"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "#cotizador", label: "Cotizador" },
  { href: "/portafolio", label: "Portafolio" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-sm border-b border-gray-100" : "bg-white/95 backdrop-blur-md"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Fotoeditores"
              width={140}
              height={45}
              className="object-contain"
              style={{ height: "44px", width: "auto" }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center">
            <a
              href="#cotizador"
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)",
                boxShadow: "0 4px 16px rgba(0,102,255,0.3)",
              }}
            >
              Calcular precio de mi web
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span
                className="h-0.5 bg-current rounded-full transition-all duration-200 origin-center"
                style={{ transform: mobileOpen ? "rotate(45deg) translateY(8px)" : "none" }}
              />
              <span
                className="h-0.5 bg-current rounded-full transition-all duration-200"
                style={{ opacity: mobileOpen ? 0 : 1 }}
              />
              <span
                className="h-0.5 bg-current rounded-full transition-all duration-200 origin-center"
                style={{ transform: mobileOpen ? "rotate(-45deg) translateY(-8px)" : "none" }}
              />
            </div>
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-white pt-16">
          <ul className="flex flex-col px-6 py-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-4 text-lg font-medium text-gray-700 border-b border-gray-100 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-6 py-6">
            <a
              href="#cotizador"
              className="block w-full py-4 rounded-xl text-center text-base font-bold text-white"
              style={{ background: "linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)" }}
              onClick={() => setMobileOpen(false)}
            >
              Calcular precio de mi web
            </a>
          </div>
        </div>
      )}
    </>
  );
}
