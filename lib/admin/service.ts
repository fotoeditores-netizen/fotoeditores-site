import type { SupabaseClient } from "@supabase/supabase-js";
import type { Staff } from "@/lib/admin/auth";
import { OrderError } from "@/lib/orders/service";
import { checkDeliveryUpload, displayFileName } from "@/lib/orders/files";

/*
 * Panel del editor (Fase 5). Todas las funciones reciben el cliente con llave
 * de servicio: quien las llama (páginas y rutas /admin) ya verificó el rol.
 */

export const DELIVERIES_BUCKET = "deliveries";
export const ORIGINALS_BUCKET = "originals";

export const STATUS_LABEL: Record<string, string> = {
  draft: "Borrador",
  awaiting_payment: "Pendiente de pago",
  payment_failed: "Pago fallido",
  paid: "Pagado",
  in_progress: "En edición",
  delivered: "Entregado",
  revision_requested: "Ajuste solicitado",
  closed: "Cerrado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
  expired: "Vencido",
};

/*
 * Cambios de estado que puede hacer el equipo. "delivered" solo con la acción
 * Entregar (exige archivos). Marcar "paid" a mano sirve mientras el pago se
 * coordina por WhatsApp; queda en la bitácora con el nombre del editor.
 */
const TRANSITIONS: Record<string, string[]> = {
  awaiting_payment: ["paid", "cancelled"],
  payment_failed: ["paid", "cancelled"],
  paid: ["in_progress", "cancelled", "refunded"],
  in_progress: ["cancelled", "refunded"],
  revision_requested: ["in_progress"],
  delivered: ["in_progress", "closed", "refunded"],
  closed: ["refunded"],
};
const ADMIN_ONLY = new Set(["refunded", "cancelled"]);

export function allowedTransitions(status: string, role: Staff["role"]): string[] {
  return (TRANSITIONS[status] ?? []).filter((to) => role === "admin" || !ADMIN_ONLY.has(to));
}

type OrderRow = {
  id: string;
  code: string;
  status: string;
  amount_usd: number;
  customer_name: string | null;
  customer_email: string | null;
  customer_whatsapp: string | null;
  created_at: string;
  paid_at: string | null;
  delivered_at: string | null;
  revisions_used: number;
  package: { name: string; turnaround_hours: number; revisions_included: number; segment: string } | null;
};

export type InboxOrder = OrderRow & { due_at: string | null; due_state: "late" | "soon" | "ok" | null; files: number };

const ACTIVE = ["paid", "in_progress", "revision_requested"];

// Fecha estimada de entrega: pago + horas del paquete.
export function dueDate(paidAt: string | null, turnaroundHours: number | undefined): Date | null {
  if (!paidAt || !turnaroundHours) return null;
  return new Date(new Date(paidAt).getTime() + turnaroundHours * 3_600_000);
}

function dueState(status: string, due: Date | null, now = Date.now()): InboxOrder["due_state"] {
  if (!due || !ACTIVE.includes(status)) return null;
  const hoursLeft = (due.getTime() - now) / 3_600_000;
  if (hoursLeft < 0) return "late";
  if (hoursLeft < 24) return "soon";
  return "ok";
}

// ── Bandeja ──────────────────────────────────────────────────────────────────

export async function listOrders(
  sb: SupabaseClient,
  filter: { status?: string; q?: string } = {},
): Promise<InboxOrder[]> {
  let query = sb
    .from("orders")
    .select(
      "id, code, status, amount_usd, customer_name, customer_email, customer_whatsapp, created_at, paid_at, delivered_at, revisions_used, package:packages(name, turnaround_hours, revisions_included, segment), order_files(count)",
    )
    .not("status", "in", "(draft,expired)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (filter.status === "activos") query = query.in("status", ACTIVE);
  else if (filter.status && STATUS_LABEL[filter.status]) query = query.eq("status", filter.status);
  if (filter.q) {
    const q = filter.q.replace(/[%,()]/g, " ").trim().slice(0, 80);
    if (q) query = query.or(`code.ilike.%${q}%,customer_name.ilike.%${q}%,customer_email.ilike.%${q}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(`orders.list: ${error.message}`);
  return (data ?? []).map((row) => {
    const r = row as unknown as OrderRow & { order_files: { count: number }[] };
    const due = dueDate(r.paid_at, r.package?.turnaround_hours);
    return {
      ...r,
      amount_usd: Number(r.amount_usd),
      due_at: due?.toISOString() ?? null,
      due_state: dueState(r.status, due),
      files: r.order_files?.[0]?.count ?? 0,
    };
  });
}

// ── Detalle ──────────────────────────────────────────────────────────────────

export type AdminFile = { id: string; kind: "original" | "delivery"; filename: string; mime: string; size_bytes: number; created_at: string };
export type AdminEvent = { id: number; type: string; actor: string; actor_name: string | null; payload: Record<string, unknown>; created_at: string };

export async function getOrderDetail(sb: SupabaseClient, id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  const { data, error } = await sb
    .from("orders")
    .select(
      `id, code, public_token, status, amount_usd, customer_name, customer_email, customer_whatsapp, brief, utm,
       created_at, paid_at, delivered_at, revisions_used, consent_at,
       package:packages(name, slug, turnaround_hours, revisions_included, segment),
       files:order_files(id, kind, filename, mime, size_bytes, created_at),
       payments(wompi_reference, status, amount_cents, fx_rate, fx_source, payment_method, created_at),
       events:order_events(id, type, actor, actor_id, payload, created_at)`,
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`orders.detail: ${error.message}`);
  if (!data) return null;

  const events = ((data.events ?? []) as (Omit<AdminEvent, "actor_name"> & { actor_id: string | null })[]).sort((a, b) => a.id - b.id);
  const actorIds = [...new Set(events.map((e) => e.actor_id).filter(Boolean))] as string[];
  const names = new Map<string, string>();
  if (actorIds.length) {
    const { data: profiles } = await sb.from("profiles").select("id, name").in("id", actorIds);
    for (const p of profiles ?? []) names.set(p.id, p.name);
  }
  const pkg = data.package as unknown as OrderRow["package"] & { slug: string };
  const files = ((data.files ?? []) as AdminFile[]).sort((a, b) => a.created_at.localeCompare(b.created_at));

  return {
    ...data,
    amount_usd: Number(data.amount_usd),
    package: pkg,
    due_at: dueDate(data.paid_at, pkg?.turnaround_hours)?.toISOString() ?? null,
    originals: files.filter((f) => f.kind === "original"),
    deliveries: files.filter((f) => f.kind === "delivery"),
    events: events.map(({ actor_id, ...e }) => ({ ...e, actor_name: actor_id ? (names.get(actor_id) ?? null) : null })),
  };
}

export type OrderDetail = NonNullable<Awaited<ReturnType<typeof getOrderDetail>>>;

async function logStaffEvent(sb: SupabaseClient, orderId: string, staff: Staff, type: string, payload: Record<string, unknown> = {}) {
  const { error } = await sb.from("order_events").insert({ order_id: orderId, type, actor: "editor", actor_id: staff.id, payload });
  if (error) console.error("order_events:", error.message);
}

async function requireOrder(sb: SupabaseClient, id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) throw new OrderError("Pedido no encontrado.", 404);
  const { data } = await sb.from("orders").select("id, status, code").eq("id", id).maybeSingle();
  if (!data) throw new OrderError("Pedido no encontrado.", 404);
  return data as { id: string; status: string; code: string };
}

// ── Acciones ─────────────────────────────────────────────────────────────────

export async function changeStatus(sb: SupabaseClient, orderId: string, to: string, staff: Staff) {
  const order = await requireOrder(sb, orderId);
  if (!allowedTransitions(order.status, staff.role).includes(to)) {
    throw new OrderError(`No se puede pasar de "${STATUS_LABEL[order.status] ?? order.status}" a "${STATUS_LABEL[to] ?? to}".`, 409);
  }
  const patch: Record<string, unknown> = { status: to };
  if (to === "paid") patch.paid_at = new Date().toISOString();
  const { data, error } = await sb.from("orders").update(patch).eq("id", orderId).eq("status", order.status).select("id");
  if (error) throw new Error(`orders.update: ${error.message}`);
  if (!data?.length) throw new OrderError("El pedido cambió mientras tanto. Recarga la página.", 409);
  await logStaffEvent(sb, orderId, staff, to === "paid" ? "paid" : "status_changed", {
    from: order.status,
    to,
    ...(to === "paid" ? { source: "manual" } : {}),
  });
}

export async function addNote(sb: SupabaseClient, orderId: string, staff: Staff, text: string) {
  await requireOrder(sb, orderId);
  const note = text.trim().slice(0, 2000);
  if (!note) throw new OrderError("La nota está vacía.", 422);
  await logStaffEvent(sb, orderId, staff, "note", { text: note });
}

// URL firmada de corta duración para descargar un archivo (original o entrega).
export async function signedDownloadUrl(sb: SupabaseClient, orderId: string, fileId: string, expiresIn = 300) {
  if (!/^[0-9a-f-]{36}$/.test(fileId)) throw new OrderError("Archivo no encontrado.", 404);
  const { data: file } = await sb
    .from("order_files")
    .select("kind, storage_path, filename")
    .eq("id", fileId)
    .eq("order_id", orderId)
    .maybeSingle();
  if (!file) throw new OrderError("Archivo no encontrado.", 404);
  const bucket = file.kind === "delivery" ? DELIVERIES_BUCKET : ORIGINALS_BUCKET;
  const { data, error } = await sb.storage.from(bucket).createSignedUrl(file.storage_path, expiresIn, { download: file.filename });
  if (error) throw new Error(`createSignedUrl: ${error.message}`);
  return data.signedUrl;
}

const CAN_UPLOAD_DELIVERY = ["paid", "in_progress", "revision_requested", "delivered"];

export async function issueDeliveryUpload(sb: SupabaseClient, orderId: string, file: { filename: string; size: number }) {
  const order = await requireOrder(sb, orderId);
  if (!CAN_UPLOAD_DELIVERY.includes(order.status)) throw new OrderError("Este pedido aún no está pagado.", 409);
  const check = checkDeliveryUpload(file);
  if (!check.ok) throw new OrderError(check.error, 422);
  const path = `${orderId}/${crypto.randomUUID()}.${check.ext}`;
  const { data, error } = await sb.storage.from(DELIVERIES_BUCKET).createSignedUploadUrl(path);
  if (error) throw new Error(`createSignedUploadUrl: ${error.message}`);
  return { path, token: data.token, mime: check.mime, bucket: DELIVERIES_BUCKET };
}

export async function confirmDelivery(sb: SupabaseClient, orderId: string, staff: Staff, input: { path: string; filename: string }) {
  await requireOrder(sb, orderId);
  const objectName = input.path.startsWith(`${orderId}/`) ? input.path.slice(orderId.length + 1) : "";
  if (!/^[0-9a-f-]{36}\.[a-z0-9]{2,5}$/.test(objectName)) throw new OrderError("Archivo inválido.", 403);

  const existing = await sb.from("order_files").select("id, filename, mime, size_bytes, created_at").eq("storage_path", input.path).maybeSingle();
  if (existing.data) return existing.data;

  const listed = await sb.storage.from(DELIVERIES_BUCKET).list(orderId, { search: objectName, limit: 1 });
  const object = listed.data?.find((o) => o.name === objectName);
  if (!object) throw new OrderError("No encontramos el archivo subido.", 404);

  const filename = displayFileName(input.filename);
  const check = checkDeliveryUpload({ filename, size: Number(object.metadata?.size ?? 0) });
  if (!check.ok) {
    await sb.storage.from(DELIVERIES_BUCKET).remove([input.path]);
    throw new OrderError(check.error, 422);
  }
  const { data, error } = await sb
    .from("order_files")
    .insert({ order_id: orderId, kind: "delivery", storage_path: input.path, filename, mime: check.mime, size_bytes: Number(object.metadata?.size ?? 0) })
    .select("id, filename, mime, size_bytes, created_at")
    .single();
  if (error) throw new Error(`order_files.insert: ${error.message}`);
  await logStaffEvent(sb, orderId, staff, "delivery_uploaded", { filename });
  return data;
}

export async function deleteDelivery(sb: SupabaseClient, orderId: string, fileId: string, staff: Staff) {
  const { data } = await sb.from("order_files").select("id, storage_path, filename").eq("id", fileId).eq("order_id", orderId).eq("kind", "delivery").maybeSingle();
  if (!data) throw new OrderError("Archivo no encontrado.", 404);
  await sb.storage.from(DELIVERIES_BUCKET).remove([data.storage_path]);
  await sb.from("order_files").delete().eq("id", data.id);
  await logStaffEvent(sb, orderId, staff, "delivery_deleted", { filename: data.filename });
}

export async function deliver(sb: SupabaseClient, orderId: string, staff: Staff) {
  const order = await requireOrder(sb, orderId);
  if (!["paid", "in_progress", "revision_requested"].includes(order.status)) {
    throw new OrderError(`Un pedido "${STATUS_LABEL[order.status] ?? order.status}" no se puede entregar.`, 409);
  }
  const { count } = await sb.from("order_files").select("id", { count: "exact", head: true }).eq("order_id", orderId).eq("kind", "delivery");
  if (!count) throw new OrderError("Sube al menos un archivo final antes de entregar.", 422);

  const { data, error } = await sb
    .from("orders")
    .update({ status: "delivered", delivered_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("status", order.status)
    .select("id");
  if (error) throw new Error(`orders.update: ${error.message}`);
  if (!data?.length) throw new OrderError("El pedido cambió mientras tanto. Recarga la página.", 409);
  await logStaffEvent(sb, orderId, staff, "delivered", { files: count, from: order.status });
}

// ── Métricas ─────────────────────────────────────────────────────────────────

export async function metrics(sb: SupabaseClient, now = new Date()) {
  const since = new Date(now.getTime() - 8 * 7 * 86_400_000).toISOString();
  const [{ data: all }, { data: paid }] = await Promise.all([
    sb.from("orders").select("status").not("status", "in", "(draft,expired)"),
    sb.from("orders").select("amount_usd, paid_at, delivered_at, status").not("paid_at", "is", null).gte("paid_at", since),
  ]);

  const byStatus: Record<string, number> = {};
  for (const o of all ?? []) byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;

  // Ingresos por semana (lunes a domingo, hora de Bogotá aproximada con UTC-5).
  const weeks = new Map<string, number>();
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 7 * 86_400_000);
    weeks.set(weekStart(d), 0);
  }
  const counted = (paid ?? []).filter((o) => !["refunded", "cancelled"].includes(o.status));
  for (const o of counted) {
    const key = weekStart(new Date(o.paid_at!));
    if (weeks.has(key)) weeks.set(key, (weeks.get(key) ?? 0) + Number(o.amount_usd));
  }

  const deliveryHours = counted
    .filter((o) => o.delivered_at)
    .map((o) => (new Date(o.delivered_at!).getTime() - new Date(o.paid_at!).getTime()) / 3_600_000);
  const avgDeliveryHours = deliveryHours.length ? deliveryHours.reduce((a, b) => a + b, 0) / deliveryHours.length : null;

  return {
    byStatus,
    revenueByWeek: [...weeks.entries()].map(([week, usd]) => ({ week, usd })),
    avgDeliveryHours,
  };
}

function weekStart(date: Date): string {
  const d = new Date(date.getTime() - 5 * 3_600_000); // UTC-5
  const day = (d.getUTCDay() + 6) % 7; // lunes = 0
  d.setUTCDate(d.getUTCDate() - day);
  return d.toISOString().slice(0, 10);
}
