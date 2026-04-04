'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

type Badge = 'nuevo' | 'oferta' | 'top';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  badge?: Badge;
  image: string;
  alt: string;
  href: string;
}

const badgeConfig: Record<Badge, { label: string; color: string; bg: string }> = {
  nuevo: { label: 'Nuevo', color: '#2563EB', bg: '#EFF6FF' },
  oferta: { label: 'Oferta', color: '#FFFFFF', bg: '#1C1C1C' },
  top: { label: 'Top Ventas', color: '#FFFFFF', bg: '#2C2C2C' },
};

const featuredProducts: Product[] = [
  {
    id: 1,
    name: 'Monitor Ultra 4K 32"',
    description: 'Panel IPS de alta resolución con cobertura sRGB 99% y HDR400.',
    price: '€649',
    originalPrice: '€799',
    rating: 5,
    reviews: 248,
    badge: 'oferta',
    image: "https://images.unsplash.com/photo-1495521939206-a217db9df264",
    alt: 'Large 4K monitor on clean white desk in bright airy studio with natural window light',
    href: '/product/1',
  },
  {
    id: 2,
    name: 'Teclado Mecánico Pro',
    description: 'Switches táctiles premium, retroiluminación RGB y cuerpo de aluminio.',
    price: '€189',
    rating: 5,
    reviews: 412,
    badge: 'top',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_116f799df-1769196847067.png",
    alt: 'Premium mechanical keyboard with aluminum body on clean light desk surface in well-lit workspace',
    href: '/product/2',
  },
  {
    id: 3,
    name: 'Auriculares ANC Studio',
    description: 'Cancelación activa de ruido de 40dB, 30h de batería, drivers de 40mm.',
    price: '€299',
    rating: 4,
    reviews: 189,
    badge: 'nuevo',
    image: "https://images.unsplash.com/photo-1674230100409-5fc79a435c6b",
    alt: 'Premium over-ear headphones on bright clean white surface with soft diffused daylight',
    href: '/product/3',
  },
  {
    id: 4,
    name: 'Lámpara de Escritorio LED',
    description: 'Temperatura de color ajustable, intensidad regulable y carga USB-C.',
    price: '€129',
    rating: 5,
    reviews: 367,
    badge: 'top',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1cc9b0dc7-1772172128875.png",
    alt: 'Modern minimalist desk lamp on clean white desk in bright well-lit home office with natural light',
    href: '/product/4',
  },
];

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
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const badge = product.badge ? badgeConfig[product.badge] : null;

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
          src={product.image}
          alt={product.alt}
          fill
          className="object-cover transition-transform duration-800 group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Subtle dark scrim on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

        {/* Badge */}
        {badge && (
          <div
            className="absolute top-4 left-4 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest z-10"
            style={{ backgroundColor: badge.bg, color: badge.color }}
          >
            {badge.label}
          </div>
        )}

        {/* Product index */}
        <div className="absolute top-4 right-4 z-10">
          <span className="font-display font-900 italic text-[#1C1C1C]/8 group-hover:text-[#1C1C1C]/14 transition-colors duration-500 text-4xl leading-none">
            0{index + 1}
          </span>
        </div>

        {/* Quick actions overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] z-10">
          <button
            aria-label="Añadir al carrito"
            className="flex-1 py-3 bg-[#1C1C1C] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#2563EB] transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Icon name="ShoppingBagIcon" size={14} variant="outline" />
            Añadir
          </button>
          <button
            aria-label="Añadir a favoritos"
            className="size-11 bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-[#1C1C1C] hover:text-white transition-colors duration-200 border border-[#DDD9D3]"
          >
            <Icon name="HeartIcon" size={16} variant="outline" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-[11px] text-[#8A8A8A] font-500">({product.reviews})</span>
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
            <span className="text-2xl font-900 text-[#1C1C1C] font-display tracking-tightest">{product.price}</span>
            {product.originalPrice && (
              <span className="text-[13px] text-[#8A8A8A] line-through">{product.originalPrice}</span>
            )}
          </div>
          <Link
            href={product.href}
            className="size-10 flex items-center justify-center border border-[#DDD9D3] text-[#5A5A5A] hover:bg-[#1C1C1C] hover:text-white hover:border-[#1C1C1C] transition-all duration-200 group/arrow"
            aria-label={`Ver ${product.name}`}
          >
            <Icon name="ArrowRightIcon" size={15} variant="outline" className="group-hover/arrow:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </motion.div>
  );
}

export default function FeaturedProductsSection() {
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
              <Icon name="ArrowRightIcon" size={14} variant="outline" className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <span className="text-[11px] text-[#8A8A8A] font-500">{featuredProducts.length} productos seleccionados</span>
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
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
