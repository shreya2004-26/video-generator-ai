import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const {
            niche, nicheType, customNichePrompt, language, voice,
            backgroundAudio, videoStyle, captionStyle, seriesName,
            videoDuration, publishTime, platforms
        } = body;

        // Validation... (kept your existing logic)
        if (!niche || !language || !voice || !videoStyle || !captionStyle || !seriesName || !videoDuration || !publishTime || !platforms) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from("VideoSeries")
            .insert({
                user_id: userId,
                niche,
                niche_type: nicheType || 'available',
                custom_niche_prompt: customNichePrompt || null,
                language,
                voice,
                background_audio: backgroundAudio || [],
                video_style: videoStyle,
                caption_style: captionStyle,
                series_name: seriesName,
                video_duration: videoDuration,
                publish_time: publishTime,
                platforms,
                status: 'active'
            })
            .select()
            .maybeSingle(); // FIX: Changed from .single()

        if (error) {
            console.error("[SERIES_POST] Supabase Error:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const supabase = await createClient();
        const { data, error } = await supabase
            .from("VideoSeries")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("[SERIES_GET] Supabase Error:", error);
            const fs = require('fs');
            fs.writeFileSync('d:\\Next_js\\video-generator\\api_get_db_error.log', JSON.stringify(error, null, 2));
            return new NextResponse("Database Error", { status: 500 });
        }
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[SERIES_GET] Catch Error:", error);
        const fs = require('fs');
        fs.writeFileSync('d:\\Next_js\\video-generator\\api_get_error.log', error?.message + '\n' + error?.stack);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) return new NextResponse("Missing fields", { status: 400 });

        const supabase = await createClient();

        const { data, error } = await supabase
            .from("VideoSeries")
            .update({ status })
            .eq("id", id)
            .eq("user_id", userId) // Ensures user can only update their own
            .select()
            .maybeSingle(); // FIX: Changed from .single()

        if (error) {
            console.error("[SERIES_PATCH] Supabase Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // If data is null, it means RLS blocked it or the ID doesn't exist
        if (!data) {
            return NextResponse.json({
                error: "Series not found or you do not have permission to update it."
            }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}