import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function verifyAdmin() {
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
      error: NextResponse.json({ error: 'No autorizado' }, { status: 403 }),
      user,
      supabase,
    };
  }

  return { error: null, user, supabase };
}

export async function verifyAuth() {
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

  return { error: null, user, supabase };
}

/** Alias for verifyAdmin — backwards-compatible with @/lib/admin */
export const requireAdmin = verifyAdmin;

