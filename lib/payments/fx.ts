/*
 * Tasa USD → COP para cobrar en Wompi (decisión 5 de docs/AUDITORIA.md §9).
 *
 * 1. TRM oficial de la Superintendencia Financiera (datos abiertos del Gobierno,
 *    datos.gov.co, conjunto 32sa-8pi3). Es la tasa de referencia legal en Colombia.
 * 2. Respaldo: open.er-api.com (la misma que usa el Cotizador).
 * Si ninguna da un valor fresco y razonable, el pago NO se inicia: nunca se
 * cobra con una tasa fija o vieja.
 */

export type FxQuote = { rate: number; source: "trm" | "open-er-api"; date: string };

// Límites de cordura: fuera de este rango algo está mal en la fuente.
const MIN_RATE = 2000;
const MAX_RATE = 8000;
// La TRM de viernes rige hasta el lunes; se tolera hasta 4 días de antigüedad.
const MAX_AGE_DAYS = 4;

const TRM_URL = "https://www.datos.gov.co/resource/32sa-8pi3.json?$order=vigenciadesde%20DESC&$limit=1";
const FALLBACK_URL = "https://open.er-api.com/v6/latest/USD";

type Fetch = typeof fetch;

const sane = (rate: unknown): rate is number => typeof rate === "number" && Number.isFinite(rate) && rate >= MIN_RATE && rate <= MAX_RATE;

// Fecha de hoy en Bogotá (YYYY-MM-DD).
const todayBogota = (now: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(now);

function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`)) / 86_400_000);
}

async function getJson(fetchImpl: Fetch, url: string): Promise<unknown> {
  const res = await fetchImpl(url, { signal: AbortSignal.timeout(5000), next: { revalidate: 1800 } } as RequestInit);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchTrm(fetchImpl: Fetch, now = new Date()): Promise<FxQuote | null> {
  try {
    const rows = (await getJson(fetchImpl, TRM_URL)) as { valor?: string; vigenciadesde?: string; vigenciahasta?: string }[];
    const row = rows?.[0];
    const rate = Number(row?.valor);
    const until = row?.vigenciahasta?.slice(0, 10);
    if (!sane(rate) || !until) return null;
    if (daysBetween(todayBogota(now), until) > MAX_AGE_DAYS) return null;
    return { rate, source: "trm", date: until };
  } catch {
    return null;
  }
}

export async function fetchFallback(fetchImpl: Fetch, now = new Date()): Promise<FxQuote | null> {
  try {
    const data = (await getJson(fetchImpl, FALLBACK_URL)) as { rates?: { COP?: number }; time_last_update_unix?: number };
    const rate = data?.rates?.COP;
    const updated = data?.time_last_update_unix;
    if (!sane(rate) || typeof updated !== "number") return null;
    const date = new Date(updated * 1000).toISOString().slice(0, 10);
    if (daysBetween(todayBogota(now), date) > MAX_AGE_DAYS) return null;
    return { rate, source: "open-er-api", date };
  } catch {
    return null;
  }
}

export async function getUsdCopRate(fetchImpl: Fetch = fetch, now = new Date()): Promise<FxQuote | null> {
  return (await fetchTrm(fetchImpl, now)) ?? (await fetchFallback(fetchImpl, now));
}

/*
 * USD → centavos de COP para Wompi. Se redondea hacia arriba al peso entero
 * (el cobro nunca queda por debajo del precio publicado). marginPercent
 * permite, si algún día se decide, cubrir variación o comisiones.
 */
export function usdToCopCents(amountUsd: number, rate: number, marginPercent = 0): number {
  const cop = Math.ceil(Number((amountUsd * rate * (1 + marginPercent / 100)).toFixed(6)));
  return cop * 100;
}
