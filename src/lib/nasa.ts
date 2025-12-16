export const NASA_API_BASE = "https://api.nasa.gov";
export const API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";

export async function getAPOD() {
    try {
        const res = await fetch(`${NASA_API_BASE}/planetary/apod?api_key=${API_KEY}`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });
        if (!res.ok) throw new Error("Failed to fetch APOD");
        return res.json();
    } catch (error) {
        console.error("APOD Error:", error);
        return null;
    }
}

export async function getRecentAPODs(days: number = 10) {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const dateStr = startDate.toISOString().split('T')[0];

        const res = await fetch(`${NASA_API_BASE}/planetary/apod?api_key=${API_KEY}&start_date=${dateStr}`, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`NASA API Error (${res.status}):`, errorText);

            // If rate limited or API error, return empty array to use fallback images
            if (res.status === 429 || res.status === 403) {
                console.warn('NASA API rate limit reached. Using fallback images.');
            }
            return [];
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Recent APOD Error:", error);
        // Return empty array to trigger fallback images in gallery
        return [];
    }
}

export async function getNeoWS() {
    // Implementation for asteroids if needed later
    return null;
}
