import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = 'force-dynamic';

const missionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    launchDate: z.string().optional().transform((str) => str ? new Date(str) : null),
    status: z.enum(["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
    agency: z.string().optional(),
    imageUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const json = await req.json();
        const body = missionSchema.parse(json);

        const mission = await db.mission.create({
            data: {
                name: body.name,
                description: body.description,
                launchDate: body.launchDate,
                status: body.status || "PENDING",
                agency: body.agency,
                imageUrl: body.imageUrl,
                authorId: session.user.id,
            },
        });

        return NextResponse.json(mission);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 });
        }

        return new NextResponse("Internal Error", { status: 500 });
    }
}
