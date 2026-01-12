import NewsFilter from "@/components/NewsFilter";
import NewsCard from "@/components/NewsCard";
import { getSpaceNews, ensureNewsUpdate } from "@/lib/news";

export const metadata = {
    title: "UniverseHub News - Global Space Updates",
    description: "Latest news from NASA, SpaceX, ESA, and more.",
};

import { db } from "@/lib/db";
import { Search } from "lucide-react";
import { getBlacklist } from "@/lib/actions";

export const dynamic = 'force-dynamic';

export default async function NewsPage({
    searchParams,
}: {
    searchParams: { q?: string; category?: string };
}) {
    // 0. Ensure News is Fresh
    await ensureNewsUpdate();

    // 1. Fetch Local News
    const dbNews = await db.news.findMany({
        orderBy: { publishedAt: "desc" },
        include: { author: true }
    });

    // 2. Fetch External News (Spaceflight News API)
    const apiData = await getSpaceNews(20);

    // 3. Fetch Blacklist
    const hiddenIds = await getBlacklist("NEWS");

    // 4. Normalize Data
    const localNews = dbNews.map(item => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        imageUrl: item.imageUrl,
        source: "UniverseHub",
        publishedAt: item.publishedAt,
        url: item.url,
        originalUrl: item.url, // Keep track of original URL for dedup
        isLocal: true
    }));

    // Create a Set of existing URLs to prevent duplicates
    // Normalize by stripping protocols or trailing slashes if strictly needed, 
    // but usually direct comparison works for exact syncs.
    const existingUrls = new Set(dbNews.map(n => n.url));

    const externalNews = apiData.results
        .filter((item: any) => !existingUrls.has(item.url)) // Deduplicate: Skip if already in DB
        .map((item: any) => ({
            id: `ext-${item.id}`,
            title: item.title,
            summary: item.summary,
            imageUrl: item.image_url,
            source: item.news_site,
            publishedAt: new Date(item.published_at),
            url: item.url,
            isLocal: false
        }));

    // 5. Merge, Filter & Sort
    let allNews = [...localNews, ...externalNews]
        .filter(item => !hiddenIds.includes(item.id))
        .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    // 6. Filter by Search Query
    const query = searchParams.q?.toLowerCase();
    if (query) {
        allNews = allNews.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.summary.toLowerCase().includes(query)
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                    Daily Transmissions
                </h1>
                <p className="text-gray-400 text-lg">
                    Latest updates from across the cosmos.
                </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-12 relative">
                <input
                    type="text"
                    placeholder="Search transmissions..."
                    className="w-full bg-black/40 border border-white/10 rounded-full py-3 px-12 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allNews.map((news) => (
                    <NewsCard key={news.id} news={news} />
                ))}

                {allNews.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-12">
                        No transmissions found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}
