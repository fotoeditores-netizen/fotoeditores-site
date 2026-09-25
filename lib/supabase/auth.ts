import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getPublicEnv } from "@/lib/env/public";

/*
 * Cliente de Supabase con la SESIÓN del usuario (cookies), para el panel del
 * equipo (/admin). Usa la llave pública: los permisos los dan la sesión y RLS.
 * En componentes de servidor no se pueden escribir cookies: la renovación de la
 * sesión la hace proxy.ts en cada petición a /admin.
 */
export async function getAuthSupabase() {
  const env = getPublicEnv();
  const store = await cookies();
  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Llamado desde un componente de servidor: lo resuelve proxy.ts.
        }
      },
    },
  });
}
