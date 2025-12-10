import NewsFilter from "@/components/NewsFilter";
import NewsCard from "@/components/NewsCard";
import { getSpaceNews } from "@/lib/news";

export const metadata = {
    title: "UniverseHub News - Global Space Updates",
    description: "Latest news from NASA, SpaceX, ESA, and more.",
};

import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

// ... imports

export default async function NewsPage({
    searchParams,
}: {
    searchParams: { search?: string };
}) {
    // 1. Fetch from Database (UniverseHub Exclusive)
    const dbNews = await db.news.findMany({
        take: 10,
        orderBy: { publishedAt: 'desc' }
    });

    // 2. Fetch from External API
    const apiData = await getSpaceNews(20);

    // 3. Normalize Data
    const localNews = dbNews.map(item => ({
        id: `local-${item.id}`,
        title: item.title,
        summary: item.summary || item.content.substring(0, 150) + "...",
        image_url: item.imageUrl || "/images/news-placeholder.jpg",
        published_at: item.publishedAt.toISOString(),
        url: `/news/${item.id}`, // Internal link
        news_site: item.source || "UniverseHub",
        isLocal: true
    }));

    const externalNews = apiData.results.map((item: any) => ({
        ...item,
        isLocal: false
    }));

    // 4. Merge
    const allNews = [...localNews, ...externalNews];

    // 5. Filter
    const filteredNews = searchParams.search
        ? allNews.filter((article: any) =>
            article.title.toLowerCase().includes(searchParams.search!.toLowerCase()) ||
            article.summary.toLowerCase().includes(searchParams.search!.toLowerCase())
        )
        : allNews;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                    Space News
                </h1>
                <p className="text-gray-400 text-lg">
                    Daily updates from the final frontier.
                </p>
            </div>

            <NewsFilter />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((article: any) => (
                    <NewsCard key={article.id} article={article} />
                ))}
                {filteredNews.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        No transmissions found matching your query.
                    </div>
                )}
            </div>
        </div>
    );
}
