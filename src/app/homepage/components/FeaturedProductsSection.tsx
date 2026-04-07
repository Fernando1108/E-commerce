'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { getFeaturedProducts } from '@/lib/supabase/services';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import type { Product } from '@/types';

const badgeConfig: Record<string, { label: string; color: string; bg: string }> = {
  nuevo: { label: 'Nuevo', color: '#2563EB', bg: '#EFF6FF' },
  oferta: { label: 'Oferta', color: '#FFFFFF', bg: '#1C1C1C' },
  top: { label: 'Top Ventas', color: '#FFFFFF', bg: '#2C2C2C' },
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

function ProductCard({
  product,
  index,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: {
  product: Product;
  index: number;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const badge = product.badge ? badgeConfig[product.badge.toLowerCase()] : null;
  const rating = Math.round(product.avg_rating ?? 0);
  const reviewCount = product.review_count ?? 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white border border-[#DDD9D3] overflow-hidden transition-all duration-500 hover:border-[#1C1C1C] hover:shadow-nova-xl"
    >
      {/* Image area */}
      <div className="relative overflow-hidden bg-[#EFEDE9]" style={{ aspectRatio: '4/5' }}>
        <AppImage
          src={product.image_url || '/assets/images/no_image.png'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-800 group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

        {badge && (
          <div
            className="absolute top-4 left-4 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest z-10"
            style={{ backgroundColor: badge.bg, color: badge.color }}
          >
            {badge.label}
          </div>
        )}

        <div className="absolute top-4 right-4 z-10">
          <span className="font-display font-900 italic text-[#1C1C1C]/8 group-hover:text-[#1C1C1C]/14 transition-colors duration-500 text-4xl leading-none">
            0{index + 1}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] z-10">
          <button
            aria-label="Añadir al carrito"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="flex-1 py-3 bg-[#1C1C1C] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#2563EB] transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Icon name="ShoppingBagIcon" size={14} variant="outline" />
            Añadir
          </button>
          <button
            aria-label="Añadir a favoritos"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className="size-11 bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-[#1C1C1C] hover:text-white transition-colors duration-200 border border-[#DDD9D3]"
          >
            <Icon
              name="HeartIcon"
              size={16}
              variant={isWishlisted ? 'solid' : 'outline'}
              className={isWishlisted ? 'text-red-500' : ''}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <StarRating rating={rating} />
          <span className="text-[11px] text-[#8A8A8A] font-500">({reviewCount})</span>
        </div>

        <div>
          <h3 className="font-700 text-[#1C1C1C] text-base leading-tight mb-1.5 group-hover:text-[#2563EB] transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-[13px] text-[#5A5A5A] leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[#EFEDE9]">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-900 text-[#1C1C1C] font-display tracking-tightest">
              {formatPrice(product.price)}
            </span>
            {product.original_price && (
              <span className="text-[13px] text-[#8A8A8A] line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          <Link
            href={`/product/${product.id}`}
            className="size-10 flex items-center justify-center border border-[#DDD9D3] text-[#5A5A5A] hover:bg-[#1C1C1C] hover:text-white hover:border-[#1C1C1C] transition-all duration-200 group/arrow"
            aria-label={`Ver ${product.name}`}
          >
            <Icon
              name="ArrowRightIcon"
              size={15}
              variant="outline"
              className="group-hover/arrow:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#DDD9D3] overflow-hidden animate-pulse">
      <div className="bg-[#EFEDE9] aspect-[4/5]" />
      <div className="p-6 space-y-4">
        <div className="h-3 bg-[#EFEDE9] rounded w-24" />
        <div className="space-y-2">
          <div className="h-4 bg-[#EFEDE9] rounded w-3/4" />
          <div className="h-3 bg-[#EFEDE9] rounded w-full" />
        </div>
        <div className="h-6 bg-[#EFEDE9] rounded w-20" />
      </div>
    </div>
  );
}

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItem(product, 1);
    },
    [addItem]
  );

  const handleToggleWishlist = useCallback(
    (id: string) => {
      toggleWishlist(id);
    },
    [toggleWishlist]
  );

  useEffect(() => {
    getFeaturedProducts(4)
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 lg:py-32 bg-[#F2F0EC]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="label-eyebrow text-[#8A8A8A] mb-4">Selección editorial</p>
            <h2
              className="font-display font-900 italic text-[#1C1C1C] uppercase leading-[0.88] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)' }}
            >
              Productos
              <br />
              <span className="text-[#2563EB]">Destacados</span>
            </h2>
          </div>
          <div className="hidden md:flex flex-col items-end gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors group border-b border-transparent hover:border-[#1C1C1C] pb-0.5"
            >
              Ver catálogo completo
              <Icon
                name="ArrowRightIcon"
                size={14}
                variant="outline"
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <span className="text-[11px] text-[#8A8A8A] font-500">
              {products.length} productos seleccionados
            </span>
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isInWishlist(product.id)}
                />
              ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1C1C1C] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#2563EB] transition-colors"
          >
            Ver catálogo completo
          </Link>
        </div>
      </div>
    </section>
  );
}
