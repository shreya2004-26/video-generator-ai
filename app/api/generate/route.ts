import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { seriesId } = body;

        if (!seriesId) return new NextResponse("Missing seriesId", { status: 400 });

        // Trigger the Inngest function in the background
        await inngest.send({
            name: "video/generate",
            data: {
                seriesId,
            },
        });

        return NextResponse.json({ success: true, message: "Generation queued" }, { status: 200 });

    } catch (error: any) {
        console.error("[GENERATE_POST] Error:", error.message);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
