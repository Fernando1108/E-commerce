import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata?.user_id

    if (userId) {
      try {
        const supabase = await createClient()

        // Obtener line items de la sesión
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

        // Crear orden en Supabase
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: userId,
            status: 'paid',
            total: (session.amount_total || 0) / 100,
          })
          .select()
          .single()

        if (orderError) throw orderError

        // Crear factura
        await supabase
          .from('invoices')
          .insert({
            order_id: order.id,
            total: (session.amount_total || 0) / 100,
          })

        console.log(`Order created: ${order.id} for user: ${userId}`)
      } catch (error) {
        console.error('Error creating order:', error)
      }
    }
  }

  return NextResponse.json({ received: true })
}
