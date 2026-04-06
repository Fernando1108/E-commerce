# NovaStore — E-commerce Platform

## Descripcion
Plataforma e-commerce moderna desarrollada con Next.js 15, Supabase y Stripe. Proyecto de portafolio de [Kodexa Solutions](https://kodexasolutions.com).

## Stack Tecnico
| Capa | Tecnologia |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| Lenguaje | TypeScript 5 |
| UI | React 19 + Tailwind CSS 3.4 |
| Animaciones | Framer Motion 11 |
| Base de datos | Supabase (PostgreSQL) |
| Autenticacion | Supabase Auth |
| Pagos | Stripe |
| Emails | Resend |
| Formularios | React Hook Form |
| Estado global | Zustand (pendiente) |
| Deploy | Netlify |

## Integraciones
- **Supabase** — Base de datos PostgreSQL, autenticacion, storage de imagenes
- **Stripe** — Procesamiento de pagos, checkout, webhooks
- **Resend** — Emails transaccionales (confirmacion de pedido, bienvenida)
- **Google Analytics** — Metricas de trafico

## Estructura del Proyecto
```text
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── not-found.tsx       # Pagina 404
│   ├── cart/               # Carrito de compras
│   ├── homepage/           # Landing page (7 secciones)
│   ├── product/[id]/       # Detalle de producto
│   ├── products/           # Catalogo con filtros
│   └── api/                # API Routes (pendiente)
├── components/             # Componentes globales
├── lib/                    # Clientes (Supabase, Stripe)
├── hooks/                  # Custom hooks
├── store/                  # Estado global (Zustand)
├── types/                  # TypeScript interfaces
└── styles/                 # Estilos globales
```

## Roadmap de Desarrollo
- [x] UI/UX — Landing, catalogo, detalle de producto, carrito
- [x] SEO — Metadata, sitemap, robots.txt
- [ ] Supabase — Cliente, tipos, productos desde DB
- [ ] Auth — Login, registro, proteccion de rutas
- [ ] Carrito — Estado global con Zustand + persistencia
- [ ] Checkout — Stripe integration + webhooks
- [ ] Emails — Confirmacion de pedido con Resend
- [ ] Admin — Panel de gestion de productos
- [ ] Paginas legales — Envios, devoluciones, privacidad, terminos

## Variables de Entorno
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_SITE_URL=
```

## Desarrollo Local
```bash
npm install
npm run dev  # Puerto 4028
```

## Desarrollado por
[Kodexa Solutions](https://kodexasolutions.com) — Desarrollo web profesional
