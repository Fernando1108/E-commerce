import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendOrderConfirmation } from '@/lib/email';

const PAYPAL_API =
  process.env.NODE_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await res.json();
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { orderID, cartItems, total } = await request.json();

    const accessToken = await getAccessToken();

    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const captureData = await res.json();

    if (captureData.status === 'COMPLETED') {
      const orderItems = cartItems.map((item: any) => ({
        product_id: item.product_id,
        variant_id: item.variant_id || '',
        quantity: item.quantity,
        price: item.product?.price || 0,
      }));

      const { data: orderId, error } = await supabase.rpc('create_order', {
        p_user_id: user.id,
        p_items: orderItems,
        p_total: total,
      });

      if (error) throw error;

      await supabase.from('invoices').insert({
        order_id: orderId,
        total: total,
      });

      // Enviar email de confirmación (non-blocking)
      try {
        await sendOrderConfirmation({
          to: user.email!,
          customerName: user.user_metadata?.name || 'Cliente',
          orderId: orderId,
          total: total,
          items: cartItems.map((item: any) => ({
            name: item.product?.name || 'Producto',
            quantity: item.quantity,
            price: item.product?.price || 0,
          })),
        });
      } catch (emailError) {
        console.error('Email error (non-blocking):', emailError);
      }

      return NextResponse.json({
        status: 'COMPLETED',
        orderId,
        paypalOrderId: orderID,
      });
    }

    return NextResponse.json({ status: captureData.status, details: captureData }, { status: 400 });
  } catch (error: any) {
    console.error('PayPal capture error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
