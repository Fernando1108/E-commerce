import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/auth/verify-admin';
import { productSchema } from '@/lib/validations';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit')) || 20));
  const offset = Math.max(0, Number(searchParams.get('offset')) || 0);
  const categoryId = searchParams.get('category') || null;
  const search = searchParams.get('search') || null;
  const sort = searchParams.get('sort') || null;

  const supabase = await createClient();

  // Count total (parallel with products)
  let countQuery = supabase.from('products').select('*', { count: 'exact', head: true });
  if (categoryId) countQuery = countQuery.eq('category_id', categoryId);
  if (search) countQuery = countQuery.ilike('name', `%${search}%`);

  const [productsResult, countResult] = await Promise.all([
    supabase.rpc('get_products_with_category', {
      p_limit: limit,
      p_offset: offset,
      p_category_id: categoryId,
      p_search: search,
    }),
    countQuery,
  ]);

  const { data, error } = productsResult;
  const { count } = countResult;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let products = data || [];
  if (sort === 'newest') {
    products = [...products].sort(
      (a: { created_at: string }, b: { created_at: string }) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  return NextResponse.json(
    {
      products,
      total: count || 0,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    },
    {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
    }
  );
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
