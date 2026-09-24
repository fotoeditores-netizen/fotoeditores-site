import { ArrowDown, Sparkles, UserCheck, Wand2, XCircle } from "lucide-react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import MediaBox from "@/components/MediaBox";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { ButtonLink } from "@/components/ui/Button";
import FaqList from "@/components/landing/FaqList";
import PackageCards from "@/components/landing/PackageCards";
import SectionHeading from "@/components/landing/SectionHeading";
import { sideBySideCases, sliderCases } from "@/lib/ejemplos";
import { faqs, howItWorks, whyAiAlone, type LandingContent } from "@/lib/landings";
import type { Package } from "@/lib/packages";
import { whatsappLink } from "@/lib/whatsapp";

/*
 * Estructura de docs/FUNNEL_PLAN.md (Fase 2): hero → problema → solución →
 * prueba → cómo funciona → paquetes → FAQ → cierre.
 * Componente de servidor: solo el divisor y los videos cargan JS en el navegador.
 */

const gridBg = {
  backgroundImage:
    "linear-gradient(rgba(0,102,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.04) 1px, transparent 1px)",
  backgroundSize: "50px 50px",
};

export default function LandingPage({ content, packages }: { content: LandingContent; packages: Package[] }) {
  const heroCase = sliderCases.find((c) => c.id === content.hero.caseId)!;
  const sliders = sliderCases.filter((c) => c.segment === content.segment && c.id !== heroCase.id);
  const videos = sideBySideCases.filter((c) => c.segment === content.segment);

  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A1628 0%, #0D1E3A 50%, #0A1628 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={gridBg} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs sm:text-sm font-semibold mb-6"
                style={{
                  background: "rgba(255,184,0,0.08)",
                  borderColor: "rgba(255,184,0,0.3)",
                  color: "#FFB800",
                  fontFamily: "var(--font-montserrat)",
                }}
              >
                <Sparkles size={14} />
                {content.hero.badge}
              </div>

              <p
                className="text-lg sm:text-xl italic font-semibold mb-3"
                style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-montserrat)" }}
              >
                &ldquo;La IA es fácil y gratis… hasta que intentas usarla.&rdquo;
              </p>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6 text-balance"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  background: "linear-gradient(135deg, #FFFFFF 0%, #00D4FF 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {content.hero.title}
              </h1>
              <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl" style={{ color: "rgba(255,255,255,0.65)" }}>
                {content.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <ButtonLink href="#paquetes" size="lg">
                  Empieza tu pedido
                  <ArrowDown size={18} />
                </ButtonLink>
                <ButtonLink href={whatsappLink(content.whatsappMessage)} size="lg" variant="secondary">
                  <WhatsAppIcon size={18} />
                  Hablar con un editor
                </ButtonLink>
              </div>
            </div>

            {/* Prueba inmediata */}
            <div className="max-w-sm w-full mx-auto lg:max-w-none">
              <BeforeAfterSlider
                beforeSrc={heroCase.beforeSrc}
                afterSrc={heroCase.afterSrc}
                alt={heroCase.category}
                priority
                sizes="(max-width: 1024px) 384px, 460px"
              />
              <p className="text-center text-xs mt-3" style={{ color: "rgba(255,255,255,0.35)" }}>
                Arrastra el divisor · resultado real de nuestro equipo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. El problema ──────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#0A1628" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="El problema" color="#FF4D6D" title={content.pains.title} />

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
            {content.pains.items.map((pain) => (
              <li
                key={pain}
                className="flex items-start gap-3 rounded-xl p-5"
                style={{ background: "rgba(255,77,109,0.04)", border: "1px solid rgba(255,77,109,0.12)" }}
              >
                <XCircle size={20} className="shrink-0 mt-0.5" style={{ color: "#FF4D6D" }} />
                <span style={{ color: "rgba(255,255,255,0.75)" }}>{pain}</span>
              </li>
            ))}
          </ul>

          <h3
            className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-8 text-balance"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {whyAiAlone.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {whyAiAlone.reasons.map((r, i) => (
              <div
                key={r.title}
                className="rounded-xl p-6"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="text-sm font-bold" style={{ color: "#FFB800", fontFamily: "var(--font-jetbrains)" }}>
                  0{i + 1}
                </span>
                <h4 className="font-bold text-white mt-2 mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
                  {r.title}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. La solución ──────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden" style={{ background: "#050D1A" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading
            badge="La solución"
            title={
              <>
                Editores <span className="gradient-text">totalmente humanos</span>, potenciados con IA
              </>
            }
            subtitle={whyAiAlone.difference}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
            {[
              { icon: UserCheck, title: "20 años de oficio", text: "Editores y productores de foto y video con criterio de imagen." },
              { icon: Wand2, title: "Las mejores herramientas", text: "Photoshop IA, Magnific, Runway, Topaz y más, bien usadas." },
              { icon: Sparkles, title: "Un editor de verdad", text: "Hablas con él por WhatsApp durante todo el proceso, no con un bot." },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-xl p-6"
                style={{ background: "rgba(0,102,255,0.06)", border: "1px solid rgba(0,102,255,0.2)" }}
              >
                <Icon size={22} style={{ color: "#00D4FF" }} />
                <h3 className="font-bold text-white mt-3 mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Prueba ───────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#0A1628" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Ver para creer"
            color="#FFB800"
            title="Resultados reales de nuestro equipo"
            subtitle="Arrastra el divisor en las fotos o reproduce los videos."
          />

          {sliders.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
              {sliders.map((item) => (
                <BeforeAfterSlider
                  key={item.id}
                  beforeSrc={item.beforeSrc}
                  afterSrc={item.afterSrc}
                  alt={item.category}
                  sizes="(max-width: 640px) 50vw, 240px"
                />
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${item.color}25` }}
              >
                <p className="text-sm font-semibold text-white mb-3" style={{ fontFamily: "var(--font-montserrat)" }}>
                  {item.title}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <MediaBox media={item.before} label={`${item.title} — antes`} isAfter={false} />
                  <MediaBox media={item.after} label={`${item.title} — después`} isAfter />
                </div>
              </div>
            ))}
          </div>

          <p className="text-center mt-10">
            <ButtonLink href="/ejemplos" variant="secondary">
              Ver todos los ejemplos
            </ButtonLink>
          </p>
        </div>
      </section>

      {/* ── 5. Cómo funciona ────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#050D1A" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Así de simple" title="Cómo funciona" />
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {howItWorks.map((step, i) => (
              <li
                key={step.title}
                className="rounded-xl p-6"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span
                  className="inline-flex w-10 h-10 items-center justify-center rounded-full text-lg font-extrabold text-white mb-4 bg-gradient-energy"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {i + 1}
                </span>
                <h3 className="font-bold text-white mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 6. Paquetes y precios ───────────────────────────────── */}
      <section id="paquetes" className="py-20 scroll-mt-24" style={{ background: "#0A1628" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Paquetes"
            title="Elige tu paquete"
            subtitle="Precios en dólares (USD), pago único. Si no ves lo que necesitas, te cotizamos a la medida."
          />
          <PackageCards packages={packages} />
        </div>
      </section>

      {/* ── 7. Preguntas frecuentes ─────────────────────────────── */}
      <section className="py-20" style={{ background: "#050D1A" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Preguntas frecuentes" title="Lo que todos nos preguntan" />
          <FaqList items={faqs} />
        </div>
      </section>

      {/* ── 8. Cierre ───────────────────────────────────────────── */}
      <section
        className="py-20 pb-28 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A1628, #0D1E3A)" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={gridBg} />
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-white mb-4 text-balance"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {content.promise}
          </h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
            Solo envíanos tus archivos y dinos qué necesitas. Nosotros hacemos el resto.
          </p>
          <ButtonLink href="#paquetes" size="lg">
            Empieza tu pedido
            <ArrowDown size={18} />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
