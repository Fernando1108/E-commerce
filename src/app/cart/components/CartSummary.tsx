'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import { formatPrice } from '@/lib/utils';

const SHIPPING_THRESHOLD = 100;

type AppliedCoupon = {
  code: string;
  label: string;
  discount: number;
  type: string;
};

type CartSummaryProps = {
  itemCount: number;
  subtotal: number;
  shipping: number;
  couponDiscount: number;
  grandTotal: number;
  shippingProgress: number;
  appliedCoupon: AppliedCoupon | null;
};

export default function CartSummary({
  itemCount,
  subtotal,
  shipping,
  couponDiscount,
  grandTotal,
  shippingProgress,
  appliedCoupon,
}: CartSummaryProps) {
  return (
    <>
      {/* Card Header */}
      <div className="relative px-8 py-7 border-b border-[#DDD9D3] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#EFEDE9] via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#1C1C1C] via-[#DDD9D3] to-transparent" />
        <div className="relative">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#2563EB] mb-2">
            Resumen del Pedido
          </p>
          <h2 className="font-display italic font-700 text-2xl text-[#1C1C1C] tracking-editorial leading-none">
            Tu Compra
          </h2>
          <p className="text-[#8A8A8A] text-[10px] mt-1.5">
            {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'} seleccionados
          </p>
        </div>
      </div>

      {/* Summary Lines */}
      <div className="px-8 py-7 flex flex-col gap-0">
        <div className="flex items-center justify-between py-3 border-b border-[#EFEDE9]">
          <span className="text-[#5A5A5A] text-[12px] font-medium">
            Subtotal ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})
          </span>
          <span className="text-[#1C1C1C] font-bold text-[13px] tabular-nums">
            {formatPrice(subtotal)}
          </span>
        </div>

        {appliedCoupon && couponDiscount > 0 && (
          <div className="flex items-center justify-between py-3 border-b border-[#EFEDE9]">
            <span className="text-[#2563EB] text-[12px] font-medium flex items-center gap-1.5">
              <Icon name="TagIcon" size={12} variant="outline" />
              Cupón {appliedCoupon.code}
            </span>
            <span className="text-[#2563EB] font-bold text-[13px] tabular-nums">
              -{formatPrice(couponDiscount)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between py-3 border-b border-[#EFEDE9]">
          <span className="text-[#5A5A5A] text-[12px] font-medium flex items-center gap-1.5">
            <Icon name="TruckIcon" size={12} variant="outline" />
            Envío
          </span>
          {shipping === 0 ? (
            <span className="text-emerald-600 font-bold text-[13px] flex items-center gap-1">
              <Icon name="CheckIcon" size={11} variant="outline" />
              Gratis
            </span>
          ) : (
            <span className="text-[#1C1C1C] font-bold text-[13px] tabular-nums">
              {formatPrice(shipping)}
            </span>
          )}
        </div>

        {shipping > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-1 mb-2 bg-[#F8F7F5] border border-[#DDD9D3] px-4 py-3.5"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[#8A8A8A] text-[9px] font-bold uppercase tracking-[0.18em]">
                Envío gratis desde {formatPrice(SHIPPING_THRESHOLD)}
              </span>
              <span className="text-[#2563EB] text-[9px] font-black">
                {formatPrice(SHIPPING_THRESHOLD - subtotal)} restante
              </span>
            </div>
            <div className="h-[3px] bg-[#DDD9D3] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${shippingProgress}%` }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-[#2563EB]/60 to-[#2563EB] rounded-full"
              />
            </div>
          </motion.div>
        )}

        <div className="mt-4 pt-5 border-t border-[#DDD9D3]">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#8A8A8A] block mb-1">
                Total a Pagar
              </span>
              <span className="text-[#8A8A8A] text-[10px]">IVA incluido</span>
            </div>
            <div className="text-right">
              <motion.span
                key={grandTotal}
                initial={{ opacity: 0.5, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="font-display italic font-700 text-4xl text-[#1C1C1C] tracking-editorial block leading-none"
              >
                {formatPrice(grandTotal)}
              </motion.span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
