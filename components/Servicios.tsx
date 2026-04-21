const servicios = [
  {
    icon: "✨",
    titulo: "Retoque profesional",
    descripcion: "Eliminación de imperfecciones, piel suave y realce de detalles para una imagen impecable.",
  },
  {
    icon: "🎨",
    titulo: "Corrección de color",
    descripcion: "Ajuste de exposición, contraste, saturación y balance de blancos para el look perfecto.",
  },
  {
    icon: "✂️",
    titulo: "Eliminación de fondo",
    descripcion: "Recorte preciso de objetos y personas con resultado limpio listo para usar.",
  },
  {
    icon: "🌅",
    titulo: "Composición y montaje",
    descripcion: "Fusión de imágenes, cielos artificiales y composiciones creativas a medida.",
  },
  {
    icon: "📦",
    titulo: "Fotografía de producto",
    descripcion: "Edición optimizada para e-commerce: fondo blanco, sombras y encuadre perfecto.",
  },
  {
    icon: "👰",
    titulo: "Bodas y eventos",
    descripcion: "Retoque de piel, uniformidad de color y estilo cohesionado para toda la galería.",
  },
];

export default function Servicios() {
  return (
    <section id="servicios" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Nuestros servicios</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Todo lo que necesitas para que tus imágenes destaquen, entregado con precisión y rapidez.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicios.map((s) => (
            <div
              key={s.titulo}
              className="p-8 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all group"
            >
              <span className="text-4xl mb-4 block">{s.icon}</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {s.titulo}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
