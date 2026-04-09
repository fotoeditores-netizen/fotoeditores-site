"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

/* ─── Data ──────────────────────────────────────────────────── */

const sliders = [
  {
    id: "frasco",
    category: "Fotografía de Producto",
    title: "Del archivo crudo a la vitrina digital",
    tool: "Photoshop IA · Magnific",
    color: "#00D4FF",
    beforeSrc: "/antes_despues/frasco_antes.jpeg",
    afterSrc: "/antes_despues/frasco_despues.png",
  },
  {
    id: "metro",
    category: "Fotografía Urbana",
    title: "Cada imagen cuenta una historia",
    tool: "Lightroom IA · Corrección de Color",
    color: "#0066FF",
    beforeSrc: "/antes_despues/metro_antes.jpg",
    afterSrc: "/antes_despues/metros_despues.png",
  },
  {
    id: "tren",
    category: "Fotografía Urbana",
    title: "La ciudad en su mejor luz",
    tool: "Lightroom IA · Upscaling",
    color: "#FFB800",
    beforeSrc: "/antes_despues/tren_antes_v2.png",
    afterSrc: "/antes_despues/tren_despues_v2.png",
  },
  {
    id: "nina",
    category: "Retoque & Fotografía de Retrato",
    title: "La imagen que habla por sí sola",
    tool: "Photoshop IA · Magnific · Retoque",
    color: "#00D4FF",
    beforeSrc: "/antes_despues/nina_antes.jpg",
    afterSrc: "/antes_despues/nina_despues.png",
  },
];

type MediaKind = "image" | "video";

const sideBySide = [
  {
    id: "alfajores",
    category: "Fotografía Gastronómica",
    title: "Del plano estático al contenido que vende",
    tool: "Runway · Video Generativo IA",
    color: "#FFB800",
    beforeSrc: "/antes_despues/alfajores_antes.png",
    beforeKind: "image" as MediaKind,
    afterSrc: "/antes_despues/alfajores_despues.mp4",
    afterKind: "video" as MediaKind,
  },
  {
    id: "pareja",
    category: "Retrato & Moda",
    title: "La emoción que conecta con tu audiencia",
    tool: "HeyGen · Producción Audiovisual IA",
    color: "#00D4FF",
    beforeSrc: "/antes_despues/pareja_antes.jpeg",
    beforeKind: "image" as MediaKind,
    afterSrc: "/antes_despues/pareja_despues.mp4",
    afterKind: "video" as MediaKind,
  },
  {
    id: "analogico",
    category: "Transformación de Video",
    title: "Moderniza tu archivo audiovisual",
    tool: "Topaz IA · Restauración y Upscaling",
    color: "#0066FF",
    beforeSrc: "/antes_despues/analogico_antes.mp4",
    beforeKind: "video" as MediaKind,
    afterSrc: "/antes_despues/analogico_despues.mp4",
    afterKind: "video" as MediaKind,
  },
  {
    id: "frasco-video",
    category: "Producto en Movimiento",
    title: "Tu producto cobra vida con la IA",
    tool: "Runway · Video Generativo",
    color: "#00D4FF",
    beforeSrc: "/antes_despues/frasco_antes_video.png",
    beforeKind: "image" as MediaKind,
    afterSrc: "/antes_despues/frasco_despues_video.mp4",
    afterKind: "video" as MediaKind,
  },
  {
    id: "moda",
    category: "Moda & Lifestyle",
    title: "La marca que se mueve y conquista",
    tool: "HeyGen · Video IA",
    color: "#FFB800",
    beforeSrc: "/antes_despues/moda_antes.png",
    beforeKind: "image" as MediaKind,
    afterSrc: "/antes_despues/moda_despues.mp4",
    afterKind: "video" as MediaKind,
  },
  {
    id: "pastel",
    category: "Repostería & Gastronomía",
    title: "Del plato al contenido de impacto",
    tool: "Runway · Animación IA",
    color: "#0066FF",
    beforeSrc: "/antes_despues/pastel_antes.jpeg",
    beforeKind: "image" as MediaKind,
    afterSrc: "/antes_despues/pastel_despues.mp4",
    afterKind: "video" as MediaKind,
  },
  {
    id: "comunion",
    category: "Fotografía de Eventos",
    title: "El recuerdo que merece ser eterno",
    tool: "Runway · Video Generativo IA",
    color: "#FFB800",
    beforeSrc: "/antes_despues/comunion_antes.png",
    beforeKind: "image" as MediaKind,
    afterSrc: "/antes_despues/comunion_despues.mp4",
    afterKind: "video" as MediaKind,
  },
];

/* ─── Media box ─────────────────────────────────────────────── */

function MediaBox({
  src,
  kind,
  label,
  isAfter,
}: {
  src: string;
  kind: MediaKind;
  label: string;
  isAfter: boolean;
}) {
  // Derive sibling format: if src is .mp4, also try .mov for Safari; vice-versa
  const altSrc = src.endsWith(".mp4")
    ? src.replace(".mp4", ".mov")
    : src.replace(".mov", ".mp4");

  return (
    <div>
      {/* Media — limpio, sin texto encima */}
      <div className="relative w-full overflow-hidden rounded-xl" style={{ paddingBottom: "177.78%" }}>
        <div className="absolute inset-0 bg-[#050D1A]">
          {kind === "video" ? (
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls
            >
              <source src={src} type="video/mp4" />
              <source src={altSrc} type="video/quicktime" />
            </video>
          ) : (
            <Image
              src={src}
              alt={label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
      </div>

      {/* Label — debajo de la imagen, como caption */}
      <div className="mt-3 flex justify-center">
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={
            isAfter
              ? { background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)", color: "#00D4FF", fontFamily: "var(--font-montserrat)" }
              : { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-montserrat)" }
          }
        >
          {label}
        </span>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */

export default function EjemplosPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative pt-28 pb-16 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A1628 0%, #0D1E3A 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,102,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.04) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #0066FF, transparent)" }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border mb-6"
              style={{
                color: "#FFB800",
                borderColor: "rgba(255,184,0,0.3)",
                background: "rgba(255,184,0,0.08)",
                fontFamily: "var(--font-montserrat)",
              }}
            >
              <Zap size={12} fill="currentColor" />
              Ver para creer
            </div>

            <h1
              className="text-4xl sm:text-5xl font-extrabold mb-5"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              <span className="text-white">Antes</span>{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                y Después
              </span>
            </h1>

            <p
              className="text-base sm:text-lg max-w-2xl mx-auto"
              style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-inter)" }}
            >
              Resultados reales producidos por nuestro equipo. Arrastra el divisor
              en las fotos o reproduce los videos para ver la transformación.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Sliders — Fotografía ─────────────────────────────── */}
      <section className="py-20" style={{ background: "#0A1628" }}>
        <div
          className="absolute left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #00D4FF40, transparent)" }}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-widest mb-10 text-center"
            style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-montserrat)" }}
          >
            Arrastra el divisor para comparar
          </motion.p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {sliders.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="rounded-2xl flex flex-col"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${item.color}20`,
                }}
              >
                {/* Badge */}
                <div className="px-3 pt-4 pb-3">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full block text-center"
                    style={{
                      background: `${item.color}15`,
                      border: `1px solid ${item.color}30`,
                      color: item.color,
                      fontFamily: "var(--font-montserrat)",
                    }}
                  >
                    {item.category}
                  </span>
                </div>

                {/* Slider */}
                <div className="px-3">
                  <BeforeAfterSlider
                    beforeSrc={item.beforeSrc}
                    afterSrc={item.afterSrc}
                    alt={item.category}
                  />
                </div>

                {/* Footer */}
                <div className="px-3 pt-3 pb-4">
                  <p
                    className="text-xs font-semibold text-white leading-snug mb-1"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-[10px] leading-snug"
                    style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-jetbrains)" }}
                  >
                    {item.tool}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Side by side — Video/Mixed ───────────────────────── */}
      <section className="py-20" style={{ background: "#050D1A" }}>
        <div
          className="h-px mb-20"
          style={{ background: "linear-gradient(90deg, transparent, #FFB80040, transparent)" }}
        />
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-widest mb-12 text-center"
            style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-montserrat)" }}
          >
            Transformaciones con Video IA
          </motion.p>

          <div className="flex flex-col gap-10">
            {sideBySide.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${item.color}20`,
                }}
              >
                {/* Card header */}
                <div className="px-5 pt-5 pb-4">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-block mb-2"
                    style={{
                      background: `${item.color}15`,
                      border: `1px solid ${item.color}30`,
                      color: item.color,
                      fontFamily: "var(--font-montserrat)",
                    }}
                  >
                    {item.category}
                  </span>
                  <p
                    className="text-sm font-semibold text-white leading-snug mb-1"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-[11px]"
                    style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-jetbrains)" }}
                  >
                    {item.tool}
                  </p>
                </div>

                {/* Side-by-side */}
                <div className="grid grid-cols-2 gap-3 px-4 pb-4">
                  <MediaBox
                    src={item.beforeSrc}
                    kind={item.beforeKind}
                    label="ANTES"
                    isAfter={false}
                  />
                  <MediaBox
                    src={item.afterSrc}
                    kind={item.afterKind}
                    label="DESPUÉS"
                    isAfter={true}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #0A1628, #0D1E3A)" }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-white mb-4"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              ¿Listo para transformar{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                tu contenido?
              </span>
            </h2>
            <p
              className="text-base mb-8"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
            >
              Estos son solo algunos ejemplos. Tu marca, tus fotos y tus videos
              pueden tener la misma transformación.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white text-sm transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)",
                fontFamily: "var(--font-montserrat)",
                boxShadow: "0 0 40px rgba(0,102,255,0.4)",
              }}
            >
              Quiero estos resultados
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
