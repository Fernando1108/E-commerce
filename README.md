# NovaStore — E-commerce Platform

Plataforma e-commerce moderna con sistema de pagos real, autenticación, gestión de productos y emails transaccionales.

**Desarrollado por [Kodexa Solutions](https://kodexasolutions.com)**

---

## Stack Técnico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js 15 (App Router) | ^15.5.14 |
| Lenguaje | TypeScript | ^5 |
| UI | React 19 + Tailwind CSS 3.4 | 19.0.3 |
| Animaciones | Framer Motion | ^11.15 |
| Base de datos | Supabase (PostgreSQL) | ^2.101 |
| Autenticación | Supabase Auth | ^0.10 |
| Pagos | PayPal (Sandbox/Live) | ^9.1 |
| Emails | Resend + React Email | ^6.10 |
| Estado global | Zustand (persist) | ^5.0 |
| Formularios | React Hook Form | ^7.72 |
| Iconos | Heroicons React | ^2.2 |
| Deploy | Netlify | - |

---

## Integraciones

- **Supabase** — Base de datos PostgreSQL, autenticación (email + Google OAuth), Row Level Security
- **PayPal** — Checkout, captura de pagos, modo Sandbox para desarrollo
- **Resend** — Emails transaccionales (confirmación de pedido, bienvenida)
- **jsPDF** — Generación de comprobantes de pago en PDF

---

## Estructura del Proyecto
```text
src/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── not-found.tsx                 # Página 404 (español)
│   ├── robots.ts                     # robots.txt dinámico
│   ├── sitemap.ts                    # sitemap.xml dinámico
│   ├── api/
│   │   ├── auth/welcome/route.ts     # POST - Email de bienvenida
│   │   ├── categories/route.ts       # GET, POST categorías
│   │   ├── orders/route.ts           # GET pedidos del usuario
│   │   ├── orders/[id]/receipt/route.ts  # GET comprobante PDF
│   │   ├── paypal/
│   │   │   ├── create-order/route.ts # POST crear orden PayPal
│   │   │   └── capture-order/route.ts # POST capturar pago + email
│   │   └── products/
│   │       ├── route.ts              # GET (filtros), POST
│   │       └── [id]/route.ts         # GET, PUT, DELETE
│   ├── auth/
│   │   ├── callback/route.ts         # OAuth callback (Supabase)
│   │   ├── login/page.tsx            # Login (Supabase Auth)
│   │   ├── register/page.tsx         # Registro (Supabase Auth)
│   │   └── forgot-password/page.tsx  # Recuperar contraseña
│   ├── cart/page.tsx                  # Carrito + PayPal Checkout
│   ├── checkout/success/page.tsx     # Confirmación post-pago
│   ├── contacto/page.tsx             # Formulario de contacto
│   ├── devoluciones/page.tsx         # Política de devoluciones
│   ├── envios/page.tsx               # Política de envíos
│   ├── homepage/                     # Landing page (7 secciones)
│   ├── privacidad/page.tsx           # Política de privacidad
│   ├── product/[id]/page.tsx         # Detalle de producto
│   ├── products/                     # Catálogo con filtros
│   ├── profile/                      # Perfil de usuario
│   │   ├── page.tsx                  # Datos del perfil
│   │   └── settings/page.tsx         # Editar perfil
│   └── terminos/page.tsx             # Términos y condiciones
├── components/
│   ├── Header.tsx                    # Header global (auth-aware)
│   ├── Footer.tsx                    # Footer global
│   └── ui/                           # Componentes reutilizables
├── emails/
│   ├── OrderConfirmation.tsx         # Template confirmación pedido
│   └── Welcome.tsx                   # Template bienvenida
├── hooks/
│   ├── useAuth.ts                    # Hook de autenticación (Supabase)
│   └── useCart.ts                    # Hook del carrito
├── lib/
│   ├── email.ts                      # Servicio de emails (Resend)
│   ├── utils.ts                      # Helpers (formatPrice USD)
│   ├── paypal/PayPalProvider.tsx      # Provider de PayPal
│   ├── pdf/generate-receipt.ts       # Generador de comprobantes PDF
│   └── supabase/
│       ├── client.ts                 # Cliente browser
│       ├── server.ts                 # Cliente server
│       └── services.ts              # Funciones RPC (stored procedures)
├── store/
│   └── cart-store.ts                 # Zustand store (persistencia localStorage)
├── types/
│   └── index.ts                      # Interfaces TypeScript globales
└── styles/
    ├── index.css
    └── tailwind.css
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
| GET | /api/orders/[id]/receipt | Descargar comprobante PDF | ✅ |
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
- **users** — Perfiles de usuario
- **roles / permissions / role_permissions** — Sistema de roles
- **employees** — Empleados
- **suppliers / purchases / purchase_items** — Proveedores y compras

---

## Roadmap

- [x] UI/UX — Landing, catálogo, detalle de producto, carrito
- [x] SEO — Metadata, sitemap, robots.txt, Open Graph
- [x] Supabase — Cliente, tipos, productos desde DB (RPC)
- [x] Auth — Login, registro, Google OAuth, recuperar contraseña (Supabase Auth)
- [x] Carrito — Zustand store con persistencia en localStorage
- [x] PayPal — Checkout + captura de pagos (Sandbox)
- [x] Emails — Confirmación de pedido + bienvenida (Resend)
- [x] Comprobante PDF — Generación y descarga con jsPDF
- [x] Páginas legales — Envíos, devoluciones, privacidad, términos
- [x] Perfil — Página de perfil + editar configuración
- [x] Contacto — Formulario de contacto
- [x] Middleware — Protección de rutas con Supabase Auth
- [ ] Panel Admin — Gestión de productos, pedidos y categorías
- [ ] Historial de pedidos — UI con descarga de comprobante
- [ ] Formulario de contacto — Conectar a endpoint real (enviar email)
- [ ] Newsletter — Endpoint de suscripción
- [ ] Google Analytics — Implementar tracking
- [ ] Búsqueda global — Barra de búsqueda en header
- [ ] Wishlist — Lista de deseos con persistencia

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
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev  # Puerto 4028

# Verificar tipos
npx tsc --noEmit

# Build de producción
npm run build
```

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

---

## Desarrollado por

**[Kodexa Solutions](https://kodexasolutions.com)** — Desarrollo web profesional para Latinoamérica

- WhatsApp: +507 6644-9530
- Instagram: @kodexasolutions
- Email: kodexasolutions@gmail.com
