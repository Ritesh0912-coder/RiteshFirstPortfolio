"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Clock, MapPin, Rocket, ChevronDown, CheckCircle, AlertTriangle } from "lucide-react";
import Image from "next/image";


interface LaunchTimelineProps {
    launches: any[];
    title: string;
}

function LaunchImage({ src, alt }: { src: string; alt: string }) {
    const [imgSrc, setImgSrc] = useState(src || "/placeholder.png");
    return (
        <Image
            src={imgSrc}
            alt={alt}
            fill
            className="object-cover"
            onError={() => setImgSrc("/placeholder.png")}
        />
    );
}

export default function LaunchTimeline({ launches, title }: LaunchTimelineProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="w-full max-w-7xl mx-auto py-12 px-4 relative">
            <h2 className="text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-16 text-center drop-shadow-lg">
                {title}
            </h2>

            {/* Central Spine Line */}
            <div className="absolute left-4 md:left-1/2 top-32 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 via-blue-500/20 to-transparent md:-translate-x-1/2" />

            <div className="space-y-12">
                {launches.map((launch, index) => {
                    const isOpen = expandedId === launch.id;
                    const date = launch.net ? new Date(launch.net) : new Date(launch.date_unix * 1000);
                    const statusColor = launch.success ? "text-green-400" : launch.success === false ? "text-red-400" : "text-blue-400";
                    const StatusIcon = launch.success ? CheckCircle : launch.success === false ? AlertTriangle : Clock;
                    const rocketName = launch.rocket?.name || "Rocket";

                    // Alternating layout: even -> left, odd -> right (on desktop)
                    const isLeft = index % 2 === 0;

                    return (
                        <div key={launch.id} className={`relative flex flex-col md:flex-row items-center ${isLeft ? "md:flex-row-reverse" : ""}`}>

                            {/* Desktop Spacer (50% width) */}
                            <div className="hidden md:block w-1/2" />

                            {/* Center Node */}
                            <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-2 border-cyan-500 bg-black z-10 md:-translate-x-1/2 mt-6 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                                <div className={`w-1.5 h-1.5 rounded-full bg-cyan-400 transition-all duration-300 ${isOpen ? "scale-150" : ""}`} />
                            </div>

                            {/* Content Card (50% width on desktop) */}
                            <motion.div
                                initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`w-full md:w-1/2 pl-12 md:pl-0 ${isLeft ? "md:pr-12" : "md:pl-12"}`}
                            >
                                <div
                                    onClick={() => toggleExpand(launch.id)}
                                    className={`
                                        group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500
                                        ${isOpen
                                            ? "border-cyan-500/50 bg-black/90 shadow-[0_0_50px_rgba(8,145,178,0.2)]"
                                            : "border-white/10 bg-white/5 hover:border-cyan-400/30 hover:bg-white/10"
                                        }
                                    `}
                                >
                                    <div className="flex flex-col sm:flex-row h-full">
                                        {/* Square Full Image */}
                                        <div className="w-full sm:w-32 sm:h-auto h-48 relative flex-shrink-0 bg-white/5">
                                            {launch.image ? (
                                                <LaunchImage src={launch.image} alt={launch.name} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                    <Rocket className="w-8 h-8 opacity-50" />
                                                </div>
                                            )}
                                            {/* Status Badge overlay on image for mobile or compact look */}
                                            <div className="absolute top-2 left-2 sm:hidden px-2 py-1 bg-black/60 backdrop-blur rounded text-xs font-mono font-bold text-white border border-white/10">
                                                {launch.status_name}
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="relative z-10 p-6 flex-grow flex flex-col justify-center">
                                            {/* Header */}
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 text-xs font-mono mb-2">
                                                        <span className="bg-cyan-900/40 text-cyan-300 px-2 py-1 rounded border border-cyan-500/20">
                                                            {format(date, "MMM d, yyyy")}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 text-gray-400">
                                                            <Clock className="w-3 h-3" />
                                                            {format(date, "HH:mm")} UTC
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 leading-tight">
                                                        {launch.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                                                        <span className="truncate max-w-[150px]">{launch.provider}</span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                                                        <span className={statusColor}>{launch.status_name}</span>
                                                    </div>
                                                </div>

                                                <div className={`p-2 rounded-full hidden sm:block bg-white/5 border border-white/10 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/30 transition-all duration-300 ${isOpen ? "rotate-180" : ""}`}>
                                                    <ChevronDown className="w-5 h-5 text-gray-300" />
                                                </div>
                                            </div>

                                            {/* Expanded Details */}
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                        animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                                                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="pt-4 border-t border-white/10">
                                                            <p className="text-gray-300 text-sm leading-relaxed mb-6">
                                                                {launch.mission || launch.details || "No mission briefing available for this launch."}
                                                            </p>

                                                            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                                                                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                                                        <Rocket className="w-3 h-3" />
                                                                        <span>VEHICLE</span>
                                                                    </div>
                                                                    <div className="text-cyan-300 font-semibold">{rocketName}</div>
                                                                </div>
                                                                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                                                        <MapPin className="w-3 h-3" />
                                                                        <span>LOCATION</span>
                                                                    </div>
                                                                    <div className="text-cyan-300 font-semibold line-clamp-1" title={launch.pad}>{launch.pad}</div>
                                                                </div>
                                                            </div>

                                                            {launch.webcast && (
                                                                <a
                                                                    href={launch.webcast}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-200 rounded-lg transition-colors font-mono text-sm uppercase tracking-wide"
                                                                >
                                                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                                    Watch Live Feed
                                                                </a>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
