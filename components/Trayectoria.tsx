const stats = [
  {
    value: "20+",
    label: "Años de experiencia",
    sublabel: "Desde 2004 construyendo presencia digital",
  },
  {
    value: "500+",
    label: "Proyectos entregados",
    sublabel: "Clientes en toda América Latina y España",
  },
  {
    value: "100%",
    label: "Sin costos ocultos",
    sublabel: "Transparencia total en cada propuesta",
  },
];

export default function Trayectoria() {
  return (
    <section id="trayectoria" className="py-24 bg-white">
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
            Nuestros números
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Trayectoria Comprobada
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Dos décadas de resultados respaldan cada proyecto que tomamos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="text-center p-10 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
              style={{ background: "#F8FAFC" }}
            >
              <div
                className="text-5xl sm:text-6xl font-extrabold mb-3"
                style={{
                  background: "linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.value}
              </div>
              <p className="font-bold text-gray-900 text-lg mb-2">{s.label}</p>
              <p className="text-gray-400 text-sm">{s.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
