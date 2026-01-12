"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalLogo() {
    const pathname = usePathname();

    // Hide on login/admin pages if necessary
    if (pathname?.startsWith('/admin') || pathname === '/login') return null;

    return (
        <div className="fixed top-10 left-10 z-[60] logo-desktop-persistent">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 940px) {
                    .logo-desktop-persistent {
                        display: none !important;
                    }
                }
                @media (min-width: 941px) {
                    .logo-desktop-persistent {
                        display: block !important;
                    }
                }
            `}} />
            <Link href="/" className="flex items-center gap-3 font-orbitron font-bold text-2xl text-white tracking-widest group">
                <img src="/favicon.ico" alt="Logo" className="w-8 h-8 object-contain" />
                <span>
                    UNIVERSE<span className="text-blue-500 group-hover:text-cyan-400 transition-colors">HUB</span>
                </span>
            </Link>
        </div>
    );
}
