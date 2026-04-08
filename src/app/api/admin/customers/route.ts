import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/verify-admin';
import { getPagination, paginatedResponse } from '@/lib/pagination';

export async function GET(request: Request) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const { page, limit, offset, search } = getPagination(new URL(request.url).searchParams);

  // Get count (with search filter if applicable)
  let countQuery = supabase.from('profiles').select('*', { count: 'exact', head: true });
  if (search) {
    countQuery = countQuery.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
  }
  const { count } = await countQuery;

  // Get paginated users with optional search
  let query = supabase
    .from('profiles')
    .select('id, name, phone, role, created_at')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  const { data: profiles, error: pError } = await query;

  if (pError) return NextResponse.json({ error: pError.message }, { status: 500 });

  // Get order stats per user
  const { data: orders, error: oError } = await supabase.from('orders').select('user_id, total');

  if (oError) return NextResponse.json({ error: oError.message }, { status: 500 });

  // Aggregate
  const orderStats: Record<string, { count: number; total: number }> = {};
  for (const order of orders || []) {
    if (!orderStats[order.user_id]) orderStats[order.user_id] = { count: 0, total: 0 };
    orderStats[order.user_id].count += 1;
    orderStats[order.user_id].total += order.total || 0;
  }

  const customers = (profiles || []).map((p) => ({
    ...p,
    order_count: orderStats[p.id]?.count || 0,
    total_spent: Math.round((orderStats[p.id]?.total || 0) * 100) / 100,
  }));

  return NextResponse.json(paginatedResponse(customers, count || 0, page, limit));
}
