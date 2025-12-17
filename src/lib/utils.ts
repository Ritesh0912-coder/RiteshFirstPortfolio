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

// Diverse Space Placeholders
export const SPACE_PLACEHOLDERS = [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop", // Earth/Orbit
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop", // Earth Vertical
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop", // Nebula
    "https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=1000&auto=format&fit=crop", // Launch
    "https://images.unsplash.com/photo-1614730341194-75c60740a070?q=80&w=1000&auto=format&fit=crop", // Starfield
    "https://images.unsplash.com/photo-1454789548728-85d2696cfb93?q=80&w=1000&auto=format&fit=crop", // Astronaut
    "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=1000&auto=format&fit=crop", // Moon-like
    "https://images.unsplash.com/photo-1614728853975-69c960c72217?q=80&w=1000&auto=format&fit=crop", // Galaxy
    "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop", // Rocket
];

// Keyword Mappings for "Relevant" Fallbacks
const KEYWORD_IMAGES: Record<string, string[]> = {
    rocket: ["https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop", "https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=1000&auto=format&fit=crop"],
    launch: ["https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop", "https://images.unsplash.com/photo-1636819488524-1f019c4e1c44?q=80&w=1000&auto=format&fit=crop"],
    mars: ["https://images.unsplash.com/photo-1614728853975-69c960c72217?q=80&w=1000&auto=format&fit=crop", "https://images.unsplash.com/photo-1571275339838-c43cb88d6dc0?q=80&w=1000&auto=format&fit=crop"],
    moon: ["https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?q=80&w=1000&auto=format&fit=crop", "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=1000&auto=format&fit=crop"],
    galaxy: ["https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop", "https://images.unsplash.com/photo-1538370965046-79c0d6907d00?q=80&w=1000&auto=format&fit=crop"],
    star: ["https://images.unsplash.com/photo-1614730341194-75c60740a070?q=80&w=1000&auto=format&fit=crop"],
    sun: ["https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1000&auto=format&fit=crop"],
    nasa: ["https://images.unsplash.com/photo-1454789548728-85d2696cfb93?q=80&w=1000&auto=format&fit=crop"],
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
