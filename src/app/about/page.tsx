"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Earth3D from "@/components/Earth3D";
import ParticleBackground from "@/components/ParticleBackground";
import GlassCard from "@/components/ui/GlassCard";
import { Search, Shield, Zap, Globe, Cpu, Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SPACE_PLACEHOLDERS } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function AboutPage() {
    const [heroImage, setHeroImage] = useState(SPACE_PLACEHOLDERS[0]);

    useEffect(() => {
        setHeroImage(SPACE_PLACEHOLDERS[Math.floor(Math.random() * SPACE_PLACEHOLDERS.length)]);
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // Hero Transforms
    const earthScale = useTransform(springScroll, [0, 0.5], [1.0, 3.5]);
    const earthOpacity = useTransform(springScroll, [0, 0.6], [1, 0.05]);
    const textY = useTransform(springScroll, [0, 0.3], [0, -100]);
    const textOpacity = useTransform(springScroll, [0, 0.2], [1, 0]);

    // Section Transforms
    const sectionOpacity = useTransform(springScroll, [0.1, 0.3], [0, 1]);
    const sectionY = useTransform(springScroll, [0.1, 0.3], [50, 0]);

    return (
        <main ref={containerRef} className="relative w-full bg-[#020408] text-white overflow-hidden selection:bg-blue-500/30">
            {/* Background Layers */}
            <div className="fixed inset-0 z-0">
                <ParticleBackground />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-black" />
            </div>

            {/* Cinematic Hero */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
                {/* Background Stars/Overlay */}
                <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />

                {/* Center Earth Container */}
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    <motion.div
                        style={{ scale: earthScale, opacity: earthOpacity }}
                        className="w-full h-full flex items-center justify-center"
                    >
                        <div className="w-full h-full max-w-[1200px] max-h-[1200px]">
                            <Earth3D interactive={false} />
                        </div>
                    </motion.div>
                </div>

                {/* Content Overlay */}
                <div className="relative z-20 text-center px-6 pointer-events-none">
                    <motion.div
                        style={{ y: textY, opacity: textOpacity }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        <div className="flex items-center justify-center gap-4 mb-8 pointer-events-auto">
                            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-blue-500/50" />
                            <span className="text-blue-400 font-mono tracking-[0.6em] text-[10px] md:text-xs uppercase bg-blue-500/5 px-4 py-1.5 rounded-full border border-blue-500/20 backdrop-blur-md">
                                SYSTEM EST. 2025
                            </span>
                            <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-blue-500/50" />
                        </div>

                        <h1 className="text-7xl md:text-[10rem] font-black font-orbitron tracking-tighter leading-none mb-6">
                            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20 select-none">
                                THE VOID
                            </span>
                            <span className="block text-4xl md:text-6xl text-blue-500/80 mt-2 font-thin tracking-[0.4em] drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                ARCHITECTS
                            </span>
                        </h1>

                        <div className="max-w-xl mx-auto mt-12 pointer-events-auto">
                            <p className="text-gray-400 font-light tracking-widest text-sm md:text-base leading-relaxed bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                                <span className="absolute top-0 left-0 w-1 h-full bg-blue-500/50 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
                                UniverseHub is a digital intelligence layer for the new space age,
                                <span className="text-blue-400/80 font-medium ml-1">unifying cosmic data</span> into human experience.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* HUD Elements */}
                <div className="absolute inset-0 z-30 pointer-events-none border-[1px] border-white/5 m-4 md:m-12 rounded-[2rem] overflow-hidden">
                    <div className="absolute top-8 left-8 flex flex-col gap-1">
                        <div className="w-12 h-[1px] bg-blue-500/30" />
                        <div className="w-[1px] h-12 bg-blue-500/30" />
                    </div>
                    <div className="absolute bottom-8 right-8 flex flex-col items-end gap-1">
                        <div className="w-[1px] h-12 bg-blue-500/30" />
                        <div className="w-12 h-[1px] bg-blue-500/30" />
                        <span className="text-[10px] font-mono text-blue-500/40 mt-2 tracking-tighter">DATA_SYNC_ACTIVE</span>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    style={{ opacity: textOpacity }}
                    className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                >
                    <div className="w-6 h-10 rounded-full border-2 border-white/10 flex justify-center p-1">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-blue-500"
                        />
                    </div>
                    <span className="text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase">Engage Scroll</span>
                </motion.div>
            </section>

            {/* Decoding the Infinite - Story Section */}
            <motion.section
                style={{ opacity: sectionOpacity, y: sectionY }}
                className="relative z-10 py-32 px-6 overflow-hidden"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-7 space-y-12">
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    className="flex items-center gap-4 text-blue-500 font-mono text-sm tracking-widest"
                                >
                                    <span className="w-12 h-[1px] bg-blue-500" />
                                    OUR ORIGIN
                                </motion.div>
                                <h2 className="text-4xl md:text-6xl font-black font-orbitron tracking-tight leading-tight">
                                    BEYOND THE <br />
                                    <span className="text-blue-500">EVENT HORIZON</span>
                                </h2>
                                <p className="text-xl text-gray-400 font-light leading-relaxed max-w-2xl">
                                    Founded in the wake of the second space race, UniverseHub was built to be the central nervous system for cosmic exploration. We don&apos;t just track objects; we weave the stories of stars into the digital fabric of humanity.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Link href="/news" className="group">
                                    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 group-hover:bg-blue-500/5 group-hover:border-blue-500/30 transition-all duration-500">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Cpu className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <h3 className="text-xl font-bold font-orbitron mb-2">Neural Link</h3>
                                        <p className="text-sm text-gray-500">Real-time processing of thousands of concurrent mission data points.</p>
                                    </div>
                                </Link>
                                <Link href="/gallery" className="group">
                                    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 group-hover:bg-cyan-500/5 group-hover:border-cyan-500/30 transition-all duration-500">
                                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Target className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <h3 className="text-xl font-bold font-orbitron mb-2">Precision</h3>
                                        <p className="text-sm text-gray-500">Sub-second latency on mission telemetry and launch countdowns.</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-5 relative group">
                            <div className="absolute -inset-4 bg-blue-500/10 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000" />
                            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                                <Image
                                    src={heroImage}
                                    fill
                                    className="object-cover grayscale opacity-40 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-1000"
                                    alt="Space view"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-10">
                                    <p className="text-blue-500 font-mono text-xs mb-2 tracking-[0.3em]">ORBITAL_VIEW_X01</p>
                                    <h4 className="text-3xl font-black font-orbitron">THE GREAT UNKNOWN</h4>
                                    <div className="mt-6 flex items-center gap-4">
                                        <div className="h-px flex-1 bg-white/10" />
                                        <Cpu className="w-6 h-6 text-white/10" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Directives Section - Modular Grid */}
            <section className="relative z-10 py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                        <div className="space-y-4">
                            <motion.p
                                initial={{ x: -10, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                className="text-blue-500 font-mono tracking-[0.5em] text-xs uppercase"
                            >
                                Architecture
                            </motion.p>
                            <h2 className="text-4xl md:text-6xl font-black font-orbitron tracking-tighter">THE MISSION PROTOCOLS</h2>
                        </div>
                        <p className="text-gray-500 max-w-sm text-right font-light italic text-sm md:text-base leading-relaxed">
                            &quot;A seamless synthesis of astrophysical data and next-generation design systems.&quot;
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "INTEGRITY", icon: Shield, desc: "Zero compromise on data accuracy. Every byte pulled from verified agencies.", color: "from-blue-600/20" },
                            { title: "IMMERSION", icon: Globe, desc: "Building interfaces that feel as expansive as the cosmos themselves.", color: "from-cyan-600/20" },
                            { title: "AUTONOMY", icon: Cpu, desc: "Advanced AI-driven syndication of satellite and telemetry data pools.", color: "from-purple-600/20" },
                            { title: "VELOCITY", icon: Zap, desc: "Real-time updates delivered at sub-second speeds across the entire hub.", color: "from-blue-400/20" }
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -10 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="group relative p-12 rounded-[3rem] bg-[#05070a] border border-white/5 overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                                <div className="relative z-10 space-y-8">
                                    <div className="h-16 w-16 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all duration-500">
                                        <item.icon className="w-7 h-7 text-white group-hover:text-blue-400 transition-colors" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-black font-orbitron tracking-tight text-white group-hover:text-blue-400 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed font-light tracking-wide">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>

                                <div className="absolute -bottom-4 -right-4 p-8 opacity-0 group-hover:opacity-5 transition-all duration-700 transform translate-y-10 group-hover:translate-y-0">
                                    <item.icon className="w-24 h-24" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="relative z-10 py-48 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-6xl md:text-8xl font-black font-orbitron mb-6">
                            JOIN THE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-white to-cyan-500">VOYAGE</span>
                        </h2>
                        <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
                            Become a sentinel of the stars. Harness the power of UniverseHub to track humanity&apos;s greatest journey.
                        </p>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/news" className="w-full sm:w-auto">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-12 py-5 bg-white text-black font-bold font-orbitron rounded-full hover:bg-blue-400 transition-colors cursor-pointer text-center"
                            >
                                SYSTEM ENTRY
                            </motion.div>
                        </Link>
                        <Link href="/gallery" className="w-full sm:w-auto">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-12 py-5 bg-transparent border border-white/20 text-white font-bold font-orbitron rounded-full hover:bg-white/10 transition-all cursor-pointer text-center"
                            >
                                WATCH HUB
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Floating Decorative Elements */}
            <div className="fixed bottom-10 right-10 z-50 pointer-events-none">
                <div className="flex flex-col items-end gap-1 opacity-20">
                    <div className="text-[10px] font-mono">LAT: 28.5729° N</div>
                    <div className="text-[10px] font-mono">LNG: 80.6490° W</div>
                    <div className="h-px w-20 bg-blue-500" />
                </div>
            </div>
        </main>
    );
}
