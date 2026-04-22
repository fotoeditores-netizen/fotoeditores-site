"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const values = [
  {
    icon: "⚡",
    title: "Innovación Aplicada",
    desc: "No adoptamos tecnología por moda. Cada herramienta de IA que incorporamos pasa por nuestro filtro: ¿resuelve un problema real? ¿mejora la calidad? ¿reduce el tiempo o el costo? Solo entonces la integramos. Somos early adopters con criterio.",
    color: "#00D4FF",
  },
  {
    icon: "🎯",
    title: "Criterio Editorial",
    desc: "La IA genera. Nosotros decidimos. Nuestros 20 años de producción audiovisual y periodística nos dan el ojo crítico para distinguir lo bueno de lo mediocre, para saber cuándo un prompt necesita ajuste, cuándo una imagen viola el manual de marca.",
    color: "#0066FF",
  },
  {
    icon: "🤝",
    title: "Alianza Real",
    desc: "No somos proveedores. Somos el equipo de producción y tecnología que les falta a nuestros clientes. Nos involucramos en sus objetivos, entendemos su industria, aprendemos su cultura de marca y defendemos sus resultados como si fueran nuestros.",
    color: "#FFB800",
  },
  {
    icon: "📊",
    title: "Impacto Medible",
    desc: "Prometemos lo que podemos demostrar. Cada propuesta incluye métricas de comparación: costo anterior vs. costo con Fotoeditores IA, tiempo anterior vs. tiempo actual. No trabajamos en la niebla.",
    color: "#00D4FF",
  },
  {
    icon: "🌱",
    title: "Democratización Creativa",
    desc: "Creemos que las PYMEs colombianas merecen acceder a la misma calidad de producción que las grandes multinacionales. El acceso a herramientas de IA de última generación no debería ser privilegio de los que tienen presupuestos millonarios.",
    color: "#0066FF",
  },
];

const timeline = [
  { year: "2006", event: "Fundación de Fotoeditores como productora audiovisual periodística en Colombia" },
  { year: "2010", event: "Consolidación como aliado de medios de comunicación nacionales" },
  { year: "2015", event: "Expansión a producción de contenido corporativo y B2B" },
  { year: "2020", event: "Primeras integraciones de herramientas IA en flujos de trabajo" },
  { year: "2023", event: "Pivot estratégico: de productora a Gestores de IA para Contenidos" },
  { year: "2026", event: "20 Aniversario: líderes en gestión IA para contenidos en Colombia" },
];

const team = [
  // Fila 1
  {
    name: "Edgar Domínguez",
    role: "Editor Personal — Imagen & Fotoperiodismo",
    bio: "Periodista experto en fotoperiodismo galardonado a nivel internacional. Magíster en estética, docente universitario y líder de Fotoeditores, con amplia trayectoria en medios periodísticos.",
    photo: "/Edgar_Dominguez.png",
    color: "#0066FF",
    skills: ["Midjourney", "Photoshop IA", "Magnific", "DALL-E 3"],
  },
  {
    name: "Juan Carlos Patiño",
    role: "Editor Personal — Tecnología & Programación",
    bio: "Ingeniero experto en programación, con más de 20 años de experiencia y ahora potenciado por poderosas herramientas de IA para mayor productividad.",
    photo: "/Juan_Carlos_Patiño.png",
    color: "#00D4FF",
    skills: ["Automatización IA", "Integraciones API", "Flujos IA", "Desarrollo Web"],
  },
  {
    name: "Sara Domínguez",
    role: "Editora Personal — Mercadeo & UGC",
    bio: "Profesional en mercadeo, experta en producción de contenido UGC y en estrategias de redes sociales. CapCut es una de sus herramientas favoritas.",
    photo: "/sara_dominguez.png",
    color: "#0066FF",
    skills: ["UGC", "Redes Sociales", "CapCut", "Estrategia Digital"],
  },
  {
    name: "Patricia López",
    nameDisplay: "Patricia\nLópez",
    role: "Editora Personal — Relaciones Públicas",
    bio: "Experta en relaciones públicas. Permanece atenta al estricto cumplimiento de nuestra oferta de valor y siempre dispuesta para atender las inquietudes de nuestros clientes.",
    photo: "/patricia_lopez.png",
    color: "#00D4FF",
    skills: ["Relaciones Públicas", "Atención al Cliente", "Comunicación", "Gestión de Marca"],
  },
  {
    name: "Juan Camilo Ospina",
    role: "Editor Personal — Diseño & Audiovisual",
    bio: "Ingeniero de diseño de producto con amplia experiencia en diseño y edición audiovisual. Experto en música urbana, reconocido en redes sociales como creador de contenidos virales.",
    photo: "/juan_camilo_ospina.png",
    color: "#0066FF",
    skills: ["Diseño de Producto", "Edición Audiovisual", "CapCut", "Contenido Viral"],
  },
  // Fila 2 (centrada)
  {
    name: "Julio César Vásquez",
    role: "Editor Personal — Servicio al Cliente",
    bio: "Administrador y ejecutivo de cuenta enfocado en el servicio. Atento a cada detalle para que nuestros clientes tengan la mejor experiencia con una atención inigualable.",
    photo: "/julio_cesar_vasquez.png",
    color: "#00D4FF",
    skills: ["Gestión de Cuentas", "Atención al Cliente", "Coordinación", "CRM"],
  },
  {
    name: "Mauricio Macías",
    role: "Editor Personal — Fotografía & Iluminación",
    bio: "Fotógrafo, retratista y experto en Lightroom. Conocedor de todas las posibilidades que ofrece la luz para crear imágenes impactantes y amante del estudio fotográfico.",
    photo: "/mauricio_macias.png",
    color: "#FFB800",
    skills: ["Lightroom", "Retoque Digital", "Fotografía", "Iluminación"],
  },
  {
    name: "Pablo Pasos",
    nameDisplay: "Pablo\nPasos",
    role: "Editor Personal — Audiovisual & Retoque",
    bio: "Experto en medios audiovisuales, creador de imágenes para las más importantes firmas de Colombia. La edición y el retoque digital, así como la imagen generativa con IA son sus fortalezas.",
    photo: "/Pablo_Pasos.png",
    color: "#FFB800",
    skills: ["Runway", "HeyGen", "Retoque Digital", "Imagen Generativa"],
  },
];

export default function NuestroADNPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 pb-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A1628 0%, #0D1E3A 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
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
              style={{ color: "#FFB800", borderColor: "rgba(255,184,0,0.3)", background: "rgba(255,184,0,0.08)", fontFamily: "var(--font-montserrat)" }}
            >
              ✦ Nuestro ADN
            </div>
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-white mb-5"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Veinte años no nos hicieron
              <br />
              <span style={{ background: "linear-gradient(135deg, #FFB800, #FFDA60)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                tradicionales.
              </span>
            </h1>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-inter)" }}
            >
              Nos hicieron más capaces de entender el futuro. Conoce el equipo, los valores
              y la historia detrás de la agencia de IA más experimentada de Colombia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section id="valores" className="py-24" style={{ background: "#0A1628" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border mb-5"
              style={{ color: "#00D4FF", borderColor: "rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.06)", fontFamily: "var(--font-montserrat)" }}
            >
              Valores corporativos
            </div>
            <h2
              className="text-3xl font-extrabold text-white"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              5 principios que guían cada decisión
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-7 ${i === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}
                style={{
                  background: `linear-gradient(135deg, ${val.color}08, ${val.color}03)`,
                  border: `1px solid ${val.color}20`,
                }}
              >
                <div className="text-4xl mb-4">{val.icon}</div>
                <h3
                  className="text-lg font-extrabold text-white mb-3"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {val.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
                >
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24" style={{ background: "#050D1A" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border mb-5"
              style={{ color: "#FFB800", borderColor: "rgba(255,184,0,0.3)", background: "rgba(255,184,0,0.08)", fontFamily: "var(--font-montserrat)" }}
            >
              20 años de historia
            </div>
            <h2
              className="text-3xl font-extrabold text-white"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Una evolución continua
            </h2>
          </motion.div>

          <div className="relative">
            {/* Line */}
            <div
              className="absolute left-16 top-0 bottom-0 w-px"
              style={{ background: "linear-gradient(to bottom, transparent, #0066FF, #00D4FF, transparent)" }}
            />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-8"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-xs font-extrabold flex-shrink-0 relative z-10"
                    style={{
                      background: i === timeline.length - 1
                        ? "linear-gradient(135deg, #FFB800, #FF6B00)"
                        : "linear-gradient(135deg, #0066FF, #00D4FF)",
                      color: "white",
                      fontFamily: "var(--font-montserrat)",
                    }}
                  >
                    {item.year}
                  </div>
                  <div
                    className="pt-3 pb-6"
                    style={{ borderBottom: i < timeline.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                  >
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-inter)" }}
                    >
                      {item.event}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="equipo" className="py-24" style={{ background: "#0A1628" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border mb-5"
              style={{ color: "#0066FF", borderColor: "rgba(0,102,255,0.3)", background: "rgba(0,102,255,0.06)", fontFamily: "var(--font-montserrat)" }}
            >
              El equipo humano
            </div>
            <h2
              className="text-3xl font-extrabold text-white mb-4"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Tus Editores Personales de IA
            </h2>
            <p
              className="text-base max-w-xl mx-auto"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
            >
              El respaldo humano que marca la diferencia. Expertos que operan la IA
              con criterio editorial y conocimiento de tu negocio.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] rounded-2xl p-6 text-center flex flex-col"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: `1px solid ${member.color}25`,
                }}
              >
                {/* Portrait avatar */}
                <div
                  className="mx-auto mb-5 overflow-hidden rounded-2xl flex-shrink-0"
                  style={{
                    width: "125px",
                    height: "165px",
                    border: `2px solid ${member.color}40`,
                  }}
                >
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={125}
                    height={165}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <h3
                  className="text-base font-extrabold text-white mb-1"
                  style={{ fontFamily: "var(--font-montserrat)", whiteSpace: "pre-line" }}
                >
                  {"nameDisplay" in member ? member.nameDisplay : member.name}
                </h3>
                <p
                  className="text-xs font-semibold mb-3"
                  style={{ color: member.color, fontFamily: "var(--font-montserrat)" }}
                >
                  {member.role}
                </p>
                <p
                  className="text-xs leading-relaxed mb-5"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
                >
                  {member.bio}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 justify-center mt-auto">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: `${member.color}12`,
                        border: `1px solid ${member.color}25`,
                        color: member.color,
                        fontFamily: "var(--font-jetbrains)",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #0A1628, #0D1E3A)" }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div
              className="text-5xl font-extrabold mb-2"
              style={{
                fontFamily: "var(--font-montserrat)",
                background: "linear-gradient(135deg, #FFB800, #FFDA60)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              20
            </div>
            <h2
              className="text-3xl font-extrabold text-white mb-4"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              años de experiencia al servicio de tu empresa
            </h2>
            <p
              className="text-base mb-8"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
            >
              Conoce a tu futuro equipo de producción IA. Una llamada de 30 minutos puede cambiar
              completamente tu forma de producir contenido.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                fontFamily: "var(--font-montserrat)",
                boxShadow: "0 8px 30px rgba(0,102,255,0.4)",
              }}
            >
              Conocer al equipo
              <ArrowRight size={17} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
