'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type CartHeaderProps = {
  itemCount: number;
};

export default function CartHeader({ itemCount }: CartHeaderProps) {
  return (
    <section className="relative border-b border-[#DDD9D3] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-[500px] h-[300px] bg-[#EFEDE9] rounded-full blur-[120px]" />
      </div>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-14 py-12 lg:py-16 relative">
        <div className="flex items-end justify-between gap-4">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[10px] font-black uppercase tracking-[0.22em] text-[#2563EB] mb-3"
            >
              Tu Selección
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="font-display italic font-900 text-5xl lg:text-7xl tracking-editorial text-[#1C1C1C] leading-none"
            >
              Carrito
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden sm:flex items-center gap-2 text-[#8A8A8A] text-[10px] font-bold uppercase tracking-[0.18em]"
          >
            <Link href="/homepage" className="hover:text-[#1C1C1C] transition-colors duration-200">
              Inicio
            </Link>
            <span className="text-[#DDD9D3]">/</span>
            <span className="text-[#5A5A5A]">Carrito {itemCount > 0 ? `(${itemCount})` : ''}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
