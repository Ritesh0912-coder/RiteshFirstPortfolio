import { getValidImageUrl } from "./utils";

export const NEWS_API_BASE = "https://api.spaceflightnewsapi.net/v4";

export async function getSpaceNews(limit = 10, offset = 0) {
    try {
        const res = await fetch(`${NEWS_API_BASE}/articles?limit=${limit}&offset=${offset}`, {
            next: { revalidate: 1800 }, // 30 mins
        });
        if (!res.ok) throw new Error("Failed to fetch news");
        const data = await res.json();

        // Sanitize images
        data.results = data.results.map((article: any) => ({
            ...article,
            image_url: getValidImageUrl(article.image_url) || article.image_url // keep original if no transform needed, let Next.js error if still bad? No, better to keep it if valid.
        }));

        return data;
    } catch (error) {
        console.error("News API Error:", error);
        return { results: [], count: 0, next: null, previous: null };
    }
}
