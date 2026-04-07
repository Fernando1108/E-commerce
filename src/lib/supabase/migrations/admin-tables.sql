-- ============================================================
-- NovaStore Admin Panel — Migración de tablas
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- ─── ROLES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── PERMISSIONS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── ROLE_PERMISSIONS (junction) ────────────────────────────
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- ─── EMPLOYEES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  position TEXT,
  department TEXT,
  phone TEXT,
  email TEXT,
  hire_date DATE DEFAULT CURRENT_DATE,
  salary NUMERIC(12, 2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── SUPPLIERS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── PURCHASES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  total NUMERIC(12, 2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── PURCHASE_ITEMS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS purchase_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0
);

-- ─── INVENTORY_MOVEMENTS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
  quantity INT NOT NULL,
  reason TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── INVOICES (si no existe) ────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'cancelled', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── SHIPMENTS (si no existe) ───────────────────────────────
CREATE TABLE IF NOT EXISTS shipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  carrier TEXT,
  tracking_number TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'shipped', 'in_transit', 'delivered', 'returned')),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── ÍNDICES ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_purchases_supplier ON purchases(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);
CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase ON purchase_items(purchase_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_product ON inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_type ON inventory_movements(type);
CREATE INDEX IF NOT EXISTS idx_invoices_order ON invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_order ON shipments(order_id);

-- ─── RLS POLICIES (básicas para admin) ──────────────────────
-- Habilitar RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Políticas: solo usuarios con rol admin pueden leer/escribir
-- (ajustar según sea necesario)

CREATE POLICY "Admin full access employees" ON employees
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admin full access suppliers" ON suppliers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admin full access purchases" ON purchases
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admin full access purchase_items" ON purchase_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admin full access inventory_movements" ON inventory_movements
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admin full access invoices" ON invoices
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admin full access shipments" ON shipments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admin full access roles" ON roles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admin full access permissions" ON permissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admin full access role_permissions" ON role_permissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );
