import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'

export async function GET() {
  const { error, supabase } = await requireAdmin()
  if (error) return error

  const { data, error: dbError } = await supabase
    .from('suppliers')
    .select('*')
    .order('created_at', { ascending: false })

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function POST(request: Request) {
  const { error, supabase } = await requireAdmin()
  if (error) return error

  const body = await request.json()
  if (!body.name) return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })

  const { data, error: dbError } = await supabase.from('suppliers').insert({
    name: body.name,
    contact_name: body.contact_name || null,
    email: body.email || null,
    phone: body.phone || null,
    address: body.address || null,
    city: body.city || null,
    country: body.country || null,
    notes: body.notes || null,
    status: body.status || 'active',
  }).select().single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
