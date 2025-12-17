"use client";

import { useState } from "react";
import useSWRInfinite from "swr/infinite";
import NewsCard from "@/components/NewsCard";
import { Loader2 } from "lucide-react";

// Fetch from our own API which merges sources
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function NewsList() {
    const getKey = (pageIndex: number, previousPageData: any) => {
        if (previousPageData && !previousPageData.results.length) return null; // reached the end
        return `/api/news?limit=10&offset=${pageIndex * 10}`;
    };

    const { data, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher);

    const news = data ? data.map(page => page.results).flat() : [];
    const isLoadingMore = isValidating && size > 0 && data && data[size - 1];
    const isEmpty = data?.[0]?.results?.length === 0;
    const isReachingEnd = isEmpty || (data && data[data.length - 1]?.results?.length < 10);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((article: any) => (
                    <div key={article.id} className="h-full">
                        <NewsCard news={{
                            id: `ext-${article.id}`,
                            title: article.title,
                            summary: article.summary,
                            imageUrl: article.image_url,
                            source: article.news_site,
                            publishedAt: article.published_at,
                            url: article.url
                        }} />
                    </div>
                ))}
            </div>

            <div className="flex justify-center py-8">
                {!isReachingEnd && (
                    <button
                        onClick={() => setSize(size + 1)}
                        disabled={isLoadingMore}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isLoadingMore ? <Loader2 className="animate-spin" /> : "Load More News"}
                    </button>
                )}
                {isReachingEnd && <p className="text-gray-500">No more news to load.</p>}
            </div>
        </div>
    );
}
