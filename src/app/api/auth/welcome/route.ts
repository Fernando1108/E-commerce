import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth/verify-admin'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: Request) {
  const { error: authError, user } = await verifyAuth()
  if (authError) return authError

  try {
    const { name } = await request.json()
    await sendWelcomeEmail({ to: user!.email!, name: name || 'Cliente' })
    return NextResponse.json({ sent: true })
  } catch (error: any) {
    console.error('Welcome email error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
