'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

type AppliedCoupon = {
  code: string;
  label: string;
  discount: number;
  type: string;
};

type CouponInputProps = {
  couponInput: string;
  appliedCoupon: AppliedCoupon | null;
  couponError: string;
  couponLoading: boolean;
  onInputChange: (value: string) => void;
  onApply: () => void;
  onRemove: () => void;
};

export default function CouponInput({
  couponInput,
  appliedCoupon,
  couponError,
  couponLoading,
  onInputChange,
  onApply,
  onRemove,
}: CouponInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      className="bg-white border border-[#DDD9D3] overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-[#DDD9D3] flex items-center gap-3">
        <div className="size-7 rounded-sm bg-[#EFF6FF] flex items-center justify-center">
          <Icon name="TagIcon" size={13} variant="outline" className="text-[#2563EB]" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5A5A5A]">
            Código Promocional
          </p>
          <p className="text-[9px] text-[#8A8A8A] mt-0.5">Introduce tu cupón de descuento</p>
        </div>
      </div>

      <div className="px-6 py-5">
        {appliedCoupon ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between bg-[#EFF6FF] border border-[#2563EB]/20 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="size-6 rounded-full bg-[#2563EB]/15 flex items-center justify-center">
                <Icon name="CheckIcon" size={11} variant="outline" className="text-[#2563EB]" />
              </div>
              <div>
                <p className="text-[#2563EB] text-[11px] font-black uppercase tracking-[0.18em]">
                  {appliedCoupon.code}
                </p>
                <p className="text-[#2563EB]/60 text-[10px] mt-0.5">{appliedCoupon.label}</p>
              </div>
            </div>
            <button
              onClick={onRemove}
              className="text-[#8A8A8A] hover:text-red-500 text-[9px] font-black uppercase tracking-[0.18em] transition-colors flex items-center gap-1.5"
            >
              <Icon name="XMarkIcon" size={11} variant="outline" />
              Eliminar
            </button>
          </motion.div>
        ) : (
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => onInputChange(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && onApply()}
                placeholder="Ej. NOVA20"
                className="w-full bg-[#F8F7F5] border border-[#DDD9D3] focus:border-[#2563EB] text-[#1C1C1C] placeholder-[#8A8A8A] text-sm font-bold px-4 py-3.5 outline-none transition-colors duration-200 tracking-[0.15em] uppercase"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onApply}
              disabled={couponLoading}
              className="px-7 py-3.5 bg-[#EFEDE9] border border-[#DDD9D3] text-[#1C1C1C] text-[10px] font-black uppercase tracking-[0.22em] hover:bg-[#2563EB] hover:border-[#2563EB] hover:text-white transition-all duration-300 whitespace-nowrap disabled:opacity-50"
            >
              {couponLoading ? 'Validando...' : 'Aplicar'}
            </motion.button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {couponError && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 text-red-500 text-[11px] font-medium flex items-center gap-2"
            >
              <Icon name="ExclamationCircleIcon" size={13} variant="outline" />
              {couponError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
