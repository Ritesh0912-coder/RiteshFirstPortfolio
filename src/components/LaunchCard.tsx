"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { Clock, MapPin, Rocket, Calendar } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

interface LaunchCardProps {
    launch: any;
}

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2070&auto=format&fit=crop", // Falcon 9
    "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?q=80&w=2070&auto=format&fit=crop", // Lift off
    "https://images.unsplash.com/photo-1614728853975-69c960772552?q=80&w=2071&auto=format&fit=crop", // Moon/Space
    "https://images.unsplash.com/photo-1457364887197-9150188c107b?q=80&w=2070&auto=format&fit=crop", // Nebula
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop", // Orbit
    "https://images.unsplash.com/photo-1541185933-717852c42243?q=80&w=1000&auto=format&fit=crop", // Starship
    "https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2070&auto=format&fit=crop", // Space Tech
    "https://images.unsplash.com/photo-1545153976-59997dad640d?q=80&w=2071&auto=format&fit=crop", // Aurora
    "https://images.unsplash.com/photo-1636819488524-1f019c4e1c44?q=80&w=2070&auto=format&fit=crop", // Galaxy
    "https://images.unsplash.com/photo-1518364538800-6bae3c2db0f2?q=80&w=2070&auto=format&fit=crop", // Satellites
    "https://images.unsplash.com/photo-1454789548728-85d2696ddbcd?q=80&w=2070&auto=format&fit=crop", // Astronaut
    "https://images.unsplash.com/photo-1543722530-d187f18026f5?q=80&w=2070&auto=format&fit=crop", // Deep Space
];

function getLaunchImage(launch: any) {
    // 1. Try Flickr Images (High Quality)
    if (launch.links?.flickr?.original?.length > 0) {
        return launch.links.flickr.original[0];
    }

    // 2. Try Patch (Large)
    if (launch.links?.patch?.large) {
        return launch.links.patch.large;
    }

    // 3. Try Rocket Specific Matches (Simple Text Search)
    const rocketName = (typeof launch.rocket === 'string' ? launch.rocket : launch.rocket?.name || "").toLowerCase();
    if (rocketName.includes("starship")) return "https://images.unsplash.com/photo-1541185933-717852c42243?q=80&w=1000&auto=format&fit=crop";

    // 4. Robust Hashing for Consistency
    // Use ID if available, otherwise Name
    const seed = launch.id || launch.name || "default";
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % FALLBACK_IMAGES.length;
    return FALLBACK_IMAGES[index];
}

export default function LaunchCard({ launch }: LaunchCardProps) {
    // Determine Date
    let launchDate = new Date();
    if (launch.net) {
        launchDate = new Date(launch.net);
    } else if (launch.date_unix) {
        launchDate = new Date(launch.date_unix * 1000);
    }

    const isValidDate = !isNaN(launchDate.getTime());
    const isUpcoming = isValidDate ? launchDate > new Date() : false;

    // Determine Status
    // Global API returns launch.status as string (e.g. "Go"), SpaceX API returns boolean launch.success
    let statusText = "UNKNOWN";
    let statusColor = "bg-gray-600";

    if (launch.status_name) {
        statusText = launch.status_name.toUpperCase();
        statusColor = statusText.includes("GO") || statusText.includes("SUCCESS") ? "bg-green-600" : "bg-yellow-600";
    } else {
        statusText = isUpcoming ? "UPCOMING" : launch.success ? "SUCCESS" : "FAILURE";
        statusColor = isUpcoming ? "bg-blue-600" : launch.success ? "bg-green-600" : "bg-red-600";
    }

    // Extract Details
    const rocketName = typeof launch.rocket === 'string' ? launch.rocket : launch.rocket?.name || "Rocket";
    const padName = typeof launch.pad === 'string' ? launch.pad : (launch.launchpad?.name || launch.pad?.name || "Launchpad");
    const details = launch.mission || launch.details || `Launch mission for ${rocketName}.`;
    const imageUrl = launch.image || getLaunchImage(launch);

    return (
        <SpotlightCard className="h-full flex flex-col group p-0 border-white/10 bg-space-light/50 backdrop-blur-md overflow-hidden">
            {/* Top Image Section */}
            <div className="relative h-48 w-full flex-shrink-0 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={launch.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = "/placeholder.png";
                        target.onerror = null;
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-black/80 to-transparent" />

                {/* Status Badge */}
                <span className={`absolute top-4 left-4 px-3 py-1 ${statusColor} text-xs font-bold rounded text-white shadow-lg backdrop-blur-sm`}>
                    {statusText}
                </span>

                {/* Mission Patch if available (Floating) */}
                {launch.links?.patch?.small && (
                    <div className="absolute bottom-[-20px] right-4 bg-black/50 p-2 rounded-full backdrop-blur-md border border-white/10 transition-transform group-hover:scale-110">
                        <img src={launch.links.patch.small} alt="Patch" className="w-10 h-10 object-contain" />
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col pt-8">
                <h3 className="text-xl font-bold font-orbitron text-white mb-3 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                    {launch.name}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {details}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-2 text-xs text-gray-400 mb-6">
                    <div className="flex items-center gap-2">
                        <Rocket className="w-3 h-3 text-purple-400" />
                        <span className="truncate">{rocketName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-red-400" />
                        <span className="truncate">{padName}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-white/5 w-full">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {isValidDate ? format(launchDate, "MMM d, yyyy") : "TBD"}
                    </div>
                    <a
                        href={`https://www.google.com/search?q=${launch.name}+launch`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                        Mission Details
                    </a>
                </div>
            </div>
        </SpotlightCard>
    );
}
