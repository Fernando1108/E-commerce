'use client';

import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import PayPalProvider from '@/lib/paypal/PayPalProvider';
import { toast } from 'sonner';
import type { CartItem } from '@/types';

type CartPayPalButtonProps = {
  items: CartItem[];
  grandTotal: number;
  onSuccess: () => void;
};

export default function CartPayPalButton({ items, grandTotal, onSuccess }: CartPayPalButtonProps) {
  return (
    <div className="px-8 pb-8">
      <PayPalProvider>
        <PayPalButtons
          style={{ layout: 'vertical', shape: 'rect', label: 'pay', tagline: false }}
          disabled={items.length === 0}
          createOrder={async () => {
            const res = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                items: items.map((item) => ({
                  name: item.product?.name || 'Producto',
                  price: item.product?.price || 0,
                  quantity: item.quantity,
                })),
                total: items.reduce(
                  (sum, item) => sum + (item.product?.price || 0) * item.quantity,
                  0
                ),
              }),
            });
            const data = await res.json();
            return data.id;
          }}
          onApprove={async (data) => {
            const res = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderID: data.orderID,
                cartItems: items,
                total: grandTotal,
              }),
            });
            const result = await res.json();
            if (result.status === 'COMPLETED') {
              onSuccess();
            }
          }}
          onError={() => {
            toast.error('Error procesando el pago. Por favor inténtalo de nuevo.');
          }}
        />
      </PayPalProvider>
    </div>
  );
}
