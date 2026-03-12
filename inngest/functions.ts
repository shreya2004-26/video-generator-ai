import { inngest } from "./client";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

import { GoogleGenAI } from "@google/genai";
import { DeepgramClient } from "@deepgram/sdk";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const deepgram = new DeepgramClient(process.env.DEEPGRAM_API_KEY!);

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return { event, body: "Hello, World!" };
    }
);

export const generateVideoContent = inngest.createFunction(
    {
        id: "generate-video-content",
        retries: 5 // Automatically retry failed steps up to 5 times with exponential backoff
    },
    { event: "video/generate" },
    async ({ event, step }) => {
        const { seriesId } = event.data;

        // 1. Fetch Series data from supabase
        const seriesData = await step.run("fetch-series-data", async () => {
            const supabase = createSupabaseAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
            const { data, error } = await supabase
                .from("VideoSeries")
                .select("*")
                .eq("id", seriesId)
                .single();

            if (error) {
                throw new Error(`Failed to fetch series: ${error.message}`);
            }
            if (!data) {
                throw new Error(`Series not found for ID: ${seriesId}`);
            }

            return data;
        });

        // 2. Generate Video Script using AI
        const scriptData = await step.run("generate-video-script", async () => {
            const isLongVideo = seriesData.video_duration === '60-70 sec';
            const sceneCount = isLongVideo ? '5 to 6' : '4 to 5';
            const durationText = seriesData.video_duration;

            const prompt = `You are a professional short-form video scriptwriter (for TikTok/Reels/Shorts).
Write a natural, engaging voiceover script for a ${durationText} video.
Niche: ${seriesData.niche} (${seriesData.niche_type === 'custom' ? seriesData.custom_niche_prompt : 'General topic'})
Visual Style: ${seriesData.video_style}

Requirements:
1. The voiceover must sound natural, hook the viewer immediately, and be engaging.
2. Break the video down into ${sceneCount} distinct scenes.
3. For EVERY scene, provide a highly detailed, descriptive "imagePrompt" that will be fed into an AI image generator to create the visuals. The image prompt MUST match the requested Visual Style (${seriesData.video_style}).
4. Provide a catchy "videoTitle".

Output EXACTLY AND ONLY in this JSON format, with no markdown formatting or extra text:
{
  "videoTitle": "Catchy title here",
  "scenes": [
    {
      "voiceoverText": "The exact text to be spoken in this scene...",
      "imagePrompt": "Detailed prompt for AI image generator, including lighting, style, and subject..."
    }
  ]
}
`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                }
            });

            const text = response.text;
            if (!text) throw new Error("AI returned empty response");

            try {
                return JSON.parse(text);
            } catch (e) {
                console.error("Failed to parse AI response:", text);
                throw new Error("AI did not return valid JSON");
            }
        });

        // 3. Generate Voice using TTS model
        const voiceAudioUrl = await step.run("generate-voice-audio", async () => {
            const { voice } = seriesData;

            // Combine all voiceover text from the scenes
            const fullScript = scriptData.scenes
                .map((scene: any) => scene.voiceoverText)
                .join('. ');

            let audioBuffer: Buffer;

            if (voice.startsWith('fonada-')) {
                // Determine voice ID based on the string (e.g. 'fonada-male-1' -> 'voice_id')
                // This assumes user provides a fonada specific string
                const fonadaVoiceId = voice.replace('fonada-', '');

                const ttsResponse = await fetch("https://api.fonadalabs.ai/v1/tts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${process.env.FONADA_API_KEY}`,
                    },
                    body: JSON.stringify({
                        text: fullScript,
                        voice_id: fonadaVoiceId,
                        // default format if applicable
                    }),
                });

                if (!ttsResponse.ok) {
                    throw new Error(`Fonada API error: ${ttsResponse.statusText}`);
                }

                const arrayBuffer = await ttsResponse.arrayBuffer();
                audioBuffer = Buffer.from(arrayBuffer);

            } else {
                // Use Deepgram SDK for voice generation
                let deepgramVoice = voice || 'aura-asteria-en';
                if (!deepgramVoice.startsWith('aura-')) {
                    deepgramVoice = 'aura-asteria-en';
                }

                const response = await deepgram.speak.request(
                    { text: fullScript },
                    {
                        model: deepgramVoice,
                        encoding: "linear16",
                        container: "wav",
                    }
                );

                const stream = await response.getStream();
                if (!stream) {
                    throw new Error("Deepgram TTS failed: No stream returned");
                }

                const reader = stream.getReader();
                const chunks: Uint8Array[] = [];
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    chunks.push(value);
                }
                audioBuffer = Buffer.concat(chunks);
            }

            // Upload the audioBuffer to Supabase Storage so we have a public URL for the video editor later
            const supabase = createSupabaseAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
            const fileName = `${seriesId}/${crypto.randomUUID()}.mp3`;

            const { error: uploadError } = await supabase.storage
                .from('video-assets')
                .upload(fileName, audioBuffer, {
                    contentType: 'audio/mpeg',
                    upsert: true
                });

            if (uploadError) {
                // If the bucket doesn't exist, we fallback to a placeholder for local dev
                console.error("Supabase storage upload failed (have you created the 'video-assets' bucket?):", uploadError.message);
                return `local-placeholder-${fileName}`;
            }

            const { data: publicUrlData } = supabase.storage
                .from('video-assets')
                .getPublicUrl(fileName);

            return publicUrlData.publicUrl;
        });

        // 4. Generate Caption using Model
        const captions = await step.run("generate-captions", async () => {
            if (!voiceAudioUrl || voiceAudioUrl.startsWith('local-placeholder')) {
                // If there is no real audio url (placeholder), return dummy captions
                return [
                    { word: "This", start: 0, end: 0.5 },
                    { word: "is", start: 0.5, end: 1 },
                    { word: "a", start: 1, end: 1.5 },
                    { word: "placeholder", start: 1.5, end: 2 }
                ];
            }

            // Call Deepgram's Pre-recorded audio API to transcribe the generated voiceover
            const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
                { url: voiceAudioUrl },
                {
                    smart_format: true,
                    punctuate: true,
                    model: "nova-2",
                    utterances: true,
                }
            );

            if (error) {
                throw new Error(`Deepgram transcription error: ${error.message}`);
            }

            const words = result?.results?.channels?.[0]?.alternatives?.[0]?.words || [];

            // Map Deepgram's word-level timestamps to our format
            return words.map((w: any) => ({
                word: w.punctuated_word || w.word,
                start: w.start,
                end: w.end
            }));
        });

        // 5. Generate Images from image prompt (Placeholder)
        const imageUrls = await step.run("generate-images", async () => {
            // Placeholder logic: would use script segments to generate images
            return [
                "https://dummy-image-url.com/img1.jpg",
                "https://dummy-image-url.com/img2.jpg"
            ];
        });

        // 6. Save everything to database
        const result = await step.run("save-to-database", async () => {
            const supabase = createSupabaseAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

            // Update the existing VideoSeries row with all the generated assets
            const { error: videoError } = await supabase
                .from('VideoSeries')
                .update({
                    script_data: scriptData,
                    audio_url: voiceAudioUrl,
                    captions_data: captions,
                    image_urls: imageUrls,
                    status: 'completed', // Or whatever your target success status is
                    // video_url: null // Can be added later when final video is stitched
                })
                .eq('id', seriesId);

            if (videoError) {
                console.error("Failed to update VideoSeries table:", videoError.message);
                throw new Error(`Database save failed: ${videoError.message}. Make sure the 'VideoSeries' table has columns: script_data, audio_url, captions_data, image_urls.`);
            }

            return {
                status: "success",
                seriesId: seriesId,
                audioUrl: voiceAudioUrl
            };
        });

        return {
            message: "Video generation pipeline completed successfully",
            seriesId,
            result
        };
    }
);
