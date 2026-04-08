'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type CartHeaderProps = {
  itemCount: number;
};

export default function CartHeader({ itemCount }: CartHeaderProps) {
  return (
    <section className="relative h-36 lg:h-48 overflow-hidden flex items-end">
      {/* ── Background image ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/logo/banner-cart.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/50" />

      {/* ── Content ── */}
      <div className="relative w-full max-w-[1440px] mx-auto px-6 lg:px-14 pb-8 lg:pb-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-[10px] font-black uppercase tracking-[0.28em] text-white/70 mb-2"
            >
              Tu Selección
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="font-display italic font-900 text-5xl lg:text-7xl tracking-editorial text-white leading-none"
            >
              Carrito
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22, duration: 0.5 }}
            className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 pb-1"
          >
            <Link href="/homepage" className="hover:text-white/80 transition-colors duration-200">
              Inicio
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-white/60">Carrito{itemCount > 0 ? ` (${itemCount})` : ''}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
