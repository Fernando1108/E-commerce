import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/auth/verify-admin';
import { productSchema } from '@/lib/validations';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit')) || 20;
  const offset = Number(searchParams.get('offset')) || 0;
  const categoryId = searchParams.get('category') || null;
  const search = searchParams.get('search') || null;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_products_with_category', {
    p_limit: limit,
    p_offset: offset,
    p_category_id: categoryId,
    p_search: search,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { error: authError, supabase } = await verifyAdmin();
  if (authError) return authError;

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      ...parsed.data,
      slug: parsed.data.slug || parsed.data.name.toLowerCase().replace(/\s+/g, '-'),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
