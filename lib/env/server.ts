import "server-only";
import { parseServerEnv, type ServerEnv } from "./schema";

let cached: ServerEnv | undefined;

// Solo servidor: incluye la llave de servicio de Supabase y los secretos de Wompi.
export function getServerEnv(): ServerEnv {
  cached ??= parseServerEnv(process.env);
  return cached;
}
