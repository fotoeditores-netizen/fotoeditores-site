"use client";

import { useState, useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Check, Plus, Minus, Mail, Loader2 } from "lucide-react";
import { useCotizador } from "@/context/CotizadorContext";
import type { Currency } from "@/components/CotizadorModal";

const BASE_PRICE = 99;
const MAINTENANCE_PRICE = 29;

const SECTORES = [
  "Comercio y Retail",
  "Restaurantes y Gastronomía",
  "Salud y Bienestar",
  "Educación y Formación",
  "Tecnología y Software",
  "Construcción e Inmobiliaria",
  "Turismo y Hotelería",
  "Moda y Ropa",
  "Servicios Profesionales",
  "Belleza y Estética",
  "Deportes y Fitness",
  "Entretenimiento y Medios",
  "Manufactura e Industria",
  "Transporte y Logística",
  "Arte y Diseño",
  "Agricultura y Ganadería",
  "Finanzas y Seguros",
  "ONG y Sector Social",
  "Otro",
];

function formatPrice(usd: number, currency: Currency, copRate: number, compact = false): string {
  if (currency === "USD") return `$${usd}`;
  const cop = usd * copRate;
  return compact
    ? `$${(cop / 1000).toFixed(0)}K`
    : `$${cop.toLocaleString("es-CO")}`;
}

function currencyLabel(currency: Currency) {
  return currency === "USD" ? "USD" : "COP";
}

interface Module {
  id: string;
  label: string;
  price: number;
  desc: string;
  tooltip: string;
}

const baseFeatures = [
  {
    label: "Homepage + hasta 5 landing pages",
    tooltip:
      "Es la página principal de tu sitio web junto con hasta 5 páginas adicionales diseñadas específicamente para ofrecer un servicio o producto concreto. Su objetivo es captar la atención y lograr que los visitantes te contacten de inmediato.",
  },
  {
    label: "Diseño 100% responsive",
    tooltip:
      "Garantiza que tu página web se adapte de forma automática para verse perfecta y ser fácil de navegar desde cualquier teléfono celular, tablet o computadora de escritorio.",
  },
  {
    label: "Certificado SSL incluido",
    tooltip:
      "Es el 'candadito' de seguridad que aparece arriba en la barra del navegador. Protege los datos personales de tus visitantes y le dice a Google que tu sitio web es de total confianza.",
  },
  {
    label: "Soporte inicial",
    tooltip:
      "Acompañamiento y ayuda técnica durante los primeros días después de entregarte la página. Nos aseguramos de que sepas cómo usarla y de que todo funcione al 100% sin complicaciones.",
  },
];

const aiModules: Module[] = [
  {
    id: "chatbot",
    label: "Chatbot IA",
    price: 49,
    desc: "Atención automatizada 24/7",
    tooltip:
      "Un asistente virtual inteligente que responde las dudas de tus clientes las 24 horas del día de forma natural y conversacional, como si fuera un humano de tu equipo atendiendo por chat.",
  },
  {
    id: "ai",
    label: "Integración IA",
    price: 99,
    desc: "Flujos inteligentes de datos",
    tooltip:
      "Conectamos tu página con herramientas de Inteligencia Artificial para automatizar tareas aburridas. Puede servir para traducir contenido al instante, analizar a tus visitantes o generar respuestas automáticas muy precisas.",
  },
  {
    id: "gamification",
    label: "Gamificación",
    price: 89,
    desc: "Experiencias interactivas",
    tooltip:
      "Agregamos elementos divertidos en tu página (como puntos, barras de progreso o pequeños retos) para que los usuarios interactúen más tiempo con tu marca y no se aburran.",
  },
  {
    id: "animations",
    label: "Animaciones Pro",
    price: 59,
    desc: "Motion design avanzado",
    tooltip:
      "Efectos visuales modernos y fluidos que hacen que tu página cobre vida al navegarla. Ayudan a que el sitio se vea mucho más profesional, dinámico y atractivo a la vista.",
  },
];

const extraModules: Module[] = [
  {
    id: "ecommerce",
    label: "E-commerce",
    price: 149,
    desc: "Tienda online completa",
    tooltip:
      "Transformamos tu página web en una sucursal abierta 24/7. Incluye catálogo de productos, carrito de compras y conexión segura para recibir pagos por internet.",
  },
  {
    id: "blog",
    label: "Blog",
    price: 79,
    desc: "Sistema de contenidos",
    tooltip:
      "Una sección especial para que publiques artículos, guías o noticias. Es una de las mejores herramientas para demostrar tu experiencia y atraer nuevos clientes desde las búsquedas de Google.",
  },
  {
    id: "seo",
    label: "SEO Avanzado",
    price: 49,
    desc: "Posicionamiento técnico",
    tooltip:
      "Técnicas y configuraciones profundas para que Google entienda perfectamente de qué trata tu página y te posicione en los primeros lugares cuando alguien busque tus servicios.",
  },
];

function Tooltip({ text, children }: { text: string; children: ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span
        className="border-b border-dotted cursor-help"
        style={{ borderColor: "rgba(255,255,255,0.28)" }}
      >
        {children}
      </span>
      {show && (
        <span
          className="absolute bottom-full left-0 mb-2 w-64 p-3 rounded-xl text-xs pointer-events-none z-[200]"
          style={{
            background: "rgba(6, 14, 28, 0.98)",
            border: "1px solid rgba(0,102,255,0.22)",
            color: "rgba(255,255,255,0.78)",
            fontFamily: "var(--font-inter)",
            fontWeight: 400,
            lineHeight: "1.55",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            backdropFilter: "blur(12px)",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

function Stepper({
  value,
  onChange,
  min = 0,
  max = 20,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-30"
        style={{
          background: "rgba(0,102,255,0.15)",
          border: "1px solid rgba(0,102,255,0.3)",
          color: "#00D4FF",
        }}
      >
        <Minus size={14} />
      </button>
      <span
        className="w-8 text-center font-bold text-base tabular-nums"
        style={{
          color: value > 0 ? "#00D4FF" : "rgba(255,255,255,0.4)",
          fontFamily: "var(--font-montserrat)",
        }}
      >
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-30"
        style={{
          background: "rgba(0,102,255,0.15)",
          border: "1px solid rgba(0,102,255,0.3)",
          color: "#00D4FF",
        }}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

function ToggleCard({
  module,
  selected,
  onToggle,
  currency,
  copRate,
}: {
  module: Module;
  selected: boolean;
  onToggle: () => void;
  currency: Currency;
  copRate: number;
}) {
  return (
    <button
      onClick={onToggle}
      className="text-left p-4 rounded-xl transition-all duration-200 w-full"
      style={{
        background: selected ? "rgba(0,102,255,0.12)" : "rgba(255,255,255,0.03)",
        border: selected
          ? "1px solid rgba(0,102,255,0.5)"
          : "1px solid rgba(255,255,255,0.08)",
        boxShadow: selected ? "0 0 20px rgba(0,102,255,0.18)" : "none",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div
            className="text-sm font-bold"
            style={{
              color: selected ? "#00D4FF" : "rgba(255,255,255,0.85)",
              fontFamily: "var(--font-montserrat)",
            }}
          >
            <Tooltip text={module.tooltip}>{module.label}</Tooltip>
          </div>
          <div
            className="text-xs mt-0.5"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}
          >
            {module.desc}
          </div>
        </div>
        <div
          className="text-sm font-extrabold flex-shrink-0"
          style={{
            color: selected ? "#00D4FF" : "rgba(255,255,255,0.4)",
            fontFamily: "var(--font-montserrat)",
          }}
        >
          +{formatPrice(module.price, currency, copRate, currency === "COP")}
        </div>
      </div>
      {selected && (
        <div className="mt-2 flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(0,212,255,0.2)" }}
          >
            <Check size={10} style={{ color: "#00D4FF" }} />
          </div>
          <span
            className="text-xs font-semibold"
            style={{ color: "#00D4FF", fontFamily: "var(--font-inter)" }}
          >
            Incluido
          </span>
        </div>
      )}
    </button>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <h3
      className="text-xs font-bold uppercase tracking-widest mb-3"
      style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-montserrat)" }}
    >
      {children}
    </h3>
  );
}

function QuantityRow({
  label,
  desc,
  pricePerUnit,
  value,
  onChange,
  tooltip,
  currency,
  copRate,
}: {
  label: string;
  desc: string;
  pricePerUnit: number;
  value: number;
  onChange: (v: number) => void;
  tooltip?: string;
  currency: Currency;
  copRate: number;
}) {
  const displayPrice = value > 0 ? value * pricePerUnit : pricePerUnit;
  return (
    <div
      className="flex items-center justify-between gap-4 p-4 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex-1 min-w-0">
        <div
          className="text-sm font-semibold"
          style={{ color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-montserrat)" }}
        >
          {tooltip ? <Tooltip text={tooltip}>{label}</Tooltip> : label}
        </div>
        <div
          className="text-xs mt-0.5"
          style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}
        >
          {desc}
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-right flex-shrink-0 tabular-nums" style={{ fontFamily: "var(--font-montserrat)" }}>
          <span
            className="text-sm font-bold"
            style={{ color: value > 0 ? "#00D4FF" : "rgba(255,255,255,0.7)" }}
          >
            {formatPrice(displayPrice, currency, copRate, currency === "COP")}
          </span>
          {value === 0 && (
            <span className="text-[10px] font-normal ml-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              c/u
            </span>
          )}
        </div>
        <Stepper value={value} onChange={onChange} />
      </div>
    </div>
  );
}

const inputBase: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "10px",
  color: "rgba(255,255,255,0.85)",
  fontFamily: "var(--font-inter)",
  fontSize: "14px",
  padding: "11px 14px",
  width: "100%",
  outline: "none",
};

const selectBase: React.CSSProperties = {
  ...inputBase,
  background: "rgba(10,22,40,0.95)",
  cursor: "pointer",
  appearance: "auto" as React.CSSProperties["appearance"],
};

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        className="block mb-1.5 text-[11px] font-bold uppercase tracking-widest"
        style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-montserrat)" }}
      >
        {label}
        {required && (
          <span className="ml-1" style={{ color: "#00D4FF" }}>
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

export default function Cotizador({ currency = "USD", copRate = 4200 }: { currency?: Currency; copRate?: number }) {
  useCotizador();

  // Quote configuration
  const [extraPages, setExtraPages] = useState(0);
  const [simpleForms, setSimpleForms] = useState(0);
  const [advancedForms, setAdvancedForms] = useState(0);
  const [languages, setLanguages] = useState(0);
  const [selectedAI, setSelectedAI] = useState<Set<string>>(new Set());
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [maintenance, setMaintenance] = useState(false);

  // Contact form
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [sector, setSector] = useState("");
  const [sectorOtro, setSectorOtro] = useState("");

  // Send state
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  const toggleAI = (id: string) =>
    setSelectedAI((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleExtra = (id: string) =>
    setSelectedExtras((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const oneTimeTotal = useMemo(() => {
    let total = BASE_PRICE;
    total += extraPages * 15;
    total += simpleForms * 10;
    total += advancedForms * 25;
    total += languages * 39;
    aiModules.forEach((m) => { if (selectedAI.has(m.id)) total += m.price; });
    extraModules.forEach((m) => { if (selectedExtras.has(m.id)) total += m.price; });
    return total;
  }, [extraPages, simpleForms, advancedForms, languages, selectedAI, selectedExtras]);

  const buildSummaryLines = () => {
    const lines: string[] = [
      `✅ Base: $${BASE_PRICE} USD (Homepage + 5 landings, responsive, SSL)`,
    ];
    if (extraPages > 0) lines.push(`✅ Páginas extra (${extraPages}): $${extraPages * 15} USD`);
    if (simpleForms > 0) lines.push(`✅ Formularios simples (${simpleForms}): $${simpleForms * 10} USD`);
    if (advancedForms > 0) lines.push(`✅ Formularios avanzados (${advancedForms}): $${advancedForms * 25} USD`);
    aiModules.forEach((m) => { if (selectedAI.has(m.id)) lines.push(`✅ ${m.label}: $${m.price} USD`); });
    extraModules.forEach((m) => { if (selectedExtras.has(m.id)) lines.push(`✅ ${m.label}: $${m.price} USD`); });
    if (languages > 0) lines.push(`✅ Multiidioma (${languages} idioma${languages > 1 ? "s" : ""}): $${languages * 39} USD`);
    if (maintenance) lines.push(`✅ Mantenimiento mensual: $${MAINTENANCE_PRICE}/mes (cobro separado)`);
    return lines;
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isFormValid =
    nombre.trim().length > 0 &&
    email.trim().length > 0 &&
    emailRegex.test(email);

  const handleEmail = async () => {
    if (!isFormValid || sendingEmail || emailSent) return;
    setSendingEmail(true);
    setEmailError("");

    try {
      const res = await fetch("/api/cotizador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nombre,
          phone: telefono,
          email,
          company: empresa,
          sector: sector === "Otro" ? sectorOtro : sector,
          quoteSummary: buildSummaryLines(),
          total: oneTimeTotal,
          currency,
          copRate,
          hasMaintenance: maintenance,
          hasEcommerce: selectedExtras.has("ecommerce"),
        }),
      });

      if (res.ok) {
        setEmailSent(true);
      } else {
        const data = await res.json();
        setEmailError(data.message || "Error al enviar. Intenta de nuevo.");
      }
    } catch {
      setEmailError("Error de conexión. Intenta de nuevo.");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
      {/* Styles for form inputs */}
      <style>{`
        .cot-input::placeholder { color: rgba(255,255,255,0.22); }
        .cot-input:focus { border-color: rgba(0,102,255,0.55) !important; }
        .cot-select:focus { border-color: rgba(0,102,255,0.55) !important; }
        .cot-select option { background: #0A1628; color: rgba(255,255,255,0.85); }
      `}</style>

      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
          style={{
            background: "rgba(0,102,255,0.1)",
            border: "1px solid rgba(0,102,255,0.25)",
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "#00D4FF", animation: "pulse 2s infinite" }}
          />
          <span
            className="text-xs font-bold"
            style={{ color: "#00D4FF", fontFamily: "var(--font-montserrat)" }}
          >
            Precio en tiempo real
          </span>
        </div>
        <h2
          className="text-2xl sm:text-3xl font-extrabold mb-2"
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #00D4FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "var(--font-montserrat)",
          }}
        >
          Arma tu proyecto web
        </h2>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          Selecciona los módulos que necesitas y el precio se actualiza al instante
        </p>
      </div>

      <div className="space-y-6">
        {/* Base — siempre incluido */}
        <div>
          <SectionLabel>Siempre incluido</SectionLabel>
          <div
            className="p-5 rounded-xl"
            style={{
              background: "rgba(0,102,255,0.08)",
              border: "1px solid rgba(0,102,255,0.22)",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div
                  className="text-base font-extrabold"
                  style={{ color: "#FFFFFF", fontFamily: "var(--font-montserrat)" }}
                >
                  Paquete Base
                </div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Todo lo que necesitas para lanzar
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span
                  className="text-2xl font-extrabold"
                  style={{ color: "#00D4FF", fontFamily: "var(--font-montserrat)" }}
                >
                  {formatPrice(BASE_PRICE, currency, copRate, currency === "COP")}
                </span>
                <span
                  className="text-sm font-normal ml-1"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {currencyLabel(currency)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {baseFeatures.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(0,212,255,0.15)" }}
                  >
                    <Check size={10} style={{ color: "#00D4FF" }} />
                  </div>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <Tooltip text={item.tooltip}>{item.label}</Tooltip>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Páginas y formularios */}
        <div>
          <SectionLabel>Páginas y formularios</SectionLabel>
          <div className="space-y-3">
            <QuantityRow
              label="Páginas adicionales"
              desc={`${formatPrice(15, currency, copRate, currency === "COP")} por página extra`}
              pricePerUnit={15}
              value={extraPages}
              onChange={setExtraPages}
              currency={currency}
              copRate={copRate}
              tooltip="Si tu proyecto necesita más secciones además de las iniciales (por ejemplo: 'Nuestra historia', 'Galería de trabajos' o 'Términos y condiciones'), puedes sumar el espacio exacto que te haga falta."
            />
            <QuantityRow
              label="Formulario simple"
              desc={`Contacto, suscripción — ${formatPrice(10, currency, copRate, currency === "COP")} c/u`}
              pricePerUnit={10}
              value={simpleForms}
              onChange={setSimpleForms}
              currency={currency}
              copRate={copRate}
              tooltip="Un espacio básico, rápido y directo donde tus clientes interesados pueden dejar su nombre, correo y un mensaje breve para que tú puedas contactarlos rápidamente."
            />
            <QuantityRow
              label="Formulario avanzado"
              desc={`Multi-paso, lógica condicional — ${formatPrice(25, currency, copRate, currency === "COP")} c/u`}
              pricePerUnit={25}
              value={advancedForms}
              onChange={setAdvancedForms}
              currency={currency}
              copRate={copRate}
              tooltip="Un formulario más completo que te permite hacer encuestas, pedir que suban archivos (como fotos o documentos) y guiar al cliente con preguntas específicas dependiendo de lo que vaya respondiendo."
            />
          </div>
        </div>

        {/* IA & Automatización */}
        <div>
          <SectionLabel>IA & Automatización</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {aiModules.map((m) => (
              <ToggleCard
                key={m.id}
                module={m}
                selected={selectedAI.has(m.id)}
                onToggle={() => toggleAI(m.id)}
                currency={currency}
                copRate={copRate}
              />
            ))}
          </div>
        </div>

        {/* Funcionalidades extra */}
        <div>
          <SectionLabel>Funcionalidades extra</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {extraModules.map((m) => (
              <ToggleCard
                key={m.id}
                module={m}
                selected={selectedExtras.has(m.id)}
                onToggle={() => toggleExtra(m.id)}
                currency={currency}
                copRate={copRate}
              />
            ))}
          </div>
        </div>

        {/* Multiidioma */}
        <div>
          <SectionLabel>Idiomas</SectionLabel>
          <QuantityRow
            label="Multiidioma"
            desc={`${formatPrice(39, currency, copRate, currency === "COP")} por idioma adicional`}
            pricePerUnit={39}
            value={languages}
            onChange={setLanguages}
            currency={currency}
            copRate={copRate}
            tooltip="Tu página web disponible en varios idiomas (por ejemplo, español e inglés). Incluye un botón para que el usuario elija en qué idioma prefiere leer, abriendo tu negocio al mercado internacional."
          />
        </div>

        {/* Mantenimiento */}
        <div>
          <SectionLabel>Mantenimiento</SectionLabel>
          <button
            onClick={() => setMaintenance(!maintenance)}
            className="w-full text-left p-4 rounded-xl transition-all duration-200"
            style={{
              background: maintenance ? "rgba(0,102,255,0.12)" : "rgba(255,255,255,0.03)",
              border: maintenance
                ? "1px solid rgba(0,102,255,0.5)"
                : "1px solid rgba(255,255,255,0.08)",
              boxShadow: maintenance ? "0 0 20px rgba(0,102,255,0.18)" : "none",
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div
                  className="text-sm font-bold"
                  style={{
                    color: maintenance ? "#00D4FF" : "rgba(255,255,255,0.85)",
                    fontFamily: "var(--font-montserrat)",
                  }}
                >
                  <Tooltip text="Un seguro de tranquilidad. Nosotros nos encargamos de actualizar los sistemas, hacer copias de respaldo y vigilar que la página no tenga caídas, para que tú solo te enfoques en atender a tus clientes.">
                    Mantenimiento mensual
                  </Tooltip>
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}
                >
                  Actualizaciones, soporte técnico y monitoreo continuo
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div
                  className="text-sm font-extrabold"
                  style={{
                    color: maintenance ? "#00D4FF" : "rgba(255,255,255,0.4)",
                    fontFamily: "var(--font-montserrat)",
                  }}
                >
                  {formatPrice(MAINTENANCE_PRICE, currency, copRate, currency === "COP")}<span className="text-xs font-normal">/mes</span>
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-inter)" }}
                >
                  cobro separado
                </div>
              </div>
            </div>
            {maintenance && (
              <div className="mt-2 flex items-center gap-1.5">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(0,212,255,0.2)" }}
                >
                  <Check size={10} style={{ color: "#00D4FF" }} />
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#00D4FF", fontFamily: "var(--font-inter)" }}
                >
                  Incluido en tu plan
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Resumen + formulario + CTA */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(0,102,255,0.06)",
            border: "1px solid rgba(0,102,255,0.18)",
          }}
        >
          {/* Total */}
          <div className="flex items-end justify-between mb-5">
            <div>
              <div
                className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-montserrat)" }}
              >
                Tu inversión
              </div>
              <div
                className="text-4xl font-extrabold tabular-nums"
                style={{
                  background: "linear-gradient(135deg, #FFFFFF 0%, #00D4FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "var(--font-montserrat)",
                }}
              >
                {formatPrice(oneTimeTotal, currency, copRate, currency === "COP")}
                <span
                  className="text-lg font-semibold ml-1"
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    WebkitTextFillColor: "rgba(255,255,255,0.35)",
                  }}
                >
                  {currencyLabel(currency)}
                </span>
              </div>
              {maintenance && (
                <div
                  className="text-sm mt-1"
                  style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}
                >
                  + {formatPrice(MAINTENANCE_PRICE, currency, copRate, currency === "COP")}/mes mantenimiento
                </div>
              )}
            </div>
            <div
              className="text-right text-xs"
              style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-inter)" }}
            >
              <div>Pago único</div>
              <div>sin comisiones</div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="mb-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          />

          {/* Contact form */}
          {!emailSent ? (
            <div className="space-y-3 mb-5">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-montserrat)" }}
              >
                Tus datos de contacto
              </p>

              {/* Nombre + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Nombre" required>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="cot-input"
                    style={inputBase}
                  />
                </FormField>
                <FormField label="Correo electrónico" required>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="cot-input"
                    style={inputBase}
                  />
                </FormField>
              </div>

              {/* Teléfono + Empresa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Teléfono / Celular">
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+57 300 000 0000"
                    className="cot-input"
                    style={inputBase}
                  />
                </FormField>
                <FormField label="Empresa">
                  <input
                    type="text"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    placeholder="Nombre de tu empresa"
                    className="cot-input"
                    style={inputBase}
                  />
                </FormField>
              </div>

              {/* Sector */}
              <FormField label="Sector / Actividad económica">
                <select
                  value={sector}
                  onChange={(e) => { setSector(e.target.value); setSectorOtro(""); }}
                  className="cot-select"
                  style={selectBase}
                >
                  <option value="" disabled>
                    Selecciona tu sector
                  </option>
                  {SECTORES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Otro sector */}
              {sector === "Otro" && (
                <FormField label="¿Cuál es tu actividad?">
                  <input
                    type="text"
                    value={sectorOtro}
                    onChange={(e) => setSectorOtro(e.target.value)}
                    placeholder="Describe tu actividad económica"
                    className="cot-input"
                    style={inputBase}
                  />
                </FormField>
              )}

              {/* Hint campos obligatorios */}
              <p
                className="text-[11px]"
                style={{ color: "rgba(255,255,255,0.22)", fontFamily: "var(--font-inter)" }}
              >
                Los campos marcados con{" "}
                <span style={{ color: "#00D4FF" }}>*</span> son obligatorios.
              </p>
            </div>
          ) : null}

          {/* Send button */}
          <motion.button
            onClick={handleEmail}
            disabled={!isFormValid || sendingEmail || emailSent}
            animate={
              isFormValid && !emailSent && !sendingEmail
                ? {
                    boxShadow: [
                      "0 0 0px rgba(0,102,255,0), 0 4px 16px rgba(0,0,0,0.25)",
                      "0 0 28px rgba(0,212,255,0.45), 0 4px 20px rgba(0,102,255,0.4)",
                      "0 0 0px rgba(0,102,255,0), 0 4px 16px rgba(0,0,0,0.25)",
                    ],
                  }
                : { boxShadow: "none" }
            }
            transition={
              isFormValid && !emailSent && !sendingEmail
                ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.2 }
            }
            whileHover={isFormValid && !emailSent ? { scale: 1.02 } : {}}
            whileTap={isFormValid && !emailSent ? { scale: 0.98 } : {}}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-extrabold text-sm transition-colors duration-300"
            style={{
              fontFamily: "var(--font-montserrat)",
              background: emailSent
                ? "rgba(0,200,100,0.12)"
                : isFormValid
                ? "linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)"
                : "rgba(255,255,255,0.06)",
              color: emailSent
                ? "#00C864"
                : isFormValid
                ? "#fff"
                : "rgba(255,255,255,0.22)",
              cursor: isFormValid && !emailSent && !sendingEmail ? "pointer" : "default",
              border: emailSent ? "1px solid rgba(0,200,100,0.28)" : "none",
            }}
          >
            {emailSent ? (
              <>
                <Check size={16} />
                ¡Cotización enviada! Revisa tu correo
              </>
            ) : sendingEmail ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Mail size={16} />
                Enviar cotización por correo
              </>
            )}
          </motion.button>

          {/* Error */}
          {emailError && (
            <p
              className="mt-3 text-xs text-center"
              style={{ color: "#ff6b6b", fontFamily: "var(--font-inter)" }}
            >
              {emailError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
