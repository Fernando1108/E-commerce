import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/verify-admin';
import { getPagination, paginatedResponse } from '@/lib/pagination';
import { logger } from '@/lib/logger';

// GET - All orders (admin only) with optional filters and pagination
export async function GET(request: Request) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const url = new URL(request.url);
  const { page, limit, offset, search } = getPagination(url.searchParams);
  const status = url.searchParams.get('status');

  let query = supabase
    .from('orders')
    .select('*, profiles(name, phone)', { count: 'exact' });

  if (status && status !== 'all') query = query.eq('status', status);
  if (search) query = query.or(`id.ilike.%${search}%`);

  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

  const { data, error: dbError, count } = await query;
  if (dbError) {
    logger.error('Admin orders list error', { error: dbError.message });
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(paginatedResponse(data || [], count || 0, page, limit));
}
