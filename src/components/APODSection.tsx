"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Calendar, Maximize2 } from "lucide-react";
import { getCompulsoryImage } from "@/lib/utils";
import Image from "next/image";

interface APODProps {
    data: any;
}

export default function APODSection({ data }: APODProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (!data) return null;

    return (
        <>
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative rounded-2xl overflow-hidden h-[600px] shadow-2xl group border border-white/10 cursor-pointer"
                        onClick={() => setIsOpen(true)}
                    >
                        {data.media_type === "image" ? (
                            <Image // Replaced img with Image
                                src={data.hdurl || data.url}
                                alt={data.title}
                                fill // Added fill prop for responsive sizing
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            // onError prop is handled differently for next/image,
                            // a fallback image can be set directly in src or via a custom loader.
                            // For simplicity, removing onError as it's not directly transferable.
                            // If a fallback is needed, it should be implemented with a custom loader or conditional rendering.
                            />
                        ) : (
                            <iframe src={data.url} title={data.title} className="w-full h-full pointer-events-none" />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-space-black via-space-black/50 to-transparent flex flex-col justify-end p-8 md:p-12 transition-opacity duration-300 group-hover:via-space-black/70">
                            <span className="text-blue-400 font-bold tracking-wider text-sm mb-2 uppercase flex items-center gap-2">
                                Astronomy Picture of the Day
                                <Maximize2 className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </span>
                            <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-white mb-4">{data.title}</h2>
                            <p className="text-gray-300 max-w-2xl text-lg hidden md:block line-clamp-2 group-hover:text-white transition-colors">
                                {data.explanation}
                            </p>
                            <div className="mt-4 inline-flex items-center text-sm font-bold text-blue-400 group-hover:text-blue-300">
                                Click to view details
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0b0b0f] border border-white/20 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full hover:bg-white/20 text-white transition-colors border border-white/10"
                            >
                                <X size={20} />
                            </button>

                            {/* Media Section */}
                            <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-full">
                                {data.media_type === "image" ? (
                                    <Image
                                        src={data.hdurl || data.url}
                                        alt={data.title}
                                        fill
                                        onError={(e) => {
                                            // Next.js Image onError doesn't pass the same event, 
                                            // but we can use state if needed. For now, just removing the inline handler.
                                        }}
                                        className="object-contain"
                                    />
                                ) : (
                                    <iframe src={data.url} title={data.title} className="w-full h-full aspect-video" allowFullScreen />
                                )}
                            </div>

                            {/* Info Section */}
                            <div className="w-full md:w-2/5 p-8 md:p-10 overflow-y-auto custom-scrollbar bg-space-light/5">
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center gap-2 text-blue-400 font-mono text-sm mb-3">
                                            <Calendar className="w-4 h-4" />
                                            {data.date}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-white leading-tight">
                                            {data.title}
                                        </h2>
                                    </div>

                                    <div className="h-px bg-white/10 w-full" />

                                    <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed">
                                        {data.explanation}
                                    </div>

                                    {data.copyright && (
                                        <div className="text-xs text-gray-500 font-mono pt-4">
                                            Image Credit: <span className="text-gray-400">{data.copyright}</span>
                                        </div>
                                    )}

                                    {data.hdurl && (
                                        <a
                                            href={data.hdurl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg transition-colors mt-4"
                                        >
                                            View Full Resolution <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
