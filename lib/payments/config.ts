import "server-only";
import { getServerEnv } from "@/lib/env/server";

// Wompi es opcional por ambiente (las 4 variables van juntas o no van, ver lib/env/schema.ts).
// Sin configuración, el sitio sigue funcionando con pago coordinado por WhatsApp.
export function getWompiConfig() {
  const env = getServerEnv();
  if (!env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || !env.WOMPI_INTEGRITY_SECRET || !env.WOMPI_EVENTS_SECRET || !env.WOMPI_API_BASE) {
    return null;
  }
  return {
    publicKey: env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
    integritySecret: env.WOMPI_INTEGRITY_SECRET,
    eventsSecret: env.WOMPI_EVENTS_SECRET,
    apiBase: env.WOMPI_API_BASE,
    forwardUrl: env.WOMPI_EVENTS_FORWARD_URL ?? null,
    marginPercent: env.FX_MARGIN_PERCENT ?? 0,
    sandbox: env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY.startsWith("pub_test_"),
  };
}
