import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactSchema } from '@/lib/validations'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from: 'NovaStore <onboarding@resend.dev>',
      to: 'kodexasolutions@gmail.com',
      subject: `Contacto NovaStore: ${parsed.data.name}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${parsed.data.name}</p>
        <p><strong>Email:</strong> ${parsed.data.email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${parsed.data.message}</p>
      `,
    })
    return NextResponse.json({ sent: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
