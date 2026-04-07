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
- **Google Analytics** — GA4 tracking (componente condicional)

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
    │   ├── layout.tsx                  # Root layout (metadata, viewport, Toaster)
    │   ├── not-found.tsx               # Página 404 (español, animaciones)
    │   ├── robots.ts                   # robots.txt dinámico
    │   ├── sitemap.ts                  # sitemap.xml dinámico
    │   │
    │   ├── api/
    │   │   ├── auth/welcome/route.ts   # POST - Email de bienvenida
    │   │   ├── categories/route.ts     # GET, POST categorías (+Zod +admin)
    │   │   ├── contact/route.ts        # POST contacto (+Zod)
    │   │   ├── newsletter/route.ts     # POST newsletter (+Zod)
    │   │   ├── orders/
    │   │   │   ├── route.ts            # GET pedidos del usuario
    │   │   │   └── [id]/status/route.ts # PUT cambiar estado (+Zod +admin)
    │   │   ├── paypal/
    │   │   │   ├── create-order/route.ts  # POST crear orden PayPal
    │   │   │   └── capture-order/route.ts # POST capturar pago + email
    │   │   ├── products/
    │   │   │   ├── route.ts            # GET (filtros), POST (+Zod +admin)
    │   │   │   └── [id]/route.ts       # GET, PUT (+Zod +admin), DELETE (+admin)
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
    │   │   ├── layout.tsx              # Layout admin (sidebar + topbar)
    │   │   ├── page.tsx                # Dashboard con stats y gráficas
    │   │   ├── components/
    │   │   │   ├── AdminSidebar.tsx     # Sidebar colapsable
    │   │   │   ├── AdminTopbar.tsx      # Topbar con breadcrumbs + usuario
    │   │   │   ├── AdminModal.tsx       # Modal reutilizable
    │   │   │   ├── ChartCard.tsx        # Wrapper para gráficas
    │   │   │   ├── DataTable.tsx        # Tabla genérica (sort, search, paginación)
    │   │   │   └── StatCard.tsx         # Tarjeta de estadísticas
    │   │   ├── productos/
    │   │   │   ├── page.tsx            # Lista productos + buscar + eliminar
    │   │   │   ├── nuevo/page.tsx      # Crear producto (react-hook-form)
    │   │   │   └── [id]/editar/page.tsx # Editar producto
    │   │   ├── pedidos/
    │   │   │   ├── page.tsx            # Lista pedidos + filtro estado
    │   │   │   └── [id]/page.tsx       # Detalle pedido + cambiar estado
    │   │   ├── categorias/page.tsx     # Lista + crear categorías
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
    │   ├── product/[id]/              # Detalle de producto
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
    │   │   ├── page.tsx                # Checkout (en construcción)
    │   │   └── success/page.tsx        # Confirmación post-pago
    │   │
    │   ├── profile/
    │   │   ├── page.tsx                # Datos del perfil
    │   │   ├── settings/page.tsx       # Editar perfil (nombre, contraseña)
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
    │   ├── Header.tsx                  # Header global (auth-aware, mobile menu)
    │   ├── Footer.tsx                  # Footer global
    │   ├── GoogleAnalytics.tsx         # GA4 tracking condicional
    │   ├── SearchModal.tsx             # Búsqueda global (debounced)
    │   └── ui/
    │       ├── AppIcon.tsx             # Wrapper dinámico de Heroicons
    │       ├── AppImage.tsx            # Wrapper next/image con fallback
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
    │   ├── useProfile.ts              # Hook perfil + detección admin
    │   └── useWishlist.ts             # Hook wishlist (API-backed)
    │
    ├── lib/
    │   ├── admin.ts                    # requireAdmin helper
    │   ├── email.ts                    # Servicio de emails (Resend)
    │   ├── utils.ts                    # Helpers (formatPrice USD)
    │   ├── auth/
    │   │   └── verify-admin.ts         # verifyAdmin + verifyAuth helpers
    │   ├── paypal/
    │   │   ├── api.ts                  # getAccessToken + createPayPalOrder
    │   │   └── PayPalProvider.tsx      # Provider de PayPal
    │   ├── supabase/
    │   │   ├── client.ts              # Cliente browser
    │   │   ├── server.ts              # Cliente server
    │   │   ├── services.ts            # Funciones RPC (stored procedures)
    │   │   └── migrations/
    │   │       ├── admin-tables.sql   # Tablas admin (employees, suppliers, etc.)
    │   │       ├── newsletter.sql     # Tabla newsletter
    │   │       └── seed-data.sql      # Datos de prueba
    │   └── validations/
    │       └── index.ts               # Esquemas Zod centralizados
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

### Públicos (sin autenticación)

| Método | Ruta | Función |
|--------|------|---------|
| GET | /api/products?limit&offset&category&search | Listar productos con filtros |
| GET | /api/products/[id] | Obtener producto por ID |
| GET | /api/categories | Listar categorías |
| GET | /api/reviews?product_id | Listar reseñas de un producto |
| POST | /api/contact | Enviar formulario de contacto |
| POST | /api/newsletter | Suscribirse a newsletter |

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
| POST | /api/auth/welcome | Enviar email de bienvenida |

### Admin (requieren rol admin)

| Método | Ruta | Función |
|--------|------|---------|
| POST | /api/products | Crear producto |
| PUT | /api/products/[id] | Actualizar producto |
| DELETE | /api/products/[id] | Eliminar producto |
| POST | /api/categories | Crear categoría |
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

## Estado del Proyecto

### ✅ Completado

**Frontend (Diego):**
- [x] Landing page (7 secciones animadas con Framer Motion)
- [x] Catálogo con filtros por categoría, búsqueda y ordenamiento
- [x] Detalle de producto (galería zoom, variantes, tabs, reviews)
- [x] Carrito descompuesto en 6 componentes + PayPal Checkout
- [x] Checkout success page
- [x] Perfil de usuario + editar configuración (nombre, contraseña)
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
- [x] Panel Admin — Categorías (crear) + link en sidebar
- [x] Panel Admin — Inventario (stock, movimientos)
- [x] Panel Admin — Proveedores CRUD + lista de compras
- [x] Panel Admin — Empleados CRUD
- [x] Panel Admin — Facturación + reportes con gráficas
- [x] Panel Admin — Clientes
- [x] AuthField y StatusMessage en `components/ui/`
- [x] Toasts (sonner) en vez de `alert()`
- [x] Google Analytics componente condicional
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
- [x] Panel Admin — Categorías con editar/eliminar (modal)

**Backend (Anderson):**
- [x] GET/POST `/api/products` + Zod + verificación admin
- [x] GET/PUT/DELETE `/api/products/[id]` + Zod + verificación admin
- [x] GET/POST `/api/categories` + Zod + verificación admin
- [x] GET `/api/orders` (pedidos del usuario autenticado)
- [x] PUT `/api/orders/[id]/status` + Zod + admin
- [x] POST `/api/paypal/create-order` + `capture-order`
- [x] POST `/api/auth/welcome` (protegido con auth)
- [x] POST `/api/contact` + Zod
- [x] POST `/api/newsletter` + Zod
- [x] GET/POST/DELETE `/api/reviews` + Zod
- [x] GET/POST/DELETE `/api/wishlist` + Zod
- [x] GET `/api/admin/stats`
- [x] APIs admin completas (orders, inventory, suppliers, purchases, employees, invoices, reports, customers)
- [x] `verifyAdmin` helper reutilizable
- [x] `getAccessToken` extraído a `lib/paypal/api.ts`
- [x] Validación Zod en endpoints públicos
- [x] Interfaces TypeScript (Review, Invoice, Employee, Supplier, etc.)
- [x] Esquemas Zod centralizados en `lib/validations/`

### 🚧 Pendiente

**Diego (Frontend):**
- [x] Implementar `onClick` en botones de card: "Añadir al carrito" y "Favoritos" en FeaturedProducts, ProductGrid, RelatedProducts
- [x] Agregar links con filtro de categoría en CategoryBannersSection
- [ ] Completar links de navegación en Header (Categorías con filtro real)
- [x] Resolver doble-submit en modales admin (inventario, proveedores, empleados)
- [x] Enviar `phone` y `subject` al API contacto (actualmente solo se envían name, email, message)
- [x] Corregir selector de producto vacío en modal inventario (tab movimientos)
- [x] Eliminar `statusColors`/`statusLabels` duplicados en admin/page.tsx → usar `constants/index.ts`
- [x] Extraer `formatCurrency` a `lib/utils.ts` (duplicado en admin/page.tsx)
- [x] Eliminar `data-v-4914bf38=""` residual en NewsletterSection.tsx
- [x] Cambiar `<a href="/privacidad">` a `<Link>` en NewsletterSection
- [x] Agregar editar/eliminar categorías en admin
- [x] Extraer StarRating a componente reutilizable en `components/ui/`
- [x] Agregar links reales de redes sociales en Footer
- [x] Botón "Cargar más productos" funcional en catálogo
- [x] Confirmar WhatsApp real en contacto

**Anderson (Backend):**
- [ ] 🔴 Corregir `variant_id: ''` → `null` en capture-order
- [ ] 🔴 Comparar `serverTotal` vs monto capturado por PayPal en `capture-order`
- [ ] 🔴 Agregar error handling en `getAccessToken()` (`lib/paypal/api.ts`)
- [ ] 🔴 Sanitizar HTML en email de contacto (prevenir XSS)
- [ ] 🔴 Eliminar `ignoreBuildErrors: true` en `next.config.mjs` (producción)
- [ ] Agregar Zod en PayPal create/capture order
- [ ] Agregar Zod en admin endpoints (inventory, suppliers, employees, purchases, admin orders)
- [ ] Mover email hardcodeado a variable de entorno (`contact/route.ts`)
- [ ] Consolidar `lib/admin.ts` y `lib/auth/verify-admin.ts` en un solo módulo
- [ ] Unificar enums de estado de pedido (Zod vs admin inline)
- [ ] Agregar `phone` y `subject` al `contactSchema` y procesarlos en el API
- [ ] Agregar field filtering en PUT de suppliers (evitar inyección de columnas)
- [ ] Remover imports no usados (`startOfWeek`/`startOfMonth` en reports)
- [ ] Crear endpoint `/api/orders/[id]/receipt` para descarga PDF
- [ ] Agregar paginación en admin endpoints (customers, suppliers, employees, purchases)
- [ ] Rate limiting en endpoints críticos (welcome, contact, newsletter)
- [ ] Logging estructurado (reemplazar console.error)

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
