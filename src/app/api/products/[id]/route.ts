import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/auth/verify-admin';
import { productSchema } from '@/lib/validations';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Detect UUID vs slug
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  try {
    if (isUUID) {
      const { data, error } = await supabase.rpc('get_product_by_id', { p_id: id });
      if (error) throw error;
      if (!data || data.length === 0) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
      }
      return NextResponse.json(data[0]);
    } else {
      // Search by slug
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('slug', id)
        .single();
      if (error || !data) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
      }
      return NextResponse.json(data);
    }
  } catch {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error: authError, supabase } = await verifyAdmin();
  if (authError) return authError;

  const body = await request.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('products')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error: authError, supabase } = await verifyAdmin();
  if (authError) return authError;

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
