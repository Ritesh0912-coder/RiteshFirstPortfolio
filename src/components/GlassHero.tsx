"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Earth3D from "./Earth3D";
import GlassButton from "./ui/GlassButton";

export default function GlassHero() {

    return (
        <div className="relative w-full min-h-screen flex items-center overflow-hidden pt-20">

            {/* 3D Background - Now STABLE (Non-interactive) */}
            <div className="absolute top-0 right-0 w-full md:w-1/2 h-full z-0 pointer-events-none opacity-60 md:opacity-100">
                <Earth3D interactive={false} />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[60vh]">

                {/* Text Content - Left Aligned & Vertically Centered */}
                <div className="text-left space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-orbitron tracking-tighter text-white drop-shadow-2xl select-none leading-[1.1]">
                            EXPLORE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                                THE UNIVERSE
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-cyan-100/80 max-w-lg leading-relaxed drop-shadow-lg font-light">
                            Dive into the infinite cosmos. Witness the beauty of space in real-time with high-fidelity telemetry.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 max-w-md relative z-50">
                        <div className="flex flex-wrap gap-4">
                            <Link href="/news" className="w-full md:w-auto">
                                <GlassButton className="w-full md:w-72 px-8 py-4 text-xl flex items-center justify-center gap-3 group/btn bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border-white/10 text-white rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] ring-1 ring-white/5 hover:ring-white/20">
                                    <span className="font-semibold tracking-wide">Latest News</span>
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
