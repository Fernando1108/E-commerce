import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';

// GET - Order detail with items and profile
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const [orderResult, itemsResult] = await Promise.all([
    supabase.from('orders').select('*, profiles(name, phone)').eq('id', id).single(),
    supabase.from('order_items').select('*, products(name, image_url, price)').eq('order_id', id),
  ]);

  if (orderResult.error)
    return NextResponse.json({ error: orderResult.error.message }, { status: 500 });

  return NextResponse.json({
    ...orderResult.data,
    items: itemsResult.data || [],
  });
}

// PUT - Update order status
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const { status } = await request.json();
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { error: `Estado inválido. Válidos: ${validStatuses.join(', ')}` },
      { status: 400 }
    );
  }

  const { data, error: dbError } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(data);
}
