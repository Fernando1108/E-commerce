import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { newsletterSchema } from '@/lib/validations';

export async function POST(request: Request) {
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
