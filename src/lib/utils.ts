import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getYouTubeThumbnail(url: string | null | undefined): string | null {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
        ? `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`
        : null;
}

// Diverse Space Placeholders - Expanded for variety
export const SPACE_PLACEHOLDERS = [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop", // Earth/Orbit
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop", // Satellite
    "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=1000&auto=format&fit=crop", // Nebula
    "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1000&auto=format&fit=crop", // Star field
    "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1000&auto=format&fit=crop", // Galaxy
    "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=1000&auto=format&fit=crop", // Deep Space
    "https://images.unsplash.com/photo-1454789548728-85d2696cfb93?q=80&w=1000&auto=format&fit=crop", // Astronaut
    "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop", // Rocket
    "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1000&auto=format&fit=crop", // Milky Way
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop", // Space view
    "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1000&auto=format&fit=crop", // Stars
    "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1000&auto=format&fit=crop", // Planets
    "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?q=80&w=1000&auto=format&fit=crop", // Rocket launch
    "https://images.unsplash.com/photo-1610296669228-602fa827fc1f?q=80&w=1000&auto=format&fit=crop", // Space station
    "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000&auto=format&fit=crop", // Cosmic
];

// Keyword Mappings for "Relevant" Fallbacks - Expanded variety
const KEYWORD_IMAGES: Record<string, string[]> = {
    rocket: [
        "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581822261290-991b38693d1b?q=80&w=1000&auto=format&fit=crop",
    ],
    launch: [
        "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?q=80&w=1000&auto=format&fit=crop",
    ],
    isro: [
        "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581822261290-991b38693d1b?q=80&w=1000&auto=format&fit=crop",
    ],
    india: [
        "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop",
    ],
    mars: [
        "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000&auto=format&fit=crop",
    ],
    moon: [
        "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509023464722-18d996393ca8?q=80&w=1000&auto=format&fit=crop",
    ],
    galaxy: [
        "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1000&auto=format&fit=crop",
    ],
    star: [
        "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1000&auto=format&fit=crop",
    ],
    earth: [
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop",
    ],
    nasa: [
        "https://images.unsplash.com/photo-1454789548728-85d2696cfb93?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1610296669228-602fa827fc1f?q=80&w=1000&auto=format&fit=crop",
    ],
    satellite: [
        "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1610296669228-602fa827fc1f?q=80&w=1000&auto=format&fit=crop",
    ],
    astronaut: [
        "https://images.unsplash.com/photo-1454789548728-85d2696cfb93?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?q=80&w=1000&auto=format&fit=crop",
    ],
    nebula: [
        "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1000&auto=format&fit=crop",
    ],
};

export function getRandomSpaceImage() {
    return SPACE_PLACEHOLDERS[Math.floor(Math.random() * SPACE_PLACEHOLDERS.length)];
}

export function getImageForKeyword(text: string): string | null {
    if (!text) return null;
    const lowerText = text.toLowerCase();

    for (const [keyword, images] of Object.entries(KEYWORD_IMAGES)) {
        if (lowerText.includes(keyword)) {
            return images[Math.floor(Math.random() * images.length)];
        }
    }
    return null;
}

export function getValidImageUrl(url: string | null | undefined): string | null {
    if (!url) return null;

    const lowerUrl = url.toLowerCase();

    // 1. YouTube Thumbs (Always valid)
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
        const thumb = getYouTubeThumbnail(url);
        if (thumb) return thumb;
    }

    // 2. Must start with http or https
    if (!url.match(/^https?:\/\//i)) return null;

    // 3. NUCLEAR BLACKLIST: Block ALL Google hosted images
    // This is necessary to prevent the generic "GE" logo from appearing.
    // We block 'google' (covers google.com, googleusercontent.com, news.google.com)
    // and 'gstatic' (covers the logo hosting).
    if (lowerUrl.includes("google") || lowerUrl.includes("gstatic")) {
        return null;
    }

    return url;
}

export function getCompulsoryImage(url: string | null | undefined, contextText: string = ""): string {
    const valid = getValidImageUrl(url);
    if (valid) return valid;

    // Try to find a relevant image based on text
    const relevant = getImageForKeyword(contextText);
    if (relevant) return relevant;

    return getRandomSpaceImage();
}
