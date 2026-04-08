import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/verify-admin';
import { z } from 'zod';
import { getPagination, paginatedResponse } from '@/lib/pagination';

const purchaseSchema = z.object({
  supplier_id: z.string().uuid(),
  total: z.number().min(0),
  status: z.enum(['pending', 'received', 'cancelled']).optional().default('pending'),
  notes: z.string().max(1000).nullable().optional(),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive(),
    unit_price: z.number().positive(),
  })).optional(),
});

export async function GET(request: Request) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const { page, limit, offset } = getPagination(new URL(request.url).searchParams);

  // Get count
  const { count } = await supabase.from('purchases').select('*', { count: 'exact', head: true });

  const { data, error: dbError } = await supabase
    .from('purchases')
    .select('*, suppliers(name)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(paginatedResponse(data || [], count || 0, page, limit));
}

export async function POST(request: Request) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const parsed = purchaseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { supplier_id, items, notes, status, total } = parsed.data;

  const { data: purchase, error: pError } = await supabase
    .from('purchases')
    .insert({
      supplier_id,
      total,
      notes: notes || null,
      status,
    })
    .select()
    .single();

  if (pError) return NextResponse.json({ error: pError.message }, { status: 500 });

  if (items && items.length > 0) {
    const purchaseItems = items.map(
      (i) => ({
        purchase_id: purchase.id,
        product_id: i.product_id,
        quantity: i.quantity,
        unit_price: i.unit_price,
      })
    );

    await supabase.from('purchase_items').insert(purchaseItems);
  }

  return NextResponse.json(purchase, { status: 201 });
}
