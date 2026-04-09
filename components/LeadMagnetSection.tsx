"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, CheckCircle, Sparkles } from "lucide-react";

const secrets = [
  "Configuración de luz natural sin equipo",
  "Los fondos que más convierten en e-commerce",
  "El ángulo que dispara el engagement",
  "Cómo preparar fotos para IA editorial",
  "3 apps gratuitas de nivel profesional",
];

export default function LeadMagnetSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="guia-gratuita"
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0A1628 0%, #0D1E3A 100%)" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #00D4FF, transparent)" }}
      />

      {/* Glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,102,255,0.08) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-3xl p-10 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          style={{
            background: "rgba(10, 22, 40, 0.7)",
            border: "1px solid rgba(0, 212, 255, 0.2)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
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
              <Sparkles size={12} />
              Descarga gratuita
            </div>

            <h2
              className="text-3xl font-extrabold text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              5 Secretos para Fotografiar
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Productos con tu Celular
              </span>
              <br />
              como un Profesional
            </h2>

            <p
              className="text-sm leading-relaxed mb-7"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
            >
              La guía que usamos con nuestros clientes antes de aplicar gestión IA.
              Técnicas de fotografía de producto que realmente venden.
            </p>

            <ul className="space-y-3">
              {secrets.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-center gap-2.5 text-sm"
                  style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-inter)" }}
                >
                  <CheckCircle size={15} style={{ color: "#00D4FF", flexShrink: 0 }} />
                  {s}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {status === "success" ? (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(0,212,255,0.12)", border: "2px solid #00D4FF" }}
                >
                  <CheckCircle size={28} style={{ color: "#00D4FF" }} />
                </div>
                <h3
                  className="text-xl font-extrabold text-white mb-2"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  ¡Guía en camino!
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
                >
                  Revisa tu correo. Los 5 secretos ya están en tu bandeja de entrada.
                </p>
              </div>
            ) : (
              <div
                className="rounded-2xl p-8"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(0,102,255,0.15)",
                      border: "1px solid rgba(0,212,255,0.2)",
                    }}
                  >
                    <Download size={20} style={{ color: "#00D4FF" }} />
                  </div>
                  <div>
                    <p
                      className="font-bold text-white text-sm"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      Descarga instantánea
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}
                    >
                      Recíbela en tu email ahora
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#FFF",
                      fontFamily: "var(--font-inter)",
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#FFF",
                      fontFamily: "var(--font-inter)",
                    }}
                  />

                  {status === "error" && (
                    <p
                      className="text-xs"
                      style={{ color: "#FF4D6D", fontFamily: "var(--font-inter)" }}
                    >
                      Error al enviar. Por favor intenta de nuevo.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02] disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                      fontFamily: "var(--font-montserrat)",
                      boxShadow: "0 4px 20px rgba(0,102,255,0.4)",
                    }}
                  >
                    {status === "loading" ? "Enviando..." : "Enviarme la guía gratis →"}
                  </button>
                </form>

                <p
                  className="text-center text-xs mt-4"
                  style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-inter)" }}
                >
                  Sin spam · Puedes darte de baja cuando quieras
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
