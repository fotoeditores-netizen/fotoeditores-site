"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageCircle, ArrowRight } from "lucide-react";

const editors = [
  // Fila 1
  { name: "Edgar Domínguez",    role: "Imagen & Fotoperiodismo",   photo: "/Edgar_Dominguez.png",       color: "#0066FF" },
  { name: "Juan Carlos Patiño", role: "Tecnología & Programación", photo: "/Juan_Carlos_Patiño.png",    color: "#00D4FF" },
  { name: "Sara Domínguez",     role: "Mercadeo & UGC",            photo: "/sara_dominguez.png",        color: "#0066FF" },
  { name: "Patricia López",     nameDisplay: "Patricia\nLópez",    role: "Relaciones Públicas",       photo: "/patricia_lopez.png",        color: "#00D4FF" },
  { name: "Juan Camilo Ospina", role: "Diseño & Audiovisual",      photo: "/juan_camilo_ospina.png",    color: "#0066FF" },
  // Fila 2 (centrada)
  { name: "Julio César Vásquez", role: "Servicio al Cliente",      photo: "/julio_cesar_vasquez.png",  color: "#00D4FF" },
  { name: "Mauricio Macías",    role: "Fotografía & Iluminación",  photo: "/mauricio_macias.png",       color: "#FFB800" },
  { name: "Pablo Pasos",        nameDisplay: "Pablo\nPasos",       role: "Audiovisual & Retoque",     photo: "/Pablo_Pasos.png",           color: "#FFB800" },
];

export default function EditorsTeaser() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0A1628 0%, #050D1A 100%)" }}
    >
      {/* Separator line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,102,255,0.5), rgba(0,212,255,0.5), transparent)",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(0,102,255,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ─────────────────────────────────────── */}
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
              color: "#00D4FF",
              borderColor: "rgba(0,212,255,0.3)",
              background: "rgba(0,212,255,0.06)",
              fontFamily: "var(--font-montserrat)",
            }}
          >
            El equipo humano detrás de la IA
          </div>

          <h2
            className="text-3xl sm:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Tus{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Editores Personales
            </span>{" "}
            de IA
          </h2>

          <p
            className="text-base max-w-lg mx-auto"
            style={{
              color: "rgba(255,255,255,0.5)",
              fontFamily: "var(--font-inter)",
            }}
          >
            La diferencia entre la promesa de la IA y sus resultados reales
            tiene nombre propio: criterio humano.
          </p>
        </motion.div>

        {/* ── Glassmorphism cards ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">

          {/* Card 1 — Medellín / global */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl p-8 relative overflow-hidden"
            style={{
              background: "rgba(0,102,255,0.07)",
              border: "1px solid rgba(0,102,255,0.22)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
          >
            <div
              className="absolute -top-10 -left-10 w-52 h-52 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,102,255,0.18) 0%, transparent 70%)",
                filter: "blur(28px)",
              }}
            />
            <div className="relative">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: "rgba(0,102,255,0.15)",
                  border: "1px solid rgba(0,102,255,0.3)",
                }}
              >
                <MapPin size={22} style={{ color: "#0066FF" }} />
              </div>
              <h3
                className="text-lg font-extrabold text-white mb-3"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Nuestras raíces, alcance global
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "rgba(255,255,255,0.65)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                Somos una agencia con sede en{" "}
                <span className="font-semibold text-white">
                  Medellín, Colombia
                </span>
                , pero las nuevas tecnologías nos permiten impactar con nuestro
                servicio{" "}
                <span
                  className="font-semibold"
                  style={{ color: "#00D4FF" }}
                >
                  al mundo entero.
                </span>
              </p>
            </div>
          </motion.div>

          {/* Card 2 — Calidez humana */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl p-8 relative overflow-hidden"
            style={{
              background: "rgba(0,212,255,0.05)",
              border: "1px solid rgba(0,212,255,0.18)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
          >
            <div
              className="absolute -top-10 -right-10 w-52 h-52 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,212,255,0.14) 0%, transparent 70%)",
                filter: "blur(28px)",
              }}
            />
            <div className="relative">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: "rgba(0,212,255,0.1)",
                  border: "1px solid rgba(0,212,255,0.25)",
                }}
              >
                <MessageCircle size={22} style={{ color: "#00D4FF" }} />
              </div>
              <h3
                className="text-lg font-extrabold text-white mb-3"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Personas reales. Sin bots.
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "rgba(255,255,255,0.65)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                No hablas con bots ni creas{" "}
                <span className="font-semibold text-white">
                  tickets de soporte vacíos.
                </span>{" "}
                Somos personas reales que hablamos contigo, entendemos tu
                negocio y{" "}
                <span
                  className="font-semibold"
                  style={{ color: "#00D4FF" }}
                >
                  te acompañamos en cada paso de tu misión.
                </span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Editors grid ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-center text-xs uppercase tracking-widest mb-8"
            style={{
              color: "rgba(255,255,255,0.25)",
              fontFamily: "var(--font-montserrat)",
            }}
          >
            Tu equipo personal
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            {editors.map((editor, i) => (
              <motion.div
                key={editor.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex flex-col items-center gap-2 text-center"
                style={{ width: "100px" }}
              >
                {/* Portrait */}
                <div
                  className="overflow-hidden rounded-xl"
                  style={{
                    width: "90px",
                    height: "115px",
                    border: `2px solid ${editor.color}45`,
                  }}
                >
                  <Image
                    src={editor.photo}
                    alt={editor.name}
                    width={90}
                    height={115}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <p
                  className="text-xs font-bold text-white leading-tight"
                  style={{ fontFamily: "var(--font-montserrat)", whiteSpace: "pre-line" }}
                >
                  {"nameDisplay" in editor ? editor.nameDisplay : editor.name}
                </p>
                <p
                  className="leading-tight"
                  style={{
                    color: editor.color,
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.64rem",
                  }}
                >
                  {editor.role}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/nuestro-adn#equipo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:gap-3 hover:scale-[1.02]"
            style={{
              background: "rgba(0,102,255,0.1)",
              border: "1px solid rgba(0,102,255,0.25)",
              color: "#00D4FF",
              fontFamily: "var(--font-montserrat)",
            }}
          >
            Conoce al equipo completo
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
