import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';

// GET - Inventory movements + products with stock info
export async function GET(request: Request) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const view = searchParams.get('view') || 'movements'; // 'movements' | 'stock'

  if (view === 'stock') {
    const { data, error: dbError } = await supabase
      .from('products')
      .select('id, name, image_url, stock, price, category_id, categories(name)')
      .order('stock', { ascending: true });

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
    return NextResponse.json(data || []);
  }

  // movements
  const { data, error: dbError } = await supabase
    .from('inventory_movements')
    .select('*, products(name, image_url)')
    .order('created_at', { ascending: false })
    .limit(100);

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(data || []);
}

// POST - Register inventory movement
export async function POST(request: Request) {
  const { error, supabase, user } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const { product_id, type, quantity, reason } = body;

  if (!product_id || !type || !quantity) {
    return NextResponse.json(
      { error: 'product_id, type y quantity son obligatorios' },
      { status: 400 }
    );
  }

  if (!['in', 'out', 'adjustment'].includes(type)) {
    return NextResponse.json({ error: 'type debe ser: in, out, adjustment' }, { status: 400 });
  }

  // Insert movement
  const { data, error: dbError } = await supabase
    .from('inventory_movements')
    .insert({
      product_id,
      type,
      quantity: Number(quantity),
      reason: reason || null,
      created_by: user!.id,
    })
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

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
