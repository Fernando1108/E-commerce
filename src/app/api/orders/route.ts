import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/verify-admin';

// GET - Pedidos del usuario autenticado
export async function GET() {
  const { error: authError, user, supabase } = await verifyAuth();
  if (authError) return authError;

  const { data, error } = await supabase.rpc('get_user_orders', { p_user_id: user!.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
