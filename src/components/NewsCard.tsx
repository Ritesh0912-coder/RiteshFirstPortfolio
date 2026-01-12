"use client";

import { useState } from "react";
import Image from "next/image";
import SpotlightCard from "./SpotlightCard";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { getRandomSpaceImage, getValidImageUrl, getCompulsoryImage } from "@/lib/utils";

interface NewsCardProps {
    news: {
        id: string;
        title: string;
        summary: string;
        imageUrl: string;
        source: string;
        publishedAt: string | Date; // Can be string from API or Date from DB/norm
        url: string;
    };
}

export default function NewsCard({ news }: NewsCardProps) {
    // Ensure we ALWAYS have an image, starting with the most relevant one possible
    const initialImage = getCompulsoryImage(news.imageUrl, news.title + " " + news.summary);
    const [imgSrc, setImgSrc] = useState(initialImage);
    const [retryCount, setRetryCount] = useState(0);

    const date = news.publishedAt instanceof Date ? news.publishedAt : new Date(news.publishedAt);

    const handleError = () => {
        if (retryCount === 0) {
            // First retry: Random space image
            setImgSrc(getRandomSpaceImage());
            setRetryCount(1);
        } else if (retryCount === 1) {
            // Final fallback: Local asset
            setImgSrc("/images/rocket-placeholder.svg");
            setRetryCount(2);
        }
    }

    return (
        <SpotlightCard className="h-full flex flex-col group p-0 border-white/10 bg-space-light/50 backdrop-blur-md">
            <div className="relative h-48 overflow-hidden w-full flex-shrink-0">
                <Image
                    src={imgSrc || getRandomSpaceImage()}
                    alt={news.title}
                    fill
                    onError={handleError}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-black/80 to-transparent" />
                <span className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600/80 text-xs rounded text-white font-medium backdrop-blur-sm">
                    {news.source}
                </span>
            </div>

            <div className="p-4 flex-1 flex flex-col relative z-10 w-full">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    <a href={news.url} target="_blank" rel="noopener noreferrer">
                        {news.title}
                    </a>
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                    {news.summary}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-white/5 w-full">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {tryFormatDate(date)}
                    </div>
                    <a
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                    >
                        Read More
                    </a>
                </div>
            </div>
        </SpotlightCard>
    );
}

function tryFormatDate(date: Date) {
    try {
        return format(date, "MMM d, yyyy");
    } catch (e) {
        return "Recent";
    }
}
