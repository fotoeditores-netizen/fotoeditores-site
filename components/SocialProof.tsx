"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "María Camila Torres",
    role: "Fundadora",
    company: "Dulce Arte Repostería",
    initial: "M",
    color: "#00D4FF",
    result: "+127% engagement · +89% conversiones",
    quote:
      "En 2 meses dupliqué mis ventas por Instagram. Las personas me preguntan si contraté una agencia de marketing de primer nivel. Les digo: contraté a Fotoeditores y me cambió el negocio.",
  },
  {
    name: "Carlos Andrés Mejía",
    role: "Director Creativo",
    company: "Marca Urbana CO",
    initial: "C",
    color: "#0066FF",
    result: "+412% alcance · +156% ventas",
    quote:
      "Uno de nuestros reels generó 50K views en 48 horas. El ROI fue inmediato: vendimos todo el inventario de esa colección en 3 días. Nunca habíamos tenido esos números con producción tradicional.",
  },
  {
    name: "Ana Sofía Ramírez",
    role: "Directora de Marketing",
    company: "Joyas ArteSano",
    initial: "A",
    color: "#FFB800",
    result: "+200% ticket promedio",
    quote:
      "Clientes me escriben preguntando si tenemos tienda física en Europa. Todo desde nuestro taller en Medellín. La calidad del contenido cambió completamente la percepción de nuestra marca.",
  },
];

const clients = ["Retail", "Startups", "E-commerce", "Gastronomía", "Moda", "B2B", "Educación", "Salud"];

export default function SocialProof() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "#0A1628" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #FFB800, transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border mb-5"
            style={{
              color: "#FFB800",
              borderColor: "rgba(255,184,0,0.3)",
              background: "rgba(255,184,0,0.06)",
              fontFamily: "var(--font-montserrat)",
            }}
          >
            <Star size={12} fill="currentColor" />
            Resultados reales
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Empresas que ya compiten
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #FFB800, #FFDA60)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              con las grandes
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl p-7 flex flex-col"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={13} fill="#FFB800" style={{ color: "#FFB800" }} />
                ))}
              </div>

              {/* Result badge */}
              <div
                className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 self-start"
                style={{
                  background: `${t.color}15`,
                  color: t.color,
                  border: `1px solid ${t.color}30`,
                  fontFamily: "var(--font-montserrat)",
                }}
              >
                {t.result}
              </div>

              <blockquote
                className="text-sm leading-relaxed flex-1 mb-6 italic"
                style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-inter)" }}
              >
                "{t.quote}"
              </blockquote>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`,
                    fontFamily: "var(--font-montserrat)",
                  }}
                >
                  {t.initial}
                </div>
                <div>
                  <p
                    className="text-sm font-semibold text-white"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}
                  >
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Industries */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p
            className="text-xs uppercase tracking-widest mb-5"
            style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-montserrat)" }}
          >
            Industrias que atendemos
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {clients.map((c) => (
              <span
                key={c}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.45)",
                  fontFamily: "var(--font-montserrat)",
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
