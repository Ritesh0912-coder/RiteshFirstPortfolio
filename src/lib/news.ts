import { db } from "./db";
import { getCompulsoryImage } from "./utils";
import Parser from "rss-parser";
import * as cheerio from "cheerio";

export const NEWS_API_BASE = "https://api.spaceflightnewsapi.net/v4";
export const GOOGLE_NEWS_RSS = "https://news.google.com/rss/search?q=space+astronomy&hl=en-US&gl=US&ceid=US:en";

// Helper to fetch OG Image
async function getOGImage(url: string): Promise<string | null> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // Increased to 8s

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        clearTimeout(timeoutId);

        // ... (rest is same)
        if (!response.ok) return null;
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
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout for better reliability

        const res = await fetch(`${NEWS_API_BASE}/articles?limit=${limit}&offset=${offset}`, {
            cache: 'no-store',
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error("Failed to fetch news");
        const data = await res.json();

        // Sanitize images
        data.results = data.results.map((article: any) => ({
            ...article,
            image_url: getCompulsoryImage(article.image_url, article.title + " " + article.summary)
        }));

        return data;
    } catch (error) {
        console.error("News API Error:", error);
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
