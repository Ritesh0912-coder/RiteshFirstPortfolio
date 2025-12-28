import { NextResponse } from "next/server";
import { syncSpaceNews } from "@/lib/news";

export async function GET() {
    try {
        console.log("Manual sync triggered via API...");
        await syncSpaceNews();
        return NextResponse.json({
            success: true,
            message: "News sync completed successfully. ISRO news should now be visible."
        });
    } catch (error: any) {
        console.error("Sync error:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
