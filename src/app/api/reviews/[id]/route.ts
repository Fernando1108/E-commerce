import { NextResponse } from 'next/server';
import { verifyAuth, verifyAdmin } from '@/lib/auth/verify-admin';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error: authError, user, supabase } = await verifyAuth();
  if (authError) return authError;

  // Verificar que sea el autor o admin
  const { data: review } = await supabase.from('reviews').select('user_id').eq('id', id).single();

  if (!review) {
    return NextResponse.json({ error: 'Reseña no encontrada' }, { status: 404 });
  }

  if (review.user_id !== user!.id) {
    // Verificar si es admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user!.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
  }

  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
