export default function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-white pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-8"
              style={{
                background: "rgba(0, 102, 255, 0.06)",
                borderColor: "rgba(0, 102, 255, 0.2)",
                color: "#0066FF",
              }}
            >
              <span>✨</span>
              IA + 20 años de experiencia
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.2rem] font-extrabold text-gray-900 leading-tight mb-6">
              Páginas Web{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Inteligentes
              </span>
              ,{" "}
              <span className="block">Rápidas y a tu Medida</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-10 max-w-lg">
              Diseño profesional potenciado con IA y respaldado por{" "}
              <span className="text-gray-900 font-semibold">20 años de experiencia</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#cotizador"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white transition-all duration-200 hover:opacity-90 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)",
                  boxShadow: "0 8px 32px rgba(0,102,255,0.3)",
                }}
              >
                Calcular precio de mi web →
              </a>
              <a
                href="/portafolio"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all duration-200"
              >
                Ver portafolio
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 mt-10">
              {[
                "✓ Sin costos ocultos",
                "✓ Entrega en 7 días",
                "✓ IA integrada",
                "✓ Soporte continuo",
              ].map((item) => (
                <span key={item} className="text-sm text-gray-400">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Visual card */}
          <div className="flex flex-col gap-5">
            {/* Main card */}
            <div
              className="rounded-2xl p-8 border"
              style={{
                background: "linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%)",
                borderColor: "rgba(0,102,255,0.12)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ background: "linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)" }}
                >
                  🤖
                </div>
                <div>
                  <p className="font-bold text-gray-900">fotoeditores.ai</p>
                  <p className="text-xs text-gray-400">Generando tu web...</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  "✓ Diseño responsivo listo",
                  "✓ SEO básico configurado",
                  "✓ SSL activado",
                  "✓ Velocidad optimizada",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-sm font-bold" style={{ color: "#0066FF" }}>
                    ✓ Publicado exitosamente
                  </span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "7 días", label: "Entrega", color: "#0066FF" },
                { value: "500+", label: "Proyectos", color: "#00D4FF" },
                { value: "$99", label: "Desde USD", color: "#0066FF" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl p-4 text-center bg-white border border-gray-100 shadow-sm"
                >
                  <div
                    className="text-xl font-extrabold mb-1"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
