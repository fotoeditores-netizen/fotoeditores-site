# CLAUDE.md — fotoeditores.com

Sitio de Fotoeditores (edición y producción de foto y video con editores humanos potenciados con IA). Next.js 16 (App Router) + React 19 + Tailwind 3, desplegado en Vercel.

En curso: el funnel de ventas "Gestores de IA". El plan completo está en `docs/FUNNEL_PLAN.md` y la auditoría del repositorio en `docs/AUDITORIA.md`. Se trabaja **una fase por sesión**, en la rama `funnel/fase-N`, y no se pasa a la siguiente fase hasta que se cumplan sus criterios de aceptación y Edgar lo confirme.

**Las decisiones de la sección 9 de `docs/AUDITORIA.md` prevalecen sobre el plan.** Las principales:
- Precios visibles siempre en **USD**. Wompi cobra en COP: el servidor convierte con la tasa del día y guarda `amount_usd`, `fx_rate` y `amount_cop` en el pedido.
- Chat de IA y popup ocultos en `/pedido/*` y `/admin`.
- Formularios y botones unificados en componentes compartidos.
- Política de devolución: 7 días.

## Reglas permanentes

- Antes de escribir código, inspecciona el repositorio y **reutiliza** lo que ya existe: tokens de color, tipografías, `BeforeAfterSlider`, el estilo de los formularios del Cotizador, Navbar/Footer. No inventes una identidad visual nueva.
- Ningún secreto en el código ni en el repositorio. Todo va en variables de entorno (`.env.local` en local, Environment Variables en Vercel). `.env.example` se mantiene al día y sin valores reales.
- Toda lógica de dinero y de acceso a archivos ocurre **en el servidor** (Route Handlers / Server Actions). El navegador nunca ve la llave de servicio de Supabase ni el secreto de integridad de Wompi. Los precios salen siempre de la base de datos, nunca del cuerpo de la petición.
- Commits pequeños y frecuentes, con mensajes claros. Tests para todo lo que toque pagos y permisos.
- Si algo del plan choca con lo que encuentres en el repositorio, **detente y pregunta** en vez de improvisar.

## Convenciones del proyecto

- Rutas públicas en español y kebab-case (`/nuestro-adn`, `/recupera-tus-fotos`). Endpoints nuevos del funnel según la sección 7 del plan (`/api/orders`, `/api/wompi/events`, `/api/admin/…`).
- Importaciones con alias `@/` (raíz del repo). Componentes en `components/` (PascalCase, uno por archivo, export default); datos y utilidades en `lib/`; contextos en `context/`.
- Marca: fondo `#0A1628` (`midnight`), primario `#0066FF` (`electric`), acento `#00D4FF` (`cyan-digital`), dorado `#FFB800` (`gold`), error `#FF4D6D` (`coral`). CTA principal con `linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)`. Títulos en Montserrat (`var(--font-montserrat)`), texto en Inter (`var(--font-inter)`), etiquetas técnicas en JetBrains Mono.
- La Navbar es fija y mide 96 px: las páginas empiezan con `pt-28`.
- Las páginas nuevas que necesiten SEO son **componentes de servidor** que exportan `metadata`; la interactividad va en componentes cliente aparte. En Next 16, `params` y `searchParams` son Promises (`const { slug } = await params`).
- Todo texto de usuario que se inserte en HTML de correo se escapa.
- Copy en español, tono cercano y directo; tuteo.
- Commits en Conventional Commits en español: `feat(funnel): …`, `fix(pedido): …`.

## Comandos

- `npm run dev` · `npm run build` · `npm run lint`
- Aún no hay script de pruebas; se añade en la Fase 1.
