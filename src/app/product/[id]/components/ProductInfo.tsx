'use client';

import React from 'react';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';
import StarRating from '@/components/ui/StarRating';

type ProductInfoProps = {
  product: Product;
  rating: number;
  reviewCount: number;
  discount: string | null;
};

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
            <span
              className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${
                product.stock < 10 ? 'text-[#F59E0B]' : 'text-[#22C55E]'
              }`}
            >
              <span className="relative flex size-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${
                    product.stock < 10 ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full size-2 ${
                    product.stock < 10 ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'
                  }`}
                />
              </span>
              {product.stock < 10 ? `¡Solo ${product.stock} restantes!` : 'En stock'}
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
            <StarRating rating={rating} size="sm" />
            <span className="text-[13px] font-700 text-[#1C1C1C]">
              {product.avg_rating?.toFixed(1) || '0.0'}
            </span>
          </div>
          <button className="text-[11px] text-[#2563EB] hover:underline font-600">
            {reviewCount} valoraciones
          </button>
          <span className="text-[11px] text-[#8A8A8A]">·</span>
          <span
            className={`text-[11px] font-500 ${
              product.stock < 10 ? 'text-[#F59E0B] font-700' : 'text-[#5A5A5A]'
            }`}
          >
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
