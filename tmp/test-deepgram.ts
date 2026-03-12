import { createClient } from "@deepgram/sdk";

async function testDeepgram() {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
        console.error("DEEPGRAM_API_KEY not found in .env.local");
        return;
    }

    const deepgram = createClient(apiKey);

    console.log("Testing Deepgram TTS...");
    try {
        const ttsResponse = await deepgram.speak.request(
            { text: "Hello, this is a test of the Deepgram SDK." },
            {
                model: "aura-asteria-en",
                encoding: "linear16",
                container: "wav",
            }
        );

        const stream = await ttsResponse.getStream();
        if (stream) {
            console.log("TTS Success: Stream received.");
        } else {
            console.error("TTS Failed: No stream received.");
        }
    } catch (err) {
        console.error("TTS Error:", err);
    }

    console.log("\nTesting Deepgram STT (Pre-recorded)...");
    try {
        // Using a sample public audio URL
        const sttResponse = await deepgram.listen.prerecorded.transcribeUrl(
            { url: "https://static.deepgram.com/examples/bueller.wav" },
            {
                smart_format: true,
                model: "nova-2",
            }
        );

        if (sttResponse.result) {
            console.log("STT Success: Result received.");
            console.log("Transcript preview:", sttResponse.result.results.channels[0].alternatives[0].transcript.substring(0, 50) + "...");
        } else if (sttResponse.error) {
            console.error("STT Error from Deepgram:", sttResponse.error);
        }
    } catch (err) {
        console.error("STT Exception:", err);
    }
}

testDeepgram();
