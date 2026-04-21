import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto text-center">
        <span className="inline-block bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          Edición profesional de fotografía
        </span>

        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
          Transforma tus fotos
          <br />
          <span className="text-blue-600">al siguiente nivel</span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Retoque profesional, eliminación de fondos, corrección de color y mucho más.
          Entrega en 24 horas. Calidad garantizada.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#contacto"
            className="bg-blue-600 text-white font-semibold px-8 py-4 rounded-full hover:bg-blue-700 transition-colors text-lg"
          >
            Empezar ahora
          </Link>
          <Link
            href="#ejemplos"
            className="bg-white text-gray-800 font-semibold px-8 py-4 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-lg"
          >
            Ver ejemplos
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto text-center">
          <div>
            <p className="text-3xl font-extrabold text-gray-900">500+</p>
            <p className="text-sm text-gray-500 mt-1">Clientes satisfechos</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900">24h</p>
            <p className="text-sm text-gray-500 mt-1">Tiempo de entrega</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900">99%</p>
            <p className="text-sm text-gray-500 mt-1">Satisfacción</p>
          </div>
        </div>
      </div>
    </section>
  );
}
