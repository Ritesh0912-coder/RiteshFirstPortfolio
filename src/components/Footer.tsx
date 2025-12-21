"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Github, Twitter, Youtube } from "lucide-react";
import Image from "next/image";

export default function Footer() {
    const pathname = usePathname();

    if (pathname === '/map') return null;

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
                                <img
                                    src="/favicon.ico"
                                    alt="UniverseHub Logo"
                                    className="w-8 h-8 object-contain"
                                />
                            </div>
                            <h3 className="text-2xl font-orbitron font-bold text-white tracking-widest">
                                UNIVERSE<span className="text-blue-500">HUB</span>
                            </h3>
                        </div>
                        <p className="text-gray-400 text-sm text-center md:text-left max-w-sm leading-relaxed">
                            Your gateway to the cosmos. Tracking humanity's journey to the stars with real-time data from NASA & SpaceX.
                        </p>
                    </div>

                    {/* Navigation Links - Simple & Clean */}
                    <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-400">
                        <Link href="/news" className="hover:text-blue-400 transition-colors">News</Link>
                        <Link href="/launches" className="hover:text-blue-400 transition-colors">Launches</Link>
                        <Link href="/missions" className="hover:text-blue-400 transition-colors">Missions</Link>
                        <Link href="/gallery" className="hover:text-blue-400 transition-colors">Gallery</Link>
                        <Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
                    </div>

                    {/* Socials */}
                    <div className="flex items-center gap-4">
                        <SocialLink href="#" icon={<Github className="w-5 h-5" />} />
                        <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
                        <SocialLink href="#" icon={<Youtube className="w-5 h-5" />} />
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
                    <p>&copy; {new Date().getFullYear()} UniverseHub. All rights reserved. By Ritesh Shinde</p>
                    <div className="flex gap-6">
                        <span className="hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-gray-400 cursor-pointer transition-colors">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a
            href={href}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white hover:scale-110 transition-all duration-300 border border-white/5"
        >
            {icon}
        </a>
    );
}
