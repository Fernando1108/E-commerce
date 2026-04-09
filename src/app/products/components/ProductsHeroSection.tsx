'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface ProductsHeroSectionProps {
  onSearch?: (query: string) => void;
  categoryId?: string;
  sort?: string;
  badge?: string;
  view?: string;
}

const categoryDescriptions: Record<string, string> = {
  accesorios: 'Fundas, cargadores, cables y accesorios premium para potenciar tus dispositivos.',
  audio: 'Auriculares, parlantes y equipos de sonido de alta fidelidad para profesionales.',
  electrónica: 'Smartphones, laptops y gadgets de última generación con tecnología de punta.',
  gaming: 'Consolas, periféricos y accesorios gaming para la mejor experiencia de juego.',
  hogar: 'Tecnología inteligente para el hogar: seguridad, automatización y conectividad.',
  wearables: 'Smartwatches, fitness trackers y tecnología portátil de última generación.',
};

const DEFAULT_DESCRIPTION = 'Más de 500 productos de tecnología premium seleccionados para ti.';

export default function ProductsHeroSection({
  onSearch,
  categoryId,
  sort,
  badge,
  view,
}: ProductsHeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  // Fetch category name when a specific category is selected
  const hasCategory = Boolean(categoryId && categoryId !== 'all');
  useEffect(() => {
    if (!hasCategory) {
      setCategoryName('');
      return;
    }
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data: { id: string; name: string }[]) => {
        const match = Array.isArray(data) ? data.find((c) => c.id === categoryId) : null;
        setCategoryName(match?.name ?? '');
      })
      .catch(() => setCategoryName(''));
  }, [categoryId, hasCategory]);

  // Derive page title from active filter
  let pageTitle = 'Tienda';
  if (view === 'categories') pageTitle = 'Categorías';
  else if (sort === 'newest') pageTitle = 'Novedades';
  else if (badge?.toLowerCase() === 'oferta') pageTitle = 'Ofertas';
  else if (hasCategory && categoryName) pageTitle = categoryName;

  const isFiltered = pageTitle !== 'Tienda';

  // Build breadcrumb items: always Inicio > Tienda, + active filter as last item
  const breadcrumbItems: { label: string; href: string | null }[] = [
    { label: 'Inicio', href: '/homepage' },
    { label: 'Tienda', href: isFiltered ? '/products' : null },
    ...(isFiltered ? [{ label: pageTitle.toUpperCase(), href: null }] : []),
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <section className="pt-[72px] bg-[#F2F0EC] relative overflow-hidden">
      {/* Background texture layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(28,28,28,0.8) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#E8E5DF] opacity-80 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-[#2563EB] opacity-[0.04] blur-[100px]" />
        <div className="absolute top-0 right-[18%] w-px h-full bg-gradient-to-b from-transparent via-[#DDD9D3]/60 to-transparent" />
        <div className="absolute top-0 right-[36%] w-px h-full bg-gradient-to-b from-transparent via-[#DDD9D3]/30 to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          aria-label="Breadcrumb"
          className="flex items-center gap-2 pt-10 mb-12"
        >
          {breadcrumbItems.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <Icon
                  name="ChevronRightIcon"
                  size={11}
                  variant="outline"
                  className="text-[#8A8A8A]"
                />
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-[10px] font-700 uppercase tracking-widest text-[#8A8A8A] hover:text-[#5A5A5A] transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[10px] font-700 uppercase tracking-widest text-[#1C1C1C]">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </motion.nav>

        {/* Hero content */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-end pb-14">
          {/* Left — headline block */}
          <div>
            {/* Eyebrow */}
            <motion.div
              key={pageTitle}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-px bg-[#2563EB]" />
              <span className="text-[10px] font-800 uppercase tracking-[0.2em] text-[#2563EB]">
                {isFiltered ? pageTitle : 'Colección 2026'}
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              key={pageTitle + '-h1'}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-900 italic uppercase text-[#1C1C1C] leading-[0.9] tracking-editorial mb-6"
              style={{ fontSize: 'clamp(3rem, 7vw, 7rem)' }}
            >
              {isFiltered ? (
                <>
                  {pageTitle.split(' ').length > 1 ? (
                    <>
                      {pageTitle.split(' ').slice(0, -1).join(' ')}
                      <br />
                      <span className="text-[#2563EB]">{pageTitle.split(' ').slice(-1)[0]}.</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[#2563EB]">{pageTitle}.</span>
                    </>
                  )}
                </>
              ) : (
                <>
                  Diseñado
                  <br />
                  para{' '}
                  <span
                    className="relative inline-block"
                    style={{
                      WebkitTextStroke: '1px rgba(28,28,28,0.25)',
                      color: 'transparent',
                    }}
                  >
                    Exigir
                  </span>
                  <br />
                  <span className="text-[#2563EB]">lo Mejor.</span>
                </>
              )}
            </motion.h1>

            {/* Supporting text */}
            <motion.p
              key={categoryName}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="text-[#5A5A5A] text-base leading-relaxed max-w-md mb-10"
            >
              {categoryDescriptions[categoryName.toLowerCase()] ?? DEFAULT_DESCRIPTION}
            </motion.p>

            {/* Premium search bar */}
            <motion.form
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
              onSubmit={handleSearch}
              className="relative max-w-xl"
            >
              <div
                className={`relative flex items-center bg-white transition-all duration-300 ${
                  searchFocused ? 'ring-1 ring-[#2563EB] ring-offset-0' : 'ring-1 ring-[#DDD9D3]'
                }`}
              >
                <div className="pl-5 pr-3 flex items-center shrink-0">
                  <Icon
                    name="MagnifyingGlassIcon"
                    size={18}
                    variant="outline"
                    className={`transition-colors duration-200 ${
                      searchFocused ? 'text-[#2563EB]' : 'text-[#8A8A8A]'
                    }`}
                  />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Buscar productos, marcas, categorías…"
                  className="flex-1 bg-transparent py-4 pr-4 text-[#1C1C1C] placeholder-[#8A8A8A] text-sm font-400 outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="px-3 text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors"
                    aria-label="Limpiar búsqueda"
                  >
                    <Icon name="XMarkIcon" size={14} variant="outline" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-4 bg-[#1C1C1C] text-white text-[10px] font-800 uppercase tracking-widest hover:bg-[#2563EB] transition-colors shrink-0"
                >
                  Buscar
                </button>
              </div>

              {/* Search suggestions hint */}
              <div className="flex items-center gap-4 mt-3">
                <span className="text-[10px] text-[#8A8A8A] font-500 uppercase tracking-wider">
                  Popular:
                </span>
                {['Monitor 4K', 'Teclado mecánico', 'Auriculares ANC'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchQuery(term)}
                    className="text-[10px] text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors font-500 underline underline-offset-2 decoration-[#DDD9D3] hover:decoration-[#1C1C1C]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.form>
          </div>

          {/* Right — stats column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="hidden lg:flex flex-col gap-0 border-l border-[#DDD9D3] pl-12 pb-2"
          >
            {[
              { value: '500+', label: 'Productos', sub: 'en catálogo' },
              { value: '12', label: 'Categorías', sub: 'especializadas' },
              { value: '4.9★', label: 'Valoración', sub: 'media global' },
              { value: '48h', label: 'Entrega', sub: 'express disponible' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.07 }}
                className="py-5 border-b border-[#DDD9D3]/60 last:border-b-0"
              >
                <p
                  className="font-display font-900 text-[#1C1C1C] leading-none tracking-tightest mb-1"
                  style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
                >
                  {stat.value}
                </p>
                <p className="text-[10px] font-700 uppercase tracking-widest text-[#5A5A5A]">
                  {stat.label}
                </p>
                <p className="text-[10px] text-[#8A8A8A] mt-0.5">{stat.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom accent bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: 'left' }}
          className="h-px bg-gradient-to-r from-[#1C1C1C] via-[#DDD9D3] to-transparent"
        />
      </div>
    </section>
  );
}
