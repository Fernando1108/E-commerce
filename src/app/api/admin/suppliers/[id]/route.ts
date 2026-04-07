import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error, supabase } = await requireAdmin()
  if (error) return error

  const body = await request.json()
  const { data, error: dbError } = await supabase.from('suppliers').update(body).eq('id', id).select().single()
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error, supabase } = await requireAdmin()
  if (error) return error

  const { error: dbError } = await supabase.from('suppliers').delete().eq('id', id)
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json({ deleted: true })
}
