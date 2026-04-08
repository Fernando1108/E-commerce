import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/verify-admin';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { getPagination, paginatedResponse } from '@/lib/pagination';

const inventoryMovementSchema = z.object({
  product_id: z.string().uuid(),
  type: z.enum(['in', 'out', 'adjustment']),
  quantity: z.number().int(),
  reason: z.string().max(500).nullable().optional(),
});

// GET - Inventory movements + products with stock info
export async function GET(request: Request) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const url = new URL(request.url);
  const view = url.searchParams.get('view') || 'movements'; // 'movements' | 'stock'

  if (view === 'stock') {
    const { data, error: dbError } = await supabase
      .from('products')
      .select('id, name, image_url, stock, price, category_id, categories(name)')
      .order('stock', { ascending: true });

    if (dbError) {
      logger.error('Admin inventory stock error', { error: dbError.message });
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }
    return NextResponse.json(data || []);
  }

  // movements — paginated
  const { page, limit, offset } = getPagination(url.searchParams);

  const { data, error: dbError, count } = await supabase
    .from('inventory_movements')
    .select('*, products(name, image_url)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (dbError) {
    logger.error('Admin inventory movements error', { error: dbError.message });
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }
  return NextResponse.json(paginatedResponse(data || [], count || 0, page, limit));
}

// POST - Register inventory movement
export async function POST(request: Request) {
  const { error, supabase, user } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const parsed = inventoryMovementSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { product_id, type, quantity, reason } = parsed.data;

  // Insert movement
  const { data, error: dbError } = await supabase
    .from('inventory_movements')
    .insert({
      product_id,
      type,
      quantity,
      reason: reason || null,
      created_by: user!.id,
    })
    .select()
    .single();

  if (dbError) {
    logger.error('Admin inventory movement create error', { error: dbError.message });
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // Update product stock — try RPC first, fallback to manual
  const stockChange =
    type === 'out' ? -Math.abs(quantity) : type === 'in' ? Math.abs(quantity) : quantity;
  try {
    await supabase.rpc('update_product_stock', {
      p_product_id: product_id,
      p_quantity_change: stockChange,
    });
  } catch {
    // If RPC doesn't exist, fetch current stock and update manually
    const { data: product } = await supabase
      .from('products')
      .select('stock')
      .eq('id', product_id)
      .single();
    if (product) {
      await supabase
        .from('products')
        .update({ stock: (product.stock || 0) + stockChange })
        .eq('id', product_id);
    }
  }

  return NextResponse.json(data, { status: 201 });
}
