'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

const TICKER_ITEMS = [
  'Nueva Colección 2026',
  'Envío Gratis +$50',
  'Tecnología Premium',
  'Curación Editorial',
  'Workspace Definitivo',
  'Diseño Sin Compromiso',
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '6%']);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col overflow-hidden bg-[#F8F7F5]"
    >
      {/* Subtle warm texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025] bg-dot-pattern" />
      {/* Soft warm glow — top right */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#E8E5DF] opacity-60 blur-[120px] pointer-events-none" />
      {/* Subtle blue accent — bottom left */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#2563EB] opacity-[0.04] blur-[100px] pointer-events-none" />
      {/* Main content */}
      <div className="flex-1 flex items-center pt-[72px]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-0 lg:gap-16 items-center py-12 lg:py-14">
          {/* LEFT: Content */}
          <motion.div style={{ y: contentY }} className="space-y-10 relative z-10 lg:pr-8">
            {/* Eyebrow pill */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="inline-flex items-center gap-3 px-5 py-2.5 border border-[#DDD9D3] bg-white/70 backdrop-blur-sm"
            >
              <span className="size-1.5 bg-[#2563EB] rounded-full animate-ping-slow" />
              <span className="label-eyebrow text-[#2563EB]">Nueva colección 2026</span>
              <span className="h-3 w-px bg-[#DDD9D3]" />
              <span className="label-eyebrow text-[#8A8A8A]">Disponible ahora</span>
            </motion.div>

            {/* Main headline */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2}>
              <h1
                className="font-display font-900 italic text-[#1C1C1C] uppercase leading-[0.85] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(3.5rem, 7.5vw, 8.5rem)' }}
              >
                Eleva tu
                <br />
                <span
                  className="relative inline-block"
                  style={{
                    WebkitTextStroke: '1px rgba(28,28,28,0.25)',
                    color: 'transparent',
                  }}
                >
                  Espacio.
                </span>
                <br />
                <span className="text-[#2563EB]">Eleva tu</span>
                <br />
                Trabajo.
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.35}
              className="text-base lg:text-lg text-[#5A5A5A] max-w-md leading-relaxed"
            >
              Tecnología premium, accesorios de workspace y gadgets seleccionados para profesionales
              que no aceptan lo ordinario.
            </motion.p>

            {/* Stats row */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.45}
              className="flex items-center gap-8 pt-2"
            >
              <div>
                <p className="text-4xl font-display font-900 tracking-tightest text-[#1C1C1C]">
                  12K+
                </p>
                <p className="label-eyebrow mt-1.5 text-[#8A8A8A]">Clientes activos</p>
              </div>
              <div className="h-12 w-px bg-[#DDD9D3]" />
              <div>
                <p className="text-4xl font-display font-900 tracking-tightest text-[#1C1C1C]">
                  4.9★
                </p>
                <p className="label-eyebrow mt-1.5 text-[#8A8A8A]">Valoración media</p>
              </div>
              <div className="h-12 w-px bg-[#DDD9D3]" />
              <div>
                <p className="text-4xl font-display font-900 tracking-tightest text-[#1C1C1C]">
                  500+
                </p>
                <p className="label-eyebrow mt-1.5 text-[#8A8A8A]">Productos</p>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.55}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link
                href="/products"
                className="btn-shine group inline-flex items-center gap-3 bg-[#1C1C1C] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#2563EB] hover:text-white transition-all duration-300"
                style={{ padding: '1.125rem 2.25rem' }}
              >
                Explorar Tienda
                <Icon
                  name="ArrowRightIcon"
                  size={16}
                  variant="outline"
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>
              <Link
                href="/products?sort=newest"
                className="inline-flex items-center gap-3 border border-[#DDD9D3] text-[#1C1C1C] text-[11px] font-black uppercase tracking-widest hover:border-[#1C1C1C] hover:bg-[#EFEDE9] transition-all duration-300"
                style={{ padding: '1.125rem 2.25rem' }}
              >
                Ver Novedades
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT: Hero image composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: imageY }}
            className="relative group hidden lg:block"
          >
            {/* Outer frame */}
            <div className="absolute -inset-px bg-gradient-to-br from-[#DDD9D3]/60 via-transparent to-transparent pointer-events-none z-20" />

            {/* Main image */}
            <div className="relative overflow-hidden bg-[#EFEDE9]" style={{ aspectRatio: '3/4' }}>
              <AppImage
                src="https://img.rocket.new/generatedImages/rocket_gen_img_1760a238a-1772690320969.png"
                alt="Premium workspace setup with monitor, keyboard and modern desk accessories in clean minimal environment"
                fill
                className="object-cover transition-all duration-[1200ms] group-hover:scale-[1.04]"
                priority
              />
              {/* Subtle scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#F8F7F5]/30 via-transparent to-transparent" />
            </div>

            {/* Corner markers */}
            <div className="absolute top-0 left-0 size-8 border-t-2 border-l-2 border-[#1C1C1C] z-30" />
            <div className="absolute top-0 right-0 size-8 border-t-2 border-r-2 border-[#DDD9D3] z-30" />
            <div className="absolute bottom-0 left-0 size-8 border-b-2 border-l-2 border-[#DDD9D3] z-30" />
            <div className="absolute bottom-0 right-0 size-8 border-b-2 border-r-2 border-[#1C1C1C] z-30" />

            {/* Floating badge: Rating */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -top-6 -right-6 bg-[#1C1C1C] shadow-nova-lg p-5 z-30 animate-float"
            >
              <div className="flex flex-col items-center gap-2">
                <Icon name="StarIcon" size={22} variant="solid" className="text-[#C8922A]" />
                <p className="text-[10px] font-black uppercase tracking-widest text-white">
                  Top Rated
                </p>
                <p className="text-[9px] font-600 text-white/60 uppercase tracking-wider">2026</p>
              </div>
            </motion.div>

            {/* Floating badge: Free shipping */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-6 -left-6 bg-white border border-[#DDD9D3] shadow-nova-lg p-5 z-30"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 bg-[#EFF6FF] flex items-center justify-center">
                  <Icon name="TruckIcon" size={18} variant="outline" className="text-[#2563EB]" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#8A8A8A]">
                    Envío Gratis
                  </p>
                  <p className="text-[12px] font-black uppercase tracking-widest text-[#1C1C1C]">
                    Pedidos +$50
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Side label */}
            <div className="absolute right-[-3.5rem] top-1/2 -translate-y-1/2 -rotate-90 origin-center z-30 hidden xl:block">
              <span className="label-eyebrow text-[#8A8A8A] whitespace-nowrap">
                Colección Primavera 2026
              </span>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Ticker strip */}
      <div className="border-t border-[#DDD9D3] bg-[#EFEDE9] overflow-hidden py-4 relative">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-0 whitespace-nowrap"
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS]?.map((item, i) => (
            <React.Fragment key={i}>
              <span className="label-eyebrow text-[#8A8A8A] px-8">{item}</span>
              <span className="size-1 bg-[#DDD9D3] rounded-full shrink-0" />
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
