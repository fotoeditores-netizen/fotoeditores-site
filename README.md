# Fotoeditores — Sitio Web Corporativo

Stack: **Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · MDX · Resend**

## Estructura del proyecto

```
fotoeditores-site/
├── app/
│   ├── layout.tsx              # Layout global (fuentes, Navbar, Footer)
│   ├── page.tsx                # Inicio (Hero + ROI + Lead Magnet)
│   ├── tecnologia/page.tsx     # Catálogo IA + Paquetes
│   ├── nuestro-adn/page.tsx    # Valores + Equipo + Timeline
│   ├── blog/
│   │   ├── page.tsx            # Índice de blog
│   │   └── [slug]/page.tsx     # Detalle de post MDX
│   ├── contacto/page.tsx       # Formulario de contacto
│   └── api/
│       ├── contact/route.ts    # API de contacto → Resend
│       └── lead-magnet/route.ts # API lead magnet → Resend
├── components/                 # Todos los componentes React
├── content/blog/               # Posts en formato .mdx
├── lib/blog.ts                 # Utilidades para leer MDX
├── .env.local                  # Variables de entorno (no comitear)
└── vercel.json                 # Configuración de Vercel
```

## Configuración inicial

### 1. Variables de entorno
Edita `.env.local`:
```bash
RESEND_API_KEY=re_tu_api_key_aqui  # resend.com → gratuito 3,000 emails/mes
NEXT_PUBLIC_SITE_URL=https://fotoeditores.com
```

### 2. Configurar Resend (emails)
1. Crea cuenta en [resend.com](https://resend.com) (gratuito)
2. Agrega y verifica el dominio `fotoeditores.com`
3. Copia tu API Key y pégala en `.env.local`
4. El email de origen debe ser `contacto@fotoeditores.com` (verificado en Resend)
5. Los emails llegan a `editorgeneral@fotoeditores.com`

## Comandos de desarrollo

```bash
npm run dev      # Servidor de desarrollo (localhost:3000)
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Verificar código
```

## Agregar posts al Blog

Crea archivos `.mdx` en `content/blog/`:

```mdx
---
title: "Título del artículo"
description: "Descripción para SEO (150-160 caracteres)"
date: "2025-03-01"
category: "IA para Empresas"
readTime: "8 min"
author: "Fotoeditores"
tags: ["IA", "Colombia", "marketing digital"]
---

# Contenido del artículo en Markdown
```

## Despliegue en Vercel

1. Sube el proyecto a GitHub:
```bash
git init
git add .
git commit -m "feat: sitio web fotoeditores"
git branch -M main
git remote add origin https://github.com/tu-usuario/fotoeditores-site.git
git push -u origin main
```

2. Ve a [vercel.com](https://vercel.com) → New Project → Importa el repo
3. En Environment Variables agrega: `RESEND_API_KEY`
4. Vercel detecta Next.js automáticamente
5. Configura el dominio `fotoeditores.com` en Settings → Domains

## Personalización

### Paleta de colores (tailwind.config.ts)
- `midnight` — #0A1628 (fondo principal)
- `electric` — #0066FF (CTAs, acciones)
- `cyan.digital` — #00D4FF (energía, datos)
- `gold` — #FFB800 (aniversario, hitos)
- `coral` — #FF4D6D (solo errores/alertas)

### Fuentes (CSS variables en layout.tsx)
- `--font-montserrat` — Títulos, botones, badges
- `--font-inter` — Cuerpos de texto
- `--font-jetbrains` — Datos técnicos, prompts

### Clases utilitarias (globals.css)
- `.glass` — Efecto glassmorphism oscuro
- `.gradient-text` — Texto con gradiente azul-cian
- `.gradient-text-gold` — Texto con gradiente dorado
- `.prose-fotoeditores` — Estilos para contenido MDX del blog
- `.grid-pattern` — Fondo con cuadrícula sutil

## Contacto
**editorgeneral@fotoeditores.com** · fotoeditores.com · Colombia 2025
