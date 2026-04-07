'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { getCategories } from '@/lib/supabase/services';
import type { Category } from '@/types';

/* ─── Individual Card ─────────────────────────────────────────── */
function CategoryCard({
  cat,
  index,
  className = '',
}: {
  cat: Category & { product_count?: number };
  index: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const accent = cat.accent_color || '#6C63FF';
  const span = cat.display_size || 'small';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden group cursor-pointer ${className}`}
    >
      <Link href={`/products?category=${cat.id}`} className="block w-full h-full">
        {/* ── Background image ── */}
        <div className="absolute inset-0">
          {cat.image_url ? (
            <AppImage
              src={cat.image_url}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.07]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: `linear-gradient(135deg, ${accent}44 0%, ${accent}22 100%)` }}
            />
          )}
          {/* Base scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
          {/* Side vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          {/* Accent color wash on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ background: `linear-gradient(135deg, ${accent}22 0%, transparent 60%)` }}
          />
        </div>

        {/* ── Corner brackets ── */}
        <div
          className="absolute top-4 left-4 size-5 border-t-[1.5px] border-l-[1.5px] border-white/20 z-20 transition-all duration-500 group-hover:size-7"
          style={{ borderColor: `color-mix(in srgb, ${accent} 60%, transparent)` }}
        />
        <div
          className="absolute bottom-4 right-4 size-5 border-b-[1.5px] border-r-[1.5px] border-white/20 z-20 transition-all duration-500 group-hover:size-7"
          style={{ borderColor: `color-mix(in srgb, ${accent} 60%, transparent)` }}
        />

        {/* ── Ghost index number ── */}
        <div className="absolute top-3 right-4 z-20 pointer-events-none select-none">
          <span
            className="font-display font-black italic text-white/[0.06] group-hover:text-white/[0.12] transition-colors duration-700 leading-none"
            style={{
              fontSize: span === 'large' ? '6rem' : span === 'medium' ? '4.5rem' : '3.5rem',
            }}
          >
            0{index + 1}
          </span>
        </div>

        {/* ── Accent top bar ── */}
        <div
          className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out z-20"
          style={{ background: accent }}
        />

        {/* ── Content ── */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 lg:p-8">
          {/* Eyebrow label */}
          <motion.span className="inline-flex items-center gap-2 mb-3" initial={false}>
            <span
              className="block w-4 h-px transition-all duration-500 group-hover:w-8"
              style={{ background: accent }}
            />
            <span
              className="text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-400"
              style={{ color: `color-mix(in srgb, ${accent} 80%, white)` }}
            >
              {cat.name}
            </span>
          </motion.span>

          {/* Headline */}
          <h3
            className="font-display font-black italic text-white uppercase leading-[0.88] tracking-[-0.03em] mb-3 whitespace-pre-line transition-transform duration-500 group-hover:-translate-y-1"
            style={{
              fontSize:
                span === 'large'
                  ? 'clamp(2rem, 3.2vw, 3.4rem)'
                  : span === 'medium'
                    ? 'clamp(1.6rem, 2.4vw, 2.4rem)'
                    : 'clamp(1.3rem, 1.8vw, 1.9rem)',
            }}
          >
            {cat.name}
          </h3>

          {/* Description */}
          {cat.description && (
            <p className="text-[12px] text-white/50 mb-4 max-w-[260px] leading-relaxed hidden sm:block group-hover:text-white/75 transition-colors duration-500">
              {cat.description}
            </p>
          )}

          {/* Product count */}
          {cat.product_count !== undefined && cat.product_count > 0 && (
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
              {cat.product_count} {cat.product_count === 1 ? 'producto' : 'productos'}
            </p>
          )}

          {/* CTA */}
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-white text-[10px] font-black uppercase tracking-[0.18em]">
              Explorar
            </span>
            <div className="flex items-center gap-1">
              <div
                className="h-px w-5 transition-all duration-500 group-hover:w-10"
                style={{ background: accent }}
              />
              <Icon
                name="ArrowRightIcon"
                size={12}
                variant="outline"
                className="text-white transition-transform duration-400 group-hover:translate-x-1"
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
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
      className="flex items-end justify-between mb-10"
    >
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-[#1A56DB]" />
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#9A9A9A]">
            Explorar
          </p>
        </div>
        <h2
          className="font-display font-black italic text-[#1C1C1C] uppercase leading-[0.88] tracking-[-0.04em]"
          style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4.2rem)' }}
        >
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
        className="hidden md:inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors group border border-[#DDD9D3] hover:border-[#1C1C1C] px-5 py-3"
      >
        Ver todas
        <Icon
          name="ArrowRightIcon"
          size={13}
          variant="outline"
          className="group-hover:translate-x-1 transition-transform"
        />
      </Link>
    </motion.div>
  );
}

/* ─── Skeleton ─────────────────────────────────────────────────── */
function SkeletonBanner({ className }: { className?: string }) {
  return <div className={`skeleton-shimmer bg-[#EFEDE9] ${className}`} />;
}

/* ─── Main Section ────────────────────────────────────────────── */
export default function CategoryBannersSection() {
  const [categories, setCategories] = useState<(Category & { product_count?: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Determine grid layout based on display_size
  const largeCategories = categories.filter((c) => c.display_size === 'large');
  const mediumCategories = categories.filter((c) => c.display_size === 'medium');
  const smallCategories = categories.filter(
    (c) => c.display_size !== 'large' && c.display_size !== 'medium'
  );

  return (
    <section className="py-14 lg:py-20 bg-[#F8F7F5]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <SectionHeader />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
            <SkeletonBanner className="md:col-span-7 h-[520px] lg:h-[640px]" />
            <SkeletonBanner className="md:col-span-5 h-[520px] lg:h-[640px]" />
            <SkeletonBanner className="md:col-span-3 h-[300px] lg:h-[370px]" />
            <SkeletonBanner className="md:col-span-3 h-[300px] lg:h-[370px]" />
            <SkeletonBanner className="md:col-span-3 h-[300px] lg:h-[370px]" />
            <SkeletonBanner className="md:col-span-3 h-[300px] lg:h-[370px]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
            {/* Row 1: large + medium */}
            {largeCategories.slice(0, 1).map((cat, i) => (
              <div key={cat.id} className="md:col-span-7 h-[520px] lg:h-[640px]">
                <CategoryCard cat={cat} index={i} className="w-full h-full" />
              </div>
            ))}
            {mediumCategories.slice(0, 1).map((cat, i) => (
              <div key={cat.id} className="md:col-span-5 h-[520px] lg:h-[640px]">
                <CategoryCard
                  cat={cat}
                  index={largeCategories.length + i}
                  className="w-full h-full"
                />
              </div>
            ))}

            {/* Row 2: small cards */}
            {smallCategories.slice(0, 4).map((cat, i) => (
              <div key={cat.id} className="md:col-span-3 h-[300px] lg:h-[370px]">
                <CategoryCard
                  cat={cat}
                  index={largeCategories.length + mediumCategories.length + i}
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
        )}

        {/* Mobile "Ver todas" CTA */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#5A5A5A] border border-[#DDD9D3] px-6 py-3.5"
          >
            Ver todas las categorías
            <Icon name="ArrowRightIcon" size={13} variant="outline" />
          </Link>
        </div>
      </div>
    </section>
  );
}
