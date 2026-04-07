'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

export default function EmptyCart() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 lg:px-14 py-40 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-7"
      >
        <div className="relative">
          <div className="size-28 rounded-full bg-[#EFEDE9] border border-[#DDD9D3] flex items-center justify-center">
            <Icon name="ShoppingBagIcon" size={44} variant="outline" className="text-[#8A8A8A]" />
          </div>
        </div>
        <div>
          <h2 className="font-display italic font-900 text-3xl text-[#1C1C1C] tracking-editorial mb-3">
            Tu carrito está vacío
          </h2>
          <p className="text-[#5A5A5A] text-sm max-w-xs leading-relaxed">
            Explora nuestra colección y añade los productos que más te gusten.
          </p>
        </div>
        <Link
          href="/products"
          className="mt-2 inline-flex items-center gap-3 px-9 py-4 bg-[#1C1C1C] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#2563EB] transition-all duration-300"
        >
          <Icon name="ArrowLeftIcon" size={13} variant="outline" />
          Seguir Comprando
        </Link>
      </motion.div>
    </section>
  );
}
