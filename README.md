# NovaStore — E-commerce Platform

Plataforma e-commerce moderna con sistema de pagos real (PayPal), autenticación completa (Supabase Auth), panel de administración ERP, gestión de productos, pedidos, inventario, proveedores, empleados, facturación, clientes, cupones, emails transaccionales y UI premium con animaciones.

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
| Validación | Zod | ^4.3 |
| Gráficas | Recharts | ^3.8 |
| Notificaciones | Sonner (toasts) | ^2.0 |
| PDF | jsPDF | ^4.2 |
| Fechas | date-fns | ^4.1 |
| Iconos | Heroicons React | ^2.2 |
| Tipografía | DM Sans + Fraunces (Google Fonts) | — |
| Deploy | Netlify | — |

---

## Integraciones

- **Supabase** — PostgreSQL, autenticación (email + Google OAuth), Row Level Security, Stored Procedures
- **PayPal** — Checkout, captura de pagos, modo Sandbox para desarrollo
- **Resend** — Emails transaccionales (confirmación de pedido, bienvenida, contacto)
- **Google Analytics** — GA4 tracking (componente condicional, ignora placeholders)

---

## Estructura del Proyecto

```text
├── middleware.ts                       # Protección de rutas (auth + admin role check)
├── next.config.mjs                     # Config Next.js (redirects, images)
├── tailwind.config.js                  # Design system NovaStore
├── image-hosts.config.mjs             # Hosts de imágenes permitidos
│
└── src/
    ├── app/
    │   ├── layout.tsx                  # Root layout (metadata, viewport, AuthProvider, Toaster)
    │   ├── not-found.tsx               # Página 404 (español, animaciones)
    │   ├── robots.ts                   # robots.txt dinámico
    │   ├── sitemap.ts                  # sitemap.xml dinámico
    │   │
    │   ├── api/
    │   │   ├── auth/welcome/route.ts   # POST - Email de bienvenida
    │   │   ├── categories/
    │   │   │   ├── route.ts            # GET, POST categorías (+Zod +admin)
    │   │   │   └── [id]/route.ts       # PUT, DELETE categoría (+Zod +admin)
    │   │   ├── contact/route.ts        # POST contacto (+Zod +rate-limit +XSS)
    │   │   ├── newsletter/
    │   │   │   ├── route.ts            # POST newsletter (+Zod +rate-limit)
    │   │   │   └── subscribe/route.ts  # POST alias de /api/newsletter
    │   │   ├── orders/
    │   │   │   ├── route.ts            # GET pedidos del usuario (+verifyAuth)
    │   │   │   └── [id]/status/route.ts # PUT cambiar estado (+Zod +admin)
    │   │   ├── paypal/
    │   │   │   ├── create-order/route.ts  # POST crear orden PayPal
    │   │   │   └── capture-order/route.ts # POST capturar pago + email
    │   │   ├── products/
    │   │   │   ├── route.ts            # GET (filtros+paginación+sort), POST (+Zod +admin)
    │   │   │   └── [id]/route.ts       # GET (UUID o slug), PUT (+Zod +admin), DELETE (+admin)
    │   │   ├── reviews/
    │   │   │   ├── route.ts            # GET, POST (+Zod +auth)
    │   │   │   └── [id]/route.ts       # DELETE (+auth, owner-or-admin)
    │   │   ├── wishlist/
    │   │   │   ├── route.ts            # GET, POST (+Zod +auth)
    │   │   │   └── [productId]/route.ts # DELETE (+auth)
    │   │   └── admin/
    │   │       ├── stats/route.ts      # GET estadísticas dashboard
    │   │       ├── orders/
    │   │       │   ├── route.ts        # GET todos los pedidos
    │   │       │   └── [id]/route.ts   # GET detalle, PUT estado
    │   │       ├── inventory/route.ts  # GET stock, POST movimiento
    │   │       ├── suppliers/
    │   │       │   ├── route.ts        # GET, POST proveedores
    │   │       │   └── [id]/route.ts   # PUT, DELETE proveedor
    │   │       ├── purchases/route.ts  # GET, POST compras
    │   │       ├── employees/
    │   │       │   ├── route.ts        # GET, POST empleados
    │   │       │   └── [id]/route.ts   # PUT, DELETE empleado
    │   │       ├── invoices/route.ts   # GET facturas
    │   │       ├── reports/route.ts    # GET reportes (ventas, productos, categorías)
    │   │       └── customers/route.ts  # GET clientes
    │   │
    │   ├── admin/
    │   │   ├── layout.tsx              # Layout admin (sidebar + topbar + AnimatePresence)
    │   │   ├── page.tsx                # Dashboard con stats y gráficas
    │   │   ├── components/
    │   │   │   ├── AdminLoader.tsx      # Loader premium SVG (anillos gradiente, barra progreso)
    │   │   │   ├── AdminModal.tsx       # Modal reutilizable
    │   │   │   ├── AdminPageTransition.tsx # Framer Motion page transitions
    │   │   │   ├── AdminSidebar.tsx     # Sidebar colapsable con hover animado
    │   │   │   ├── AdminTopbar.tsx      # Topbar con breadcrumbs + usuario
    │   │   │   ├── ChartCard.tsx        # Wrapper para gráficas
    │   │   │   ├── DataTable.tsx        # Tabla genérica (sort, search, paginación)
    │   │   │   └── StatCard.tsx         # Tarjeta de estadísticas con count-up
    │   │   ├── productos/
    │   │   │   ├── page.tsx            # Lista productos + buscar + eliminar
    │   │   │   ├── nuevo/page.tsx      # Crear producto (react-hook-form)
    │   │   │   └── [id]/editar/page.tsx # Editar producto
    │   │   ├── pedidos/
    │   │   │   ├── page.tsx            # Lista pedidos + filtro estado
    │   │   │   └── [id]/page.tsx       # Detalle pedido + cambiar estado
    │   │   ├── categorias/page.tsx     # Lista + crear + editar + eliminar categorías
    │   │   ├── inventario/page.tsx     # Stock + movimientos
    │   │   ├── proveedores/
    │   │   │   ├── page.tsx            # CRUD proveedores
    │   │   │   └── compras/page.tsx    # Lista compras (solo lectura)
    │   │   ├── empleados/page.tsx      # CRUD empleados
    │   │   ├── facturacion/
    │   │   │   ├── page.tsx            # Lista facturas (solo lectura)
    │   │   │   └── reportes/page.tsx   # Reportes con gráficas
    │   │   └── clientes/page.tsx       # Lista clientes (solo lectura)
    │   │
    │   ├── auth/
    │   │   ├── callback/route.ts       # OAuth callback (Supabase)
    │   │   ├── login/page.tsx          # Login (email + Google OAuth)
    │   │   ├── register/page.tsx       # Registro con validación
    │   │   ├── forgot-password/page.tsx # Recuperar contraseña
    │   │   └── reset-password/page.tsx # Resetear contraseña
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
    │   ├── product/[id]/              # Detalle de producto (acepta UUID o slug)
    │   │   ├── page.tsx
    │   │   └── components/
    │   │       ├── ProductActions.tsx
    │   │       ├── ProductGallery.tsx
    │   │       ├── ProductInfo.tsx
    │   │       ├── ProductSpecs.tsx
    │   │       ├── ProductTabs.tsx      # Incluye reviews
    │   │       ├── ProductVariants.tsx
    │   │       └── RelatedProducts.tsx
    │   │
    │   ├── cart/                       # Carrito + PayPal Checkout
    │   │   ├── page.tsx
    │   │   └── components/
    │   │       ├── CartHeader.tsx
    │   │       ├── CartItemCard.tsx
    │   │       ├── CartPayPalButton.tsx
    │   │       ├── CartSummary.tsx
    │   │       ├── CouponInput.tsx
    │   │       └── EmptyCart.tsx
    │   │
    │   ├── checkout/
    │   │   ├── page.tsx                # Redirige al carrito (Server Component)
    │   │   └── success/page.tsx        # Confirmación post-pago
    │   │
    │   ├── profile/
    │   │   ├── page.tsx                # Datos del perfil
    │   │   ├── settings/page.tsx       # Editar perfil (nombre, contraseña, dirección)
    │   │   └── orders/page.tsx         # Historial de pedidos
    │   │
    │   ├── wishlist/page.tsx           # Lista de deseos
    │   ├── contacto/page.tsx           # Formulario de contacto
    │   ├── envios/page.tsx             # Política de envíos
    │   ├── devoluciones/page.tsx       # Política de devoluciones
    │   ├── privacidad/page.tsx         # Política de privacidad
    │   └── terminos/page.tsx           # Términos y condiciones
    │
    ├── components/
    │   ├── Header.tsx                  # Header global (auth-aware, mobile menu, búsqueda)
    │   ├── Footer.tsx                  # Footer global con redes sociales
    │   ├── GoogleAnalytics.tsx         # GA4 tracking condicional (ignora placeholder)
    │   ├── ProfileModal.tsx            # Modal de perfil inline (pedidos, wishlist, reseñas)
    │   ├── SearchModal.tsx             # Búsqueda global (debounced)
    │   ├── SessionManager.tsx          # Detección de sesión activa + redirect
    │   └── ui/
    │       ├── AppIcon.tsx             # Wrapper dinámico de Heroicons (tipado estricto)
    │       ├── AppImage.tsx            # Wrapper next/image con fallback doble
    │       ├── AppLogo.tsx             # Logo del sitio
    │       ├── AuthField.tsx           # Input de formulario reutilizable
    │       ├── ScrollProgress.tsx      # Barra de progreso de scroll (fixed top)
    │       ├── StarRating.tsx          # Estrellas (readOnly + clickeable, sm/md/lg)
    │       └── StatusMessage.tsx       # Mensajes de feedback
    │
    ├── emails/
    │   ├── OrderConfirmation.tsx       # Template confirmación pedido
    │   └── Welcome.tsx                 # Template bienvenida
    │
    ├── hooks/
    │   ├── useAuth.ts                  # Hook (sign in/up/out, Google OAuth)
    │   ├── useCart.ts                  # Hook wrapper del store
    │   ├── useDebounce.ts             # Hook debounce genérico (usado en 5 búsquedas)
    │   ├── useProfile.ts              # Hook perfil + detección admin
    │   └── useWishlist.ts             # Hook wishlist (API-backed)
    │
    ├── lib/
    │   ├── email.ts                    # Servicio de emails (Resend)
    │   ├── export-csv.ts              # Exportar tablas admin a CSV (8 tablas)
    │   ├── logger.ts                  # Logger estructurado JSON (reemplaza console.error)
    │   ├── pagination.ts              # Helper Zod para paginación (page, limit)
    │   ├── rate-limit.ts              # In-memory rate limiter (Map con TTL)
    │   ├── utils.ts                    # Helpers (formatPrice USD)
    │   ├── auth/
    │   │   └── verify-admin.ts         # verifyAdmin + verifyAuth + requireAdmin helpers
    │   ├── constants/
    │   │   └── order-status.ts         # ORDER_STATUSES enum (7 estados)
    │   ├── paypal/
    │   │   ├── api.ts                  # getAccessToken + createPayPalOrder
    │   │   └── PayPalProvider.tsx      # Provider de PayPal
    │   ├── supabase/
    │   │   ├── client.ts              # Cliente browser
    │   │   ├── server.ts              # Cliente server
    │   │   ├── services.ts            # Funciones RPC (stored procedures)
    │   │   └── migrations/
    │   │       ├── admin-tables.sql   # Tablas admin (employees, suppliers, etc.)
    │   │       ├── fix-timestamps.sql # Dispersa created_at del seed para sort=newest
    │   │       ├── newsletter.sql     # Tabla newsletter_subscribers
    │   │       ├── rls-policies.sql   # RLS policies para 11 tablas
    │   │       └── seed-data.sql      # Datos de prueba
    │   └── validations/
    │       └── index.ts               # Esquemas Zod centralizados
    │
    ├── providers/
    │   └── AuthProvider.tsx           # Contexto global de auth (un fetch, onAuthStateChange)
    │
    ├── store/
    │   └── cart-store.ts              # Zustand store (persist localStorage)
    │
    ├── types/
    │   └── index.ts                   # Interfaces TypeScript globales
    │
    ├── constants/
    │   └── index.ts                   # statusColors, SHIPPING_THRESHOLD, badgeConfig
    │
    └── styles/
        ├── index.css
        └── tailwind.css               # Design system (tokens, componentes CSS)
```

---

## API Endpoints

### Públicos (sin autenticación)

| Método | Ruta | Función |
|--------|------|---------|
| GET | /api/products?limit&offset&category&search&sort | Listar productos con filtros, paginación y metadata |
| GET | /api/products/[id] | Obtener producto por UUID o slug |
| GET | /api/categories | Listar categorías (cache 60s) |
| GET | /api/reviews?product_id | Listar reseñas de un producto |
| POST | /api/contact | Enviar formulario de contacto (+rate-limit 3/min) |
| POST | /api/newsletter | Suscribirse a newsletter (+rate-limit 3/min) |
| POST | /api/newsletter/subscribe | Alias de /api/newsletter |

### Autenticados (requieren sesión)

| Método | Ruta | Función |
|--------|------|---------|
| POST | /api/paypal/create-order | Crear orden PayPal |
| POST | /api/paypal/capture-order | Capturar pago + crear pedido + email |
| GET | /api/orders | Pedidos del usuario autenticado |
| POST | /api/reviews | Crear reseña |
| DELETE | /api/reviews/[id] | Eliminar reseña (dueño o admin) |
| GET | /api/wishlist | Lista de deseos del usuario |
| POST | /api/wishlist | Agregar a wishlist |
| DELETE | /api/wishlist/[productId] | Eliminar de wishlist |
| POST | /api/auth/welcome | Enviar email de bienvenida (+rate-limit 2/min) |

### Admin (requieren rol admin)

| Método | Ruta | Función |
|--------|------|---------|
| POST | /api/products | Crear producto |
| PUT | /api/products/[id] | Actualizar producto |
| DELETE | /api/products/[id] | Eliminar producto |
| POST | /api/categories | Crear categoría |
| PUT | /api/categories/[id] | Editar categoría (+Zod) |
| DELETE | /api/categories/[id] | Eliminar categoría (guard: falla si hay productos) |
| PUT | /api/orders/[id]/status | Cambiar estado de pedido |
| GET | /api/admin/stats | Estadísticas del dashboard |
| GET | /api/admin/orders | Todos los pedidos |
| GET | /api/admin/orders/[id] | Detalle de pedido |
| PUT | /api/admin/orders/[id] | Actualizar estado de pedido |
| GET | /api/admin/inventory | Stock actual |
| POST | /api/admin/inventory | Registrar movimiento de inventario |
| GET | /api/admin/suppliers | Listar proveedores |
| POST | /api/admin/suppliers | Crear proveedor |
| PUT | /api/admin/suppliers/[id] | Actualizar proveedor |
| DELETE | /api/admin/suppliers/[id] | Eliminar proveedor |
| GET | /api/admin/purchases | Listar compras |
| POST | /api/admin/purchases | Crear compra |
| GET | /api/admin/employees | Listar empleados |
| POST | /api/admin/employees | Crear empleado |
| PUT | /api/admin/employees/[id] | Actualizar empleado |
| DELETE | /api/admin/employees/[id] | Eliminar empleado |
| GET | /api/admin/invoices | Listar facturas |
| GET | /api/admin/reports | Reportes (ventas, productos, categorías) |
| GET | /api/admin/customers | Listar clientes |

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
- **newsletter_subscribers** — Suscriptores de newsletter
- **wishlists** — Lista de deseos por usuario

---

## Seguridad

### Middleware (`middleware.ts`)
- Protege `/profile/*`, `/checkout/*`, `/account/*` — redirige a `/auth/login` si no hay sesión
- Protege `/admin/*` — verifica rol `admin` en tabla `profiles`; redirige a `/homepage` si el usuario autenticado no tiene rol admin
- Si el usuario ya está autenticado como admin e intenta acceder a `/auth/login`, redirige a `/admin`

### Row Level Security (Supabase)
RLS activo en 11 tablas (`rls-policies.sql`):

| Tabla | Lectura | Escritura |
|-------|---------|-----------|
| products | Pública | Solo admin |
| categories | Pública | Solo admin |
| orders | Owner + admin | Sistema (RPC) |
| order_items | Owner + admin | Sistema (RPC) |
| reviews | Pública | Owner autenticado |
| wishlists | Owner | Owner |
| cart_items | Owner | Owner |
| coupons | Pública | Solo admin |
| product_images | Pública | Solo admin |
| product_variants | Pública | Solo admin |
| newsletter_subscribers | — | Upsert por email |

### Autenticación en API
- `verifyAdmin()` — verifica sesión + rol admin; retorna `{ error, user, supabase }`
- `verifyAuth()` — verifica sesión; retorna `{ error, user, supabase }`
- Todos los endpoints mutantes usan uno de estos helpers antes de procesar

### Rate Limiting (`lib/rate-limit.ts`)
In-memory rate limiter (TTL map) — nota: no persiste entre instancias serverless.

| Endpoint | Límite |
|----------|--------|
| POST /api/contact | 3 req/min por IP |
| POST /api/newsletter | 3 req/min por IP |
| POST /api/auth/welcome | 2 req/min por IP |

### Validación y Sanitización
- **Zod** — todos los endpoints públicos y autenticados validan el body antes de procesar
- **sanitizeHtml()** — escapa `& < > " '` en emails de contacto (previene XSS en HTML de Resend)
- **Slug vs UUID** — `GET /api/products/[id]` detecta formato UUID con regex; si no coincide, busca por slug (previene queries malformadas al RPC)

### Middleware ubicación
- **El middleware DEBE estar en `src/middleware.ts`** (no en la raíz) cuando el proyecto usa `src/` directory — Next.js solo reconoce el middleware dentro de `src/` si esa carpeta existe

### AuthProvider (`providers/AuthProvider.tsx`)
- Un solo `supabase.auth.getUser()` al montar la app (evita múltiples requests de auth)
- `onAuthStateChange` para reactividad a login/logout
- Expone `useAuthContext()` con `{ user, profile, loading, isAdmin, signOut }`

---

## Estado del Proyecto

### ✅ Completado

**Frontend (Diego):**
- [x] Landing page (7 secciones animadas con Framer Motion)
- [x] Catálogo con filtros por categoría, búsqueda y ordenamiento
- [x] Detalle de producto (galería zoom, variantes, tabs, reviews)
- [x] Carrito descompuesto en 6 componentes + PayPal Checkout
- [x] Checkout success page
- [x] Perfil de usuario + editar configuración (nombre, contraseña, dirección)
- [x] Historial de pedidos con detalles expandibles
- [x] Wishlist conectada a backend (API-backed)
- [x] Contacto conectado a `/api/contact`
- [x] Newsletter conectado a `/api/newsletter`
- [x] Reviews UI con formulario + listado en detalle de producto
- [x] Páginas legales (envíos, devoluciones, privacidad, términos)
- [x] Auth completo (login, register, forgot-password, reset-password, Google OAuth)
- [x] Página 404 con animaciones
- [x] Búsqueda global en Header (SearchModal con debounce)
- [x] Panel Admin — Dashboard con gráficas (Recharts)
- [x] Panel Admin — CRUD productos (crear, editar, eliminar)
- [x] Panel Admin — Pedidos (lista, detalle, cambiar estado)
- [x] Panel Admin — Categorías (crear, editar, eliminar con modal)
- [x] Panel Admin — Inventario (stock, movimientos)
- [x] Panel Admin — Proveedores CRUD + lista de compras
- [x] Panel Admin — Empleados CRUD
- [x] Panel Admin — Facturación + reportes con gráficas
- [x] Panel Admin — Clientes
- [x] AuthField y StatusMessage en `components/ui/`
- [x] Toasts (sonner) en vez de `alert()`
- [x] Google Analytics componente condicional (ignora env vacía y placeholders)
- [x] Responsive completo en todas las páginas
- [x] Animaciones Framer Motion
- [x] Header + Footer en `product/[id]`, `cart`, `checkout/success`
- [x] Link correcto `/profile/orders` en checkout success
- [x] Links "Ir a soporte" apuntando a `/contacto` en páginas legales
- [x] Google OAuth en register + login
- [x] Checkout `page.tsx` redirige al carrito
- [x] Categorías en sidebar del admin
- [x] Header — línea de gradiente animada al hacer scroll
- [x] Footer — animaciones de entrada (useInView) y hover en links y redes sociales
- [x] Botones CTA — efecto shine sweep en hover (btn-shine)
- [x] Mobile menu — tap feedback con Framer Motion whileTap
- [x] Admin Dashboard — StatCards con count-up animado y micro-animaciones
- [x] Admin Sidebar — hover con slide-in bg + active indicator layoutId
- [x] Product Cards — hover elevated (y:-4, spring) + badge scale-in
- [x] Skeleton loaders premium con shimmer sweep (sin animate-pulse)
- [x] Scroll progress indicator global (barra azul fixed top-0)
- [x] StarRating como componente reutilizable (`components/ui/StarRating.tsx`)
- [x] Indicador de stock bajo (< 10) con pulse amber en ProductInfo
- [x] Shake periódico en botón "Añadir al carrito" cuando stock < 5
- [x] Cursor personalizado en galería de producto (desktop)
- [x] Header reestructurado: nav links, search inline, dropdown usuario, badge Admin
- [x] Dots de navegación solo iluminan el link activo
- [x] SessionManager con detección de sesión activa en login
- [x] Dashboard link en dropdown de perfil para admin/employee
- [x] Dark mode toggle en dashboard admin
- [x] Logout funcional en AdminTopbar → redirige a /auth/login
- [x] CategoryBannersSection reorganizado (Electrónica full-width)
- [x] Carousel de productos destacados con animación spring estilo Netflix
- [x] Footer crédito "Desarrollado por Kodexa Solutions" con link
- [x] Links reales de redes sociales en Footer (WhatsApp, Instagram, Email)
- [x] Botón "Cargar más productos" funcional en catálogo (offset+limit, estado loading)
- [x] Rediseño página de perfil — header con avatar, stats, 6 acciones rápidas, banner admin
- [x] Rediseño editar perfil — datos personales + seguridad; guarda vía `supabase.auth.updateUser`
- [x] Hero grande en página del carrito (full-width, gradiente, dot grid, Framer Motion)
- [x] Panel Admin — Iconos de categoría por tipo (getCategoryIcon)
- [x] Panel Admin — Dark mode auditado y completado en todos los módulos
- [x] Panel Admin — Error handling con try/catch + toast en todos los CRUD
- [x] Panel Admin — `window.location.href` reemplazado por `useRouter` en navegaciones admin
- [x] Panel Admin — bg-dot-pattern y skeleton-shimmer estandarizados
- [x] Remover `[key: string]: any` en AppIcon y AppImage — tipado estricto
- [x] Eliminar `console.error()` residual en CartPayPalButton
- [x] Agregar `.catch()` con toast en fetches sin error handling
- [x] Reemplazar `<img>` con AppImage en Header y profile/page
- [x] Dark mode en AuthField (inputs login/register/contacto)
- [x] Dark mode en cart summary background
- [x] Toast con undo al eliminar ítem del carrito (CartItemCard)
- [x] ARIA `role="menu"` / `role="menuitem"` en dropdown de usuario
- [x] Checkbox "Recordar email" en login controla persistencia en localStorage
- [x] Paginación server-side conectada en admin (clientes, proveedores, empleados, compras)
- [x] Manejo de 429 (rate limiting) en contacto y newsletter con toast amigable
- [x] Flechas carousel productos redeseñadas estilo Netflix
- [x] Hero del carrito extendido detrás del header
- [x] "HOME" en header como primer link de navegación
- [x] Hero de wishlist con gradiente slate-800 a blue-900
- [x] Descripciones dinámicas por categoría en /products
- [x] Rol badge arriba del avatar en profile
- [x] Quitado "Powered by PayPal" del carrito (tagline: false)
- [x] Modal "Mis pedidos" en profile — fetch /api/orders, lista con badge de estado
- [x] Modal "Wishlist" en profile — grid 2 col con imagen/precio, botón Quitar
- [x] Modal "Mis reseñas" en profile — StarRating readOnly, eliminar con DELETE /api/reviews/[id]
- [x] F-01 — Hydration mismatch: suppressHydrationWarning en `<html>`
- [x] F-02 — /products mostraba "0 PRODUCTOS": fetches desacoplados con error state + Reintentar
- [x] F-03 — /checkout en blanco: redirect('/cart') en Server Component
- [x] F-04 — Wishlist no sincroniza: useAuth + diagnóstico de timing
- [x] F-05 — Redirect /login → /auth/login y /register → /auth/register (permanent)
- [x] F-06 — Redirect /orders → /profile/orders (permanent)
- [x] F-07 — Perfil mostraba "Sin completar" en pedidos: value={String(orderCount ?? 0)}
- [x] F-08 — Estadísticas hardcodeadas: comentarios // Valores editoriales
- [x] F-09 — Newsletter texto truncado: tildes y separador miles corregidos
- [x] F-10 — URLs con slug: href=/product/${slug || id} en todos los componentes
- [x] F-11 — Acciones rápidas del ProfileModal: 5 acciones completas
- [x] F-13 — Reviews (0) ocultos en homepage: estrellas envueltas en {reviewCount > 0 && ...}
- [x] F-14 — Fallback de imagen: AppImage con estado doubleFailed + icono SVG
- [x] F-15 — Categorías dropdown vacío: Header con categoriesError + Reintentar
- [x] F-16 — Redirect / → /homepage en next.config.mjs
- [x] F-17 — Dev overlay "1 Issue": resuelto por F-01
- [x] F-18 — Tildes en /devoluciones: 10 correcciones
- [x] F-19 — Búsquedas populares: comentario // Términos editoriales
- [x] F-20 — Instagram: href mantenido como demo
- [x] F-21 — Variantes: ProductVariants.tsx con guard if (variants.length === 0) return null

**Backend (Anderson):**
- [x] GET/POST `/api/products` + Zod + verificación admin
- [x] GET/PUT/DELETE `/api/products/[id]` + Zod + verificación admin
- [x] GET/POST `/api/categories` + Zod + verificación admin
- [x] PUT/DELETE `/api/categories/[id]` + Zod + guard de productos
- [x] GET `/api/orders` (pedidos del usuario autenticado, usa verifyAuth)
- [x] PUT `/api/orders/[id]/status` + Zod + admin
- [x] POST `/api/paypal/create-order` + `capture-order`
- [x] POST `/api/auth/welcome` (protegido con auth + rate-limit 2/min)
- [x] POST `/api/contact` + Zod + rate-limit + sanitizeHtml (XSS)
- [x] POST `/api/newsletter` + Zod + rate-limit
- [x] POST `/api/newsletter/subscribe` (alias re-exportado)
- [x] GET/POST/DELETE `/api/reviews` + Zod
- [x] GET/POST/DELETE `/api/wishlist` + Zod
- [x] GET `/api/admin/stats`
- [x] APIs admin completas (orders, inventory, suppliers, purchases, employees, invoices, reports, customers)
- [x] `verifyAdmin` + `verifyAuth` + `requireAdmin` en `lib/auth/verify-admin.ts`
- [x] `getAccessToken` extraído a `lib/paypal/api.ts`
- [x] Validación Zod en todos los endpoints con body
- [x] Interfaces TypeScript (Review, Invoice, Employee, Supplier, etc.)
- [x] Esquemas Zod centralizados en `lib/validations/`
- [x] Corregir `variant_id: ''` → `null` en capture-order
- [x] Comparar `serverTotal` vs monto capturado por PayPal en `capture-order`
- [x] Error handling en `getAccessToken()` (`lib/paypal/api.ts`)
- [x] Sanitizar HTML en email de contacto (prevenir XSS)
- [x] Eliminar `ignoreBuildErrors: true` en `next.config.mjs`
- [x] Agregar Zod en PayPal create/capture order
- [x] Agregar Zod en admin endpoints (inventory, suppliers, employees, purchases)
- [x] Mover email hardcodeado a variable de entorno `CONTACT_EMAIL`
- [x] Consolidar `lib/admin.ts` en `lib/auth/verify-admin.ts`
- [x] Agregar `phone` y `subject` al `contactSchema`
- [x] Agregar field filtering en PUT de suppliers
- [x] Remover imports no usados en reports
- [x] Paginación en admin endpoints con helper `lib/pagination.ts`
- [x] Rate limiting en endpoints críticos (`lib/rate-limit.ts`)
- [x] Logging estructurado con `lib/logger.ts` (JSON, reemplaza console.error)
- [x] Enums de estado centralizados en `lib/constants/order-status.ts`
- [x] RLS policies en 11 tablas (`migrations/rls-policies.sql`)
- [x] Sprint 1 Admin: estados de pedido unificados, PUT/DELETE categorías, toast errors, logger
- [x] Sprint 2 Admin: paginación en orders/invoices/inventory, modales confirmación, AppImage
- [x] Sprint 3 Admin: exportar CSV en 8 tablas (`lib/export-csv.ts`), búsqueda, breadcrumbs, UI compras
- [x] AdminLoader premium con SVG animado aplicado en 12 páginas admin
- [x] AdminPageTransition con Framer Motion en layout admin
- [x] Optimización: Promise.all en fetches paralelos (productos, inventario, compras)
- [x] Optimización: cache headers en GET /api/products y /api/categories
- [x] Optimización: useDebounce hook aplicado en 5 páginas de búsqueda admin
- [x] Optimización: AppImage sizes default para thumbnails admin
- [x] Fix: foreign key orders → profiles para JOIN en admin pedidos
- [x] B-01 — Cache headers en /api/categories solo en respuesta exitosa (error path sin cache)
- [x] B-03 — products/[id] soporta slug además de UUID (detección por regex)
- [x] B-05 — products/[id] retorna objeto (data[0]) en vez de array
- [x] B-06 — /api/products responde `{ products, total, page, limit, totalPages }` + count paralelo
- [x] B-08 — GoogleAnalytics ignora placeholder `'your-google-analytics-id-here'`
- [x] B-09 — /api/newsletter/subscribe creado como alias re-exportado
- [x] B-11 — AuthProvider con un solo getUser() al montar + onAuthStateChange reactivo
- [x] B-13 — /api/products acepta `?sort=newest` y ordena por created_at DESC
- [x] B-13 — migrations/fix-timestamps.sql para dispersar timestamps del seed
- [x] B-15 — Parámetros limit (1-100) y offset (≥0) validados con Math.max/min
- [x] B-16 — GET /api/orders usa verifyAuth() en vez de check manual
- [x] Fix seguridad: middleware movido a src/ (Next.js con src/ directory requiere middleware dentro de src/)
- [x] Fix seguridad: usuarios no-admin bloqueados de /admin — redirige a /homepage
- [x] AuthProvider centralizado para reducir llamadas duplicadas a Supabase Auth
- [x] Bugs B-01 a B-16 corregidos (cache 503, slug support, paginación metadata, GA placeholder, newsletter subscribe alias)

### 🚧 Pendiente

Ningún pendiente abierto. El proyecto está feature-complete para portafolio/producción.

**Mejoras opcionales (post-MVP):**
- [ ] Rate limiting persistente con Redis/Upstash (el actual in-memory no sobrevive cold starts serverless)
- [ ] Rate limiting en `/api/reviews` y `/api/wishlist` para prevenir spam en producción
- [ ] Migrar a `/wishlist` en middleware para protección a nivel de ruta (actualmente solo protege la API)
- [ ] Tests de integración (Playwright/Vitest) para flujo de checkout y auth

---

## Variables de Entorno

Copia `.env.example` a `.env.local` y configura:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
RESEND_API_KEY=
CONTACT_EMAIL=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_SITE_URL=http://localhost:4028
```

### ¿Dónde obtener cada key?
| Variable | Dónde |
|----------|-------|
| Supabase URL + Anon Key | [supabase.com](https://supabase.com) → Settings → API |
| PayPal Client ID + Secret | [developer.paypal.com](https://developer.paypal.com) → Apps & Credentials → Sandbox |
| Resend API Key | [resend.com](https://resend.com) → API Keys |
| CONTACT_EMAIL | Email destino para formulario de contacto (ej: tu@empresa.com) |
| GA Measurement ID | [analytics.google.com](https://analytics.google.com) → Admin → Data Streams |

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
| dashboard-v2 | Ambos | Panel admin + integraciones |
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

1. **Antes de empezar:** Verifica que estás en la rama correcta
2. **Instalar dependencias:** `npm install` después de cada pull
3. **Verificar tipos:** `npm run type-check` antes de hacer commit
4. **Formatear código:** `npm run format` antes de hacer commit
5. **Regla de no-console:** No usar `console.log()` — revisar las reglas de ESLint
6. **Tipado:** Evitar `any` — usar interfaces de `src/types/index.ts`
7. **Componentes nuevos:** Crear en `src/components/ui/` si son reutilizables, o en `src/app/<page>/components/` si son específicos de página
8. **API routes nuevas:** Siempre verificar autenticación y rol (si aplica). Usar Zod para validación.
9. **Pull Requests:** Crear PR hacia `main` con descripción clara de los cambios

---

## Desarrollado por

**[Kodexa Solutions](https://kodexasolutions.com)** — Desarrollo web profesional para Latinoamérica

- WhatsApp: +507 6644-9530
- Instagram: @kodexasolutions
- Email: kodexasolutions@gmail.com
