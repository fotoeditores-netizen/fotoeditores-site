"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Clock, CheckCircle, Send } from "lucide-react";

const services = [
  "Gestión IA para Contenidos",
  "Estrategia de Contenido IA",
  "Paquete IA Starter ($99/mes)",
  "Paquete IA Producer",
  "Paquete IA Studio (Enterprise)",
  "Otro / Consulta general",
];

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Error al enviar. Intenta de nuevo.");
    }
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#FFFFFF",
    fontFamily: "var(--font-inter)",
    outline: "none",
    width: "100%",
    padding: "0.875rem 1rem",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    transition: "border-color 0.2s, background 0.2s",
  } as React.CSSProperties;

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 pb-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A1628, #0D1E3A)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: "linear-gradient(rgba(0,102,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border mb-6"
              style={{ color: "#00D4FF", borderColor: "rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.06)", fontFamily: "var(--font-montserrat)" }}
            >
              <MessageCircle size={13} />
              Hablemos
            </div>
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-white mb-4"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Tu siguiente paso hacia
              <br />
              <span style={{ background: "linear-gradient(135deg, #0066FF, #00D4FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                más contenido, menos costo.
              </span>
            </h1>
            <p
              className="text-base max-w-xl mx-auto"
              style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-inter)" }}
            >
              Cuéntanos sobre tu empresa y te respondemos en menos de 24 horas hábiles con una propuesta personalizada.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact section */}
      <section className="py-16 pb-24" style={{ background: "#0A1628" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left: Info */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="space-y-6">
                {[
                  {
                    icon: Mail,
                    title: "Email directo",
                    desc: "editorgeneral@fotoeditores.com",
                    link: "mailto:editorgeneral@fotoeditores.com",
                    color: "#00D4FF",
                  },
                  {
                    icon: Clock,
                    title: "Tiempo de respuesta",
                    desc: "Menos de 24 horas hábiles",
                    color: "#0066FF",
                  },
                  {
                    icon: MessageCircle,
                    title: "WhatsApp Business",
                    desc: "Disponible para clientes activos",
                    color: "#FFB800",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}
                    >
                      <item.icon size={18} style={{ color: item.color }} />
                    </div>
                    <div>
                      <p
                        className="font-semibold text-white text-sm"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                      >
                        {item.title}
                      </p>
                      {item.link ? (
                        <a
                          href={item.link}
                          className="text-sm"
                          style={{ color: item.color, fontFamily: "var(--font-inter)" }}
                        >
                          {item.desc}
                        </a>
                      ) : (
                        <p
                          className="text-sm"
                          style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)" }}
                        >
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Promise */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-10 rounded-xl p-6"
                style={{
                  background: "rgba(255,184,0,0.06)",
                  border: "1px solid rgba(255,184,0,0.2)",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "#FFB800", fontFamily: "var(--font-montserrat)" }}
                >
                  Nuestra promesa
                </p>
                <p
                  className="text-sm leading-relaxed italic"
                  style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-inter)" }}
                >
                  "No andamos con rodeos. Decimos lo que el cliente necesita escuchar, presentamos el problema y la solución en el mismo aliento, y siempre terminamos una conversación con un paso claro a seguir."
                </p>
              </motion.div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-3"
            >
              {status === "success" ? (
                <div
                  className="rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(0,212,255,0.2)",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: "rgba(0,212,255,0.12)", border: "2px solid #00D4FF" }}
                  >
                    <CheckCircle size={36} style={{ color: "#00D4FF" }} />
                  </motion.div>
                  <h3
                    className="text-2xl font-extrabold text-white mb-3"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    Mensaje recibido.
                  </h3>
                  <p
                    className="text-base"
                    style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)", maxWidth: "320px" }}
                  >
                    Te respondemos en menos de 24 horas hábiles. También te enviamos
                    un correo de confirmación.
                  </p>
                </div>
              ) : (
                <div
                  className="rounded-2xl p-8"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-xs font-semibold mb-1.5"
                          style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-montserrat)" }}
                        >
                          Nombre *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Tu nombre completo"
                          style={inputStyle}
                          onFocus={(e) => { e.target.style.borderColor = "rgba(0,212,255,0.5)"; e.target.style.background = "rgba(0,102,255,0.06)"; }}
                          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs font-semibold mb-1.5"
                          style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-montserrat)" }}
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="tu@empresa.com"
                          style={inputStyle}
                          onFocus={(e) => { e.target.style.borderColor = "rgba(0,212,255,0.5)"; e.target.style.background = "rgba(0,102,255,0.06)"; }}
                          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-xs font-semibold mb-1.5"
                        style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-montserrat)" }}
                      >
                        Empresa
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Nombre de tu empresa (opcional)"
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = "rgba(0,212,255,0.5)"; e.target.style.background = "rgba(0,102,255,0.06)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs font-semibold mb-1.5"
                        style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-montserrat)" }}
                      >
                        Servicio de interés
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        style={{
                          ...inputStyle,
                          cursor: "pointer",
                        }}
                        onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(0,212,255,0.5)"; (e.target as HTMLElement).style.background = "rgba(0,102,255,0.06)"; }}
                        onBlur={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.target as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                      >
                        <option value="" style={{ background: "#0A1628" }}>
                          Selecciona un servicio...
                        </option>
                        {services.map((s) => (
                          <option key={s} value={s} style={{ background: "#0A1628" }}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        className="block text-xs font-semibold mb-1.5"
                        style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-montserrat)" }}
                      >
                        Mensaje *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Cuéntanos sobre tu empresa, qué tipo de contenido necesitas y cuál es tu mayor reto actual..."
                        style={{ ...inputStyle, resize: "vertical" }}
                        onFocus={(e) => { e.target.style.borderColor = "rgba(0,212,255,0.5)"; e.target.style.background = "rgba(0,102,255,0.06)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                      />
                    </div>

                    {errorMsg && (
                      <p
                        className="text-sm"
                        style={{ color: "#FF4D6D", fontFamily: "var(--font-inter)" }}
                      >
                        {errorMsg}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full py-4 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                        fontFamily: "var(--font-montserrat)",
                        boxShadow: "0 4px 20px rgba(0,102,255,0.4)",
                      }}
                    >
                      {status === "loading" ? (
                        "Enviando..."
                      ) : (
                        <>
                          Enviar mensaje
                          <Send size={15} />
                        </>
                      )}
                    </button>

                    <p
                      className="text-center text-xs"
                      style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-inter)" }}
                    >
                      * Campos requeridos · Respondemos en menos de 24 horas hábiles
                    </p>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
