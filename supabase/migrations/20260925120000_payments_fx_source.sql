-- Fase 4: de dónde salió la tasa USD→COP de cada intento de pago (trazabilidad).
--   trm          → TRM oficial (Superintendencia Financiera, datos.gov.co)
--   open-er-api  → respaldo si la TRM no está disponible
alter table public.payments
  add column fx_source text check (fx_source in ('trm', 'open-er-api')),
  add column fx_date date;

create index payments_order_id_idx on public.payments (order_id);
