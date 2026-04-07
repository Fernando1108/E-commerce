# NovaStore — E-commerce Platform

Plataforma e-commerce moderna con sistema de pagos real (PayPal), autenticación completa (Supabase Auth), gestión de productos, cupones, emails transaccionales y UI premium con animaciones.

**Desarrollado por [Kodexa Solutions](https://kodexasolutions.com)**

---

## Stack Técnico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js 15 (App Router) | ^15.5.14 |
| Lenguaje | TypeScript (strict) | ^5 |
| UI | React 19 + Tailwind CSS 3.4 | 19.0.3 |
| Animaciones | Framer Motion | ^11.15 |
| Base de datos | Supabase (PostgreSQL) | ^2.101 |
| Autenticación | Supabase Auth + SSR | ^0.10 |
| Pagos | PayPal (Sandbox/Live) | ^9.1 |
| Emails | Resend + React Email | ^6.10 |
| Estado global | Zustand (persist) | ^5.0 |
| Formularios | React Hook Form | ^7.72 |
| Iconos | Heroicons React | ^2.2 |
| Tipografía | DM Sans + Fraunces (Google Fonts) | — |
| Deploy | Netlify | — |

---

## Integraciones

- **Supabase** — PostgreSQL, autenticación (email + Google OAuth), Row Level Security, Stored Procedures
- **PayPal** — Checkout, captura de pagos, modo Sandbox para desarrollo
- **Resend** — Emails transaccionales (confirmación de pedido, bienvenida)

---

## Estructura del Proyecto

```text
├── middleware.ts                       # Protección de rutas (auth + admin)
├── next.config.mjs                     # Config Next.js (redirects, images)
├── tailwind.config.js                  # Design system NovaStore
├── image-hosts.config.mjs             # Hosts de imágenes permitidos
│
└── src/
    ├── app/
    │   ├── layout.tsx                  # Root layout (metadata, viewport)
    │   ├── not-found.tsx               # Página 404 (español)
    │   ├── robots.ts                   # robots.txt dinámico
    │   ├── sitemap.ts                  # sitemap.xml dinámico
    │   │
    │   ├── api/
    │   │   ├── auth/welcome/route.ts   # POST - Email de bienvenida
    │   │   ├── categories/route.ts     # GET, POST categorías
    │   │   ├── orders/route.ts         # GET pedidos del usuario
    │   │   ├── paypal/
    │   │   │   ├── create-order/route.ts  # POST crear orden PayPal
    │   │   │   └── capture-order/route.ts # POST capturar pago + email
    │   │   └── products/
    │   │       ├── route.ts            # GET (filtros), POST
    │   │       └── [id]/route.ts       # GET, PUT, DELETE
    │   │
    │   ├── auth/
    │   │   ├── callback/route.ts       # OAuth callback (Supabase)
    │   │   ├── login/page.tsx          # Login (email + Google OAuth)
    │   │   ├── register/page.tsx       # Registro con validación
    │   │   └── forgot-password/page.tsx # Recuperar contraseña
    │   │
    │   ├── homepage/                   # Landing page (7 secciones)
    │   │   ├── page.tsx
    │   │   └── components/
    │   │       ├── HeroSection.tsx
    │   │       ├── FeaturedProductsSection.tsx
    │   │       ├── CategoryBannersSection.tsx
    │   │       ├── PromoBannerSection.tsx
    │   │       ├── TestimonialsSection.tsx
    │   │       ├── WhyNovaStoreSection.tsx
    │   │       └── NewsletterSection.tsx
    │   │
    │   ├── products/                   # Catálogo con filtros y búsqueda
    │   │   ├── page.tsx
    │   │   └── components/
    │   │       ├── ProductsHeroSection.tsx
    │   │       ├── ProductGridSection.tsx
    │   │       └── ProductFiltersSection.tsx
    │   │
    │   ├── product/[id]/page.tsx       # Detalle de producto (galería, variantes, tabs)
    │   ├── cart/page.tsx               # Carrito + PayPal Checkout
    │   ├── checkout/
    │   │   ├── page.tsx                # Checkout (en construcción)
    │   │   └── success/page.tsx        # Confirmación post-pago
    │   │
    │   ├── profile/
    │   │   ├── page.tsx                # Datos del perfil
    │   │   └── settings/page.tsx       # Editar perfil (nombre, contraseña)
    │   │
    │   ├── contacto/page.tsx           # Formulario de contacto
    │   ├── envios/page.tsx             # Política de envíos
    │   ├── devoluciones/page.tsx        # Política de devoluciones
    │   ├── privacidad/page.tsx         # Política de privacidad
    │   └── terminos/page.tsx           # Términos y condiciones
    │
    ├── components/
    │   ├── Header.tsx                  # Header global (auth-aware, mobile menu)
    │   ├── Footer.tsx                  # Footer global
    │   └── ui/
    │       ├── AppIcon.tsx             # Wrapper dinámico de Heroicons
    │       ├── AppImage.tsx            # Wrapper next/image con fallback
    │       └── AppLogo.tsx             # Logo del sitio
    │
    ├── emails/
    │   ├── OrderConfirmation.tsx       # Template confirmación pedido
    │   └── Welcome.tsx                 # Template bienvenida
    │
    ├── hooks/
    │   ├── useAuth.ts                  # Hook (sign in/up/out, Google OAuth)
    │   ├── useCart.ts                  # Hook wrapper del store
    │   └── useProfile.ts              # Hook perfil + detección admin
    │
    ├── lib/
    │   ├── email.ts                    # Servicio de emails (Resend)
    │   ├── utils.ts                    # Helpers (formatPrice USD)
    │   ├── paypal/PayPalProvider.tsx   # Provider de PayPal
    │   └── supabase/
    │       ├── client.ts              # Cliente browser
    │       ├── server.ts              # Cliente server
    │       └── services.ts            # Funciones RPC (stored procedures)
    │
    ├── store/
    │   └── cart-store.ts              # Zustand store (persist localStorage)
    │
    ├── types/
    │   └── index.ts                   # Interfaces TypeScript globales
    │
    └── styles/
        ├── index.css
        └── tailwind.css               # Design system (tokens, componentes CSS)
```

---

## API Endpoints

| Método | Ruta | Función | Auth |
|--------|------|---------|------|
| POST | /api/paypal/create-order | Crear orden PayPal | ✅ |
| POST | /api/paypal/capture-order | Capturar pago + crear pedido + email | ✅ |
| GET | /api/products?limit&offset&category&search | Listar productos | ❌ |
| POST | /api/products | Crear producto | ✅ |
| GET | /api/products/[id] | Obtener producto | ❌ |
| PUT | /api/products/[id] | Actualizar producto | ✅ |
| DELETE | /api/products/[id] | Eliminar producto | ✅ |
| GET | /api/orders | Pedidos del usuario | ✅ |
| GET | /api/categories | Listar categorías | ❌ |
| POST | /api/categories | Crear categoría | ✅ |
| POST | /api/auth/welcome | Enviar email de bienvenida | ❌ |

---

## Stored Procedures (Supabase)

| Función | Descripción |
|---------|-------------|
| get_products_with_category | Productos con categoría, filtros y paginación |
| get_product_by_id | Producto con variantes, reviews y categoría |
| get_featured_products | Productos destacados para homepage |
| get_categories_with_count | Categorías con conteo de productos |
| validate_coupon | Validar cupón por código |
| create_order | Crear pedido completo + descontar stock |
| get_user_orders | Pedidos de un usuario |
| get_product_images | Imágenes de un producto |

---

## Base de Datos (Supabase)

### Tablas principales
- **products** — Productos con precio, stock, specs (JSON), highlights, badge, featured
- **categories** — Categorías con imagen, color, descripción
- **product_variants** — Variantes de producto (talla, color, etc.)
- **product_images** — Galería de imágenes por producto
- **orders** — Pedidos con estado y total
- **order_items** — Items individuales de cada pedido
- **cart_items** — Carrito persistente por usuario
- **reviews** — Reseñas con rating 1-5
- **coupons** — Cupones de descuento con expiración
- **invoices** — Facturas vinculadas a pedidos
- **shipments** — Seguimiento de envíos (carrier, tracking)
- **inventory_movements** — Movimientos de inventario
- **profiles** — Perfiles de usuario (con campo `role`)
- **roles / permissions / role_permissions** — Sistema de roles
- **employees** — Empleados
- **suppliers / purchases / purchase_items** — Proveedores y compras

---

## Estado del Proyecto

### ✅ Completado
- [x] UI/UX — Landing (7 secciones), catálogo con filtros, detalle de producto con galería/tabs, carrito
- [x] SEO — Metadata, sitemap, robots.txt, Open Graph, `lang="es"`
- [x] Supabase — Cliente browser/server, tipos, productos desde DB (RPC)
- [x] Auth — Login, registro, Google OAuth, recuperar contraseña (Supabase Auth)
- [x] Carrito — Zustand store con persistencia en localStorage + cupones reales
- [x] PayPal — Checkout + captura de pagos (Sandbox)
- [x] Emails — Confirmación de pedido + bienvenida (Resend + React Email)
- [x] Páginas legales — Envíos, devoluciones, privacidad, términos
- [x] Perfil — Página de perfil + editar configuración (nombre, contraseña)
- [x] Contacto — Formulario de contacto (UI)
- [x] Middleware — Protección de rutas con Supabase Auth
- [x] Design system — Tokens CSS, componentes reutilizables, animaciones Framer Motion
- [x] Responsive — Layout responsive en todas las páginas + menú mobile
- [x] CRUD de productos — API completa (GET, POST, PUT, DELETE)

### 🚧 Pendiente
- [ ] Panel Admin — Gestión de productos, pedidos y categorías (UI + APIs seguras)
- [ ] Historial de pedidos — UI con lista de pedidos + descarga de comprobante PDF
- [ ] Comprobante PDF — Endpoint `/api/orders/[id]/receipt` + jsPDF
- [ ] Formulario de contacto — Conectar a endpoint real (enviar email)
- [ ] Newsletter — Endpoint de suscripción + conectar UI
- [ ] Búsqueda global — Barra de búsqueda funcional en header
- [ ] Wishlist — Lista de deseos con persistencia en DB
- [ ] Reviews — UI para crear/leer reseñas de productos
- [ ] Google Analytics — Implementar tracking GA4
- [ ] Dark mode — Tokens existen pero no hay toggle
- [ ] Página reset-password — Ruta faltante para completar flujo
- [ ] Validación server-side — Zod en endpoints de mutación
- [ ] Verificación admin — APIs de productos/categorías no verifican rol admin

---

## Tareas de Diego (Frontend)

### Bugs que corregir
- [ ] Corregir link "Mi cuenta" en Header → cambiar `/account` por `/profile`
- [ ] Corregir link "Soporte" en Header → cambiar `/homepage` por `/contacto`
- [ ] Corregir estilos de página 404 (`not-found.tsx`) — usa clases CSS que no existen en el design system

### Nuevas features
- [ ] **Panel Admin** — Dashboard con gestión visual de productos, pedidos, categorías
- [ ] **Historial de pedidos** — Página `/profile/orders` con lista de pedidos y descarga PDF
- [ ] **Búsqueda global** — Modal/dropdown de búsqueda en Header
- [ ] **Wishlist** — Persistir en DB en vez de localStorage
- [ ] **Reviews** — Formulario y listado de reseñas en detalle de producto
- [ ] **Página reset-password** — `/auth/reset-password` para completar flujo de recuperación
- [ ] **Sistema de toasts** — Reemplazar `alert()` por notificaciones elegantes
- [ ] **Google Analytics** — Implementar script GA4

### Refactoring
- [ ] Extraer `AuthField` y `StatusMessage` duplicados a `components/ui/`
- [ ] Descomponer `cart/page.tsx` (657 líneas) en componentes
- [ ] Descomponer `product/[id]/page.tsx` (858 líneas) en componentes
- [ ] Crear componente `DotBackground` para fondo punteado reutilizable
- [ ] Conectar formulario de contacto a endpoint
- [ ] Conectar newsletter a endpoint

---

## Tareas de Anderson (Backend)

### Bugs que corregir
- [ ] **CRÍTICO:** Añadir verificación de rol admin en POST/PUT/DELETE de `/api/products` y `/api/categories`
- [ ] **CRÍTICO:** Proteger `/api/auth/welcome` con autenticación (prevenir spam)
- [ ] Recalcular total del pedido server-side en `capture-order` (no confiar en frontend)

### Nuevas features
- [ ] **Endpoint comprobante PDF** — `/api/orders/[id]/receipt` con jsPDF
- [ ] **Endpoint de contacto** — `/api/contact` para enviar email
- [ ] **Endpoint de newsletter** — `/api/newsletter` para suscripción
- [ ] **Endpoints de reviews** — CRUD para reseñas
- [ ] **Endpoints de wishlist** — CRUD para lista de deseos
- [ ] **Carrito persistente** — Sincronizar tabla `cart_items` con frontend

### Refactoring
- [ ] Extraer `getAccessToken()` duplicada a `lib/paypal/api.ts`
- [ ] Validación server-side con Zod en todos los POST/PUT
- [ ] Rate limiting en endpoints críticos
- [ ] RLS Policies en Supabase (solo admin = mutaciones, usuario = sus propios datos)
- [ ] Logging estructurado (pino/winston) en vez de `console.error`
- [ ] Limpiar `catch {}` vacío en `lib/supabase/server.ts`
- [ ] Añadir interfaces TypeScript faltantes: `Review`, `Invoice`, `Employee`, etc.
- [ ] Unificar interface `UserProfile` (types/) vs `Profile` (useProfile)

---

## Variables de Entorno

Copia `.env.example` a `.env.local` y configura:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_SITE_URL=http://localhost:4028
```

### ¿Dónde obtener cada key?
| Variable | Dónde |
|----------|-------|
| Supabase URL + Anon Key | [supabase.com](https://supabase.com) → Settings → API |
| PayPal Client ID + Secret | [developer.paypal.com](https://developer.paypal.com) → Apps & Credentials → Sandbox |
| Resend API Key | [resend.com](https://resend.com) → API Keys |

---

## Desarrollo Local

```bash
# 1. Clonar repositorio
git clone https://github.com/<org>/E-commerce.git
cd E-commerce

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus keys

# 4. Iniciar servidor de desarrollo
npm run dev  # Puerto 4028

# 5. Abrir en navegador
# http://localhost:4028
```

### Scripts disponibles
| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (puerto 4028) |
| `npm run build` | Build de producción |
| `npm run serve` | Servidor de producción |
| `npm run lint` | Ejecutar ESLint |
| `npm run lint:fix` | Corregir errores de ESLint |
| `npm run format` | Formatear código con Prettier |
| `npm run type-check` | Verificar tipos TypeScript |

---

## Colaboración (Git)

### Ramas
| Rama | Dueño | Descripción |
|------|-------|-------------|
| main | Protegida | Solo merge vía PR |
| feature/supabase-core | Anderson | Backend + integraciones |
| feature/ui-pages | Diego | Páginas UI + diseño |

### Convenciones de commits
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `chore:` mantenimiento
- `style:` cambios visuales
- `docs:` documentación
- `refactor:` refactorización sin cambio de funcionalidad

### Guía de contribución

1. **Antes de empezar:** Verifica que estás en la rama correcta (`feature/ui-pages` para Diego, `feature/supabase-core` para Anderson)
2. **Instalar dependencias:** `npm install` después de cada pull
3. **Verificar tipos:** `npm run type-check` antes de hacer commit
4. **Formatear código:** `npm run format` antes de hacer commit
5. **Regla de no-console:** No usar `console.log()` — revisar las reglas de ESLint
6. **Tipado:** Evitar `any` — usar interfaces de `src/types/index.ts`
7. **Componentes nuevos:** Crear en `src/components/ui/` si son reutilizables, o en `src/app/<page>/components/` si son específicos de página
8. **API routes nuevas:** Siempre verificar autenticación y rol (si aplica)
9. **Pull Requests:** Crear PR hacia `main` con descripción clara de los cambios

---

## Desarrollado por

**[Kodexa Solutions](https://kodexasolutions.com)** — Desarrollo web profesional para Latinoamérica

- WhatsApp: +507 6644-9530
- Instagram: @kodexasolutions
- Email: kodexasolutions@gmail.com
