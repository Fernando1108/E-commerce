import { Resend } from 'resend'
import OrderConfirmation from '@/emails/OrderConfirmation'
import Welcome from '@/emails/Welcome'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = 'NovaStore <onboarding@resend.dev>'

export async function sendOrderConfirmation(params: {
  to: string
  customerName: string
  orderId: string
  total: number
  items: { name: string; quantity: number; price: number }[]
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `Pedido confirmado #${params.orderId.slice(0, 8).toUpperCase()}`,
      react: OrderConfirmation({
        customerName: params.customerName,
        orderId: params.orderId,
        total: params.total,
        items: params.items,
      }),
    })
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error sending order confirmation:', error)
    throw error
  }
}

export async function sendWelcomeEmail(params: { to: string; name: string }) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: '¡Bienvenido a NovaStore!',
      react: Welcome({ name: params.name }),
    })
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error sending welcome email:', error)
    throw error
  }
}
