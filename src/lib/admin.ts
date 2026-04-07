import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Verifica autenticación + rol admin en API routes.
 * Retorna { user, supabase } si es admin, o una NextResponse de error.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: 'No autenticado' }, { status: 401 }),
      user: null,
      supabase,
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return {
      error: NextResponse.json({ error: 'No autorizado. Se requiere rol admin.' }, { status: 403 }),
      user,
      supabase,
    };
  }

  return { error: null, user, supabase };
}
