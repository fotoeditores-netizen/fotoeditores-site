"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/tecnologia", label: "Tecnología" },
  { href: "/nuestro-adn", label: "Nuestro ADN" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
        style={{
          background: scrolled
            ? "rgba(10, 22, 40, 0.92)"
            : "transparent",
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Fotoeditores"
              width={160}
              height={52}
              className="object-contain"
              style={{ height: "70px", width: "auto" }}
              priority
            />
            <span
              className="hidden sm:block text-xs px-2 py-0.5 rounded-full border font-medium"
              style={{
                borderColor: "rgba(255, 184, 0, 0.4)",
                color: "#FFB800",
                background: "rgba(255, 184, 0, 0.08)",
                fontFamily: "var(--font-montserrat)",
              }}
            >
              20 años
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      background: isActive
                        ? "rgba(0, 102, 255, 0.15)"
                        : undefined,
                      color: isActive ? "#00D4FF" : undefined,
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/contacto"
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white/80 transition-all duration-200 hover:text-white hover:bg-white/5"
              style={{
                fontFamily: "var(--font-montserrat)",
              }}
            >
              Hablar con un experto
            </Link>
            <a
              href="https://funnel-fotoeditores.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)",
                fontFamily: "var(--font-montserrat)",
                boxShadow: "0 0 24px rgba(0, 102, 255, 0.45)",
                borderRadius: "12px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 40px rgba(0, 102, 255, 0.75), 0 6px 24px rgba(0, 0, 0, 0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 24px rgba(0, 102, 255, 0.45)";
              }}
            >
              Cotizador Web
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: "rgba(10, 22, 40, 0.98)", backdropFilter: "blur(20px)" }}
          >
            <div className="flex flex-col h-full pt-20 px-6 pb-8">
              <ul className="flex flex-col gap-2 flex-1">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center py-4 px-4 rounded-xl text-lg font-semibold transition-all"
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          color: isActive ? "#00D4FF" : "rgba(255,255,255,0.8)",
                          background: isActive
                            ? "rgba(0, 102, 255, 0.1)"
                            : "transparent",
                          borderLeft: isActive ? "3px solid #0066FF" : "3px solid transparent",
                        }}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
              <div className="flex flex-col gap-3">
                <a
                  href="https://funnel-fotoeditores.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl text-center text-base font-extrabold text-white"
                  style={{
                    background: "linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)",
                    fontFamily: "var(--font-montserrat)",
                    borderRadius: "12px",
                    boxShadow: "0 0 32px rgba(0, 102, 255, 0.5)",
                  }}
                >
                  Cotizador Web
                </a>
                <Link
                  href="/contacto"
                  className="w-full py-3 rounded-xl text-center text-sm font-semibold text-white/70 hover:text-white transition-colors"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                  }}
                >
                  Hablar con un experto
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
