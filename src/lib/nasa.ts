export const NASA_API_BASE = "https://api.nasa.gov";
export const API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";

export async function getAPOD() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const res = await fetch(`${NASA_API_BASE}/planetary/apod?api_key=${API_KEY}`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            const errorText = await res.text().catch(() => "Unknown error");
            throw new Error(`Failed to fetch APOD: ${res.status} ${errorText}`);
        }
        return res.json();
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.error("APOD Error: Request timed out");
        } else {
            console.error("APOD Error:", error.message || error);
        }
        return null;
    }
}

export async function getRecentAPODs(days: number = 10) {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const dateStr = startDate.toISOString().split('T')[0];

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for range

        const res = await fetch(`${NASA_API_BASE}/planetary/apod?api_key=${API_KEY}&start_date=${dateStr}`, {
            next: { revalidate: 3600 },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            const errorText = await res.text().catch(() => "Unknown error");
            console.error(`NASA API Error (${res.status}):`, errorText);

            // If rate limited or API error, return empty array to use fallback images
            if (res.status === 429 || res.status === 403 || res.status >= 500) {
                console.warn(`NASA API issue (${res.status}). Using fallback images.`);
            }
            return [];
        }

        const data = await res.json();
        return data;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.error("Recent APOD Error: Request timed out");
        } else {
            console.error("Recent APOD Error:", error.message || error);
        }
        // Return empty array to trigger fallback images in gallery
        return [];
    }
}

export async function getRandomAPODs(count: number = 10) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const res = await fetch(`${NASA_API_BASE}/planetary/apod?api_key=${API_KEY}&count=${count}`, {
            next: { revalidate: 3600 },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            console.error(`NASA Random API Error (${res.status})`);
            return [];
        }

        return res.json();
    } catch (error) {
        console.error("Random APOD Error:", error);
        return [];
    }
}

export async function getNeoWS() {
    // Implementation for asteroids if needed later
    return null;
}
