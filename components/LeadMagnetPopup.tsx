"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Sparkles, Check } from "lucide-react";

export default function LeadMagnetPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Show popup after 30 seconds, only once per session
  useEffect(() => {
    const dismissed = sessionStorage.getItem("leadmagnet_dismissed");
    if (dismissed) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem("leadmagnet_dismissed", "1");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al enviar");

      setStatus("success");
      sessionStorage.setItem("leadmagnet_dismissed", "1");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Error al enviar. Intenta de nuevo.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(5, 13, 26, 0.85)", backdropFilter: "blur(8px)" }}
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md rounded-2xl overflow-hidden pointer-events-auto"
              style={{
                background: "linear-gradient(135deg, #0A1628 0%, #0D1E3A 100%)",
                border: "1px solid rgba(0, 212, 255, 0.25)",
                boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 60px rgba(0,102,255,0.15)",
              }}
            >
              {/* Top accent line */}
              <div
                className="h-1 w-full"
                style={{ background: "linear-gradient(90deg, #0066FF, #00D4FF)" }}
              />

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-white/10"
                style={{ color: "rgba(255,255,255,0.4)" }}
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>

              <div className="p-8">
                {status !== "success" ? (
                  <>
                    {/* Icon */}
                    <div className="flex justify-center mb-5">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{
                          background: "linear-gradient(135deg, rgba(0,102,255,0.2), rgba(0,212,255,0.1))",
                          border: "1px solid rgba(0,212,255,0.3)",
                        }}
                      >
                        <Download size={28} style={{ color: "#00D4FF" }} />
                      </div>
                    </div>

                    {/* Headline */}
                    <div className="text-center mb-6">
                      <div
                        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border mb-3"
                        style={{
                          color: "#FFB800",
                          borderColor: "rgba(255,184,0,0.3)",
                          background: "rgba(255,184,0,0.08)",
                          fontFamily: "var(--font-montserrat)",
                        }}
                      >
                        <Sparkles size={11} />
                        Guía Gratuita
                      </div>
                      <h2
                        className="text-xl font-extrabold text-white mb-2 leading-tight"
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
                        className="text-sm"
                        style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
                      >
                        La guía que usan nuestros clientes para duplicar sus ventas
                        online antes de pasar a gestión IA.
                      </p>
                    </div>

                    {/* What's included */}
                    <ul className="space-y-2 mb-6">
                      {[
                        "Configuración de iluminación natural sin equipo",
                        "Los fondos que más convierten en e-commerce",
                        "El ángulo que dispara el engagement en Instagram",
                        "Cómo preparar tus fotos para IA editorial",
                        "Herramientas gratuitas para edición de nivel pro",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm"
                          style={{
                            color: "rgba(255,255,255,0.65)",
                            fontFamily: "var(--font-inter)",
                          }}
                        >
                          <Check
                            size={14}
                            className="flex-shrink-0 mt-0.5"
                            style={{ color: "#00D4FF" }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Tu nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#FFFFFF",
                          fontFamily: "var(--font-inter)",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(0,212,255,0.5)";
                          e.target.style.background = "rgba(0,102,255,0.08)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255,255,255,0.1)";
                          e.target.style.background = "rgba(255,255,255,0.05)";
                        }}
                      />
                      <input
                        type="email"
                        placeholder="Tu correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#FFFFFF",
                          fontFamily: "var(--font-inter)",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(0,212,255,0.5)";
                          e.target.style.background = "rgba(0,102,255,0.08)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255,255,255,0.1)";
                          e.target.style.background = "rgba(255,255,255,0.05)";
                        }}
                      />

                      {errorMsg && (
                        <p
                          className="text-xs"
                          style={{ color: "#FF4D6D", fontFamily: "var(--font-inter)" }}
                        >
                          {errorMsg}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                          fontFamily: "var(--font-montserrat)",
                          boxShadow: "0 4px 20px rgba(0,102,255,0.4)",
                        }}
                      >
                        {status === "loading" ? "Enviando..." : "Quiero la guía gratuita →"}
                      </button>
                    </form>

                    <p
                      className="text-center text-xs mt-3"
                      style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-inter)" }}
                    >
                      Sin spam. Puedes darte de baja cuando quieras.
                    </p>
                  </>
                ) : (
                  /* Success state */
                  <div className="text-center py-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                      style={{ background: "rgba(0,212,255,0.15)", border: "2px solid #00D4FF" }}
                    >
                      <Check size={28} style={{ color: "#00D4FF" }} />
                    </motion.div>
                    <h3
                      className="text-xl font-extrabold text-white mb-2"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      ¡Guía en camino!
                    </h3>
                    <p
                      className="text-sm mb-6"
                      style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
                    >
                      Revisa tu correo en los próximos minutos.
                      También recibirás consejos exclusivos de nuestro equipo.
                    </p>
                    <button
                      onClick={handleDismiss}
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.7)",
                        fontFamily: "var(--font-montserrat)",
                      }}
                    >
                      Cerrar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
