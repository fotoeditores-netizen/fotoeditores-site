import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // /pedido/* (seguimiento privado por token) y /admin no deben indexarse (Fases 3–5).
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/pedido/", "/admin"] },
    sitemap: "https://fotoeditores.com/sitemap.xml",
  };
}
