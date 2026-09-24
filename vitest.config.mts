import path from "node:path";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": import.meta.dirname,
      // "server-only" lanza un error fuera del bundler de Next; en pruebas es un módulo vacío.
      "server-only": path.resolve(import.meta.dirname, "tests/stubs/server-only.ts"),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    // Carga .env.local (llaves de Supabase) para las pruebas de integración.
    env: loadEnv("test", process.cwd(), ""),
    testTimeout: 20_000,
  },
});
