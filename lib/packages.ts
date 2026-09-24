import { getPublicSupabase } from "@/lib/supabase/public";
import type { Segment } from "@/lib/ejemplos";

export type Package = {
  id: string;
  slug: string;
  segment: Segment | "ambos";
  name: string;
  description: string;
  price_usd: number | null;
  max_files: number;
  accepts_video: boolean;
  turnaround_hours: number;
  revisions_included: number;
  sort_order: number;
};

const COLUMNS =
  "id, slug, segment, name, description, price_usd, max_files, accepts_video, turnaround_hours, revisions_included, sort_order";

/*
 * Paquetes activos (RLS solo deja ver active = true con la llave pública).
 * Si Supabase no responde se lanza el error: la página falla en el build o
 * conserva la última versión generada (ISR) en vez de mostrarse sin precios.
 */
export async function getActivePackages(): Promise<Package[]> {
  const { data, error } = await getPublicSupabase().from("packages").select(COLUMNS).order("sort_order");
  if (error) throw new Error(`No se pudieron leer los paquetes: ${error.message}`);
  return (data ?? []).map((p) => ({ ...p, price_usd: p.price_usd == null ? null : Number(p.price_usd) }));
}

export function packagesForSegment(packages: Package[], segment: Segment): Package[] {
  return packages.filter((p) => p.segment === segment || p.segment === "ambos");
}

export function turnaroundLabel(hours: number): string {
  if (hours < 48) return `${hours} horas`;
  const days = Math.round(hours / 24);
  return `${days} días`;
}
