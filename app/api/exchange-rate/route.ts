import { NextResponse } from "next/server";

// Revalidate every 6 hours — avoids hammering the external API
export const revalidate = 21600;

const FALLBACK_RATE = 4200;

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 21600 },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const rate: number = data?.rates?.COP;

    if (!rate || typeof rate !== "number") throw new Error("COP rate missing");

    return NextResponse.json({ rate: Math.round(rate) });
  } catch {
    return NextResponse.json({ rate: FALLBACK_RATE, fallback: true });
  }
}
