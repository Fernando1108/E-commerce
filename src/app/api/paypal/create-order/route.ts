import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAccessToken, PAYPAL_API } from '@/lib/paypal/api'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { items, total } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Carrito vacío' }, { status: 400 })
    }

    const accessToken = await getAccessToken()

    const order = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2),
            breakdown: {
              item_total: { currency_code: 'USD', value: total.toFixed(2) },
            },
          },
          items: items.map((item: any) => ({
            name: item.name,
            quantity: String(item.quantity),
            unit_amount: { currency_code: 'USD', value: item.price.toFixed(2) },
          })),
        }],
        application_context: {
          brand_name: 'NovaStore',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
        },
      }),
    })

    const orderData = await order.json()
    return NextResponse.json(orderData)
  } catch (error: any) {
    console.error('PayPal create order error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
