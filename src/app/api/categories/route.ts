import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_categories_with_count');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST - Crear categoría (requiere admin)
export async function POST(request: Request) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError) return authError;

  const body = await request.json();
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: body.name,
      description: body.description || null,
      image_url: body.image_url || null,
      accent_color: body.accent_color || '#6C63FF',
      display_size: body.display_size || 'normal',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
