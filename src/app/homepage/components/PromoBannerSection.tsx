'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function PromoBannerSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 lg:py-32 bg-[#EFEDE9]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-3">

        {/* Primary promo: full-width dark editorial */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden bg-[#1C1C1C] group h-[480px] lg:h-[580px]"
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <AppImage
              src="https://img.rocket.new/generatedImages/rocket_gen_img_1a2dae783-1772721358804.png"
              alt="Premium tech workspace setup with multiple monitors and professional equipment in dark atmospheric moody studio lighting deep shadows"
              fill
              className="object-cover opacity-35 transition-all duration-[1200ms] group-hover:scale-[1.04] group-hover:opacity-45"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Corner markers */}
          <div className="absolute top-7 left-7 size-7 border-t-2 border-l-2 border-white/15 z-10 group-hover:border-white/30 transition-colors duration-500" />
          <div className="absolute bottom-7 right-7 size-7 border-b-2 border-r-2 border-white/15 z-10 group-hover:border-white/30 transition-colors duration-500" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-12 lg:px-20 max-w-3xl">
            <span className="label-eyebrow text-[#2563EB] mb-6">Oferta Especial · Tiempo Limitado</span>
            <h2
              className="font-display font-900 italic text-white uppercase leading-[0.85] tracking-[-0.04em] mb-6"
              style={{ fontSize: 'clamp(3rem, 5.5vw, 6rem)' }}
            >
              Setup Premium
              <br />
              para Oficina.
            </h2>
            <p className="text-base text-white/50 max-w-sm leading-relaxed mb-10">
              Configura tu espacio de trabajo ideal con nuestros paquetes premium. Hasta{' '}
              <strong className="text-white font-black">40% de descuento</strong> en setups completos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="group/btn inline-flex items-center gap-3 bg-white text-[#1C1C1C] text-[11px] font-black uppercase tracking-widest hover:bg-[#2563EB] hover:text-white transition-all duration-300"
                style={{ padding: '1.125rem 2.25rem' }}
              >
                Ver Setups
                <Icon name="ArrowRightIcon" size={15} variant="outline" className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-3 border border-white/15 text-white text-[11px] font-black uppercase tracking-widest hover:bg-white/8 hover:border-white/30 transition-all duration-300"
                style={{ padding: '1.125rem 2.25rem' }}
              >
                Explorar Ofertas
              </Link>
            </div>
          </div>

          {/* Right decorative stat */}
          <div className="absolute right-12 lg:right-24 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-end gap-4 z-10">
            <div className="h-px w-20 bg-white/10" />
            <p
              className="font-display font-900 italic text-white/8 group-hover:text-white/12 transition-colors duration-700 leading-none"
              style={{ fontSize: 'clamp(6rem, 10vw, 12rem)' }}
            >
              40%
            </p>
            <p className="label-eyebrow text-white/30 text-right">Descuento<br />máximo</p>
            <div className="h-px w-20 bg-white/10" />
          </div>
        </motion.div>

        {/* Two secondary promos side by side */}
        <div className="grid md:grid-cols-2 gap-3">
          {/* Promo A — charcoal */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden bg-[#2C2C2C] group h-[280px] lg:h-[340px]"
          >
            <div className="absolute inset-0">
              <AppImage
                src="https://images.unsplash.com/photo-1662019293071-bff94b65d33e"
                alt="Modern tech gadgets and devices on bright clean white surface in well-lit airy open office space"
                fill
                className="object-cover opacity-15 transition-all duration-[1200ms] group-hover:scale-[1.05] group-hover:opacity-25"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#1C1C1C]/60 to-[#2C2C2C]/80" />
            </div>
            {/* Corner markers */}
            <div className="absolute top-5 left-5 size-5 border-t-2 border-l-2 border-white/15 z-20 group-hover:border-white/30 transition-colors duration-400" />
            <div className="absolute bottom-5 right-5 size-5 border-b-2 border-r-2 border-white/15 z-20 group-hover:border-white/30 transition-colors duration-400" />
            <div className="relative z-10 h-full flex flex-col justify-between p-9 lg:p-11">
              <span className="label-eyebrow text-white/40 group-hover:text-[#2563EB] transition-colors duration-400">Nuevos Lanzamientos</span>
              <div>
                <h3
                  className="font-display font-900 italic text-white uppercase leading-[0.88] tracking-[-0.04em] mb-5"
                  style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)' }}
                >
                  Temporada
                  <br />
                  2026.
                </h3>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-white text-[11px] font-black uppercase tracking-widest group-hover:gap-4 transition-all duration-300"
                >
                  Descubrir
                  <Icon name="ArrowRightIcon" size={13} variant="outline" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Promo B — warm light */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden bg-[#F8F7F5] border border-[#DDD9D3] group h-[280px] lg:h-[340px]"
          >
            <div className="absolute inset-0">
              <AppImage
                src="https://img.rocket.new/generatedImages/rocket_gen_img_108a7f85a-1767613245607.png"
                alt="Team of professionals collaborating in bright modern office with large windows and clean minimal design"
                fill
                className="object-cover opacity-20 transition-all duration-[1200ms] group-hover:scale-[1.05] group-hover:opacity-30"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#F8F7F5]/90 to-transparent" />
            </div>
            {/* Corner markers */}
            <div className="absolute top-5 left-5 size-5 border-t-2 border-l-2 border-[#1C1C1C]/12 z-20 group-hover:border-[#1C1C1C]/30 transition-colors duration-400" />
            <div className="absolute bottom-5 right-5 size-5 border-b-2 border-r-2 border-[#1C1C1C]/12 z-20 group-hover:border-[#1C1C1C]/30 transition-colors duration-400" />
            <div className="relative z-10 h-full flex flex-col justify-between p-9 lg:p-11">
              <span className="label-eyebrow text-[#8A8A8A] group-hover:text-[#2563EB] transition-colors duration-400">Para Profesionales</span>
              <div>
                <h3
                  className="font-display font-900 italic text-[#1C1C1C] uppercase leading-[0.88] tracking-[-0.04em] mb-5"
                  style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)' }}
                >
                  Workspace
                  <br />
                  Perfecto.
                </h3>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-[#1C1C1C] text-[11px] font-black uppercase tracking-widest hover:gap-4 hover:text-[#2563EB] transition-all duration-300"
                >
                  Explorar
                  <Icon name="ArrowRightIcon" size={13} variant="outline" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
