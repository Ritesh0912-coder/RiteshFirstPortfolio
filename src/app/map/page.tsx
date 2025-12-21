"use client";
import { Suspense, useState, useEffect } from "react";
import { ArrowLeft, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function MapContent() {
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [currentCoords, setCurrentCoords] = useState<{ lat: number, lng: number, zoom: number }>({
        lat: 61.15943892,
        lng: 85.03273432,
        zoom: 3
    });
    const [mapQuery, setMapQuery] = useState("");

    const searchParams = useSearchParams();

    useEffect(() => {
        const query = searchParams.get('query');
        if (query) {
            handleSearch(query);
            setIsExpanded(true);
            setSearchQuery(query);
        }
    }, [searchParams]);

    // Fetch suggestions (attractions/locations)
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length < 3) {
                setSuggestions([]);
                return;
            }
            setIsSearching(true);
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=jsonv2&limit=5`);
                const data = await res.json();
                setSuggestions(data);
            } catch (err) {
                console.error("Failed to fetch suggestions:", err);
            } finally {
                setIsSearching(false);
            }
        };

        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const satelliteUrl = `https://maps.google.com/maps?ll=${currentCoords.lat},${currentCoords.lng}&q=${encodeURIComponent(mapQuery || `${currentCoords.lat},${currentCoords.lng}`)}&t=k&z=${currentCoords.zoom}&hl=en&output=embed&iwloc=A`;

    const handleSearch = async (query: string) => {
        if (!query) return;

        // check if it's a link first
        const match = query.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (match) {
            const lat = parseFloat(match[1]);
            const lng = parseFloat(match[2]);
            setCurrentCoords({ lat, lng, zoom: 17 });
            setMapQuery("");
            setIsLoading(true);
            setSearchQuery("");
            return;
        }

        // otherwise search via geocoding
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&limit=1`);
            const data = await res.json();
            if (data && data.length > 0) {
                setCurrentCoords({
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                    zoom: 15
                });
                setMapQuery(query);
                setSuggestions([]);
                setIsLoading(true);
            }
        } catch (err) {
            console.error("Search failed:", err);
        }
    };

    const handleSelectSuggestion = (suggestion: any) => {
        setCurrentCoords({
            lat: parseFloat(suggestion.lat),
            lng: parseFloat(suggestion.lon),
            zoom: 15
        });
        setMapQuery(suggestion.display_name);
        setSearchQuery(suggestion.display_name);
        setSuggestions([]);
        setIsLoading(true);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black font-sans selection:bg-blue-500/30">
            {/* OVERLAY UI */}
            <div className="absolute top-8 left-8 z-50 flex flex-col gap-4 w-full max-w-[360px] pointer-events-none">

                {/* EXPANDABLE SEARCH BAR */}
                <div className="relative pointer-events-auto">
                    <motion.div
                        onHoverStart={() => setIsExpanded(true)}
                        onHoverEnd={() => !searchQuery && setIsExpanded(false)}
                        initial={false}
                        animate={{ width: isExpanded ? "100%" : "56px" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-[#111214] rounded-2xl flex items-center h-14 overflow-hidden"
                    >
                        <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                            <Search className={`w-5 h-5 transition-colors duration-300 ${isExpanded ? "text-blue-400" : "text-white/40"}`} />
                        </div>

                        {isExpanded && (
                            <input
                                type="text"
                                placeholder="Search attractions or cities..."
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch(searchQuery);
                                    }
                                }}
                                className="w-full bg-transparent text-[15px] text-white placeholder:text-white/20 focus:outline-none pr-6 h-full font-medium"
                            />
                        )}
                    </motion.div>

                    {/* SUGGESTIONS DROPDOWN */}
                    <AnimatePresence>
                        {suggestions.length > 0 && isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-[#111214] border border-white/5 rounded-2xl overflow-hidden shadow-2xl z-50 divide-y divide-white/5"
                            >
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSelectSuggestion(s)}
                                        className="w-full px-6 py-4 text-left text-[13px] text-white/70 hover:bg-blue-600 hover:text-white transition-colors truncate flex flex-col gap-0.5"
                                    >
                                        <span className="truncate font-medium">{s.display_name.split(',')[0]}</span>
                                        <span className="truncate text-[10px] text-white/30 uppercase tracking-widest">
                                            {s.display_name.split(',').slice(1).join(',').trim()}
                                        </span>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* RETURN BUTTON */}
                <Link href="/" className="pointer-events-auto">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white/5 rounded-full text-white/40 hover:text-white transition-all text-[11px] font-bold tracking-widest uppercase group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Return to Hub
                    </motion.button>
                </Link>
            </div>

            {/* MAP AREA */}
            <div className="w-full h-full relative z-0">
                {isLoading && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="mt-4 font-mono text-[9px] tracking-[0.4em] text-blue-400/60 uppercase animate-pulse">Establishing Connection</p>
                    </div>
                )}
                <iframe
                    key={`${currentCoords.lat}-${currentCoords.lng}`}
                    src={satelliteUrl}
                    className="w-full h-full border-none"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onLoad={() => setIsLoading(false)}
                ></iframe>
            </div>

            {/* COORDINATE HUD */}
            <div className="absolute bottom-10 left-10 z-50 pointer-events-none">
                <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-white/20 tracking-[0.3em] uppercase">Orbital Position</p>
                    <p className="text-[13px] font-mono text-white/60 tracking-widest tabular-nums font-medium">
                        {currentCoords.lat.toFixed(4)}° N, {currentCoords.lng.toFixed(4)}° E
                    </p>
                </div>
            </div>

        </div>
    );
}

export default function GlobalMapPage() {
    return (
        <main className="min-h-screen bg-black">
            <Suspense fallback={
                <div className="w-full h-screen flex items-center justify-center bg-black">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                </div>
            }>
                <MapContent />
            </Suspense>
        </main>
    );
}
