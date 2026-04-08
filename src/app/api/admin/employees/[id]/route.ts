import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/verify-admin';
import { z } from 'zod';

const employeeSchema = z.object({
  name: z.string().min(1).max(200),
  position: z.string().max(200).nullable().optional(),
  department: z.string().max(200).nullable().optional(),
  phone: z.string().max(50).nullable().optional(),
  email: z.string().email().nullable().optional(),
  hire_date: z.string().nullable().optional(),
  salary: z.number().min(0).nullable().optional(),
  status: z.enum(['active', 'inactive', 'terminated']).optional().default('active'),
  role: z.string().max(100).nullable().optional(),
});

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const parsed = employeeSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { data, error: dbError } = await supabase
    .from('employees')
    .update(parsed.data)
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
