import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/lib/env/server";

let client: SupabaseClient | undefined;

/*
 * Cliente con la llave de servicio: ignora RLS. Solo para Route Handlers y
 * Server Actions que ya validaron quién hace la petición (public_token del
 * pedido o sesión del editor). "server-only" hace fallar el build si algún
 * componente de cliente lo importa.
 */
export function getAdminSupabase(): SupabaseClient {
  if (!client) {
    const env = getServerEnv();
    client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
