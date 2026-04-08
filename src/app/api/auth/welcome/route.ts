import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/verify-admin';
import { sendWelcomeEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  const { error: authError, user } = await verifyAuth();
  if (authError) return authError;

  // Rate limit: 2 por minuto por usuario
  const { allowed, resetIn } = checkRateLimit(`welcome:${user!.id}`, 2, 60000);
  if (!allowed) {
    return NextResponse.json(
      { error: `Demasiadas solicitudes. Intenta en ${Math.ceil(resetIn / 1000)} segundos.` },
      { status: 429 }
    );
  }

  try {
    const { name } = await request.json();
    await sendWelcomeEmail({ to: user!.email!, name: name || 'Cliente' });
    return NextResponse.json({ sent: true });
  } catch (error: any) {
    logger.error('Welcome email failed', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
