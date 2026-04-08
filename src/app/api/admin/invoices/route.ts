import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/verify-admin';
import { getPagination, paginatedResponse } from '@/lib/pagination';
import { logger } from '@/lib/logger';

export async function GET(request: Request) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const { page, limit, offset } = getPagination(new URL(request.url).searchParams);

  const { data, error: dbError, count } = await supabase
    .from('invoices')
    .select('*, orders(id, status, total, created_at, user_id, profiles(name))', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (dbError) {
    logger.error('Admin invoices error', { error: dbError.message });
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(paginatedResponse(data || [], count || 0, page, limit));
}
