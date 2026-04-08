import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/verify-admin';
import { z } from 'zod';

const supplierSchema = z.object({
  name: z.string().min(1).max(200),
  contact_name: z.string().max(200).nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().max(50).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  country: z.string().max(100).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const parsed = supplierSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  // Solo los campos validados por Zod se envían a Supabase
  const { data, error: dbError } = await supabase
    .from('suppliers')
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

  const { error: dbError } = await supabase.from('suppliers').delete().eq('id', id);
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
