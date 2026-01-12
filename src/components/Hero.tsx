"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import PlanetModel from "./PlanetModel";
import ShinyButton from "./ShinyButton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            {/* 3D Scene Layer */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4c1d95" />

                    <PlanetModel color="#2563eb" size={2.5} rotationSpeed={0.002} />

                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                </Canvas>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="pointer-events-auto"
                >
                    <h1 className="text-5xl md:text-7xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-6 drop-shadow-2xl h-[1.2em]">
                        UniverseHub
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light tracking-wide">
                        Explore the Infinite. Real-time updates from the cosmos.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <ShinyButton href="/news">
                            Explore News
                        </ShinyButton>

                        <Link
                            href="/planets/earth"
                            className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full font-semibold transition-all hover:scale-105"
                        >
                            Live Earth
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
