'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import ProductFiltersSection from './ProductFiltersSection';
import { getProducts } from '@/lib/supabase/services';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

const badgeConfig: Record<string, { label: string; textColor: string; bg: string }> = {
  nuevo: { label: 'Nuevo', textColor: '#2563EB', bg: '#EFF6FF' },
  oferta: { label: 'Oferta', textColor: '#FFFFFF', bg: '#1C1C1C' },
  top: { label: 'Top Ventas', textColor: '#FFFFFF', bg: '#2C2C2C' },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="StarIcon"
          size={11}
          variant="solid"
          className={i < rating ? 'star-filled' : 'star-empty'}
        />
      ))}
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const badge = product.badge ? badgeConfig[product.badge.toLowerCase()] : null;
  const rating = Math.round(product.avg_rating ?? 0);
  const reviewCount = product.review_count ?? 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08, ease: [0.4, 0, 0.2, 1] }}
      className="product-card group"
    >
      {/* Image */}
      <Link href={`/product/${product.id}`} className="block">
        <div className="product-card-image aspect-square">
          <AppImage
            src={product.image_url || '/assets/images/no_image.png'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {badge && (
            <div
              className="absolute top-3 left-3 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest z-10"
              style={{ backgroundColor: badge.bg, color: badge.textColor }}
            >
              {badge.label}
            </div>
          )}

          {/* Hover actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300 flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100 z-10">
            <button
              aria-label={`Añadir ${product.name} al carrito`}
              onClick={(e) => e.preventDefault()}
              className="size-10 bg-white shadow-nova-md flex items-center justify-center hover:bg-[#1C1C1C] hover:text-white transition-colors"
            >
              <Icon name="ShoppingBagIcon" size={16} variant="outline" />
            </button>
            <button
              aria-label={`Añadir ${product.name} a favoritos`}
              onClick={(e) => e.preventDefault()}
              className="size-10 bg-white shadow-nova-md flex items-center justify-center hover:bg-[#1C1C1C] hover:text-white transition-colors"
            >
              <Icon name="HeartIcon" size={16} variant="outline" />
            </button>
            <button
              aria-label={`Vista rápida de ${product.name}`}
              onClick={(e) => e.preventDefault()}
              className="size-10 bg-white shadow-nova-md flex items-center justify-center hover:bg-[#1C1C1C] hover:text-white transition-colors"
            >
              <Icon name="EyeIcon" size={16} variant="outline" />
            </button>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-center gap-1.5">
          <StarRating rating={rating} />
          <span className="text-[10px] text-[#8A8A8A] font-500">({reviewCount})</span>
        </div>

        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-700 text-[#1C1C1C] text-[15px] leading-tight mb-1 group-hover:text-[#2563EB] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-[12px] text-[#5A5A5A] leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-900 text-[#1C1C1C] font-display">
              {formatPrice(product.price)}
            </span>
            {product.original_price && (
              <span className="text-[12px] text-[#8A8A8A] line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          <button
            aria-label={`Añadir ${product.name} al carrito`}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1C1C1C] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#2563EB] transition-colors"
          >
            Añadir
            <Icon name="PlusIcon" size={12} variant="outline" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#DDD9D3] overflow-hidden animate-pulse">
      <div className="bg-[#EFEDE9] aspect-square" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 bg-[#EFEDE9] rounded w-20" />
        <div className="h-4 bg-[#EFEDE9] rounded w-3/4" />
        <div className="h-3 bg-[#EFEDE9] rounded w-full" />
        <div className="h-5 bg-[#EFEDE9] rounded w-16" />
      </div>
    </div>
  );
}

export default function ProductGridSection({ searchQuery = '' }: { searchQuery?: string }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSort, setActiveSort] = useState('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts({
      categoryId: activeCategory === 'all' ? null : activeCategory,
      search: searchQuery.trim() || null,
    })
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeCategory, searchQuery]);

  const sorted = useMemo(() => {
    const list = [...products];
    if (activeSort === 'newest') {
      return list.reverse();
    } else if (activeSort === 'price-asc') {
      return list.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-desc') {
      return list.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'rating') {
      return list.sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0));
    }
    return list;
  }, [products, activeSort]);

  return (
    <>
      <ProductFiltersSection
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activeSort={activeSort}
        onSortChange={setActiveSort}
        productCount={sorted.length}
      />

      <section className="py-10 lg:py-16 bg-[#F8F7F5]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Count on mobile */}
          <div className="flex items-center justify-between mb-8 sm:hidden">
            <span className="label-eyebrow text-[#8A8A8A]">{sorted.length} productos</span>
          </div>

          {/* Product grid */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5"
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </motion.div>
            ) : sorted.length > 0 ? (
              <motion.div
                key={activeCategory + activeSort}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5"
              >
                {sorted.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 gap-6"
              >
                <div className="size-16 bg-[#EFEDE9] flex items-center justify-center">
                  <Icon name="MagnifyingGlassIcon" size={28} variant="outline" className="text-[#8A8A8A]" />
                </div>
                <div className="text-center">
                  <p className="font-700 text-[#1C1C1C] text-xl mb-2">Sin resultados</p>
                  <p className="text-[#5A5A5A] text-sm">No hay productos en esta categoría por el momento.</p>
                </div>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="px-8 py-3 bg-[#1C1C1C] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#2563EB] transition-colors"
                >
                  Ver todos los productos
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Load more */}
          {!loading && sorted.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col items-center gap-4 mt-16"
            >
              <p className="label-eyebrow text-[#8A8A8A]">
                Mostrando {sorted.length} de {sorted.length} productos
              </p>
              <div className="w-full max-w-xs bg-[#DDD9D3] h-1 rounded-full overflow-hidden">
                <div className="bg-[#1C1C1C] h-1 w-full rounded-full" />
              </div>
              <button className="mt-4 px-10 py-4 border-2 border-[#1C1C1C] text-[#1C1C1C] text-[11px] font-black uppercase tracking-widest hover:bg-[#1C1C1C] hover:text-white transition-all duration-300 inline-flex items-center gap-3 group">
                Cargar más productos
                <Icon name="ArrowDownIcon" size={14} variant="outline" className="group-hover:translate-y-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
