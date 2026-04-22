const features = [
  {
    icon: "⚡",
    title: "Entrega en 7 días",
    description:
      "Sitios web completos y funcionales listos en tiempo récord, sin sacrificar la calidad ni los detalles.",
  },
  {
    icon: "🤖",
    title: "IA Nativa",
    description:
      "Integración de las mejores herramientas de inteligencia artificial disponibles: diseño, contenido y automatización.",
  },
  {
    icon: "💎",
    title: "Precio transparente",
    description:
      "Un precio claro desde el primer día. Sin sorpresas, sin costos ocultos, nunca. Lo que cotizamos es lo que pagas.",
  },
];

export default function PorQueElegirnos() {
  return (
    <section id="por-que" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-5"
            style={{
              background: "rgba(0,102,255,0.06)",
              borderColor: "rgba(0,102,255,0.2)",
              color: "#0066FF",
            }}
          >
            Nuestras ventajas
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            20 años construyendo presencia digital con las mejores herramientas del mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-8 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all duration-300 text-center group"
            >
              <div className="text-5xl mb-6">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {f.title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
