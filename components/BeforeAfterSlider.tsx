"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface Props {
  beforeSrc: string;
  afterSrc: string;
  alt: string;
  /** Proporción ancho/alto. Por defecto 3/4 (vertical). */
  ratio?: number;
  /** true en la imagen principal de la página (la carga primero: mejora el LCP). */
  priority?: boolean;
  sizes?: string;
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  alt,
  ratio = 3 / 4,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: Props) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  }, []);

  return (
    <div>
      {/* Slider — imagen limpia */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl select-none cursor-ew-resize"
        style={{ paddingBottom: `${100 / ratio}%` }}
        role="slider"
        aria-label={`Comparar antes y después: ${alt}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPosition((p) => Math.max(2, p - 5));
          if (e.key === "ArrowRight") setPosition((p) => Math.min(98, p + 5));
        }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          updatePosition(e.clientX);
          e.preventDefault();
        }}
        onPointerMove={(e) => updatePosition(e.clientX)}
        onPointerUp={(e) => e.currentTarget.releasePointerCapture(e.pointerId)}
        onPointerCancel={(e) => e.currentTarget.releasePointerCapture(e.pointerId)}
      >
      {/* After — full background */}
      <div className="absolute inset-0">
        <Image
          src={afterSrc}
          alt={`${alt} después`}
          fill
          priority={priority}
          className="object-cover"
          sizes={sizes}
        />
      </div>

      {/* Before — clipped to left */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <div className="absolute inset-0">
          <Image
            src={beforeSrc}
            alt={`${alt} antes`}
            fill
            priority={priority}
            className="object-cover"
            sizes={sizes}
          />
        </div>
      </div>

      {/* Divider + handle */}
      <div
        className="absolute top-0 bottom-0 z-10 pointer-events-none"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/80" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.45)" }}
        >
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
            <path
              d="M5 6H1m0 0 3-3M1 6l3 3M13 6h4m0 0-3-3m3 3-3 3"
              stroke="#0A1628"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      </div>

      {/* Labels — grid 50/50 espejando la imagen */}
      <div className="grid grid-cols-2 mt-3">
        <div className="text-center">
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full inline-block"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "var(--font-montserrat)",
            }}
          >
            ANTES
          </span>
        </div>
        <div className="text-center">
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full inline-block"
            style={{
              background: "rgba(0,212,255,0.15)",
              border: "1px solid rgba(0,212,255,0.3)",
              color: "#00D4FF",
              fontFamily: "var(--font-montserrat)",
            }}
          >
            DESPUÉS
          </span>
        </div>
      </div>
    </div>
  );
}
