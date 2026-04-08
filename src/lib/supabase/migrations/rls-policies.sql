-- ═══════════════════════════════════════════
-- RLS para tablas principales
-- ═══════════════════════════════════════════

-- Products: lectura pública, escritura admin
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Products public read" ON products;
CREATE POLICY "Products public read" ON products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Products admin write" ON products;
CREATE POLICY "Products admin write" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Categories: lectura pública, escritura admin
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Categories public read" ON categories;
CREATE POLICY "Categories public read" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Categories admin write" ON categories;
CREATE POLICY "Categories admin write" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Orders: usuario ve las suyas, admin ve todas
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Orders own read" ON orders;
CREATE POLICY "Orders own read" ON orders FOR SELECT USING (
  user_id::text = auth.uid()::text OR
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
DROP POLICY IF EXISTS "Orders admin write" ON orders;
CREATE POLICY "Orders admin write" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Order Items: mismo que orders
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Order items access" ON order_items;
CREATE POLICY "Order items access" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (
      orders.user_id::text = auth.uid()::text OR
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    )
  )
);

-- Reviews: lectura pública, escritura usuario autenticado, delete autor o admin
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Reviews public read" ON reviews;
CREATE POLICY "Reviews public read" ON reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Reviews auth insert" ON reviews;
CREATE POLICY "Reviews auth insert" ON reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Reviews own or admin delete" ON reviews;
CREATE POLICY "Reviews own or admin delete" ON reviews FOR DELETE USING (
  user_id::text = auth.uid()::text OR
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Wishlist: solo el usuario ve/modifica la suya
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Wishlist own access" ON wishlist;
CREATE POLICY "Wishlist own access" ON wishlist FOR ALL USING (user_id::text = auth.uid()::text);

-- Cart Items: solo el usuario ve/modifica los suyos
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cart own access" ON cart_items;
CREATE POLICY "Cart own access" ON cart_items FOR ALL USING (user_id::text = auth.uid()::text);

-- Coupons: lectura pública
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Coupons public read" ON coupons;
CREATE POLICY "Coupons public read" ON coupons FOR SELECT USING (true);
DROP POLICY IF EXISTS "Coupons admin write" ON coupons;
CREATE POLICY "Coupons admin write" ON coupons FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Product Images: lectura pública, escritura admin
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Product images public read" ON product_images;
CREATE POLICY "Product images public read" ON product_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Product images admin write" ON product_images;
CREATE POLICY "Product images admin write" ON product_images FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Product Variants: lectura pública, escritura admin
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Variants public read" ON product_variants;
CREATE POLICY "Variants public read" ON product_variants FOR SELECT USING (true);
DROP POLICY IF EXISTS "Variants admin write" ON product_variants;
CREATE POLICY "Variants admin write" ON product_variants FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Newsletter: solo admin lee, inserción pública
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Newsletter public insert" ON newsletter_subscribers;
CREATE POLICY "Newsletter public insert" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Newsletter admin read" ON newsletter_subscribers;
CREATE POLICY "Newsletter admin read" ON newsletter_subscribers FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
