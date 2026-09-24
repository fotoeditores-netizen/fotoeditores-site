import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const SITE = "https://fotoeditores.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/fotos-de-producto-con-ia", priority: 0.9 },
    { path: "/recupera-tus-fotos", priority: 0.9 },
    { path: "/ejemplos", priority: 0.8 },
    { path: "/tecnologia", priority: 0.7 },
    { path: "/nuestro-adn", priority: 0.6 },
    { path: "/contacto", priority: 0.6 },
    { path: "/blog", priority: 0.6 },
  ];

  return [
    ...pages.map(({ path, priority }) => ({ url: `${SITE}${path}`, priority })),
    ...getAllPosts().map((post) => ({
      url: `${SITE}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : undefined,
      priority: 0.5,
    })),
  ];
}
