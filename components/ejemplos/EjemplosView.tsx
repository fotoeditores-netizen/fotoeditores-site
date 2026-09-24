"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import MediaBox from "@/components/MediaBox";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { ButtonLink } from "@/components/ui/Button";
import { sideBySideCases, sliderCases } from "@/lib/ejemplos";

// CTA por caso, calculado en el servidor (precio y enlace de WhatsApp).
export type CaseCta = { href: string; priceLabel: string | null };

function CaseCtaLink({ cta, compact = false }: { cta?: CaseCta; compact?: boolean }) {
  if (!cta) return null;
  const external = cta.href.startsWith("http");
  return (
    <a
      href={cta.href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`mt-3 flex items-center justify-between gap-2 rounded-lg border border-white/10 hover:border-cyan-digital/60 hover:bg-cyan-digital/10 transition-colors ${
        compact ? "px-2.5 py-2" : "px-4 py-2.5"
      }`}
      style={{ fontFamily: "var(--font-montserrat)" }}
    >
      <span className={`flex items-center gap-1.5 font-bold text-white ${compact ? "text-[11px]" : "text-sm"}`}>
        {external ? <WhatsAppIcon size={compact ? 12 : 15} /> : <ArrowRight size={compact ? 12 : 15} />}
        Quiero algo así
      </span>
      {cta.priceLabel && (
        <span className={`${compact ? "text-[10px]" : "text-xs"}`} style={{ color: "#00D4FF" }}>
          desde {cta.priceLabel}
        </span>
      )}
    </a>
  );
}

export default function EjemplosView({ ctas }: { ctas: Record<string, CaseCta> }) {
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
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

            <h1 className="text-4xl sm:text-5xl font-extrabold mb-5" style={{ fontFamily: "var(--font-montserrat)" }}>
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
              Resultados reales producidos por nuestro equipo. Arrastra el divisor en las fotos o reproduce los
              videos para ver la transformación.
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
            {sliderCases.map((item, i) => (
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
                    sizes="(max-width: 640px) 50vw, 180px"
                  />
                </div>

                {/* Footer */}
                <div className="px-3 pt-3 pb-4 flex flex-col flex-1">
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
                  <div className="mt-auto">
                    <CaseCtaLink cta={ctas[item.id]} compact />
                  </div>
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
            {sideBySideCases.map((item, i) => (
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
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-jetbrains)" }}>
                    {item.tool}
                  </p>
                </div>

                {/* Side-by-side */}
                <div className="grid grid-cols-2 gap-3 px-4">
                  <MediaBox media={item.before} label={`${item.title} — antes`} isAfter={false} />
                  <MediaBox media={item.after} label={`${item.title} — después`} isAfter />
                </div>

                <div className="px-4 pb-4">
                  <CaseCtaLink cta={ctas[item.id]} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #0A1628, #0D1E3A)" }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
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
                tus imágenes?
              </span>
            </h2>
            <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}>
              Estos son solo algunos ejemplos. Tus fotos y tus videos pueden tener la misma transformación.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <ButtonLink href="/fotos-de-producto-con-ia" size="lg">
                Fotos de producto
                <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="/recupera-tus-fotos" size="lg" variant="secondary">
                Recuperar mis fotos
                <ArrowRight size={16} />
              </ButtonLink>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
