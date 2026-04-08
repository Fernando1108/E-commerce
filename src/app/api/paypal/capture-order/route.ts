import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendOrderConfirmation } from '@/lib/email';
import { getAccessToken, PAYPAL_API } from '@/lib/paypal/api';

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
      // Recalcular total server-side
      const productIds = cartItems.map((item: any) => item.product_id);
      const { data: products } = await supabase
        .from('products')
        .select('id, price')
        .in('id', productIds);

      const priceMap = new Map(products?.map((p: any) => [p.id, p.price]) || []);
      const serverTotal = cartItems.reduce((sum: number, item: any) => {
        const realPrice = priceMap.get(item.product_id) || 0;
        return sum + realPrice * item.quantity;
      }, 0);

      // Verificar que el monto capturado coincide con el total calculado
      const capturedAmount = parseFloat(
        captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || '0'
      )
      
      if (Math.abs(capturedAmount - serverTotal) > 0.01) {
        console.error(`Monto mismatch: capturado=${capturedAmount}, calculado=${serverTotal}`)
        return NextResponse.json(
          { error: 'El monto capturado no coincide con el total del pedido' },
          { status: 400 }
        )
      }

      const orderItems = cartItems.map((item: any) => ({
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        quantity: item.quantity,
        price: priceMap.get(item.product_id) || 0,
      }));

      const { data: orderId, error } = await supabase.rpc('create_order', {
        p_user_id: user.id,
        p_items: orderItems,
        p_total: serverTotal,
      });

      if (error) throw error;

      await supabase.from('invoices').insert({
        order_id: orderId,
        total: serverTotal,
      });

      // Enviar email de confirmación (non-blocking)
      try {
        await sendOrderConfirmation({
          to: user.email!,
          customerName: user.user_metadata?.name || 'Cliente',
          orderId: orderId,
          total: serverTotal,
          items: cartItems.map((item: any) => ({
            name: item.product?.name || 'Producto',
            quantity: item.quantity,
            price: priceMap.get(item.product_id) || 0,
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
