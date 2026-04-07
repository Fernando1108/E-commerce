import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/verify-admin';
import { wishlistSchema } from '@/lib/validations';

export async function GET() {
  const { error: authError, user, supabase } = await verifyAuth();
  if (authError) return authError;

  const { data, error } = await supabase
    .from('wishlist')
    .select('id, product_id, created_at, products(id, name, price, image_url, slug, stock)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { error: authError, user, supabase } = await verifyAuth();
  if (authError) return authError;

  const body = await request.json();
  const parsed = wishlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('wishlist')
    .upsert(
      { user_id: user!.id, product_id: parsed.data.product_id },
      { onConflict: 'user_id,product_id' }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
