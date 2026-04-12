-- Fix seed products that all share the same created_at timestamp.
-- Spreads them across a random window of up to 30 days before the original date,
-- so that sort=newest produces meaningful ordering.
UPDATE products
SET created_at = created_at - (random() * interval '30 days')
WHERE created_at = (SELECT MIN(created_at) FROM products);
