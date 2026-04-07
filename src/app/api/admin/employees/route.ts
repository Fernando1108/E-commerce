import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'

export async function GET() {
  const { error, supabase } = await requireAdmin()
  if (error) return error

  const { data, error: dbError } = await supabase
    .from('employees')
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

  const { data, error: dbError } = await supabase.from('employees').insert({
    name: body.name,
    position: body.position || null,
    department: body.department || null,
    phone: body.phone || null,
    email: body.email || null,
    hire_date: body.hire_date || new Date().toISOString().split('T')[0],
    salary: body.salary ? Number(body.salary) : 0,
    status: body.status || 'active',
    user_id: body.user_id || null,
  }).select().single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
