import BeforeAfterSlider from "./BeforeAfterSlider";

const ejemplos = [
  {
    beforeSrc: "https://picsum.photos/seed/portrait1/800/600?grayscale",
    afterSrc: "https://picsum.photos/seed/portrait1/800/600",
    titulo: "Retoque de retrato",
  },
  {
    beforeSrc: "https://picsum.photos/seed/product2/800/600?grayscale",
    afterSrc: "https://picsum.photos/seed/product2/800/600",
    titulo: "Fotografía de producto",
  },
  {
    beforeSrc: "https://picsum.photos/seed/wedding3/800/600?grayscale",
    afterSrc: "https://picsum.photos/seed/wedding3/800/600",
    titulo: "Fotografía de boda",
  },
];

export default function EjemplosSection() {
  return (
    <section id="ejemplos" className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Antes y después</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Arrastra el divisor para ver la transformación. Resultados reales de nuestros clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ejemplos.map((ej) => (
            <div key={ej.titulo}>
              <BeforeAfterSlider
                beforeSrc={ej.beforeSrc}
                afterSrc={ej.afterSrc}
                alt={ej.titulo}
              />
              <p className="text-center text-sm font-semibold text-gray-600 mt-3">{ej.titulo}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
