import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAuth } from '@/lib/auth/verify-admin'
import { reviewSchema } from '@/lib/validations'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('product_id')

  if (!productId) {
    return NextResponse.json({ error: 'product_id requerido' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at, user_id, profiles(name)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const { error: authError, user, supabase } = await verifyAuth()
  if (authError) return authError

  const body = await request.json()
  const parsed = reviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  // Verificar que no haya review duplicada
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('product_id', parsed.data.product_id)
    .eq('user_id', user!.id)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Ya dejaste una reseña para este producto' }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      product_id: parsed.data.product_id,
      user_id: user!.id,
      rating: parsed.data.rating,
      comment: parsed.data.comment || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
