import { db } from "./db";
import { getCompulsoryImage } from "./utils";
import Parser from "rss-parser";
import * as cheerio from "cheerio";

export const NEWS_API_BASE = "https://api.spaceflightnewsapi.net/v4";
export const GOOGLE_NEWS_RSS = "https://news.google.com/rss/search?q=space+astronomy&hl=en-US&gl=US&ceid=US:en";

// Utility for fetching with retry and timeout
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 2, timeout = 10000): Promise<Response> {
    for (let i = 0; i <= retries; i++) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });
            clearTimeout(id);
            if (response.ok) return response;
            if (i === retries) return response; // Final attempt, return whatever we got
        } catch (err: any) {
            clearTimeout(id);
            if (i === retries) throw err;
            // Wait before retry
            await new Promise(res => setTimeout(res, 1000 * (i + 1)));
        }
    }
    throw new Error("Fetch failed after retries");
}

// Helper to fetch OG Image
async function getOGImage(url: string): Promise<string | null> {
    try {
        const response = await fetchWithRetry(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        }, 1, 5000); // 1 retry, 5s timeout for OG images

        const html = await response.text();
        const $ = cheerio.load(html);
        let ogImage = $('meta[property="og:image"]').attr('content');
        if (ogImage && !ogImage.startsWith('http')) {
            try {
                ogImage = new URL(ogImage, url).toString();
            } catch (e) { return null; }
        }
        return ogImage || null;
    } catch (error) {
        return null; // Silent fail
    }
}

// Fetch from External API (Spaceflight News)
export async function getSpaceNews(limit = 10, offset = 0) {
    try {
        const res = await fetchWithRetry(`${NEWS_API_BASE}/articles?limit=${limit}&offset=${offset}`, {
            cache: 'no-store',
        }, 2, 15000); // 2 retries, 15s timeout

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Sanitize images
        data.results = data.results.map((article: any) => ({
            ...article,
            image_url: getCompulsoryImage(article.image_url, article.title + " " + article.summary)
        }));

        return data;
    } catch (error: any) {
        // Log concisely
        console.error("News API Error:", error.message || error);
        return { results: [], count: 0, next: null, previous: null };
    }
}

// Fetch from Google News RSS
export async function getGoogleNews() {
    try {
        const parser = new Parser({
            customFields: {
                item: [
                    ['media:content', 'mediaContent'],
                    ['media:thumbnail', 'mediaThumbnail'],
                ]
            }
        });
        const feed = await parser.parseURL(GOOGLE_NEWS_RSS);

        // Process items with potential OG fetch in parallel
        const promises = feed.items.map(async (item: any) => {
            // Attempt to extract image from various probable sources
            let imageUrl: string | null = null;

            // 1. Check media:content (standard RSS media extension)
            if (item.mediaContent && item.mediaContent['$'] && item.mediaContent['$'].url) {
                imageUrl = item.mediaContent['$'].url;
            }
            // 2. Check media:thumbnail
            else if (item.mediaThumbnail && item.mediaThumbnail['$'] && item.mediaThumbnail['$'].url) {
                imageUrl = item.mediaThumbnail['$'].url;
            }
            // 3. Regex match in content/description
            else {
                const content = item.content || item.contentSnippet || item.description || "";
                const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) imageUrl = imgMatch[1];
            }

            // 4. Try fetching OG Image if still no image
            if (!imageUrl && item.link) {
                imageUrl = await getOGImage(item.link);
            }

            // 5. Use compulsory fallback with context
            const finalImageUrl = getCompulsoryImage(imageUrl, (item.title || "") + " " + (item.contentSnippet || ""));

            return {
                title: item.title || "Space News",
                url: item.link || "",
                image_url: finalImageUrl,
                news_site: "Google News",
                summary: item.contentSnippet || item.content || "Click to read more about this story.",
                published_at: item.isoDate || new Date().toISOString(),
            };
        });

        return await Promise.all(promises);
    } catch (error) {
        console.error("Google News Error:", error);
        return [];
    }
}

// Fetch from Database (Archive)
export async function getArchivedNews(limit = 50) {
    try {
        const news = await db.news.findMany({
            take: limit,
            orderBy: { publishedAt: 'desc' },
        });
        // Map to same format as API for compatibility
        return {
            results: news.map(n => ({
                id: n.id, // Internal DB ID
                title: n.title,
                url: n.url,
                image_url: getCompulsoryImage(n.imageUrl, n.title + " " + n.summary),
                news_site: n.source,
                summary: n.summary,
                published_at: n.publishedAt.toISOString(),
            }))
        };
    } catch (error) {
        console.error("DB News Error:", error);
        return { results: [] };
    }
}

// Ensure News is Fresh (Helper for Pages)
export async function ensureNewsUpdate() {
    try {
        const latestNews = await db.news.findFirst({ orderBy: { updatedAt: 'desc' } });
        // Sync if empty or older than 2 hours
        const isStale = !latestNews || (new Date().getTime() - new Date(latestNews.updatedAt).getTime() > 2 * 60 * 60 * 1000);

        if (isStale) {
            console.log("News stale, triggering sync...");
            await syncSpaceNews();
        }
    } catch (error) {
        console.error("Failed to ensure news update:", error);
    }
}

// Sync function
export async function syncSpaceNews() {
    console.log("Syncing news...");

    // Use Promise.allSettled to ensure one failure doesn't stop the other
    const [spaceNewsResult, googleNewsData] = await Promise.all([
        getSpaceNews(30).catch(e => ({ results: [] })),
        getGoogleNews().catch(e => [])
    ]);

    const spaceNewsData = (spaceNewsResult as any).results || [];
    const allArticles = [...spaceNewsData, ...googleNewsData];

    if (allArticles.length > 0) {
        for (const article of allArticles) {
            let externalIdVal = "";
            if (article.id && article.news_site !== "Google News") {
                externalIdVal = `sfn-${article.id}`;
            } else {
                externalIdVal = `gn-${Buffer.from(article.url).toString('base64')}`;
            }

            await db.news.upsert({
                where: { externalId: externalIdVal },
                update: {
                    updatedAt: new Date(),
                    imageUrl: article.image_url || undefined
                },
                create: {
                    externalId: externalIdVal,
                    title: article.title,
                    summary: article.summary,
                    url: article.url,
                    imageUrl: article.image_url,
                    source: article.news_site,
                    publishedAt: new Date(article.published_at),
                    content: article.summary,
                }
            });
        }
    }
}
