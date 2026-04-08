import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAccessToken, PAYPAL_API } from '@/lib/paypal/api';
import { z } from 'zod';

const checkoutSchema = z.object({
  items: z.array(z.object({
    name: z.string().min(1),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
    image_url: z.string().nullable().optional(),
  })).min(1, 'Carrito vacío'),
  total: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { items, total } = parsed.data;

    const accessToken = await getAccessToken();

    const order = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: total.toFixed(2),
              breakdown: {
                item_total: { currency_code: 'USD', value: total.toFixed(2) },
              },
            },
            items: items.map((item) => ({
              name: item.name,
              quantity: String(item.quantity),
              unit_amount: { currency_code: 'USD', value: item.price.toFixed(2) },
            })),
          },
        ],
        application_context: {
          brand_name: 'NovaStore',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
        },
      }),
    });

    const orderData = await order.json();
    return NextResponse.json(orderData);
  } catch (error: any) {
    console.error('PayPal create order error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
