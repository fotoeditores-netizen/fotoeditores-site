"use client";

import { useState, useMemo } from "react";
import { Check, Plus, Minus, MessageCircle, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCotizador } from "@/context/CotizadorContext";

// Actualiza este número con el WhatsApp real de Fotoeditores
const WHATSAPP_NUMBER = "573000000000";
const CONTACT_EMAIL = "fotoeditores@gmail.com";

const BASE_PRICE = 99;
const MAINTENANCE_PRICE = 29;

interface Module {
  id: string;
  label: string;
  price: number;
  desc: string;
}

const aiModules: Module[] = [
  { id: "chatbot", label: "Chatbot IA", price: 49, desc: "Atención automatizada 24/7" },
  { id: "ai", label: "Integración IA", price: 99, desc: "Flujos inteligentes de datos" },
  { id: "gamification", label: "Gamificación", price: 89, desc: "Experiencias interactivas" },
  { id: "animations", label: "Animaciones Pro", price: 59, desc: "Motion design avanzado" },
];

const extraModules: Module[] = [
  { id: "ecommerce", label: "E-commerce", price: 149, desc: "Tienda online completa" },
  { id: "blog", label: "Blog", price: 79, desc: "Sistema de contenidos" },
  { id: "seo", label: "SEO Avanzado", price: 49, desc: "Posicionamiento técnico" },
];

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
}: {
  module: Module;
  selected: boolean;
  onToggle: () => void;
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
            {module.label}
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
          +${module.price}
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
}: {
  label: string;
  desc: string;
  pricePerUnit: number;
  value: number;
  onChange: (v: number) => void;
}) {
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
          {label}
        </div>
        <div
          className="text-xs mt-0.5"
          style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}
        >
          {desc}
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <span
          className="text-sm font-bold w-16 text-right tabular-nums"
          style={{
            color: value > 0 ? "#00D4FF" : "rgba(255,255,255,0.25)",
            fontFamily: "var(--font-montserrat)",
          }}
        >
          {value > 0 ? `$${value * pricePerUnit}` : `$${pricePerUnit}/u`}
        </span>
        <Stepper value={value} onChange={onChange} />
      </div>
    </div>
  );
}

export default function Cotizador() {
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
                  $99
                </span>
                <span
                  className="text-sm font-normal ml-1"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  USD
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "Homepage + hasta 5 landing pages",
                "Diseño 100% responsive",
                "Certificado SSL incluido",
                "Soporte inicial",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(0,212,255,0.15)" }}
                  >
                    <Check size={10} style={{ color: "#00D4FF" }} />
                  </div>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {item}
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
              desc="$15 por página extra"
              pricePerUnit={15}
              value={extraPages}
              onChange={setExtraPages}
            />
            <QuantityRow
              label="Formulario simple"
              desc="Contacto, suscripción — $10 c/u"
              pricePerUnit={10}
              value={simpleForms}
              onChange={setSimpleForms}
            />
            <QuantityRow
              label="Formulario avanzado"
              desc="Multi-paso, lógica condicional — $25 c/u"
              pricePerUnit={25}
              value={advancedForms}
              onChange={setAdvancedForms}
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
              />
            ))}
          </div>
        </div>

        {/* Multiidioma */}
        <div>
          <SectionLabel>Idiomas</SectionLabel>
          <QuantityRow
            label="Multiidioma"
            desc="$39 por idioma adicional"
            pricePerUnit={39}
            value={languages}
            onChange={setLanguages}
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
                  Mantenimiento mensual
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
                  $29<span className="text-xs font-normal">/mes</span>
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
                ${oneTimeTotal}
                <span
                  className="text-lg font-semibold ml-1"
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    WebkitTextFillColor: "rgba(255,255,255,0.35)",
                  }}
                >
                  USD
                </span>
              </div>
              {maintenance && (
                <div
                  className="text-sm mt-1"
                  style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}
                >
                  + ${MAINTENANCE_PRICE}/mes mantenimiento
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
