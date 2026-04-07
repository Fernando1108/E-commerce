import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'

export async function GET() {
  const { error, supabase } = await requireAdmin()
  if (error) return error

  const { data, error: dbError } = await supabase
    .from('purchases')
    .select('*, suppliers(name)')
    .order('created_at', { ascending: false })

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function POST(request: Request) {
  const { error, supabase } = await requireAdmin()
  if (error) return error

  const body = await request.json()
  const { supplier_id, items, notes } = body

  if (!supplier_id || !items?.length) {
    return NextResponse.json({ error: 'supplier_id e items son obligatorios' }, { status: 400 })
  }

  const total = items.reduce((sum: number, i: { quantity: number; unit_price: number }) => sum + i.quantity * i.unit_price, 0)

  const { data: purchase, error: pError } = await supabase.from('purchases').insert({
    supplier_id, total, notes: notes || null, status: 'pending',
  }).select().single()

  if (pError) return NextResponse.json({ error: pError.message }, { status: 500 })

  const purchaseItems = items.map((i: { product_id: string; quantity: number; unit_price: number }) => ({
    purchase_id: purchase.id,
    product_id: i.product_id,
    quantity: i.quantity,
    unit_price: i.unit_price,
  }))

  await supabase.from('purchase_items').insert(purchaseItems)

  return NextResponse.json(purchase, { status: 201 })
}
