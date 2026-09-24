"use client";

import { useEffect } from "react";
import { UTM_COOKIE, UTM_KEYS } from "@/lib/utm";

// Guarda de qué anuncio llegó el visitante (solo la primera vez que trae parámetros).
export default function UtmCapture() {
  useEffect(() => {
    if (document.cookie.split("; ").some((c) => c.startsWith(`${UTM_COOKIE}=`))) return;
    const params = new URLSearchParams(window.location.search);
    const data: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) data[key] = value.slice(0, 200);
    }
    if (Object.keys(data).length === 0) return;
    data.landing = window.location.pathname;
    if (document.referrer) data.referrer = document.referrer.slice(0, 200);
    data.first_seen = new Date().toISOString();
    const value = encodeURIComponent(JSON.stringify(data));
    document.cookie = `${UTM_COOKIE}=${value}; Max-Age=${60 * 60 * 24 * 30}; Path=/; SameSite=Lax; Secure`;
  }, []);
  return null;
}
