'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const categories = [
{
  id: 1,
  label: 'Setup de Productividad',
  headline: 'Tu espacio,\ntu rendimiento.',
  description: 'Monitores, periféricos y accesorios para el workspace definitivo.',
  image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e6670b5e-1772721355079.png',
  alt: 'Clean minimal desk setup with ultrawide monitor and mechanical keyboard in dimly lit professional workspace',
  href: '/products',
  accent: '#1A56DB',
  span: 'large'
},
{
  id: 2,
  label: 'Audio & Workspace',
  headline: 'Sonido sin\ncompromiso.',
  description: 'Auriculares, micrófonos y equipos de audio de referencia.',
  image: 'https://img.rocket.new/generatedImages/rocket_gen_img_15350b1ea-1772901666425.png',
  alt: 'Premium over-ear headphones on dark minimal surface with soft studio lighting',
  href: '/products',
  accent: '#7C3AED',
  span: 'medium'
},
{
  id: 3,
  label: 'Tecnología Premium',
  headline: 'Lo mejor\ndel mercado.',
  description: 'Dispositivos de vanguardia seleccionados por expertos.',
  image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f09534a3-1773005766044.png',
  alt: 'Latest laptop and smartphone on clean white desk in bright modern office environment',
  href: '/products',
  accent: '#059669',
  span: 'small'
},
{
  id: 4,
  label: 'Iluminación',
  headline: 'Ambiente\nperfecto.',
  description: 'Luz inteligente que transforma cualquier espacio de trabajo.',
  image: "https://images.unsplash.com/photo-1615938165708-feda49ca470c",
  alt: 'Modern LED desk lamp and ambient lighting setup in a stylish dark workspace with warm tones',
  href: '/products',
  accent: '#D97706',
  span: 'small'
},
{
  id: 5,
  label: 'Accesorios',
  headline: 'Cada\ndetalle importa.',
  description: 'Cables, hubs, soportes y todo lo que completa tu setup.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_119ef5dda-1774453061827.png",
  alt: 'Premium tech accessories including USB hub, cable management and desk organizer on dark surface',
  href: '/products',
  accent: '#DC2626',
  span: 'small'
},
{
  id: 6,
  label: 'Oficina Moderna',
  headline: 'Diseña tu\noficina ideal.',
  description: 'Mobiliario y soluciones para espacios de trabajo contemporáneos.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1cb783dd0-1766831761442.png",
  alt: 'Modern minimalist office with standing desk, ergonomic chair and clean white walls',
  href: '/products',
  accent: '#0891B2',
  span: 'small'
}];


/* ─── Individual Card ─────────────────────────────────────────── */
function CategoryCard({
  cat,
  index,
  className = ''




}: {cat: (typeof categories)[0];index: number;className?: string;}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden group cursor-pointer ${className}`}>
      
      <Link href={cat.href} className="block w-full h-full">
        {/* ── Background image ── */}
        <div className="absolute inset-0">
          <AppImage
            src={cat.image}
            alt={cat.alt}
            fill
            className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.07]"
            sizes="(max-width: 768px) 100vw, 50vw" />
          
          {/* Base scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
          {/* Side vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          {/* Accent color wash on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ background: `linear-gradient(135deg, ${cat.accent}22 0%, transparent 60%)` }} />
          
        </div>

        {/* ── Corner brackets ── */}
        <div
          className="absolute top-4 left-4 size-5 border-t-[1.5px] border-l-[1.5px] border-white/20 z-20 transition-all duration-500 group-hover:size-7"
          style={{ borderColor: `color-mix(in srgb, ${cat.accent} 60%, transparent)` }} />
        
        <div
          className="absolute bottom-4 right-4 size-5 border-b-[1.5px] border-r-[1.5px] border-white/20 z-20 transition-all duration-500 group-hover:size-7"
          style={{ borderColor: `color-mix(in srgb, ${cat.accent} 60%, transparent)` }} />
        

        {/* ── Ghost index number ── */}
        <div className="absolute top-3 right-4 z-20 pointer-events-none select-none">
          <span
            className="font-display font-black italic text-white/[0.06] group-hover:text-white/[0.12] transition-colors duration-700 leading-none"
            style={{ fontSize: cat.span === 'large' ? '6rem' : cat.span === 'medium' ? '4.5rem' : '3.5rem' }}>
            
            0{index + 1}
          </span>
        </div>

        {/* ── Accent top bar ── */}
        <div
          className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out z-20"
          style={{ background: cat.accent }} />
        

        {/* ── Content ── */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 lg:p-8">
          {/* Eyebrow label */}
          <motion.span
            className="inline-flex items-center gap-2 mb-3"
            initial={false}>
            
            <span
              className="block w-4 h-px transition-all duration-500 group-hover:w-8"
              style={{ background: cat.accent }} />
            
            <span
              className="text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-400"
              style={{ color: `color-mix(in srgb, ${cat.accent} 80%, white)` }}>
              
              {cat.label}
            </span>
          </motion.span>

          {/* Headline */}
          <h3
            className="font-display font-black italic text-white uppercase leading-[0.88] tracking-[-0.03em] mb-3 whitespace-pre-line transition-transform duration-500 group-hover:-translate-y-1"
            style={{
              fontSize:
              cat.span === 'large' ? 'clamp(2rem, 3.2vw, 3.4rem)' :
              cat.span === 'medium' ? 'clamp(1.6rem, 2.4vw, 2.4rem)' : 'clamp(1.3rem, 1.8vw, 1.9rem)'
            }}>
            
            {cat.headline}
          </h3>

          {/* Description */}
          <p className="text-[12px] text-white/50 mb-6 max-w-[260px] leading-relaxed hidden sm:block group-hover:text-white/75 transition-colors duration-500">
            {cat.description}
          </p>

          {/* CTA */}
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-white text-[10px] font-black uppercase tracking-[0.18em]">
              Explorar
            </span>
            <div className="flex items-center gap-1">
              <div
                className="h-px w-5 transition-all duration-500 group-hover:w-10"
                style={{ background: cat.accent }} />
              
              <Icon
                name="ArrowRightIcon"
                size={12}
                variant="outline"
                className="text-white transition-transform duration-400 group-hover:translate-x-1" />
              
            </div>
          </div>
        </div>
      </Link>
    </motion.div>);

}

/* ─── Section Header ──────────────────────────────────────────── */
function SectionHeader() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-end justify-between mb-14">
      
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-[#1A56DB]" />
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#9A9A9A]">
            Explorar
          </p>
        </div>
        <h2
          className="font-display font-black italic text-[#1C1C1C] uppercase leading-[0.88] tracking-[-0.04em]"
          style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4.2rem)' }}>
          
          Categorías
          <br />
          <span className="text-[#2563EB]">Destacadas</span>
        </h2>
        <p className="mt-4 text-[13px] text-[#5A5A5A] max-w-sm leading-relaxed">
          Colecciones curadas para cada tipo de workspace y estilo de vida digital.
        </p>
      </div>

      <Link
        href="/products"
        className="hidden md:inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors group border border-[#DDD9D3] hover:border-[#1C1C1C] px-5 py-3">
        
        Ver todas
        <Icon
          name="ArrowRightIcon"
          size={13}
          variant="outline"
          className="group-hover:translate-x-1 transition-transform" />
        
      </Link>
    </motion.div>);

}

/* ─── Main Section ────────────────────────────────────────────── */
export default function CategoryBannersSection() {
  return (
    <section className="py-24 lg:py-36 bg-[#F8F7F5]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <SectionHeader />

        {/*
           Premium editorial bento grid:
           Row 1: Large (7 cols / 620px tall) + Medium (5 cols / 620px tall)
           Row 2: 4 equal small cards (3 cols each / 360px tall)
          */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
          {/* ── Row 1 ── */}
          <div className="md:col-span-7 h-[520px] lg:h-[640px]">
            <CategoryCard cat={categories[0]} index={0} className="w-full h-full" />
          </div>
          <div className="md:col-span-5 h-[520px] lg:h-[640px]">
            <CategoryCard cat={categories[1]} index={1} className="w-full h-full" />
          </div>

          {/* ── Row 2 — 4 equal cards ── */}
          <div className="md:col-span-3 h-[300px] lg:h-[370px]">
            <CategoryCard cat={categories[2]} index={2} className="w-full h-full" />
          </div>
          <div className="md:col-span-3 h-[300px] lg:h-[370px]">
            <CategoryCard cat={categories[3]} index={3} className="w-full h-full" />
          </div>
          <div className="md:col-span-3 h-[300px] lg:h-[370px]">
            <CategoryCard cat={categories[4]} index={4} className="w-full h-full" />
          </div>
          <div className="md:col-span-3 h-[300px] lg:h-[370px]">
            <CategoryCard cat={categories[5]} index={5} className="w-full h-full" />
          </div>
        </div>

        {/* ── Mobile "Ver todas" CTA ── */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#5A5A5A] border border-[#DDD9D3] px-6 py-3.5">
            
            Ver todas las categorías
            <Icon name="ArrowRightIcon" size={13} variant="outline" />
          </Link>
        </div>
      </div>
    </section>);

}