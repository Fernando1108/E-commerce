import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/verify-admin';
import { z } from 'zod';
import { getPagination, paginatedResponse } from '@/lib/pagination';

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

export async function GET(request: Request) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const { page, limit, offset, search } = getPagination(new URL(request.url).searchParams);

  // Get count
  const { count } = await supabase.from('suppliers').select('*', { count: 'exact', head: true });

  // Get paginated suppliers with optional search
  let query = supabase
    .from('suppliers')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error: dbError } = await query;

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(paginatedResponse(data || [], count || 0, page, limit));
}

export async function POST(request: Request) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const parsed = supplierSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { data, error: dbError } = await supabase
    .from('suppliers')
    .insert(parsed.data)
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
