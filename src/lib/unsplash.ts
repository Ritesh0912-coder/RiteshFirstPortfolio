export const UNSPLASH_API_BASE = "https://api.unsplash.com";
export const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_ACCESS_KEY;

export async function getRandomSpacePhotos(count: number = 10) {
    if (!UNSPLASH_ACCESS_KEY) {
        console.warn("Unsplash Access Key not found. Skipping Unsplash fetch.");
        return [];
    }

    try {
        const query = "space,galaxy,nebula,cosmos,astronomy";
        const res = await fetch(`${UNSPLASH_API_BASE}/photos/random?client_id=${UNSPLASH_ACCESS_KEY}&count=${count}&query=${query}&orientation=landscape`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            const error = await res.text();
            console.error(`Unsplash API Error (${res.status}):`, error);
            return [];
        }

        const data = await res.json();
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        console.error("Unsplash Fetch Error:", error);
        return [];
    }
}
