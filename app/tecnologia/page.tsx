"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Check } from "lucide-react";
import ROICalculator from "@/components/ROICalculator";

const tools = [
  { name: "Midjourney", category: "Imagen IA", desc: "Generación de imágenes fotorrealistas y artísticas de primer nivel", color: "#0066FF", emoji: "🎨" },
  { name: "Runway", category: "Video IA", desc: "Generación y edición de video con IA de nivel cinematográfico", color: "#00D4FF", emoji: "🎬" },
  { name: "ElevenLabs", category: "Audio IA", desc: "Síntesis de voz y clonación de audio ultrarrealista", color: "#FFB800", emoji: "🎙️" },
  { name: "HeyGen", category: "Avatar IA", desc: "Generación de presentadores virtuales y avatares de marca", color: "#0066FF", emoji: "👤" },
  { name: "ChatGPT", category: "Texto IA", desc: "Redacción, guiones, copys y contenido escrito de alto impacto", color: "#00D4FF", emoji: "📝" },
  { name: "Gemini", category: "Análisis IA", desc: "Análisis multimodal y procesamiento de contenido complejo", color: "#FFB800", emoji: "🔮" },
  { name: "Magnific", category: "Upscaling IA", desc: "Ampliación de imágenes sin perder calidad — hasta 10x resolución", color: "#0066FF", emoji: "🔭" },
  { name: "Luma Dream", category: "3D IA", desc: "Generación de escenas y productos en 3D fotorrealista", color: "#00D4FF", emoji: "🌐" },
  { name: "Pika Labs", category: "Video IA", desc: "Animación de imágenes estáticas y generación de video corto", color: "#FFB800", emoji: "⚡" },
];

const results = [
  { metric: "-55%", label: "Reducción de costos de producción", desc: "Comparado con agencias y productoras tradicionales", color: "#00D4FF" },
  { metric: "+350%", label: "Aumento en volumen de piezas", desc: "Más contenido con el mismo presupuesto mensual", color: "#0066FF" },
  { metric: "-70%", label: "Menos tiempo de entrega", desc: "De semanas a 48-72 horas para proyectos complejos", color: "#FFB800" },
  { metric: "×10", label: "Escalabilidad de producción", desc: "Capacidad de multiplicar el output en semanas, no meses", color: "#00D4FF" },
];

const packages = [
  {
    id: "starter",
    name: "IA Starter",
    target: "PYMEs y emprendedores",
    price: "$99",
    period: "/mes",
    color: "#0066FF",
    features: [
      "Hasta 40 fotos repotenciadas con IA",
      "10 videos/reels tipo Reel (hasta 15 seg)",
      "Eliminación y sustitución de fondos",
      "Adaptación para cada red social",
      "Consultoría mensual (30 min)",
      "Entrega en 48-72 horas",
      "Soporte vía WhatsApp",
    ],
  },
  {
    id: "producer",
    name: "IA Producer",
    target: "Medianas empresas",
    price: "A medida",
    period: "",
    color: "#00D4FF",
    featured: true,
    features: [
      "Producción escalable sin límite fijo",
      "Editor personal dedicado",
      "Videos de mayor duración y complejidad",
      "Avatares y presentadores IA de marca",
      "Locución y audio con voz clonada",
      "Adaptación multicanal y multiidioma",
      "Informe mensual de ROI",
      "Integración con tu equipo de marketing",
    ],
  },
  {
    id: "studio",
    name: "IA Studio",
    target: "Corporativos y enterprise",
    price: "Consultar",
    period: "",
    color: "#FFB800",
    features: [
      "Modelo IA entrenado con tu marca",
      "Automatización de workflows de contenido",
      "Formación interna para tu equipo",
      "Implementación de asistentes IA corporativos",
      "Integración con sistemas existentes",
      "SLA garantizado y soporte 24/7",
      "Reportería ejecutiva mensual",
    ],
  },
];

export default function TecnologiaPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 pb-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A1628 0%, #0D1E3A 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "linear-gradient(rgba(0,102,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border mb-6"
              style={{ color: "#00D4FF", borderColor: "rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.06)", fontFamily: "var(--font-montserrat)" }}
            >
              <Zap size={13} />
              Catálogo Tecnológico
            </div>
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-white mb-5"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Las herramientas más potentes.
              <br />
              <span style={{ background: "linear-gradient(135deg, #0066FF, #00D4FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                El criterio que importa.
              </span>
            </h1>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-inter)" }}
            >
              Dominamos más de 30 herramientas de IA especializadas. Pero nuestra verdadera ventaja
              no es el acceso a estas herramientas — es saber cuál usar, cuándo y cómo para tu negocio.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Results metrics */}
      <section className="py-16" style={{ background: "#050D1A" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {results.map((r, i) => (
              <motion.div
                key={r.metric}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl p-6 text-center"
                style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${r.color}20` }}
              >
                <div
                  className="text-4xl font-extrabold mb-2"
                  style={{ fontFamily: "var(--font-montserrat)", color: r.color }}
                >
                  {r.metric}
                </div>
                <div
                  className="text-sm font-semibold text-white mb-1"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {r.label}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}
                >
                  {r.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools catalog */}
      <section className="py-24" style={{ background: "#0A1628" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2
              className="text-3xl font-extrabold text-white mb-4"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              El arsenal de IA que operamos
            </h2>
            <p
              className="text-base max-w-xl mx-auto"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
            >
              Cada herramienta seleccionada con criterio: ¿resuelve un problema real? ¿mejora la calidad? Solo entonces la integramos.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-xl p-6 transition-all duration-200 hover:scale-[1.01]"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: `1px solid ${tool.color}20`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${tool.color}15`, border: `1px solid ${tool.color}25` }}
                  >
                    {tool.emoji}
                  </div>
                  <div>
                    <div
                      className="text-xs font-semibold uppercase tracking-wider mb-1"
                      style={{ color: tool.color, fontFamily: "var(--font-montserrat)" }}
                    >
                      {tool.category}
                    </div>
                    <h3
                      className="font-bold text-white mb-1"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {tool.name}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)" }}
                    >
                      {tool.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <ROICalculator />

      {/* Packages */}
      <section id="paquetes" className="py-24" style={{ background: "#0A1628" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2
              className="text-3xl font-extrabold text-white mb-4"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Elige tu plan de producción IA
            </h2>
            <p
              className="text-base max-w-xl mx-auto"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
            >
              Sin contratos anuales. Sin sorpresas. Escala cuando tu negocio lo necesite.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="rounded-2xl p-8 flex flex-col relative"
                style={{
                  background: pkg.featured
                    ? `linear-gradient(135deg, rgba(0,102,255,0.15), rgba(0,212,255,0.08))`
                    : "rgba(255,255,255,0.025)",
                  border: pkg.featured
                    ? "1px solid rgba(0,212,255,0.35)"
                    : `1px solid ${pkg.color}20`,
                  transform: pkg.featured ? "scale(1.02)" : undefined,
                }}
              >
                {pkg.featured && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                      color: "white",
                      fontFamily: "var(--font-montserrat)",
                    }}
                  >
                    Más popular
                  </div>
                )}

                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: pkg.color, fontFamily: "var(--font-montserrat)" }}
                >
                  {pkg.target}
                </div>
                <h3
                  className="text-xl font-extrabold text-white mb-4"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {pkg.name}
                </h3>
                <div className="mb-6">
                  <span
                    className="text-4xl font-extrabold"
                    style={{ fontFamily: "var(--font-montserrat)", color: pkg.color }}
                  >
                    {pkg.price}
                  </span>
                  <span
                    className="text-base"
                    style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}
                  >
                    {pkg.period}
                  </span>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {pkg.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm"
                      style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-inter)" }}
                    >
                      <Check size={14} className="flex-shrink-0 mt-0.5" style={{ color: pkg.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contacto"
                  className="w-full py-3 rounded-xl text-center font-bold text-sm transition-all hover:scale-[1.02]"
                  style={{
                    background: pkg.featured
                      ? "linear-gradient(135deg, #0066FF, #00D4FF)"
                      : `${pkg.color}18`,
                    border: pkg.featured ? "none" : `1px solid ${pkg.color}35`,
                    color: pkg.featured ? "white" : pkg.color,
                    fontFamily: "var(--font-montserrat)",
                  }}
                >
                  {pkg.price === "Consultar" || pkg.price === "A medida" ? "Solicitar propuesta" : "Comenzar ahora"} →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20"
        style={{ background: "linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2
            className="text-3xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            ¿Qué herramienta necesita tu empresa?
          </h2>
          <p className="text-lg text-white/80 mb-8" style={{ fontFamily: "var(--font-inter)" }}>
            Agenda una sesión gratuita y te mostramos el ecosistema IA perfecto para tu industria.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105"
            style={{
              background: "white",
              color: "#0066FF",
              fontFamily: "var(--font-montserrat)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            }}
          >
            Agendar sesión gratuita
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
