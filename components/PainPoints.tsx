"use client";

import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

const pains = [
  {
    icon: "⏱️",
    title: "Pierdes horas coordinando",
    desc: "Contactar fotógrafos, agendar sesiones, esperar entregas. Ese tiempo vale oro — y lo estás regalando.",
  },
  {
    icon: "💸",
    title: "Presupuesto que se esfuma",
    desc: "Una sesión fotográfica profesional cuesta $800–$2,000 USD. Y si necesitas video, multiplica por tres.",
  },
  {
    icon: "📉",
    title: "Volumen insuficiente",
    desc: "Los algoritmos piden contenido constante. Producir 2-3 piezas por semana con métodos tradicionales es imposible.",
  },
  {
    icon: "🤖",
    title: "La IA sola no basta",
    desc: "Probaste Midjourney o DALL-E por tu cuenta y los resultados no cumplen los estándares de tu marca. La IA sin criterio editorial produce mediocridad.",
  },
  {
    icon: "🔄",
    title: "Revisiones sin fin",
    desc: "Tres rondas de correcciones con la agencia, el brief que nunca se entiende, el deadline que se mueve.",
  },
  {
    icon: "📊",
    title: "Sin métricas de impacto",
    desc: "Produces contenido pero no sabes si genera retorno. La producción sin análisis es dinero tirado al aire.",
  },
];

export default function PainPoints() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "#0A1628" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border mb-5"
            style={{
              color: "#FF4D6D",
              borderColor: "rgba(255,77,109,0.3)",
              background: "rgba(255,77,109,0.06)",
              fontFamily: "var(--font-montserrat)",
            }}
          >
            <XCircle size={13} />
            El problema
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            ¿Te suena familiar?
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
          >
            Producir contenido de calidad es cada vez más caro, más lento y más
            frustrante. Hasta que descubres la forma correcta de usar la IA.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pains.map((pain, i) => (
            <motion.div
              key={pain.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-xl p-6 transition-all duration-200 hover:border-red-500/30"
              style={{
                background: "rgba(255,77,109,0.04)",
                border: "1px solid rgba(255,77,109,0.1)",
              }}
            >
              <div className="text-3xl mb-3">{pain.icon}</div>
              <h3
                className="font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-montserrat)", fontSize: "1rem" }}
              >
                {pain.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)" }}
              >
                {pain.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
