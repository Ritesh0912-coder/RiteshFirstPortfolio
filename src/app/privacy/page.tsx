"use client";

import React from "react";
import GlassCard from "@/components/ui/GlassCard";
import ParticleBackground from "@/components/ParticleBackground";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden">
            <ParticleBackground />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6">
                        <Shield className="w-10 h-10 text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-blue-400 to-cyan-500 mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Guardian of your cosmic data. Effective Date: {mounted ? "Jan 4, 2026" : "Loading..."}
                    </p>
                </div>

                <GlassCard className="p-8 md:p-12 space-y-12">
                    {/* Introduction */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <FileText className="w-6 h-6 text-blue-400" />
                            <h2 className="text-2xl font-bold font-orbitron text-white">1. Introduction</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            At UniverseHub, we are committed to protecting your privacy and ensuring a secure experience while you explore the cosmos through our platform. This Privacy Policy outlines how we collect, use, and safeguard your data.
                        </p>
                    </section>

                    {/* Data Collection */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Eye className="w-6 h-6 text-cyan-400" />
                            <h2 className="text-2xl font-bold font-orbitron text-white">2. Information Collection</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            UniverseHub may collect minimal information necessary to provide and improve our atmospheric exploration experience:
                        </p>
                        <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                            <li>Voluntary contact information (name, email) provided via our Transmission form.</li>
                            <li>Anonymous usage statistics to optimize celestial rendering and data delivery.</li>
                            <li>Browser and device metadata to ensure compatible visual experiences.</li>
                        </ul>
                    </section>

                    {/* Security */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Lock className="w-6 h-6 text-purple-400" />
                            <h2 className="text-2xl font-bold font-orbitron text-white">3. Data Security</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            We implement industry-standard security measures, including high-level encryption, to protect your data from unauthorized access or celestial interference. Your personal &quot;signal&quot; is treated with the highest integrity.
                        </p>
                    </section>

                    {/* Cookies */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="w-6 h-6 text-blue-400" />
                            <h2 className="text-2xl font-bold font-orbitron text-white">4. Celestial Cookies</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            We use subtle &quot;navigation beacons&quot; (cookies) to remember your preferences and provide a seamless journey across our various modules like the map and news feeds.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold font-orbitron text-white">5. Contact Ground Control</h2>
                        <p className="text-gray-300 leading-relaxed">
                            If you have questions about our data protocols, please reach out via our contact page or at:
                            <br />
                            <span className="text-blue-400 mt-2 block">privacy@universehub.com</span>
                        </p>
                    </section>
                </GlassCard>

                {/* Footer text */}
                <p className="mt-12 text-center text-gray-500 text-sm italic">
                    &quot;Expanding our knowledge while protecting your digital footprint.&quot;
                </p>
            </div>
        </main>
    );
}
