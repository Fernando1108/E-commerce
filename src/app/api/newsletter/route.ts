import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { newsletterSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  // Rate limit: 3 por minuto por IP
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const { allowed, resetIn } = checkRateLimit(`newsletter:${ip}`, 3, 60000);
  if (!allowed) {
    return NextResponse.json(
      { error: `Demasiadas solicitudes. Intenta en ${Math.ceil(resetIn / 1000)} segundos.` },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const supabase = await createClient();

  // Crear tabla newsletter_subscribers si no existe via insert
  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert({ email: parsed.data.email }, { onConflict: 'email' });

  if (error) {
    // Si la tabla no existe, el error lo indica
    return NextResponse.json({ error: 'Error al suscribirse' }, { status: 500 });
  }

  return NextResponse.json({ subscribed: true });
}
