import "server-only";
import { NextResponse } from "next/server";
import { OrderError } from "@/lib/orders/service";

// Respuesta de error uniforme para los Route Handlers del funnel.
export function errorResponse(error: unknown): NextResponse {
  if (error instanceof OrderError) {
    return NextResponse.json({ error: error.message, fields: error.fields }, { status: error.status });
  }
  console.error("Error no controlado:", error);
  return NextResponse.json({ error: "Algo salió mal de nuestro lado. Intenta de nuevo en un momento." }, { status: 500 });
}

// Lee JSON del cuerpo con tope de tamaño; devuelve null si no es JSON válido.
export async function readJson(request: Request, maxBytes = 20_000): Promise<Record<string, unknown> | null> {
  const text = await request.text();
  if (text.length > maxBytes) return null;
  try {
    const value: unknown = JSON.parse(text);
    return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export const badRequest = (message = "Petición inválida.") => NextResponse.json({ error: message }, { status: 400 });

export function clientIp(request: Request): string | null {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
}
