import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const { data, error: dbError } = await supabase
    .from('employees')
    .update({
      name: body.name,
      position: body.position,
      department: body.department,
      phone: body.phone,
      email: body.email,
      hire_date: body.hire_date,
      salary: body.salary ? Number(body.salary) : undefined,
      status: body.status,
    })
    .eq('id', id)
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const { error: dbError } = await supabase.from('employees').delete().eq('id', id);
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
