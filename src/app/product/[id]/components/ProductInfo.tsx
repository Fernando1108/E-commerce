'use client';

import React from 'react';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill={i < rating ? '#C8922A' : 'none'}
          stroke={i < rating ? '#C8922A' : '#DDD9D3'}
          strokeWidth="1.5"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

type ProductInfoProps = {
  product: Product;
  rating: number;
  reviewCount: number;
  discount: string | null;
};

export { StarRating };
export default function ProductInfo({ product, rating, reviewCount, discount }: ProductInfoProps) {
  return (
    <>
      {/* Badge + Stock */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {product.badge && (
            <span className="px-3 py-1.5 bg-[#0F0F0F] text-white text-[9px] font-black uppercase tracking-widest">
              {product.badge}
            </span>
          )}
          {product.stock > 0 && (
            <span className="flex items-center gap-1.5 text-[10px] text-[#22C55E] font-black uppercase tracking-widest">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-60" />
                <span className="relative inline-flex rounded-full size-2 bg-[#22C55E]" />
              </span>
              En stock
            </span>
          )}
        </div>
      </div>

      {/* Title block */}
      <div className="space-y-3 pb-6 border-b border-[#E8E5E0]">
        <h1
          className="font-display font-900 italic text-[#0F0F0F] uppercase leading-[0.88] tracking-[-0.04em]"
          style={{ fontSize: 'clamp(2rem, 3.8vw, 3.2rem)' }}
        >
          {product.name}
        </h1>
        {product.description && (
          <p className="text-[#5A5A5A] text-[15px] leading-relaxed max-w-sm">
            {product.description}
          </p>
        )}
        <div className="flex items-center gap-4 pt-1">
          <div className="flex items-center gap-2">
            <StarRating rating={rating} size={15} />
            <span className="text-[13px] font-700 text-[#1C1C1C]">
              {product.avg_rating?.toFixed(1) || '0.0'}
            </span>
          </div>
          <button className="text-[11px] text-[#2563EB] hover:underline font-600">
            {reviewCount} valoraciones
          </button>
          <span className="text-[11px] text-[#8A8A8A]">·</span>
          <span className="text-[11px] text-[#5A5A5A] font-500">
            {product.stock} unidades restantes
          </span>
        </div>
      </div>

      {/* Price block */}
      <div className="flex items-baseline gap-4">
        <span
          className="font-display font-900 italic text-[#0F0F0F] tracking-tightest"
          style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)' }}
        >
          {formatPrice(product.price)}
        </span>
        {product.original_price && (
          <span className="text-xl text-[#8A8A8A] line-through font-400">
            {formatPrice(product.original_price)}
          </span>
        )}
        {discount && (
          <span className="px-2.5 py-1 bg-[#EFF6FF] text-[#2563EB] text-[10px] font-black uppercase tracking-widest">
            {discount}
          </span>
        )}
      </div>
    </>
  );
}
