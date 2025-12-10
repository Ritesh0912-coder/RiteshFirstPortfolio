import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = 'force-dynamic';

const newsSchema = z.object({
    title: z.string().min(1, "Title is required"),
    summary: z.string().optional(),
    content: z.string().min(1, "Content is required"),
    imageUrl: z.string().url().optional().or(z.literal("")),
    source: z.string().optional(),
    category: z.string().optional(),
});

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
