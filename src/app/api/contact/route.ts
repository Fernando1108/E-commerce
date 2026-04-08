import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactSchema } from '@/lib/validations';

function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: 'NovaStore <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'kodexasolutions@gmail.com',
      subject: parsed.data.subject
        ? `Contacto NovaStore: ${sanitizeHtml(parsed.data.subject)}`
        : `Contacto NovaStore: ${sanitizeHtml(parsed.data.name)}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        ${parsed.data.subject ? `<p><strong>Asunto:</strong> ${sanitizeHtml(parsed.data.subject)}</p>` : ''}
        <p><strong>Nombre:</strong> ${sanitizeHtml(parsed.data.name)}</p>
        <p><strong>Email:</strong> ${sanitizeHtml(parsed.data.email)}</p>
        ${parsed.data.phone ? `<p><strong>Teléfono:</strong> ${sanitizeHtml(parsed.data.phone)}</p>` : ''}
        <p><strong>Mensaje:</strong></p>
        <p>${sanitizeHtml(parsed.data.message)}</p>
      `,
    });
    return NextResponse.json({ sent: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
