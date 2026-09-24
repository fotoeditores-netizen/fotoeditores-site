-- Funnel "Gestores de IA" — modelo de datos (docs/FUNNEL_PLAN.md §6).
-- Ajuste de la decisión 5 (docs/AUDITORIA.md §9): precios en USD; Wompi cobra
-- en COP, así que cada intento de pago guarda la tasa usada y el monto en COP.

create extension if not exists pgcrypto with schema extensions;

-- ── Tipos ────────────────────────────────────────────────────────────────────

create type public.package_segment as enum ('producto', 'recuerdos', 'ambos');

create type public.order_status as enum (
  'draft',
  'awaiting_payment',
  'paid',
  'in_progress',
  'delivered',
  'revision_requested',
  'closed',
  'payment_failed',
  'cancelled',
  'refunded',
  'expired'
);

create type public.file_kind as enum ('original', 'delivery');

-- Estados de transacción de Wompi. PENDING mientras no llega el evento.
create type public.payment_status as enum ('PENDING', 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR');

create type public.staff_role as enum ('editor', 'admin');

create type public.event_actor as enum ('system', 'customer', 'editor');

-- ── Utilidades ───────────────────────────────────────────────────────────────

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Código legible del pedido: FE-AAMM-NNNN, consecutivo por mes (hora de Bogotá).
create table public.order_code_counters (
  period text primary key check (period ~ '^\d{4}$'),
  last_value integer not null check (last_value > 0)
);

create function public.next_order_code()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_period text := to_char(now() at time zone 'America/Bogota', 'YYMM');
  n integer;
begin
  insert into public.order_code_counters as c (period, last_value)
  values (current_period, 1)
  on conflict (period) do update set last_value = c.last_value + 1
  returning c.last_value into n;

  -- Mínimo 4 dígitos; si un mes pasa de 9999 pedidos el código crece en vez de cortarse.
  return 'FE-' || current_period || '-' || lpad(n::text, greatest(4, length(n::text)), '0');
end;
$$;

-- Token del enlace del cliente: 24 bytes aleatorios = 32 caracteres base64url.
create function public.generate_public_token()
returns text
language sql
volatile
set search_path = ''
as $$
  select translate(encode(extensions.gen_random_bytes(24), 'base64'), '+/', '-_');
$$;

-- ── Tablas ───────────────────────────────────────────────────────────────────

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  segment public.package_segment not null,
  name text not null,
  description text not null default '',
  -- null = no se cobra en línea (cotización por WhatsApp, p. ej. "a-la-medida").
  price_usd numeric(10, 2) check (price_usd is null or price_usd > 0),
  max_files integer not null check (max_files between 0 and 500),
  max_file_mb integer not null check (max_file_mb between 1 and 5000),
  accepts_video boolean not null default false,
  turnaround_hours integer not null check (turnaround_hours > 0),
  revisions_included integer not null default 1 check (revisions_included >= 0),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.staff_role not null,
  name text not null default '',
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default public.next_order_code(),
  public_token text not null unique default public.generate_public_token()
    check (public_token ~ '^[A-Za-z0-9_-]{32}$'),
  package_id uuid not null references public.packages (id),
  status public.order_status not null default 'draft',
  -- Precio del paquete en el momento de crear el pedido (copiado de packages).
  amount_usd numeric(10, 2) not null check (amount_usd > 0),
  customer_name text,
  customer_email text,
  customer_whatsapp text,
  brief jsonb not null default '{}'::jsonb,
  utm jsonb not null default '{}'::jsonb,
  consent_at timestamptz,
  paid_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_status_created_at_idx on public.orders (status, created_at);
create index orders_package_id_idx on public.orders (package_id);

create table public.order_files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  kind public.file_kind not null,
  storage_path text not null unique,
  filename text not null,
  mime text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  created_at timestamptz not null default now()
);

create index order_files_order_id_idx on public.order_files (order_id);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  -- restrict: un pedido con pagos no se borra (trazabilidad contable).
  order_id uuid not null references public.orders (id) on delete restrict,
  attempt integer not null check (attempt >= 1),
  -- <codigo>-<intento>, p. ej. FE-2609-0042-1. Wompi no permite reutilizarla.
  wompi_reference text not null unique,
  wompi_transaction_id text unique,
  status public.payment_status not null default 'PENDING',
  amount_usd numeric(10, 2) not null check (amount_usd > 0),
  -- COP por 1 USD usada en este intento; se fija en el servidor, nunca viene del navegador.
  fx_rate numeric(12, 4) not null check (fx_rate > 0),
  -- Monto enviado a Wompi, en centavos de COP (95.000 COP = 9500000).
  amount_cents bigint not null check (amount_cents > 0),
  currency text not null default 'COP' check (currency = 'COP'),
  payment_method text,
  raw_event jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (order_id, attempt)
);

create table public.order_events (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  type text not null,
  actor public.event_actor not null,
  -- Editor que hizo el cambio, cuando actor = 'editor'.
  actor_id uuid references public.profiles (id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (actor = 'editor' or actor_id is null)
);

create index order_events_order_id_created_at_idx on public.order_events (order_id, created_at);

create trigger packages_set_updated_at before update on public.packages
  for each row execute function public.set_updated_at();
create trigger orders_set_updated_at before update on public.orders
  for each row execute function public.set_updated_at();
create trigger payments_set_updated_at before update on public.payments
  for each row execute function public.set_updated_at();
