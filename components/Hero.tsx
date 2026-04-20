"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingDown, TrendingUp, Clock, Play } from "lucide-react";

const stats = [
  {
    icon: TrendingDown,
    value: "-55%",
    label: "en costos de producción",
    color: "#00D4FF",
  },
  {
    icon: TrendingUp,
    value: "+350%",
    label: "en volumen de piezas",
    color: "#0066FF",
  },
  {
    icon: Clock,
    value: "-70%",
    label: "en tiempo de entrega",
    color: "#FFB800",
  },
];

const promptLines = [
  '> inicializando_fotoeditores.ai...',
  '> cargando 20 años de criterio editorial...',
  '> conectando midjourney + runway + elevenlabs...',
  '> resultado: contenido_de_impacto.ready ✓',
];

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0A1628 0%, #0D1E3A 50%, #0A1628 100%)" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 102, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 102, 255, 0.04) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,102,255,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-8"
              style={{
                background: "rgba(255, 184, 0, 0.08)",
                borderColor: "rgba(255, 184, 0, 0.3)",
                color: "#FFB800",
                fontFamily: "var(--font-montserrat)",
              }}
            >
              <Sparkles size={14} />
              20 años de experiencia · Potenciados con IA
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-tight mb-6"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {/* Línea irónica — tono de duda */}
              <span
                className="block text-2xl sm:text-3xl lg:text-4xl font-semibold mb-1 italic"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                "La IA es fácil y gratis...
              </span>
              {/* El gancho — la realidad */}
              <span
                className="block"
                style={{
                  background: "linear-gradient(135deg, #FFFFFF 0%, #00D4FF 60%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                hasta que intentas
              </span>
              <span
                className="block"
                style={{
                  background: "linear-gradient(135deg, #00D4FF 0%, #0066FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                usarla."
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="text-lg sm:text-xl font-semibold leading-relaxed mb-3"
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-inter)",
                maxWidth: "520px",
              }}
            >
              Nosotros somos diferentes:{" "}
              <span style={{ color: "#00D4FF" }}>
                IA profesional + un humano real que te responde.
              </span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base leading-relaxed mb-10"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontFamily: "var(--font-inter)",
                maxWidth: "480px",
              }}
            >
              20 años de criterio editorial + las mejores herramientas de IA.
              El equipo que convierte la promesa de la IA en resultados reales
              para tu empresa.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col gap-3"
            >
              {/* Secundarios — fila compartida */}
              <div className="flex gap-3">
                <Link
                  href="/contacto"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                  style={{
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.85)",
                    fontFamily: "var(--font-montserrat)",
                  }}
                >
                  Quiero ese apoyo hoy
                  <ArrowRight size={15} />
                </Link>

                <Link
                  href="/ejemplos"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                  style={{
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.85)",
                    fontFamily: "var(--font-montserrat)",
                  }}
                >
                  <Play size={14} fill="currentColor" />
                  Ver Ejemplos Reales
                </Link>
              </div>

              {/* Primario — Cotizador Web */}
              <a
                href="https://funnel-fotoeditores.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full font-extrabold text-white text-base transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)",
                  fontFamily: "var(--font-montserrat)",
                  boxShadow: "0 0 48px rgba(0,102,255,0.55), 0 6px 24px rgba(0,0,0,0.35)",
                  borderRadius: "12px",
                  padding: "16px 48px",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 0 72px rgba(0,102,255,0.8), 0 10px 32px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 0 48px rgba(0,102,255,0.55), 0 6px 24px rgba(0,0,0,0.35)";
                }}
              >
                Cotizador Web
                <ArrowRight size={18} />
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center gap-2 mt-8"
            >
              <div className="flex -space-x-2">
                {["C", "M", "J"].map((initial, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-midnight flex items-center justify-center text-xs font-bold"
                    style={{
                      background:
                        i === 0
                          ? "linear-gradient(135deg, #0066FF, #00D4FF)"
                          : i === 1
                          ? "linear-gradient(135deg, #00D4FF, #0066FF)"
                          : "linear-gradient(135deg, #FFB800, #FF6B00)",
                      color: "white",
                      fontFamily: "var(--font-montserrat)",
                    }}
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <p
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
              >
                <span className="text-white font-medium">Carlos, María y Juan</span> — tu equipo personal de IA
              </p>
            </motion.div>
          </div>

          {/* Right: Terminal + Stats */}
          <div className="flex flex-col gap-6">
            {/* Terminal / prompt visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="rounded-2xl p-6 overflow-hidden"
              style={{
                background: "rgba(10, 22, 40, 0.8)",
                border: "1px solid rgba(0, 212, 255, 0.2)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full" style={{ background: "#FF4D6D" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#FFB800" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#00D4FF" }} />
                <span
                  className="ml-2 text-xs"
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    fontFamily: "var(--font-jetbrains)",
                  }}
                >
                  fotoeditores.ai — terminal
                </span>
              </div>

              {/* Prompt lines */}
              <div className="space-y-2">
                {promptLines.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.3 }}
                    className="text-sm"
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      color:
                        i === promptLines.length - 1
                          ? "#00D4FF"
                          : "rgba(255,255,255,0.5)",
                      fontSize: "0.8rem",
                    }}
                  >
                    {line}
                  </motion.p>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ delay: 2, duration: 1, repeat: Infinity }}
                  className="inline-block w-2 h-4 ml-1"
                  style={{ background: "#00D4FF" }}
                />
              </div>
            </motion.div>

            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  className="rounded-xl p-4 text-center"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <stat.icon
                    size={20}
                    className="mx-auto mb-2"
                    style={{ color: stat.color }}
                  />
                  <div
                    className="text-2xl font-extrabold mb-1"
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      color: stat.color,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs leading-tight"
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-montserrat)" }}
          >
            Explorar
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8"
            style={{ background: "linear-gradient(to bottom, rgba(0,212,255,0.5), transparent)" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
