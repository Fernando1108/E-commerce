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
  'Desarrollado por Kodexa Solutions',
  'Innovación Tecnológica',
  'Calidad Premium',
  'Envío Rápido y Seguro',
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
      className="-mt-[72px] pt-[72px] relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/logo/Hero-homepage.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-[1] pointer-events-none" />

      {/* Main content */}
      <div className="flex-1 flex items-center pt-[72px] relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-0 lg:gap-16 items-center py-12 lg:py-14">
          {/* LEFT: Content */}
          <motion.div style={{ y: contentY }} className="space-y-10 relative z-10 lg:pr-8">
            {/* Eyebrow pill */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="inline-flex items-center gap-3 px-5 py-2.5 border border-white/20 bg-white/10 backdrop-blur-sm"
            >
              <span className="size-1.5 bg-[#2563EB] rounded-full animate-ping-slow" />
              <span className="label-eyebrow text-[#2563EB]">Nueva colección 2026</span>
              <span className="h-3 w-px bg-white/20" />
              <span className="label-eyebrow text-white/70">Disponible ahora</span>
            </motion.div>

            {/* Main headline */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2}>
              <h1
                className="font-display font-900 italic text-white uppercase leading-[0.85] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(3.5rem, 7.5vw, 8.5rem)' }}
              >
                Eleva tu
                <br />
                <span
                  className="relative inline-block"
                  style={{
                    WebkitTextStroke: '1px rgba(255,255,255,0.4)',
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
              className="text-base lg:text-lg text-white/75 max-w-md leading-relaxed"
            >
              Tecnología premium, accesorios de workspace y gadgets seleccionados para profesionales
              que no aceptan lo ordinario.
            </motion.p>

            {/* Stats row — Marketing — valores fijos para demo/portafolio */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.45}
              className="flex items-center gap-8 pt-2"
            >
              <div>
                <p className="text-4xl font-display font-900 tracking-tightest text-white">12K+</p>
                <p className="label-eyebrow mt-1.5 text-white/60">Clientes activos</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <p className="text-4xl font-display font-900 tracking-tightest text-white">4.9★</p>
                <p className="label-eyebrow mt-1.5 text-white/60">Valoración media</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <p className="text-4xl font-display font-900 tracking-tightest text-white">500+</p>
                <p className="label-eyebrow mt-1.5 text-white/60">Productos</p>
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
                className="btn-shine group inline-flex items-center gap-3 bg-[#2563EB] text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all duration-300"
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
                className="inline-flex items-center gap-3 border border-white/60 text-white text-[11px] font-black uppercase tracking-widest hover:border-white hover:bg-white/10 transition-all duration-300"
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
            <div className="absolute -inset-px bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-20" />

            {/* Main image */}
            <div
              className="relative overflow-hidden bg-white/5 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)]"
              style={{ aspectRatio: '3/4' }}
            >
              <AppImage
                src="https://img.rocket.new/generatedImages/rocket_gen_img_1760a238a-1772690320969.png"
                alt="Premium workspace setup with monitor, keyboard and modern desk accessories in clean minimal environment"
                fill
                className="object-cover transition-all duration-[1200ms] group-hover:scale-[1.04]"
                priority
              />
              {/* Subtle scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            {/* Corner markers */}
            <div className="absolute top-0 left-0 size-8 border-t-2 border-l-2 border-white z-30" />
            <div className="absolute top-0 right-0 size-8 border-t-2 border-r-2 border-white/30 z-30" />
            <div className="absolute bottom-0 left-0 size-8 border-b-2 border-l-2 border-white/30 z-30" />
            <div className="absolute bottom-0 right-0 size-8 border-b-2 border-r-2 border-white z-30" />

            {/* Floating badge: Rating */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -top-6 -right-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-nova-lg p-5 z-30 animate-float"
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
              className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-nova-lg p-5 z-30"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 bg-white/20 flex items-center justify-center">
                  <Icon name="TruckIcon" size={18} variant="outline" className="text-[#2563EB]" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/60">
                    Envío Gratis
                  </p>
                  <p className="text-[12px] font-black uppercase tracking-widest text-white">
                    Pedidos +$50
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Side label */}
            <div className="absolute right-[-3.5rem] top-1/2 -translate-y-1/2 -rotate-90 origin-center z-30 hidden xl:block">
              <span className="label-eyebrow text-white/50 whitespace-nowrap">
                Colección Primavera 2026
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ticker strip */}
      <div className="relative z-10 border-t border-white/10 bg-black/80 backdrop-blur-sm overflow-hidden py-4">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-0 whitespace-nowrap"
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS]?.map((item, i) => (
            <React.Fragment key={i}>
              <span className="label-eyebrow text-white/50 px-8">{item}</span>
              <span className="size-1 bg-white/20 rounded-full shrink-0" />
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
