
import { NextResponse } from "next/server";
import { syncSpaceNews } from "@/lib/news";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("Cron started: Syncing news...");
        await syncSpaceNews();
        console.log("Cron finished: Syncing news.");

        return NextResponse.json({ success: true, message: "News synced successfully" });
    } catch (error) {
        console.error("News Sync Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
