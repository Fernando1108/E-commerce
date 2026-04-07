import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin'

// GET - Listar productos con filtros (público)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get('limit')) || 20
  const offset = Number(searchParams.get('offset')) || 0
  const categoryId = searchParams.get('category') || null
  const search = searchParams.get('search') || null

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_products_with_category', {
    p_limit: limit,
    p_offset: offset,
    p_category_id: categoryId,
    p_search: search,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST - Crear producto (requiere admin)
export async function POST(request: Request) {
  const { error: authError, supabase } = await requireAdmin()
  if (authError) return authError

  const body = await request.json()
  const { data, error } = await supabase.from('products').insert({
    name: body.name,
    description: body.description,
    price: body.price,
    original_price: body.original_price || null,
    badge: body.badge || null,
    category_id: body.category_id,
    image_url: body.image_url || null,
    slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
    stock: body.stock || 0,
    featured: body.featured || false,
    specs: body.specs || {},
    highlights: body.highlights || [],
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
