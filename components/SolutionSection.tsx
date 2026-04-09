"use client";

import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    num: "01",
    title: "Tú enfocas tu negocio",
    desc: "Nos envías tus fotos, videos o brief. Sin agendas, sin coordinaciones complicadas. Solo compartes lo que tienes y lo que necesitas.",
    color: "#0066FF",
  },
  {
    num: "02",
    title: "Nosotros aplicamos la IA",
    desc: "Nuestros editores personales analizan tu contenido y aplican las herramientas de IA correctas: Midjourney, Runway, ElevenLabs, HeyGen y +30 más.",
    color: "#00D4FF",
  },
  {
    num: "03",
    title: "Criterio editorial humano",
    desc: "Cada pieza pasa por nuestro filtro editorial de 20 años. La IA genera, nosotros decidimos qué sirve, qué ajustar y qué está listo para publicar.",
    color: "#FFB800",
  },
];

const differentiators = [
  "No vendemos herramientas — entregamos resultados",
  "20 años de criterio editorial en cada entrega",
  "Modelos IA entrenados con tu manual de marca",
  "Auditoría mensual de ROI incluida",
  "Tu editor personal disponible vía WhatsApp",
  "Sin contratos anuales — mes a mes",
];

export default function SolutionSection() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0A1628 0%, #050D1A 100%)" }}
    >
      {/* Accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #0066FF, transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Process */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border mb-5"
                style={{
                  color: "#00D4FF",
                  borderColor: "rgba(0,212,255,0.3)",
                  background: "rgba(0,212,255,0.06)",
                  fontFamily: "var(--font-montserrat)",
                }}
              >
                ✓ La solución
              </div>
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-white mb-4"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                La IA que trabaja
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  para tu marca.
                </span>
              </h2>
              <p
                className="text-base leading-relaxed mb-10"
                style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-inter)", maxWidth: "460px" }}
              >
                No somos una app ni un curso. Somos el equipo experto que domina las herramientas
                de IA más potentes y las pone al servicio de tu estrategia de contenidos.
              </p>
            </motion.div>

            {/* Steps */}
            <div className="space-y-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="flex gap-5"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-extrabold text-sm"
                    style={{
                      background: `${step.color}18`,
                      border: `1px solid ${step.color}35`,
                      color: step.color,
                      fontFamily: "var(--font-montserrat)",
                    }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <h3
                      className="font-bold text-white mb-1"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)" }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Differentiators */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div
              className="rounded-2xl p-8"
              style={{
                background: "rgba(0,102,255,0.06)",
                border: "1px solid rgba(0,102,255,0.15)",
              }}
            >
              <p
                className="text-sm font-semibold uppercase tracking-wider mb-6"
                style={{ color: "#00D4FF", fontFamily: "var(--font-montserrat)" }}
              >
                Por qué Fotoeditores y no otro
              </p>

              <ul className="space-y-4 mb-8">
                {differentiators.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.07 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle
                      size={18}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: "#00D4FF" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-inter)" }}
                    >
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* Quote */}
              <blockquote
                className="border-l-4 pl-4 mb-8"
                style={{ borderColor: "#0066FF" }}
              >
                <p
                  className="text-sm italic leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-inter)" }}
                >
                  "Veinte años no nos hicieron tradicionales.
                  Nos hicieron más capaces de entender el futuro."
                </p>
                <footer
                  className="text-xs mt-2 font-semibold"
                  style={{ color: "#FFB800", fontFamily: "var(--font-montserrat)" }}
                >
                  — Fotoeditores, 2006–2026
                </footer>
              </blockquote>

              <Link
                href="/nuestro-adn"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
                style={{ color: "#00D4FF", fontFamily: "var(--font-montserrat)" }}
              >
                Conoce nuestro ADN
                <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
