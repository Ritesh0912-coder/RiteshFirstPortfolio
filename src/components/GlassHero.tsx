"use client";

import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import Earth3D from "./Earth3D";
import GlassButton from "./ui/GlassButton";

export default function GlassHero() {

    return (
        <div className="relative w-full min-h-[700px] md:min-h-[85vh] flex items-center overflow-hidden">
            {/* 3D Background - Now STABLE (Non-interactive) */}
            <div className="absolute top-0 right-0 w-full md:w-1/2 h-full z-0 pointer-events-none opacity-60 md:opacity-100">
                <Earth3D interactive={false} />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                {/* Text Content - Left Aligned */}
                <div className="text-left space-y-8 pt-12 md:pt-0">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-orbitron tracking-tighter text-white drop-shadow-2xl select-none leading-tight">
                            EXPLORE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                                THE UNIVERSE
                            </span>
                        </h1>
                        <p className="text-base md:text-xl text-cyan-100/80 max-w-lg leading-relaxed drop-shadow-lg">
                            Dive into the infinite cosmos. Track missions, explore the globe, and witness the beauty of space in real-time.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 max-w-md relative z-50">
                        <div className="flex flex-wrap gap-4">
                            <Link href="/map">
                                <GlassButton className="px-8 py-3 text-lg flex items-center gap-2 group/btn bg-blue-600/20 hover:bg-blue-600/40 border-blue-500/50">
                                    <Globe className="w-5 h-5 text-blue-400 group-hover/btn:rotate-12 transition-transform" />
                                    Global Map
                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </GlassButton>
                            </Link>

                            <Link href="/news">
                                <GlassButton variant="outline" className="px-8 py-3 text-lg border-cyan-500/30 text-cyan-400 hover:text-cyan-200">
                                    Latest News
                                </GlassButton>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right side is reserved for the 3D Earth projection */}
                <div className="hidden md:block h-full" />
            </div>
        </div>
    );
}
