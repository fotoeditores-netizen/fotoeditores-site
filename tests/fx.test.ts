import { describe, expect, it } from "vitest";
import { getUsdCopRate, usdToCopCents } from "@/lib/payments/fx";

const NOW = new Date("2026-09-25T15:00:00Z"); // 10 a. m. en Bogotá

// fetch falso: responde según la URL.
function fakeFetch(responses: { trm?: unknown; fallback?: unknown; trmFails?: boolean; fallbackFails?: boolean }) {
  return (async (url: string) => {
    const isTrm = String(url).includes("datos.gov.co");
    if ((isTrm && responses.trmFails) || (!isTrm && responses.fallbackFails)) throw new Error("red caída");
    const body = isTrm ? responses.trm : responses.fallback;
    return new Response(JSON.stringify(body), { status: 200 });
  }) as unknown as typeof fetch;
}

const trmRow = (valor: string, fecha = "2026-09-25") => [
  { valor, unidad: "COP", vigenciadesde: `${fecha}T00:00:00.000`, vigenciahasta: `${fecha}T00:00:00.000` },
];
const fallback = (cop: number, unix = Date.parse("2026-09-25T00:02:00Z") / 1000) => ({ rates: { COP: cop }, time_last_update_unix: unix });

describe("getUsdCopRate", () => {
  it("usa la TRM oficial cuando está vigente", async () => {
    expect(await getUsdCopRate(fakeFetch({ trm: trmRow("3329.61"), fallback: fallback(3264.5) }), NOW)).toEqual({
      rate: 3329.61,
      source: "trm",
      date: "2026-09-25",
    });
  });

  it("acepta la TRM del viernes durante el fin de semana", async () => {
    const quote = await getUsdCopRate(fakeFetch({ trm: trmRow("3300", "2026-09-28") }), new Date("2026-09-27T15:00:00Z"));
    expect(quote?.source).toBe("trm");
  });

  it("pasa al respaldo si la TRM no responde", async () => {
    const quote = await getUsdCopRate(fakeFetch({ trmFails: true, fallback: fallback(3264.54) }), NOW);
    expect(quote).toMatchObject({ rate: 3264.54, source: "open-er-api" });
  });

  it("pasa al respaldo si la TRM está vencida (más de 4 días)", async () => {
    const quote = await getUsdCopRate(fakeFetch({ trm: trmRow("3300", "2026-09-15"), fallback: fallback(3264.54) }), NOW);
    expect(quote?.source).toBe("open-er-api");
  });

  it("rechaza valores absurdos de cualquier fuente", async () => {
    expect(await getUsdCopRate(fakeFetch({ trm: trmRow("33.29"), fallback: fallback(0) }), NOW)).toBeNull();
    expect(await getUsdCopRate(fakeFetch({ trm: trmRow("abc"), fallback: fallback(99999) }), NOW)).toBeNull();
  });

  it("devuelve null (no se cobra) si ninguna fuente sirve", async () => {
    expect(await getUsdCopRate(fakeFetch({ trmFails: true, fallbackFails: true }), NOW)).toBeNull();
  });
});

describe("usdToCopCents", () => {
  it("convierte a centavos de COP redondeando hacia arriba al peso", () => {
    expect(usdToCopCents(59, 3329.61)).toBe(19644700); // 196.446,99 → 196.447 COP
    expect(usdToCopCents(9, 4000)).toBe(3600000); // exacto: 36.000 COP
  });

  it("nunca cobra menos del precio publicado", () => {
    for (const usd of [9, 29, 39, 59, 99, 149]) {
      for (const rate of [3264.54, 3329.61, 4012.1]) {
        expect(usdToCopCents(usd, rate) / 100).toBeGreaterThanOrEqual(usd * rate);
      }
    }
  });

  it("aplica un margen opcional", () => {
    expect(usdToCopCents(100, 4000, 3)).toBe(41200000);
  });
});
