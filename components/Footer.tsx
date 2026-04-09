"use client";

import Link from "next/link";
import { Mail, Linkedin, Instagram, Youtube } from "lucide-react";
import Image from "next/image";

const footerLinks = {
  servicios: [
    { label: "Gestión IA para Contenidos", href: "/tecnologia" },
    { label: "Estrategia de Contenido IA", href: "/tecnologia#estrategia" },
    { label: "Paquetes Productivos", href: "/tecnologia#paquetes" },
    { label: "Calculadora de ROI", href: "/#roi" },
  ],
  empresa: [
    { label: "Nuestro ADN", href: "/nuestro-adn" },
    { label: "Equipo", href: "/nuestro-adn#equipo" },
    { label: "Valores", href: "/nuestro-adn#valores" },
    { label: "Blog", href: "/blog" },
  ],
  legal: [
    { label: "Política de Privacidad", href: "/privacidad" },
    { label: "Términos de Servicio", href: "/terminos" },
    { label: "Contacto", href: "/contacto" },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com/company/fotoeditores", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com/fotoeditores", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/@fotoeditores", label: "YouTube" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0A1628 0%, #050D1A 100%)" }}
    >
      {/* Top border gradient */}
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, #0066FF, #00D4FF, transparent)" }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 102, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 102, 255, 0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="Fotoeditores"
                width={200}
                height={65}
                className="object-contain"
                style={{ height: "44px", width: "auto" }}
              />
            </Link>

            <p
              className="text-sm leading-relaxed mb-6 max-w-xs"
              style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-inter)" }}
            >
              De creadores a gestores de IA. 20 años de criterio editorial al
              servicio de la inteligencia artificial más avanzada del mercado.
            </p>

            {/* Stats row */}
            <div className="flex gap-6 mb-6">
              {[
                { value: "20", label: "Años" },
                { value: "-55%", label: "Costos" },
                { value: "×3.5", label: "Volumen" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-lg font-extrabold"
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(0,102,255,0.2)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.3)";
                    (e.currentTarget as HTMLElement).style.color = "#00D4FF";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#0066FF", fontFamily: "var(--font-montserrat)" }}
            >
              Servicios
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.servicios.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-150"
                    style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#00D4FF")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#0066FF", fontFamily: "var(--font-montserrat)" }}
            >
              Empresa
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-150"
                    style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#00D4FF")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#0066FF", fontFamily: "var(--font-montserrat)" }}
            >
              Contacto
            </h4>
            <a
              href="mailto:editorgeneral@fotoeditores.com"
              className="flex items-center gap-2 text-sm mb-4 transition-colors duration-150"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00D4FF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            >
              <Mail size={14} />
              editorgeneral@fotoeditores.com
            </a>
            <div
              className="inline-block text-xs px-3 py-1.5 rounded-full border"
              style={{
                background: "rgba(255,184,0,0.08)",
                borderColor: "rgba(255,184,0,0.3)",
                color: "#FFB800",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
              }}
            >
              Colombia · 2006 – {currentYear}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.3)",
            fontFamily: "var(--font-inter)",
          }}
        >
          <p>© {currentYear} Fotoeditores. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1">
            <span>Hecho con</span>
            <span style={{ color: "#0066FF" }}>♥</span>
            <span>en Colombia</span>
            <span className="mx-2">·</span>
            <span style={{ fontFamily: "var(--font-jetbrains)", color: "rgba(0,212,255,0.5)", fontSize: "0.7rem" }}>
              IA + criterio humano
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
