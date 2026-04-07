'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { ProductVariant } from '@/types';

type ProductVariantsProps = {
  variants: ProductVariant[];
  selectedVariant: string | null;
  onSelect: (variantId: string) => void;
};

export default function ProductVariants({
  variants,
  selectedVariant,
  onSelect,
}: ProductVariantsProps) {
  if (variants.length === 0) return null;

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#0F0F0F]">Variante</p>
        <p className="text-[12px] text-[#5A5A5A] font-500">
          {variants.find((v) => v.id === selectedVariant)?.name || 'Seleccionar'}
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {variants.map((variant) => (
          <motion.button
            key={variant.id}
            onClick={() => variant.stock > 0 && onSelect(variant.id)}
            disabled={variant.stock <= 0}
            whileHover={variant.stock > 0 ? { scale: 1.02 } : {}}
            whileTap={variant.stock > 0 ? { scale: 0.97 } : {}}
            className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-200 ${
              variant.stock <= 0
                ? 'border-[#DDD9D3] text-[#C4C4C4] cursor-not-allowed line-through'
                : selectedVariant === variant.id
                  ? 'border-[#1C1C1C] bg-[#1C1C1C] text-white shadow-nova-sm'
                  : 'border-[#DDD9D3] text-[#5A5A5A] hover:border-[#1C1C1C] hover:text-[#1C1C1C]'
            }`}
          >
            {variant.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
