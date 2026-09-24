-- Seguridad del funnel (docs/FUNNEL_PLAN.md §6, "Reglas de seguridad").
--
-- Todo cerrado por defecto:
--   · anon (llave pública): solo lee paquetes activos.
--   · authenticated: solo el equipo (profiles.role editor/admin) lee pedidos.
--   · El cliente nunca consulta tablas: accede a su pedido por rutas del
--     servidor que validan public_token y usan la llave de servicio.
-- Además de RLS se retiran los permisos de anon sobre las tablas privadas, para
-- que un error futuro en una política no las exponga.

-- ── RLS en todas las tablas ─────────────────────────────────────────────────

alter table public.packages enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_files enable row level security;
alter table public.payments enable row level security;
alter table public.order_events enable row level security;
alter table public.order_code_counters enable row level security;

-- ── Permisos base ───────────────────────────────────────────────────────────

revoke all on public.orders, public.order_files, public.payments, public.order_events,
  public.profiles, public.order_code_counters
  from anon;

-- Ni anon ni authenticated escriben directamente: toda escritura pasa por el servidor.
revoke insert, update, delete, truncate on public.packages, public.orders, public.order_files,
  public.payments, public.order_events, public.profiles
  from anon, authenticated;

revoke all on public.order_code_counters from authenticated;

-- Las funciones de generación solo las usa el servidor (llave de servicio) al
-- insertar pedidos. Sin esto, cualquiera podría gastar consecutivos por RPC.
revoke execute on function public.next_order_code() from public, anon, authenticated;
revoke execute on function public.generate_public_token() from public, anon, authenticated;

-- ── ¿Es del equipo? ─────────────────────────────────────────────────────────

create function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('editor', 'admin')
  );
$$;

revoke execute on function public.is_staff() from public, anon;
grant execute on function public.is_staff() to authenticated;

-- ── Políticas ───────────────────────────────────────────────────────────────

create policy "Paquetes activos visibles para todos"
  on public.packages for select
  to anon, authenticated
  using (active);

create policy "El equipo ve todos los paquetes"
  on public.packages for select
  to authenticated
  using ((select public.is_staff()));

create policy "Cada usuario ve su propio perfil"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

create policy "El equipo ve los perfiles"
  on public.profiles for select
  to authenticated
  using ((select public.is_staff()));

create policy "El equipo ve los pedidos"
  on public.orders for select
  to authenticated
  using ((select public.is_staff()));

create policy "El equipo ve los archivos de pedidos"
  on public.order_files for select
  to authenticated
  using ((select public.is_staff()));

create policy "El equipo ve los pagos"
  on public.payments for select
  to authenticated
  using ((select public.is_staff()));

create policy "El equipo ve la bitácora"
  on public.order_events for select
  to authenticated
  using ((select public.is_staff()));

-- order_code_counters: sin políticas; solo la llave de servicio lo toca.
