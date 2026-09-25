/*
 * Procedencia del visitante (anuncio → pedido). Se guarda en la cookie fe_utm
 * en la PRIMERA visita con parámetros (first touch, 30 días) y el servidor la
 * copia a orders.utm al crear el pedido.
 */

export const UTM_COOKIE = "fe_utm";
export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"] as const;

export type Utm = Partial<Record<(typeof UTM_KEYS)[number] | "landing" | "referrer" | "first_seen", string>>;

const ALLOWED = new Set<string>([...UTM_KEYS, "landing", "referrer", "first_seen"]);

// La cookie la escribe el navegador: se trata como dato no confiable.
export function parseUtmCookie(raw: string | undefined): Utm {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    if (!parsed || typeof parsed !== "object") return {};
    const out: Utm = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (ALLOWED.has(key) && typeof value === "string" && value.length > 0) {
        out[key as keyof Utm] = value.slice(0, 200);
      }
    }
    return out;
  } catch {
    return {};
  }
}
