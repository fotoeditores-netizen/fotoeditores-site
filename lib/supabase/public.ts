import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getPublicEnv } from "@/lib/env/public";

let client: SupabaseClient | undefined;

/*
 * Cliente con la llave pública (anon). Sirve en navegador y servidor, pero RLS
 * solo le deja leer los paquetes activos: pedidos, archivos y pagos se manejan
 * siempre desde el servidor con lib/supabase/admin.ts.
 */
export function getPublicSupabase(): SupabaseClient {
  if (!client) {
    const env = getPublicEnv();
    client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
  }
  return client;
}
