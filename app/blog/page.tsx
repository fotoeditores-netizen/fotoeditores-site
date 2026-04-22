import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Gestión IA para Contenidos | Fotoeditores",
  description:
    "Artículos, guías y casos de estudio sobre gestión IA para producción de contenido corporativo. Estrategias reales aplicadas en empresas colombianas.",
  alternates: { canonical: "https://fotoeditores.com/blog" },
  openGraph: {
    title: "Blog Fotoeditores — IA para Contenidos",
    description: "Guías y estrategias para usar IA en producción de contenido corporativo con resultados medibles.",
  },
};

const categoryColors: Record<string, string> = {
  "IA para Empresas": "#0066FF",
  "Herramientas IA": "#00D4FF",
  "Estrategia de Contenido": "#FFB800",
  "Casos de Éxito": "#00D4FF",
  "General": "#0066FF",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 pb-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A1628, #0D1E3A)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: "linear-gradient(rgba(0,102,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border mb-6"
            style={{ color: "#00D4FF", borderColor: "rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.06)", fontFamily: "var(--font-montserrat)" }}
          >
            Blog & Recursos
          </div>
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-white mb-5"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Estrategia IA para contenidos.
            <br />
            <span style={{ background: "linear-gradient(135deg, #0066FF, #00D4FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Sin rodeos.
            </span>
          </h1>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-inter)" }}
          >
            Artículos prácticos sobre cómo las empresas colombianas están usando IA para producir
            más contenido, a menor costo, con mayor impacto.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-16 pb-24" style={{ background: "#0A1628" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}>
                Los artículos están en camino. Vuelve pronto.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => {
                const color = categoryColors[post.category] || "#0066FF";
                return (
                  <article
                    key={post.slug}
                    className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:scale-[1.01] hover:shadow-2xl"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      border: `1px solid ${color}20`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  >
                    {/* Card header */}
                    <div
                      className="h-2"
                      style={{ background: `linear-gradient(90deg, ${color}, ${color}60)` }}
                    />

                    <div className="p-7 flex flex-col flex-1">
                      {/* Category + read time */}
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                          style={{
                            background: `${color}12`,
                            color: color,
                            border: `1px solid ${color}25`,
                            fontFamily: "var(--font-montserrat)",
                          }}
                        >
                          <Tag size={10} />
                          {post.category}
                        </span>
                        <span
                          className="text-xs flex items-center gap-1"
                          style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-inter)" }}
                        >
                          <Clock size={11} />
                          {post.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h2
                        className="font-extrabold text-white mb-3 leading-snug"
                        style={{ fontFamily: "var(--font-montserrat)", fontSize: "1.05rem" }}
                      >
                        {post.title}
                      </h2>

                      {/* Description */}
                      <p
                        className="text-sm leading-relaxed mb-4 flex-1"
                        style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)" }}
                      >
                        {post.description}
                      </p>

                      {/* Meta + CTA */}
                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <p
                            className="text-xs font-semibold text-white"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                          >
                            {post.author}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-inter)" }}
                          >
                            {new Date(post.date).toLocaleDateString("es-CO", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-2.5"
                          style={{ color: color, fontFamily: "var(--font-montserrat)" }}
                        >
                          Leer
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Tags cloud */}
          <div className="mt-16 pt-12" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p
              className="text-xs uppercase tracking-widest mb-5"
              style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-montserrat)" }}
            >
              Temas frecuentes
            </p>
            <div className="flex flex-wrap gap-2">
              {["IA para empresas", "Midjourney", "Runway", "ElevenLabs", "fotografía con IA", "video IA", "reducción de costos", "ROI contenido", "Colombia", "marketing digital"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-xs"
                  style={{
                    background: "rgba(0,102,255,0.06)",
                    border: "1px solid rgba(0,102,255,0.15)",
                    color: "rgba(255,255,255,0.4)",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
