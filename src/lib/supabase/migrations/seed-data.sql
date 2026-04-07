-- ============================================================
-- NovaStore Admin Panel — Datos de ejemplo (Seed)
-- Ejecutar en Supabase SQL Editor DESPUÉS de admin-tables.sql
-- ============================================================

-- ─── ROLES ──────────────────────────────────────────────────
INSERT INTO roles (name, description) VALUES
  ('admin', 'Acceso total al sistema. Puede gestionar todos los módulos.'),
  ('editor', 'Puede editar productos, categorías e inventario. No puede gestionar empleados ni configuración.'),
  ('viewer', 'Solo lectura. Puede ver reportes y datos pero no modificar.')
ON CONFLICT (name) DO NOTHING;

-- ─── PERMISSIONS ────────────────────────────────────────────
INSERT INTO permissions (name, description) VALUES
  ('products.read', 'Ver productos'),
  ('products.write', 'Crear y editar productos'),
  ('products.delete', 'Eliminar productos'),
  ('orders.read', 'Ver pedidos'),
  ('orders.write', 'Gestionar pedidos (cambiar estado)'),
  ('inventory.read', 'Ver inventario'),
  ('inventory.write', 'Registrar movimientos de inventario'),
  ('suppliers.read', 'Ver proveedores'),
  ('suppliers.write', 'Gestionar proveedores'),
  ('employees.read', 'Ver empleados'),
  ('employees.write', 'Gestionar empleados'),
  ('invoices.read', 'Ver facturas'),
  ('invoices.write', 'Gestionar facturas'),
  ('reports.read', 'Ver reportes'),
  ('customers.read', 'Ver clientes'),
  ('settings.write', 'Modificar configuración del sistema')
ON CONFLICT (name) DO NOTHING;

-- ─── ROLE_PERMISSIONS ───────────────────────────────────────
-- Admin: todos los permisos
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'admin'
ON CONFLICT DO NOTHING;

-- Editor: productos, pedidos, inventario, proveedores
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'editor'
  AND p.name IN (
    'products.read', 'products.write',
    'orders.read', 'orders.write',
    'inventory.read', 'inventory.write',
    'suppliers.read', 'suppliers.write',
    'invoices.read',
    'reports.read',
    'customers.read'
  )
ON CONFLICT DO NOTHING;

-- Viewer: solo lectura
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'viewer'
  AND p.name IN (
    'products.read',
    'orders.read',
    'inventory.read',
    'suppliers.read',
    'employees.read',
    'invoices.read',
    'reports.read',
    'customers.read'
  )
ON CONFLICT DO NOTHING;

-- ─── EMPLOYEES ──────────────────────────────────────────────
INSERT INTO employees (name, position, department, phone, email, hire_date, salary, status) VALUES
  ('Carlos Méndez', 'Gerente de Operaciones', 'Operaciones', '+507 6234-5678', 'carlos@novastore.com', '2024-01-15', 3500.00, 'active'),
  ('María López', 'Diseñadora UI/UX', 'Tecnología', '+507 6345-6789', 'maria@novastore.com', '2024-03-01', 2800.00, 'active'),
  ('José Rodríguez', 'Asistente de Almacén', 'Logística', '+507 6456-7890', 'jose@novastore.com', '2024-06-10', 1500.00, 'active');

-- ─── SUPPLIERS ──────────────────────────────────────────────
INSERT INTO suppliers (name, contact_name, email, phone, address, city, country, notes, status) VALUES
  ('TechWorld Distribution', 'Ana García', 'ventas@techworld.com', '+1 305-555-0101', '1200 Brickell Ave, Suite 400', 'Miami', 'Estados Unidos', 'Proveedor principal de electrónicos y gadgets.', 'active'),
  ('GadgetPro Asia', 'Wei Chen', 'orders@gadgetpro.cn', '+86 755-8888-0202', 'Shenzhen Tech Park, Building 7', 'Shenzhen', 'China', 'Proveedor de accesorios y periféricos. Envío marítimo 30 días.', 'active'),
  ('Nordic Accessories', 'Lars Eriksson', 'info@nordicacc.se', '+46 8-555-0303', 'Sveavägen 44', 'Estocolmo', 'Suecia', 'Accesorios premium de diseño escandinavo.', 'inactive');

-- ─── INVENTORY MOVEMENTS (ejemplo con primeros productos) ──
-- Nota: usa product_id reales de tu tabla products
-- Estos inserts se ejecutarán solo si hay productos
INSERT INTO inventory_movements (product_id, type, quantity, reason)
SELECT id, 'in', 50, 'Stock inicial — apertura de tienda'
FROM products LIMIT 3;

INSERT INTO inventory_movements (product_id, type, quantity, reason)
SELECT id, 'out', 5, 'Venta online — pedido manual'
FROM products LIMIT 2;

INSERT INTO inventory_movements (product_id, type, quantity, reason)
SELECT id, 'adjustment', -2, 'Ajuste de inventario — producto dañado'
FROM products LIMIT 1;
