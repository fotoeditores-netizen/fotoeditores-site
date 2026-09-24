/*
 * Prueba de integración contra el proyecto de Supabase configurado en .env.local.
 *
 * Criterio de aceptación de la Fase 1: un usuario anónimo (llave pública) no
 * puede leer pedidos ni archivos. Para que la prueba demuestre algo, crea filas
 * reales con la llave de servicio, verifica que existen, intenta leerlas como
 * anónimo y al final las borra.
 *
 * Requiere que las migraciones de supabase/migrations estén aplicadas.
 */
import { createClient, type PostgrestSingleResponse, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const configured = Boolean(url && anonKey && serviceKey);

const TEST_TAG = `rls-test-${Date.now()}`;

// Sin filas visibles: o la consulta falla por permisos o vuelve vacía.
function expectNoRows(result: PostgrestSingleResponse<unknown[] | null>) {
  const rows = result.data ?? [];
  expect(result.error !== null || rows.length === 0, `se esperaban 0 filas, llegaron ${rows.length}`).toBe(true);
}

describe.skipIf(!configured)("RLS: acceso anónimo con la llave pública", () => {
  let admin: SupabaseClient;
  let anon: SupabaseClient;

  let orderId: string;
  let orderCode: string;
  let publicToken: string;
  let inactivePackageId: string;
  const storagePath = `${TEST_TAG}/prueba.jpg`;

  beforeAll(async () => {
    admin = createClient(url!, serviceKey!, { auth: { persistSession: false, autoRefreshToken: false } });
    anon = createClient(url!, anonKey!, { auth: { persistSession: false } });

    const pkg = await admin.from("packages").select("id, price_usd").eq("slug", "rescate-1-foto").single();
    if (pkg.error) {
      throw new Error(
        `No se encontró el paquete rescate-1-foto (${pkg.error.message}). ¿Están aplicadas las migraciones?`,
      );
    }

    const order = await admin
      .from("orders")
      .insert({ package_id: pkg.data.id, amount_usd: pkg.data.price_usd, customer_name: TEST_TAG })
      .select("id, code, public_token")
      .single();
    if (order.error) throw new Error(`No se pudo crear el pedido de prueba: ${order.error.message}`);
    ({ id: orderId, code: orderCode, public_token: publicToken } = order.data);

    const inserts = await Promise.all([
      admin.from("order_files").insert({
        order_id: orderId,
        kind: "original",
        storage_path: `originals/${storagePath}`,
        filename: "prueba.jpg",
        mime: "image/jpeg",
        size_bytes: 3,
      }),
      admin.from("payments").insert({
        order_id: orderId,
        attempt: 1,
        wompi_reference: `${orderCode}-1`,
        amount_usd: pkg.data.price_usd,
        fx_rate: 4000,
        amount_cents: Math.round(Number(pkg.data.price_usd) * 4000 * 100),
      }),
      admin.from("order_events").insert({ order_id: orderId, type: "test", actor: "system" }),
      admin.storage.from("originals").upload(storagePath, new Blob([new Uint8Array([1, 2, 3])], { type: "image/jpeg" }), {
        contentType: "image/jpeg",
      }),
    ]);
    for (const r of inserts) if (r.error) throw new Error(`Preparación fallida: ${r.error.message}`);

    const inactive = await admin
      .from("packages")
      .insert({
        slug: TEST_TAG,
        segment: "producto",
        name: TEST_TAG,
        price_usd: 1,
        max_files: 1,
        max_file_mb: 1,
        turnaround_hours: 1,
        active: false,
      })
      .select("id")
      .single();
    if (inactive.error) throw new Error(`No se pudo crear el paquete inactivo: ${inactive.error.message}`);
    inactivePackageId = inactive.data.id;
  });

  afterAll(async () => {
    if (!admin) return;
    await admin.storage.from("originals").remove([storagePath]);
    if (orderId) {
      await admin.from("payments").delete().eq("order_id", orderId); // on delete restrict
      await admin.from("orders").delete().eq("id", orderId); // borra en cascada archivos y bitácora
    }
    if (inactivePackageId) await admin.from("packages").delete().eq("id", inactivePackageId);
  });

  it("los datos de prueba existen (la llave de servicio sí los ve)", async () => {
    const { data, error } = await admin.from("orders").select("id").eq("id", orderId);
    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  it("la base genera el código FE-AAMM-NNNN y un token de 32 caracteres", () => {
    expect(orderCode).toMatch(/^FE-\d{4}-\d{4,}$/);
    expect(publicToken).toMatch(/^[A-Za-z0-9_-]{32}$/);
  });

  describe("pedidos", () => {
    it("no lista pedidos", async () => {
      expectNoRows(await anon.from("orders").select("*"));
    });

    it("no lee un pedido aunque conozca su id", async () => {
      expectNoRows(await anon.from("orders").select("*").eq("id", orderId));
    });

    it("no lee un pedido aunque conozca su public_token", async () => {
      expectNoRows(await anon.from("orders").select("*").eq("public_token", publicToken));
    });

    it("no crea pedidos", async () => {
      const pkg = await anon.from("packages").select("id").eq("slug", "rescate-1-foto").single();
      const { error } = await anon.from("orders").insert({ package_id: pkg.data?.id, amount_usd: 1 });
      expect(error).not.toBeNull();
    });

    it("no modifica pedidos", async () => {
      await anon.from("orders").update({ status: "paid" }).eq("id", orderId);
      const { data } = await admin.from("orders").select("status").eq("id", orderId).single();
      expect(data?.status).toBe("draft");
    });

    it("no gasta consecutivos de pedido por RPC", async () => {
      const { error } = await anon.rpc("next_order_code");
      expect(error).not.toBeNull();
    });
  });

  describe("archivos", () => {
    it("no lista order_files", async () => {
      expectNoRows(await anon.from("order_files").select("*"));
      expectNoRows(await anon.from("order_files").select("*").eq("order_id", orderId));
    });

    it("no descarga el archivo del bucket originals", async () => {
      const { data, error } = await anon.storage.from("originals").download(storagePath);
      expect(data).toBeNull();
      expect(error).not.toBeNull();
    });

    it("no lista el contenido del bucket originals", async () => {
      const { data } = await anon.storage.from("originals").list(TEST_TAG);
      expect(data ?? []).toHaveLength(0);
    });

    it("no sube archivos al bucket originals", async () => {
      const { error } = await anon.storage
        .from("originals")
        .upload(`${TEST_TAG}/intruso.jpg`, new Blob([new Uint8Array([1])], { type: "image/jpeg" }), { contentType: "image/jpeg" });
      expect(error).not.toBeNull();
    });
  });

  describe("otras tablas privadas", () => {
    it.each(["payments", "order_events", "profiles", "order_code_counters"])("no lee %s", async (table) => {
      expectNoRows(await anon.from(table).select("*"));
    });
  });

  describe("paquetes", () => {
    it("lee los paquetes activos", async () => {
      const { data, error } = await anon.from("packages").select("slug").eq("slug", "rescate-1-foto");
      expect(error).toBeNull();
      expect(data).toHaveLength(1);
    });

    it("no ve los paquetes inactivos", async () => {
      expectNoRows(await anon.from("packages").select("*").eq("id", inactivePackageId));
    });

    it("no modifica precios", async () => {
      await anon.from("packages").update({ price_usd: 0.01 }).eq("slug", "rescate-1-foto");
      const { data } = await admin.from("packages").select("price_usd").eq("slug", "rescate-1-foto").single();
      expect(Number(data?.price_usd)).not.toBe(0.01);
    });
  });
});
