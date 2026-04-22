import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: { canonical: `https://fotoeditores.com/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  return (
    <>
      {/* Article hero */}
      <section
        className="relative pt-28 pb-16 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A1628, #0D1E3A)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "linear-gradient(rgba(0,102,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-all hover:gap-3"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-montserrat)" }}
          >
            <ArrowLeft size={15} />
            Volver al Blog
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5"
              style={{
                background: "rgba(0,212,255,0.1)",
                color: "#00D4FF",
                border: "1px solid rgba(0,212,255,0.25)",
                fontFamily: "var(--font-montserrat)",
              }}
            >
              <Tag size={10} />
              {post.category}
            </span>
            <span
              className="text-xs flex items-center gap-1.5"
              style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}
            >
              <Clock size={12} />
              {post.readTime} de lectura
            </span>
            <span
              className="text-xs flex items-center gap-1.5"
              style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}
            >
              <Calendar size={12} />
              {new Date(post.date).toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {post.title}
          </h1>

          {/* Description */}
          <p
            className="text-base leading-relaxed mb-6"
            style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-inter)" }}
          >
            {post.description}
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 pb-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold text-white"
              style={{ background: "linear-gradient(135deg, #0066FF, #00D4FF)", fontFamily: "var(--font-montserrat)" }}
            >
              F
            </div>
            <div>
              <p
                className="text-sm font-semibold text-white"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {post.author}
              </p>
              <p
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}
              >
                Fotoeditores — Colombia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Article content */}
      <section className="py-16" style={{ background: "#0A1628" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-fotoeditores">
            <MDXRemote source={post.content} />
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 flex flex-wrap gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(0,102,255,0.08)",
                  border: "1px solid rgba(0,102,255,0.18)",
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA block */}
      <section
        className="py-16"
        style={{ background: "linear-gradient(135deg, rgba(0,102,255,0.08), rgba(0,212,255,0.04))" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-2xl p-10 text-center"
            style={{
              background: "rgba(10,22,40,0.7)",
              border: "1px solid rgba(0,212,255,0.2)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#00D4FF", fontFamily: "var(--font-montserrat)" }}
            >
              ¿Listo para aplicar esto en tu empresa?
            </p>
            <h3
              className="text-2xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Hablemos de tu caso específico
            </h3>
            <p
              className="text-sm mb-7"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
            >
              En 30 minutos, un experto de Fotoeditores analiza tu flujo de producción actual
              y te muestra con números cuánto podrías ahorrar.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                fontFamily: "var(--font-montserrat)",
                boxShadow: "0 4px 20px rgba(0,102,255,0.4)",
              }}
            >
              Agendar sesión gratuita →
            </Link>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 pb-24" style={{ background: "#0A1628" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3
              className="text-xl font-extrabold text-white mb-8"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              También te puede interesar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="rounded-xl p-6 transition-all hover:scale-[1.01]"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    display: "block",
                  }}
                >
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#00D4FF", fontFamily: "var(--font-montserrat)" }}
                  >
                    {related.category}
                  </span>
                  <h4
                    className="font-bold text-white mt-2 mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.95rem" }}
                  >
                    {related.title}
                  </h4>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}
                  >
                    {related.readTime} · {new Date(related.date).toLocaleDateString("es-CO", { month: "short", year: "numeric" })}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
