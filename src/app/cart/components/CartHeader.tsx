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
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-800" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Glow blobs */}
      <div className="absolute -top-20 right-1/4 w-80 h-80 rounded-full bg-blue-500 blur-[120px] opacity-15 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full bg-indigo-600 blur-[90px] opacity-10 pointer-events-none" />

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-slate-900/30" />

      {/* ── Content ── */}
      <div className="relative w-full max-w-[1440px] mx-auto px-6 lg:px-14 pb-8 lg:pb-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-400/80 mb-2"
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
