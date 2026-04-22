import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // Sarah — voz clara en español

export async function POST(req: NextRequest) {
  // Si no hay API key, responder con 204 (sin contenido) para que el widget falle silenciosamente
  if (!ELEVENLABS_API_KEY) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.slice(0, 500), // Limitar para no exceder quota
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("ElevenLabs error:", response.status, response.statusText);
      return new NextResponse(null, { status: 204 });
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("TTS API error:", error);
    return new NextResponse(null, { status: 204 });
  }
}
