import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
          foto<span className="text-blue-600">editores</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="#servicios" className="hover:text-gray-900 transition-colors">Servicios</Link>
          <Link href="#ejemplos" className="hover:text-gray-900 transition-colors">Ejemplos</Link>
          <Link href="#precios" className="hover:text-gray-900 transition-colors">Precios</Link>
          <Link href="#contacto" className="hover:text-gray-900 transition-colors">Contacto</Link>
        </div>

        <Link
          href="#contacto"
          className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors"
        >
          Solicitar presupuesto
        </Link>
      </div>
    </nav>
  );
}
