import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/verify-admin';
import { logger } from '@/lib/logger';

export async function GET() {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const { data, error: dbError } = await supabase
    .from('invoices')
    .select('*, orders(id, status, total, created_at, user_id, profiles(name))')
    .order('created_at', { ascending: false })
    .limit(100);

  if (dbError) {
    logger.error('Admin invoices error', { error: dbError.message });
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }
  return NextResponse.json(data || []);
}
