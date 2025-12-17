import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSpaceNews, getGoogleNews } from "@/lib/news";

export const dynamic = 'force-dynamic';

const newsSchema = z.object({
    title: z.string().min(1, "Title is required"),
    summary: z.string().optional(),
    content: z.string().min(1, "Content is required"),
    imageUrl: z.string().url().optional().or(z.literal("")),
    source: z.string().optional(),
    category: z.string().optional(),
});

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "20");
        const offset = parseInt(searchParams.get("offset") || "0");

        // Fetch concurrently
        const [spaceNews, googleNews] = await Promise.all([
            getSpaceNews(Math.floor(limit / 2), offset),
            getGoogleNews()
        ]);

        // Merge results
        // Note: Google News doesn't support pagination easily in this RSS format, 
        // safely slicing it or just appending it might be best.
        // For "live" feel, we prioritize Google News at the top or mix them.

        // Convert Google News items to match structure
        const googleItems = googleNews.map((item: any, index: number) => ({
            id: `gn-${index}`,
            title: item.title,
            summary: item.summary,
            image_url: item.image_url,
            news_site: item.news_site,
            published_at: item.published_at,
            url: item.url,
        }));

        const combined = [
            ...googleItems,
            ...(spaceNews.results || [])
        ];

        // Sort by date descending
        combined.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

        return NextResponse.json({
            results: combined,
            count: combined.length,
            next: null // Pagination complex with mixed sources
        });

    } catch (error) {
        console.error("GET News Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const json = await req.json();
        const body = newsSchema.parse(json);

        const news = await db.news.create({
            data: {
                title: body.title,
                summary: body.summary,
                content: body.content,
                imageUrl: body.imageUrl,
                source: body.source,
                category: body.category,
                authorId: session.user.id,
            },
        });

        return NextResponse.json(news);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 });
        }

        return new NextResponse("Internal Error", { status: 500 });
    }
}
