"use client";

import { useState, useMemo, type ReactNode } from "react";
import { Check, Plus, Minus, MessageCircle, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCotizador } from "@/context/CotizadorContext";
import type { Currency } from "@/components/CotizadorModal";

const WHATSAPP_NUMBER = "573000000000";
const CONTACT_EMAIL = "fotoeditores@gmail.com";

const BASE_PRICE = 99;
const MAINTENANCE_PRICE = 29;
const COP_RATE = 4200;

function formatPrice(usd: number, currency: Currency, compact = false): string {
  if (currency === "USD") return `$${usd}`;
  const cop = usd * COP_RATE;
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
}: {
  module: Module;
  selected: boolean;
  onToggle: () => void;
  currency: Currency;
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
          +{formatPrice(module.price, currency, currency === "COP")}
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
}: {
  label: string;
  desc: string;
  pricePerUnit: number;
  value: number;
  onChange: (v: number) => void;
  tooltip?: string;
  currency: Currency;
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
            {formatPrice(displayPrice, currency, currency === "COP")}
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

export default function Cotizador({ currency = "USD" }: { currency?: Currency }) {
  const { close } = useCotizador();
  const [extraPages, setExtraPages] = useState(0);
  const [simpleForms, setSimpleForms] = useState(0);
  const [advancedForms, setAdvancedForms] = useState(0);
  const [languages, setLanguages] = useState(0);
  const [selectedAI, setSelectedAI] = useState<Set<string>>(new Set());
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [maintenance, setMaintenance] = useState(false);

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

  const handleWhatsApp = () => {
    const lines = buildSummaryLines();
    const msg = [
      "*Mi cotización en Fotoeditores:*",
      "",
      ...lines,
      "",
      `*TOTAL: $${oneTimeTotal} USD*${maintenance ? ` + $${MAINTENANCE_PRICE}/mes` : ""}`,
      "",
      "¡Quiero una cotización formal! 🚀",
    ].join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleEmail = () => {
    const lines = buildSummaryLines();
    const body = [
      "Hola Fotoeditores,",
      "",
      "Me interesa el siguiente proyecto:",
      "",
      ...lines,
      "",
      `TOTAL: $${oneTimeTotal} USD${maintenance ? ` + $${MAINTENANCE_PRICE}/mes de mantenimiento` : ""}`,
      "",
      "Quisiera recibir una cotización formal.",
      "",
      "Gracias.",
    ].join("\n");
    window.open(
      `mailto:${CONTACT_EMAIL}?subject=Cotización%20Fotoeditores%20-%20$${oneTimeTotal}%20USD&body=${encodeURIComponent(body)}`,
      "_blank"
    );
  };

  return (
    <div className="max-w-2xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
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
                  {formatPrice(BASE_PRICE, currency, currency === "COP")}
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
              desc={`${formatPrice(15, currency, currency === "COP")} por página extra`}
              pricePerUnit={15}
              value={extraPages}
              onChange={setExtraPages}
              currency={currency}
              tooltip="Si tu proyecto necesita más secciones además de las iniciales (por ejemplo: 'Nuestra historia', 'Galería de trabajos' o 'Términos y condiciones'), puedes sumar el espacio exacto que te haga falta."
            />
            <QuantityRow
              label="Formulario simple"
              desc={`Contacto, suscripción — ${formatPrice(10, currency, currency === "COP")} c/u`}
              pricePerUnit={10}
              value={simpleForms}
              onChange={setSimpleForms}
              currency={currency}
              tooltip="Un espacio básico, rápido y directo donde tus clientes interesados pueden dejar su nombre, correo y un mensaje breve para que tú puedas contactarlos rápidamente."
            />
            <QuantityRow
              label="Formulario avanzado"
              desc={`Multi-paso, lógica condicional — ${formatPrice(25, currency, currency === "COP")} c/u`}
              pricePerUnit={25}
              value={advancedForms}
              onChange={setAdvancedForms}
              currency={currency}
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
              />
            ))}
          </div>
        </div>

        {/* Multiidioma */}
        <div>
          <SectionLabel>Idiomas</SectionLabel>
          <QuantityRow
            label="Multiidioma"
            desc={`${formatPrice(39, currency, currency === "COP")} por idioma adicional`}
            pricePerUnit={39}
            value={languages}
            onChange={setLanguages}
            currency={currency}
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
                  {formatPrice(MAINTENANCE_PRICE, currency, currency === "COP")}<span className="text-xs font-normal">/mes</span>
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

        {/* Resumen y CTAs */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(0,102,255,0.06)",
            border: "1px solid rgba(0,102,255,0.18)",
          }}
        >
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
                {formatPrice(oneTimeTotal, currency, currency === "COP")}
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
                  + {formatPrice(MAINTENANCE_PRICE, currency, currency === "COP")}/mes mantenimiento
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

          {/* Share buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "rgba(37,211,102,0.08)",
                border: "1px solid rgba(37,211,102,0.25)",
                color: "#25D366",
                fontFamily: "var(--font-montserrat)",
              }}
            >
              <MessageCircle size={15} />
              Compartir por WhatsApp
            </button>
            <button
              onClick={handleEmail}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.65)",
                fontFamily: "var(--font-montserrat)",
              }}
            >
              <Mail size={15} />
              Enviar por correo
            </button>
          </div>

          {/* Main CTA */}
          <Link
            href="/contacto"
            onClick={close}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-extrabold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)",
              fontFamily: "var(--font-montserrat)",
              boxShadow: "0 0 36px rgba(0,102,255,0.4), 0 4px 16px rgba(0,0,0,0.3)",
              fontSize: "0.95rem",
            }}
          >
            Solicitar cotización formal
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
