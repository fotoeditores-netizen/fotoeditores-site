"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const services = [
  {
    icon: "🤖",
    badge: "Servicio estrella",
    badgeColor: "#00D4FF",
    title: "Gestión IA para Contenidos",
    desc: "Somos tu equipo de producción con IA. Producimos imágenes, videos, audio y texto con las mejores herramientas del mercado, con criterio editorial de 20 años.",
    features: [
      "Video con IA (Runway, Pika, HeyGen, Luma)",
      "Imagen editorial (Midjourney, DALL-E 3, Magnific)",
      "Voz y audio (ElevenLabs, clonación de voz)",
      "Subtitulado y traducción multiidioma",
      "Adaptación multicanal de contenidos",
    ],
    color: "#00D4FF",
    href: "/tecnologia",
  },
  {
    icon: "🎯",
    badge: "Estrategia",
    badgeColor: "#0066FF",
    title: "Estrategia de Contenido IA",
    desc: "Diseñamos el ecosistema completo de herramientas IA para tu empresa, formamos a tu equipo y implementamos flujos de trabajo que multiplican tu capacidad productiva.",
    features: [
      "Auditoría de flujos y diagnóstico de eficiencia",
      "Diseño de ecosistema IA personalizado",
      "Calendario editorial con IA generativa",
      "Formación interna para equipos de marketing",
      "Implementación de asistentes IA corporativos",
    ],
    color: "#0066FF",
    href: "/tecnologia#estrategia",
  },
  {
    icon: "📦",
    badge: "Desde $99 USD/mes",
    badgeColor: "#FFB800",
    title: "Paquetes Productivos",
    desc: "Soluciones empaquetadas y escalables para cualquier tamaño de empresa. Sin contratos anuales, sin sorpresas en la factura.",
    features: [
      "IA Starter: 40 fotos + 10 videos — PYMEs",
      "IA Producer: Producción escalable — Medianas",
      "IA Studio: Modelos entrenados — Enterprise",
      "Editor personal dedicado incluido",
      "Soporte prioritario vía WhatsApp",
    ],
    color: "#FFB800",
    href: "/tecnologia#paquetes",
  },
];

export default function ServicesSection() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "#050D1A" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #00D4FF, transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border mb-5"
            style={{
              color: "#0066FF",
              borderColor: "rgba(0,102,255,0.3)",
              background: "rgba(0,102,255,0.06)",
              fontFamily: "var(--font-montserrat)",
            }}
          >
            Nuestros servicios
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            El ecosistema completo
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              de IA para tu contenido
            </span>
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
          >
            Desde la ideación hasta la publicación, pasando por la producción con IA, la
            edición editorial y la adaptación multicanal.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl p-7 flex flex-col transition-all duration-300 hover:scale-[1.01]"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: `1px solid ${service.color}25`,
              }}
            >
              {/* Icon + Badge */}
              <div className="flex items-start justify-between mb-5">
                <span className="text-4xl">{service.icon}</span>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{
                    background: `${service.badgeColor}15`,
                    color: service.badgeColor,
                    fontFamily: "var(--font-montserrat)",
                    border: `1px solid ${service.badgeColor}30`,
                  }}
                >
                  {service.badge}
                </span>
              </div>

              <h3
                className="text-lg font-extrabold text-white mb-3"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {service.title}
              </h3>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
              >
                {service.desc}
              </p>

              <ul className="space-y-2 mb-8 flex-1">
                {service.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-inter)" }}
                  >
                    <span style={{ color: service.color, flexShrink: 0 }}>›</span>
                    {feat}
                  </li>
                ))}
              </ul>

              <Link
                href={service.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-2.5"
                style={{ color: service.color, fontFamily: "var(--font-montserrat)" }}
              >
                Ver más
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
