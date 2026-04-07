'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/hooks/useCart';
import { validateCoupon } from '@/lib/supabase/services';
import { formatPrice } from '@/lib/utils';
import CartHeader from './components/CartHeader';
import CartItemCard from './components/CartItemCard';
import CartSummary from './components/CartSummary';
import CouponInput from './components/CouponInput';
import CartPayPalButton from './components/CartPayPalButton';
import EmptyCart from './components/EmptyCart';

const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.95;

type AppliedCoupon = { code: string; label: string; discount: number; type: string };

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemoveItem = (productId: string) => {
    setRemovingId(productId);
    setTimeout(() => {
      removeItem(productId);
      setRemovingId(null);
    }, 380);
  };

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    setCouponError('');
    if (!code) {
      setCouponError('Introduce un código de cupón.');
      return;
    }
    setCouponLoading(true);
    try {
      const coupon = await validateCoupon(code);
      if (!coupon?.is_valid) {
        setCouponError('Código no válido o expirado.');
        setCouponLoading(false);
        return;
      }
      const label =
        coupon.type === 'percent'
          ? `${coupon.value}% de descuento`
          : `${formatPrice(coupon.value)} de descuento`;
      setAppliedCoupon({ code: coupon.code, label, discount: coupon.value, type: coupon.type });
      setCouponInput('');
    } catch {
      setCouponError('Error al validar el cupón.');
    }
    setCouponLoading(false);
  };

  const subtotal = total;
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? subtotal * (appliedCoupon.discount / 100)
      : appliedCoupon.discount
    : 0;
  const grandTotal = Math.max(0, subtotal + shipping - couponDiscount);
  const shippingProgress = Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);

  return (
    <main className="min-h-screen bg-[#F8F7F5] pt-[72px]">
      <CartHeader itemCount={itemCount} />
      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <section className="max-w-[1440px] mx-auto px-6 lg:px-14 py-12 lg:py-20">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_440px] gap-12 xl:gap-16 items-start">
            <div className="flex flex-col gap-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="flex items-center justify-between pb-5 border-b border-[#DDD9D3]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5A5A5A]">
                    {itemCount} {itemCount === 1 ? 'Artículo' : 'Artículos'}
                  </span>
                  <span className="w-px h-3 bg-[#DDD9D3]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A8A8A]">
                    en tu carrito
                  </span>
                </div>
                <button
                  onClick={clearCart}
                  className="group flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A8A8A] hover:text-red-500 transition-colors duration-200"
                >
                  <Icon
                    name="TrashIcon"
                    size={11}
                    variant="outline"
                    className="group-hover:text-red-500 transition-colors"
                  />
                  Vaciar carrito
                </button>
              </motion.div>
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    index={index}
                    isRemoving={removingId === item.product_id}
                    onRemove={handleRemoveItem}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </AnimatePresence>
              <CouponInput
                couponInput={couponInput}
                appliedCoupon={appliedCoupon}
                couponError={couponError}
                couponLoading={couponLoading}
                onInputChange={(v) => {
                  setCouponInput(v);
                  setCouponError('');
                }}
                onApply={applyCoupon}
                onRemove={() => {
                  setAppliedCoupon(null);
                  setCouponError('');
                }}
              />
              <div className="flex items-center gap-4 pt-1">
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors duration-200"
                >
                  <span className="size-6 border border-[#DDD9D3] group-hover:border-[#1C1C1C] flex items-center justify-center transition-colors duration-200">
                    <Icon name="ArrowLeftIcon" size={11} variant="outline" />
                  </span>
                  Seguir Comprando
                </Link>
              </div>
            </div>
            <div className="xl:sticky xl:top-[96px]">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white border border-[#DDD9D3] overflow-hidden"
              >
                <CartSummary
                  itemCount={itemCount}
                  subtotal={subtotal}
                  shipping={shipping}
                  couponDiscount={couponDiscount}
                  grandTotal={grandTotal}
                  shippingProgress={shippingProgress}
                  appliedCoupon={appliedCoupon}
                />
                <CartPayPalButton
                  items={items}
                  grandTotal={grandTotal}
                  onSuccess={async () => {
                    const { useCartStore } = await import('@/store/cart-store');
                    useCartStore.getState().clearCart();
                    window.location.href = '/checkout/success';
                  }}
                />
                <div className="border-t border-[#DDD9D3] px-8 py-6 grid grid-cols-2 gap-4">
                  {[
                    { icon: 'LockClosedIcon', label: 'Pago 100% seguro' },
                    { icon: 'ArrowPathIcon', label: 'Devolución 30 días' },
                    { icon: 'TruckIcon', label: 'Envío rápido' },
                    { icon: 'ShieldCheckIcon', label: 'Garantía oficial' },
                  ].map((trust) => (
                    <div key={trust.label} className="flex items-center gap-2.5">
                      <div className="size-6 rounded-sm bg-[#EFF6FF] flex items-center justify-center shrink-0">
                        <Icon
                          name={trust.icon as Parameters<typeof Icon>[0]['name']}
                          size={11}
                          variant="outline"
                          className="text-[#2563EB]"
                        />
                      </div>
                      <span className="text-[#5A5A5A] text-[10px] font-medium leading-tight">
                        {trust.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#DDD9D3] px-8 py-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#8A8A8A] mb-3">
                    Métodos de Pago Aceptados
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {['Visa', 'MC', 'Amex', 'PayPal', 'Bizum'].map((m) => (
                      <span
                        key={m}
                        className="px-2.5 py-1 border border-[#DDD9D3] text-[#8A8A8A] text-[9px] font-bold uppercase tracking-[0.15em]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mt-4 flex items-start gap-3 px-1"
              >
                <Icon
                  name="InformationCircleIcon"
                  size={13}
                  variant="outline"
                  className="text-[#2563EB]/50 shrink-0 mt-0.5"
                />
                <p className="text-[#8A8A8A] text-[10px] leading-relaxed">
                  Los precios incluyen IVA. El coste de envío se calcula en el siguiente paso según
                  tu dirección.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
