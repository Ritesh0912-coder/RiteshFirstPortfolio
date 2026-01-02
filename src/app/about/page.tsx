"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import DecryptedText from "@/components/DecryptedText";
import Earth3D from "@/components/Earth3D";
import ParticleBackground from "@/components/ParticleBackground";

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <main ref={containerRef} className="relative w-full bg-black text-white overflow-hidden selection:bg-cyan-500/30">
            <ParticleBackground />

            {/* Hero Section */}
            <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
                <motion.div
                    style={{ y, opacity }}
                    className="absolute inset-0 z-0 opacity-60 md:opacity-80"
                >
                    <Earth3D />
                </motion.div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="mb-6 flex items-center space-x-3 pointer-events-auto"
                    >
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-cyan-400 font-mono tracking-[0.2em] text-xs uppercase">
                            System Status: Operational
                        </span>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-black font-orbitron text-white leading-tight mb-8 mix-blend-screen">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50">
                            BEYOND
                        </span>
                        <span className="block text-4xl md:text-6xl text-blue-500 mt-2">
                            <DecryptedText text="THE HORIZON" speed={60} maxIterations={20} revealDirection="center" />
                        </span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed pointer-events-auto"
                    >
                        UniverseHub acts as the digital nervous system for space exploration, bridging the gap between raw cosmic data and human understanding.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto cursor-pointer"
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                    <span className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">Initialize Sequence</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-pulse" />
                </motion.div>
            </section>

            {/* The Origin - Narrative Section */}
            <section className="relative z-10 py-32 px-6 bg-gradient-to-b from-black via-black/90 to-black">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl rounded-full" />
                        <h2 className="relative text-4xl md:text-5xl font-bold font-orbitron mb-6 text-white">
                            <span className="text-cyan-500">01.</span> The Origin
                        </h2>
                        <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-light">
                            <p>
                                It started with a simple question: <span className="text-white">Why is space data so disconnected?</span>
                            </p>
                            <p>
                                Scattered across distinct agencies, buried in complex archives, the story of our universe was fragmented. We built UniverseHub to unify these threads.
                            </p>
                            <p>
                                What began as a data aggregation experiment has evolved into a comprehensive platform for visualizing the cosmos, tracking humanity's progress among the stars, and actively participating in the new space age.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative h-[500px] w-full rounded-3xl overflow-hidden border border-white/10"
                    >
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-60 hover:scale-105 transition-transform duration-700 ease-out" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-xl">
                                <div className="text-cyan-400 font-mono text-xs mb-2">TELEMETRY DATA</div>
                                <div className="text-2xl font-bold text-white mb-1">Global Coverage</div>
                                <div className="text-sm text-gray-400">Tracking 500+ active missions</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="relative z-10 py-24 px-6 border-y border-white/5 bg-black/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4">Core Directives</h2>
                        <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full" />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Data Integrity",
                                desc: "We prioritize raw, verifiable datasets from official agency sources. No speculation, just science.",
                                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                                color: "blue"
                            },
                            {
                                title: "Visual Immersion",
                                desc: "Space is beautiful. Our interfaces are designed to reflect the awe of the cosmos through high-fidelity visuals.",
                                icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
                                color: "cyan"
                            },
                            {
                                title: "Universal Access",
                                desc: "We believe space belongs to everyone. Our platform removes barriers to entry for astronomical data.",
                                icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
                                color: "purple"
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="group relative p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                <div className={`h-12 w-12 rounded-lg bg-gray-900 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <svg className={`w-6 h-6 text-${item.color}-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                                    </svg>
                                </div>

                                <h3 className="text-xl font-bold font-orbitron text-white mb-3 group-hover:text-white transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 group-hover:text-gray-300 text-sm leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Join Mission CTA */}
            <section className="relative z-10 py-32 px-6">
                <div className="absolute inset-0 bg-blue-600/5" />
                <div className="max-w-5xl mx-auto text-center relative pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] -z-10" />

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black font-orbitron mb-8 leading-tight"
                    >
                        READY T<span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-cyan-500">O LAUNCH?</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
                    >
                        Join thousands of explorers tracking the pulse of the universe.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        viewport={{ once: true }}
                        className="pointer-events-auto"
                    >
                        <a href="/launches" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-black transition-all duration-200 bg-white border border-transparent rounded-full hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 hover:scale-105">
                            Start Your Journey
                        </a>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
