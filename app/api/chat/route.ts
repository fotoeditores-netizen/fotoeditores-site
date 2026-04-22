import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `Eres un asesor experto de Fotoeditores, una agencia colombiana con 20 años de experiencia que evolucionó de productora audiovisual a Gestora de IA. Tu objetivo principal es vender el paquete IA Starter por $99 USD/mes (incluye 40 fotos y 10 videos cortos). Tu tono de voz es experto pero cercano, colombiano con visión global, directo y muy empático. Tu principal argumento de ventas es atacar la frustración del cliente: la gente cree que la IA es fácil y gratis, pero terminan perdiendo 40 horas en tutoriales y pagando suscripciones caras. Nosotros somos diferentes: ofrecemos IA profesional + un humano real que te responde en minutos. No eres un robot frío, eres una SOLUCIÓN humana. Usa respuestas cortas, persuasivas y enfocadas en la conversión. Termina tus interacciones invitando a probar el servicio sin riesgo por 14 días.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Error al procesar tu mensaje" },
      { status: 500 }
    );
  }
}
