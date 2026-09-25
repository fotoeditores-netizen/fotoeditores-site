-- Fase 5: ajustes usados por pedido (se comparan con packages.revisions_included).
alter table public.orders
  add column if not exists revisions_used integer not null default 0 check (revisions_used >= 0);

-- Bandeja del editor: filtra por estado y ordena por fecha de pago.
create index if not exists orders_status_paid_at_idx on public.orders (status, paid_at);
