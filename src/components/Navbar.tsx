"use client"

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'HOME', href: '/' },
    { name: 'LAUNCHES', href: '/launches' },
    { name: 'GALLERY', href: '/gallery' },
    { name: 'ABOUT', href: '/about' },
];

export default function Navbar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const pathname = usePathname();
    const router = useRouter();

    const isAdmin = session?.user?.email === 'admin@universe.io' || session?.user?.role === 'ADMIN';

    const dynamicNavItems = navItems;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/map?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setSearchExpanded(false);
        }
    };

    if (pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/map') return null;

    return (
        <nav className={cn(
            "fixed top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-auto min-w-[320px] max-w-2xl rounded-full",
            scrolled
                ? "bg-black/60 backdrop-blur-xl border border-white/10 py-3 px-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                : "bg-black/20 backdrop-blur-lg border border-white/5 py-4 px-8"
        )}>
            <div className="px-6 md:px-8">
                <div className="flex items-center justify-between gap-8">
                    {/* Logo (Hidden on desktop if minimizing, but let's keep it minimal) */}
                    <Link href="/" className="md:hidden flex items-center gap-2 font-orbitron font-bold text-white tracking-widest">
                        UNIVERSE<span className="text-blue-500">HUB</span>
                    </Link>

                    {/* Desktop Navigation - Centered */}
                    <div className="hidden md:flex items-center justify-center w-full gap-10">
                        {dynamicNavItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-xs font-bold tracking-[0.2em] transition-colors relative group",
                                    pathname === item.href ? "text-white" : "text-gray-400 hover:text-white"
                                )}
                            >
                                {item.name}
                                <span className={cn(
                                    "absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 transition-all duration-300",
                                    pathname === item.href ? "opacity-100 scale-100" : "opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100"
                                )} />
                            </Link>
                        ))}

                        {/* Expandable Search */}
                        <motion.form
                            onSubmit={handleSearch}
                            onHoverStart={() => setSearchExpanded(true)}
                            onHoverEnd={() => !searchQuery && setSearchExpanded(false)}
                            animate={{ width: searchExpanded ? 200 : 24 }}
                            className="relative flex items-center overflow-hidden h-8"
                        >
                            <Search className={cn(
                                "w-4 h-4 cursor-pointer transition-colors shrink-0",
                                searchExpanded ? "text-blue-500" : "text-gray-400 group-hover:text-white"
                            )} />
                            <AnimatePresence>
                                {searchExpanded && (
                                    <motion.input
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        placeholder="SEARCH LOCATION..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-transparent border-none outline-none text-[10px] font-bold tracking-widest text-white placeholder:text-gray-600 ml-4 w-full"
                                        autoFocus
                                    />
                                )}
                            </AnimatePresence>
                        </motion.form>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white hover:text-blue-400 transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 p-2 bg-black/90 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden md:hidden shadow-xl"
                    >
                        <div className="flex flex-col space-y-1">
                            {dynamicNavItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-3 rounded-xl transition-all",
                                        pathname === item.href ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <span className="text-sm font-bold tracking-wider">{item.name}</span>
                                    {pathname === item.href && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                </Link>
                            ))}
                            {session && (
                                <button
                                    onClick={() => signOut()}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl transition-all text-red-400 hover:bg-white/5 hover:text-red-300 w-full text-left"
                                >
                                    <span className="text-sm font-bold tracking-wider">LOGOUT</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
