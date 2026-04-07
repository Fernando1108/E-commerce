import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth/verify-admin'

export async function DELETE(request: Request, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params
  const { error: authError, user, supabase } = await verifyAuth()
  if (authError) return authError

  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', user!.id)
    .eq('product_id', productId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ deleted: true })
}
