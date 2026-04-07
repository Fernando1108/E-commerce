'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8F7F5] flex flex-col items-center justify-center px-6">
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(28,28,28,0.8) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative text-center max-w-lg">
        {/* 404 big number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8"
        >
          <p
            className="font-display font-900 italic uppercase leading-none text-[#EFEDE9] select-none"
            style={{ fontSize: 'clamp(7rem, 22vw, 16rem)' }}
          >
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-20 rounded-full bg-white border border-[#DDD9D3] flex items-center justify-center shadow-[0_8px_40px_rgba(28,28,28,0.08)]">
              <Icon
                name="ExclamationCircleIcon"
                size={36}
                variant="outline"
                className="text-[#2563EB]"
              />
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#2563EB] mb-4">
            Página no encontrada
          </p>
          <h1
            className="font-display font-900 italic uppercase leading-[0.9] tracking-[-0.03em] text-[#1C1C1C] mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Esta página
            <br />
            no existe.
          </h1>
          <p className="text-[#5A5A5A] text-base leading-relaxed max-w-sm mx-auto">
            Lo sentimos, la URL que buscas no está disponible. Puede que haya sido movida o
            eliminada.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/homepage"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#1C1C1C] text-white text-[10px] font-black uppercase tracking-[0.22em] hover:bg-[#2563EB] transition-all duration-300"
          >
            <Icon name="HomeIcon" size={13} variant="outline" />
            Volver al inicio
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-[#DDD9D3] text-[#1C1C1C] text-[10px] font-black uppercase tracking-[0.22em] hover:border-[#1C1C1C] hover:bg-[#F0EEE9] transition-all duration-300"
          >
            <Icon name="ShoppingBagIcon" size={13} variant="outline" />
            Ver tienda
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
