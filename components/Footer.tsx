import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "#cotizador", label: "Cotizador" },
  { href: "/portafolio", label: "Portafolio" },
  { href: "/contacto", label: "Contacto" },
];

const services = [
  "Diseño Web",
  "Integración IA",
  "SEO & Marketing",
  "E-commerce",
  "Mantenimiento",
];

export default function Footer() {
  return (
    <footer style={{ background: "#0A1628" }} className="text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div>
            <Image
              src="/logo.png"
              alt="Fotoeditores"
              width={130}
              height={42}
              className="object-contain mb-5"
              style={{ height: "42px", width: "auto" }}
            />
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              De Creadores a Gestores de IA. Páginas web inteligentes, rápidas
              y a tu medida.
            </p>
            <a
              href="mailto:fotoeditores@gmail.com"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              fotoeditores@gmail.com
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-white/70 mb-5 text-xs uppercase tracking-widest">
              Navegación
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-white/70 mb-5 text-xs uppercase tracking-widest">
              Servicios
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-white/50 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Fotoeditores. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1">
            <span className="text-white/30 text-xs">Hecho con</span>
            <span className="text-blue-400 text-xs mx-1">IA</span>
            <span className="text-white/30 text-xs">+ 20 años de experiencia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
