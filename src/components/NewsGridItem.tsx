"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { getRandomSpaceImage, getValidImageUrl, getCompulsoryImage } from "@/lib/utils";
import { motion } from "framer-motion";

interface NewsArticle {
    id: string | number;
    url: string;
    title: string;
    summary: string;
    published_at: string;
    image_url: string;
}

export default function NewsGridItem({ article, index = 0 }: { article: NewsArticle, index?: number }) {
    // Ensure we ALWAYS have an image
    const initialImage = getCompulsoryImage(article.image_url, article.title + " " + article.summary);
    const [imgSrc, setImgSrc] = useState(initialImage);
    const [retryCount, setRetryCount] = useState(0);

    const handleError = () => {
        if (retryCount === 0) {
            // First failure: Try a random space image
            setImgSrc(getRandomSpaceImage());
            setRetryCount(1);
        } else if (retryCount === 1) {
            // Second failure: Fallback to local SVG (guaranteed to exist)
            setImgSrc("/images/rocket-placeholder.svg");
            setRetryCount(2);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.6,
                delay: (index % 3) * 0.1, // Stagger based on column position
                ease: "easeOut"
            }}
            className="h-full"
        >
            <Link href={article.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                <GlassCard className="h-full flex flex-col group hover:border-cyan-500/50 transition-colors duration-300">
                    <div className="relative h-48 w-full overflow-hidden">
                        <img
                            src={imgSrc}
                            alt={article.title}
                            onError={handleError}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <span className="absolute bottom-2 right-2 text-xs font-mono text-cyan-400 bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
                            {new Date(article.published_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-xl font-bold font-orbitron mb-3 text-white line-clamp-2 group-hover:text-cyan-400 transition-colors">
                            {article.title}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-1">
                            {article.summary}
                        </p>
                        <div className="flex items-center text-xs text-cyan-500 font-mono mt-auto">
                            READ MORE <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </GlassCard>
            </Link>
        </motion.div>
    );
}
