'use client';

import React, { useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';
import StarRating from '@/components/ui/StarRating';
import type { Product } from '@/types';

function RelatedProductCard({
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
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const rating = Math.round(product.avg_rating ?? 0);
  const reviewCount = product.review_count ?? 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
      className="group relative bg-white border border-[#E8E5E0] overflow-hidden hover:border-[#0F0F0F] hover:shadow-nova-xl transition-[border-color,box-shadow] duration-500"
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-[#F4F2EF]" style={{ aspectRatio: '4/5' }}>
          <AppImage
            src={product.image_url || '/assets/images/no_image.png'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
          {product.badge && (
            <div className="absolute top-3 left-3 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-[#2563EB] text-white z-10">
              {product.badge}
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/12 transition-colors duration-400" />
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="flex-1 py-3 bg-[#1C1C1C] text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#2563EB] transition-colors flex items-center justify-center gap-1.5"
            >
              <Icon name="ShoppingBagIcon" size={12} variant="outline" />
              Añadir
            </button>
            <button
              aria-label="Añadir a favoritos"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleWishlist(product.id);
              }}
              className="size-10 bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-[#1C1C1C] hover:text-white transition-colors border border-[#DDD9D3]"
            >
              <Icon
                name="HeartIcon"
                size={14}
                variant={isWishlisted ? 'solid' : 'outline'}
                className={isWishlisted ? 'text-red-500' : ''}
              />
            </button>
          </div>
          <div className="absolute top-3 right-3 z-10">
            <span className="font-display font-900 italic text-white/10 group-hover:text-white/20 transition-colors duration-500 text-3xl leading-none">
              0{index + 1}
            </span>
          </div>
        </div>
        <div className="p-5 space-y-2.5">
          <div className="flex items-center gap-1.5">
            <StarRating rating={rating} size="sm" />
            <span className="text-[10px] text-[#8A8A8A]">({reviewCount})</span>
          </div>
          <h3 className="font-700 text-[#1C1C1C] text-[14px] leading-tight group-hover:text-[#2563EB] transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 pt-1 border-t border-[#EFEDE9]">
            <span className="text-xl font-900 text-[#1C1C1C] font-display tracking-tightest">
              {formatPrice(product.price)}
            </span>
            {product.original_price && (
              <span className="text-[12px] text-[#8A8A8A] line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </motion.div>
  );
}

type RelatedProductsProps = {
  products: Product[];
};

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItem(product, 1);
      toast.success('Agregado al carrito');
    },
    [addItem]
  );

  const handleToggleWishlist = useCallback(
    (id: string) => {
      toggleWishlist(id);
    },
    [toggleWishlist]
  );

  if (products.length === 0) return null;

  return (
    <section className="py-20 lg:py-32 bg-[#EFEDE9]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="label-eyebrow text-[#8A8A8A] mb-4">Completa tu setup</p>
            <h2
              className="font-display font-900 italic text-[#1C1C1C] uppercase leading-[0.88] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2rem, 3.8vw, 3.2rem)' }}
            >
              Productos
              <br />
              <span className="text-[#2563EB]">Relacionados</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden md:inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors group border-b border-transparent hover:border-[#1C1C1C] pb-0.5"
          >
            Ver catálogo completo
            <Icon
              name="ArrowRightIcon"
              size={13}
              variant="outline"
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {products.map((p, i) => (
            <RelatedProductCard
              key={p.id}
              product={p}
              index={i}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={isInWishlist(p.id)}
            />
          ))}
        </div>
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1C1C1C] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#2563EB] transition-colors"
          >
            Ver catálogo completo
          </Link>
        </div>
      </div>
    </section>
  );
}
