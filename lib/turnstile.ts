import "server-only";
import { getServerEnv } from "@/lib/env/server";

/*
 * Verificación de Cloudflare Turnstile (anti-bots) antes de crear un pedido.
 * Llaves de prueba de Cloudflare para local y previews:
 *   sitio  1x00000000000000000000AA   (siempre pasa)
 *   secreto 1x0000000000000000000000000000000AA
 */
export async function verifyTurnstile(token: unknown, ip?: string | null): Promise<boolean> {
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) return false;
  const body = new URLSearchParams({ secret: getServerEnv().TURNSTILE_SECRET_KEY, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!data.success) console.warn("Turnstile rechazado:", data["error-codes"]);
    return data.success === true;
  } catch (error) {
    console.error("Turnstile no respondió:", error);
    return false;
  }
}
