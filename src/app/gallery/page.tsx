import GlassCard from "@/components/ui/GlassCard";
import Image from "next/image";
import InfiniteMenu from "@/components/ui/InfiniteMenu";
import { getRandomAPODs } from "@/lib/nasa";
import { getRandomSpacePhotos } from "@/lib/unsplash";

export const revalidate = 3600; // Refresh hourly for variety

const FALLBACK_IMAGES = [
    { image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop", link: "https://unsplash.com/photos/earth", title: "Earth", description: "Our blue marble." },
    { image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop", link: "https://unsplash.com/photos/orbit", title: "Orbit", description: "Curvature of Earth." },
    { image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=2074&auto=format&fit=crop", link: "https://unsplash.com/photos/nebula", title: "Nebula", description: "Deep space wonders." },
    { image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2070&auto=format&fit=crop", link: "https://unsplash.com/photos/cosmos", title: "Cosmos", description: "Infinite starlight." },
    { image: "https://images.unsplash.com/photo-1614730341194-75c60740a087?q=80&w=2148&auto=format&fit=crop", link: "https://unsplash.com/photos/spacex", title: "Launch", description: "Future of travel." },
    { image: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=2074&auto=format&fit=crop", link: "https://unsplash.com/photos/nebula", title: "Galaxy", description: "Spiral beauty." },
    { image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2070&auto=format&fit=crop", link: "https://unsplash.com/photos/rocket", title: "Rocket", description: "To the stars." },
];

export default async function GalleryPage() {
    // Fetch random content from both sources
    const [apodData, unsplashData] = await Promise.all([
        getRandomAPODs(25),
        getRandomSpacePhotos(25)
    ]);

    // Map NASA data
    const nasaImages = Array.isArray(apodData)
        ? apodData
            .filter((item: any) => item.media_type === "image" && item.url)
            .map((item: any) => ({
                image: `https://wsrv.nl/?url=${encodeURIComponent(item.hdurl || item.url)}&w=800&q=80`,
                link: item.hdurl || item.url,
                title: item.title,
                description: item.explanation || "NASA Astronomy Picture of the Day"
            }))
        : [];

    // Map Unsplash data
    const unsplashImages = Array.isArray(unsplashData)
        ? unsplashData.map((item: any) => ({
            image: item.urls.regular,
            link: item.links.html,
            title: item.alt_description || "Space exploration",
            description: item.description || "Captured from the stars"
        }))
        : [];

    // Combine and Shuffle
    const combined = [...nasaImages, ...unsplashImages];
    const shuffled = combined.sort(() => Math.random() - 0.5);

    // Ensure we have enough for the infinite effect, otherwise add fallbacks
    const galleryItems = shuffled.length >= 10
        ? shuffled
        : [...shuffled, ...FALLBACK_IMAGES];

    // Final unique check
    const uniqueItems = Array.from(new Map(galleryItems.map((item: any) => [item.image, item])).values());

    return (
        <main className="min-h-screen bg-black overflow-hidden relative">
            <div className="absolute top-24 left-0 right-0 z-10 text-center pointer-events-none">
                <h1 className="text-4xl md:text-6xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-500 opacity-90 tracking-tighter">
                    COSMIC GALLERY
                </h1>
                <p className="text-blue-400/60 mt-4 font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase">

                </p>
            </div>

            <div className="w-full h-screen relative z-0">
                <InfiniteMenu items={uniqueItems} />
            </div>
        </main>
    );
}
