import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'

// GET - All orders (admin only) with optional filters
export async function GET(request: Request) {
  const { error, supabase } = await requireAdmin()
  if (error) return error

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const limit = Number(searchParams.get('limit')) || 50
  const offset = Number(searchParams.get('offset')) || 0

  let query = supabase
    .from('orders')
    .select('*, profiles(name, phone)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status)

  const { data, error: dbError, count } = await query
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  return NextResponse.json({ data: data || [], total: count || 0 })
}
