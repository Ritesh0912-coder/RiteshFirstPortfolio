"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Footer() {
    const pathname = usePathname();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Transmission failed");
            }

            setStatus("success");
            setMessage(data.message || "Transmission received!");
            setEmail("");
        } catch (error: any) {
            setStatus("error");
            setMessage(error.message || "Atmospheric interference detected.");
        }
    };

    return (
        <footer className="border-t border-white/5 bg-black/40 backdrop-blur-md relative z-10 mt-auto">
            {/* Subtle top glow */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />

            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10">

                    {/* Brand Section */}
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="p-1.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                <Image
                                    src="/favicon.ico"
                                    alt="UniverseHub Logo"
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                            <h3 className="text-2xl font-orbitron font-bold text-white tracking-widest">
                                UNIVERSE<span className="text-blue-500">HUB</span>
                            </h3>
                        </div>
                        <p className="text-gray-400 text-sm text-center md:text-left max-w-sm leading-relaxed">
                            Your gateway to the cosmos. Tracking humanity&apos;s journey to the stars with real-time data from NASA & SpaceX.
                        </p>
                    </div>

                    {/* Navigation Links - Simple & Clean */}
                    <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-400">
                        <Link href="/news" className="hover:text-blue-400 transition-colors">News</Link>
                        <Link href="/launches" className="hover:text-blue-400 transition-colors">Launches</Link>
                        <Link href="/gallery" className="hover:text-blue-400 transition-colors">Gallery</Link>
                        <Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
                    </div>

                    {/* Newsletter Subscription */}
                    <div className="flex flex-col space-y-4 w-full md:w-auto">
                        <div className="flex flex-col space-y-2 text-center md:text-left">
                            <h4 className="text-sm font-orbitron font-bold text-white uppercase tracking-wider">
                                Galactic News Transmission
                            </h4>
                            <p className="text-xs text-gray-500 max-w-[240px]">
                                Receive the latest cosmic updates directly.
                            </p>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl focus-within:border-blue-500/50 transition-all duration-300 backdrop-blur-sm group"
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email coordinates..."
                                required
                                disabled={status === "loading"}
                                className="bg-transparent border-none outline-none text-sm text-white px-3 py-1.5 w-full placeholder:text-gray-600 focus:ring-0 disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-orbitron px-4 py-2 rounded-lg transition-all duration-300 shadow-[0_0_10px_rgba(37,99,235,0.3)] hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] active:scale-95 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === "loading" ? "SCANNING..." : "TRANSMIT"}
                            </button>
                        </form>
                        {message && (
                            <p className={`text-xs ${status === "success" ? "text-green-400" : "text-red-400"} animate-pulse`}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
                    <p>&copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> UniverseHub. All rights reserved. Made By Ritesh Shinde</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-gray-400 cursor-pointer transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
