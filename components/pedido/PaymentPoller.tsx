"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Mientras el pago se confirma, vuelve a pedir la página cada 4 s (máx. ~2 min).
export default function PaymentPoller({ active }: { active: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (!active) return;
    let tries = 0;
    const id = window.setInterval(() => {
      tries += 1;
      if (tries > 30) return window.clearInterval(id);
      router.refresh();
    }, 4000);
    return () => window.clearInterval(id);
  }, [active, router]);
  return null;
}
