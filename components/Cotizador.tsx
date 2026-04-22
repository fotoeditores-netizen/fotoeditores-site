"use client";

import { useState } from "react";

interface Addon {
  id: string;
  label: string;
  description: string;
  price: number;
  unit?: string;
}

const addons: Addon[] = [
  {
    id: "landing",
    label: "Landing pages adicionales",
    description: "Páginas adicionales para campañas o servicios",
    price: 15,
    unit: "por página",
  },
  {
    id: "forms",
    label: "Formularios y automatización",
    description: "Formularios de contacto, cotización y flujos automáticos",
    price: 25,
  },
  {
    id: "chatbot",
    label: "Chatbot con IA",
    description: "Asistente virtual entrenado con tu negocio",
    price: 49,
  },
  {
    id: "ecommerce",
    label: "E-commerce / Tienda online",
    description: "Catálogo de productos, carrito y pagos integrados",
    price: 149,
  },
  {
    id: "blog",
    label: "Blog integrado",
    description: "Sistema de contenidos para artículos y noticias",
    price: 79,
  },
  {
    id: "seo",
    label: "SEO avanzado",
    description: "Optimización técnica completa para buscadores",
    price: 49,
  },
  {
    id: "multilingual",
    label: "Sitio multilingüe",
    description: "Versión del sitio en múltiples idiomas",
    price: 39,
    unit: "por idioma",
  },
];

const BASE_PRICE = 99;
const MAINTENANCE_PRICE = 29;

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div
      className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all duration-200"
      style={{
        background: checked ? "#0066FF" : "transparent",
        borderColor: checked ? "#0066FF" : "#D1D5DB",
      }}
    >
      {checked && (
        <svg
          className="w-3 h-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
}

export default function Cotizador() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [landingCount, setLandingCount] = useState(1);
  const [langCount, setLangCount] = useState(1);
  const [maintenance, setMaintenance] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const total =
    BASE_PRICE +
    (selected.has("landing") ? 15 * landingCount : 0) +
    (selected.has("forms") ? 25 : 0) +
    (selected.has("chatbot") ? 49 : 0) +
    (selected.has("ecommerce") ? 149 : 0) +
    (selected.has("blog") ? 79 : 0) +
    (selected.has("seo") ? 49 : 0) +
    (selected.has("multilingual") ? 39 * langCount : 0);

  const lineItems: { label: string; price: string }[] = [
    { label: "Paquete Base", price: "$99" },
    ...(selected.has("landing")
      ? [{ label: `Landing pages (×${landingCount})`, price: `+$${15 * landingCount}` }]
      : []),
    ...(selected.has("forms") ? [{ label: "Formularios", price: "+$25" }] : []),
    ...(selected.has("chatbot") ? [{ label: "Chatbot IA", price: "+$49" }] : []),
    ...(selected.has("ecommerce") ? [{ label: "E-commerce", price: "+$149" }] : []),
    ...(selected.has("blog") ? [{ label: "Blog", price: "+$79" }] : []),
    ...(selected.has("seo") ? [{ label: "SEO avanzado", price: "+$49" }] : []),
    ...(selected.has("multilingual")
      ? [{ label: `Multilingüe (×${langCount})`, price: `+$${39 * langCount}` }]
      : []),
    ...(maintenance ? [{ label: "Mantenimiento mensual", price: "+$29/mes" }] : []),
  ];

  return (
    <section id="cotizador" className="py-24" style={{ background: "#F8FAFC" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-5"
            style={{
              background: "rgba(0,102,255,0.06)",
              borderColor: "rgba(0,102,255,0.2)",
              color: "#0066FF",
            }}
          >
            Precio en tiempo real
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Cotizador en Vivo
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Selecciona los módulos que necesitas y ve el precio total al instante.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Options — 3 cols */}
          <div className="lg:col-span-3 space-y-3">
            {/* Base package */}
            <div
              className="bg-white rounded-2xl p-5 border-2 shadow-sm"
              style={{ borderColor: "#0066FF" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-900 text-base">Paquete Base</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Homepage + 5 secciones · Diseño responsive · SSL incluido
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-2xl font-extrabold" style={{ color: "#0066FF" }}>
                    $99
                  </span>
                  <span className="text-xs text-gray-400 block">USD</span>
                </div>
              </div>
            </div>

            {/* Add-ons */}
            {addons.map((addon) => (
              <div key={addon.id}>
                <div
                  className="bg-white rounded-2xl p-5 border-2 cursor-pointer transition-all duration-200 hover:shadow-md"
                  style={{
                    borderColor: selected.has(addon.id)
                      ? "#0066FF"
                      : "#F1F5F9",
                  }}
                  onClick={() => toggle(addon.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Checkbox checked={selected.has(addon.id)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm">{addon.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{addon.description}</p>
                      {addon.unit && (
                        <p className="text-xs text-blue-400 mt-0.5">{addon.unit}</p>
                      )}
                    </div>
                    <span className="font-bold text-sm flex-shrink-0" style={{ color: "#0066FF" }}>
                      +${addon.price}
                    </span>
                  </div>

                  {/* Landing page counter */}
                  {addon.id === "landing" && selected.has("landing") && (
                    <div
                      className="mt-3 pl-8 flex items-center gap-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg leading-none"
                        onClick={() => setLandingCount(Math.max(1, landingCount - 1))}
                      >
                        −
                      </button>
                      <span className="font-bold text-gray-800 w-4 text-center">
                        {landingCount}
                      </span>
                      <button
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg leading-none"
                        onClick={() => setLandingCount(landingCount + 1)}
                      >
                        +
                      </button>
                      <span className="text-sm text-gray-500">= ${15 * landingCount} USD</span>
                    </div>
                  )}

                  {/* Multilingual counter */}
                  {addon.id === "multilingual" && selected.has("multilingual") && (
                    <div
                      className="mt-3 pl-8 flex items-center gap-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg leading-none"
                        onClick={() => setLangCount(Math.max(1, langCount - 1))}
                      >
                        −
                      </button>
                      <span className="font-bold text-gray-800 w-4 text-center">{langCount}</span>
                      <button
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg leading-none"
                        onClick={() => setLangCount(langCount + 1)}
                      >
                        +
                      </button>
                      <span className="text-sm text-gray-500">= ${39 * langCount} USD</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Maintenance */}
            <div
              className="bg-white rounded-2xl p-5 border-2 cursor-pointer transition-all duration-200 hover:shadow-md"
              style={{ borderColor: maintenance ? "#0066FF" : "#F1F5F9" }}
              onClick={() => setMaintenance(!maintenance)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Checkbox checked={maintenance} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">Mantenimiento mensual</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Actualizaciones, backups automáticos y soporte técnico
                  </p>
                </div>
                <span className="font-bold text-sm flex-shrink-0" style={{ color: "#0066FF" }}>
                  +${MAINTENANCE_PRICE}/mes
                </span>
              </div>
            </div>
          </div>

          {/* Summary — 2 cols */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg sticky top-24">
              <h3 className="font-bold text-gray-900 text-lg mb-5">Tu resumen</h3>

              <div className="space-y-2.5 mb-6">
                {lineItems.map((item) => (
                  <div key={item.label} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-semibold text-gray-800">{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-5 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-base">Total</span>
                  <div className="text-right">
                    <span
                      className="text-3xl font-extrabold"
                      style={{ color: "#0066FF" }}
                    >
                      ${total}
                    </span>
                    <span className="text-sm text-gray-400 ml-1">USD</span>
                  </div>
                </div>
                {maintenance && (
                  <p className="text-xs text-gray-400 text-right mt-1">
                    + ${MAINTENANCE_PRICE}/mes mantenimiento
                  </p>
                )}
              </div>

              <a
                href="mailto:fotoeditores@gmail.com"
                className="block w-full py-4 rounded-xl text-center font-bold text-white text-base transition-all duration-200 hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)",
                  boxShadow: "0 4px 20px rgba(0,102,255,0.35)",
                }}
              >
                Solicitar cotización
              </a>
              <p className="text-center text-xs text-gray-400 mt-3">
                Sin compromiso · Respuesta en menos de 2 horas
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
