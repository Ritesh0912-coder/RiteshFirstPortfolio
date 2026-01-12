"use client";

import React from "react";
import GlassCard from "@/components/ui/GlassCard";
import ParticleBackground from "@/components/ParticleBackground";
import { Scale, Users, PenTool, AlertTriangle, Info } from "lucide-react";

export default function TermsOfServicePage() {
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
                    <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6">
                        <Scale className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-cyan-400 to-blue-500 mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Rules of Engagement for the Cosmos. Effective Date: {mounted ? "Jan 4, 2026" : "Loading..."}
                    </p>
                </div>

                <GlassCard className="p-8 md:p-12 space-y-12 border-cyan-500/30">
                    {/* Agreement */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Info className="w-6 h-6 text-cyan-400" />
                            <h2 className="text-2xl font-bold font-orbitron text-white">1. Acceptance of Terms</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            By accessing or using UniverseHub, you agree to bound by these Terms of Service. If you do not agree to these terms, please disconnect from our servers immediately.
                        </p>
                    </section>

                    {/* User Conduct */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-6 h-6 text-blue-400" />
                            <h2 className="text-2xl font-bold font-orbitron text-white">2. Flight Etiquette</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            Users are expected to use UniverseHub for its intended purpose: exploration and education. You agree not to:
                        </p>
                        <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                            <li>Attempt to breach our security perimeters.</li>
                            <li>Inject malicious code into our data streams.</li>
                            <li>Harass other explorers within our community modules.</li>
                            <li>Misrepresent data retrieved from our platforms for deceptive purposes.</li>
                        </ul>
                    </section>

                    {/* Intellectual Property */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <PenTool className="w-6 h-6 text-purple-400" />
                            <h2 className="text-2xl font-bold font-orbitron text-white">3. Intellectual Property</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            All original visualizations, UI designs, and synthesized data models on UniverseHub are the property of Ritesh Shinde. Third-party data (NASA, SpaceX, etc.) remains the property of their respective owners.
                        </p>
                    </section>

                    {/* Limitation of Liability */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className="w-6 h-6 text-yellow-400" />
                            <h2 className="text-2xl font-bold font-orbitron text-white">4. Space Hazard Disclaimer</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            UniverseHub provides data &quot;as-is&quot;. While we strive for absolute accuracy, we are not liable for any decisions made based on real-time data fluctuations or atmospheric interference. Space exploration is inherently risky; browse responsibly.
                        </p>
                    </section>

                    {/* Governing Law */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold font-orbitron text-white">5. Governing Law</h2>
                        <p className="text-gray-300 leading-relaxed">
                            These terms are governed by the laws of the Earthly jurisdiction where the developer resides, without regard to interplanetary conflict-of-law principles.
                        </p>
                    </section>
                </GlassCard>

                {/* Footer text */}
                <p className="mt-12 text-center text-gray-500 text-sm italic">
                    &quot;United by curiosity, guided by order.&quot;
                </p>
            </div>
        </main>
    );
}
