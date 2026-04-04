'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import ProductFiltersSection from './ProductFiltersSection';

type Badge = 'nuevo' | 'oferta' | 'top';
type CategoryId = 'setup' | 'audio' | 'tech' | 'lighting' | 'accessories' | 'storage';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  badge?: Badge;
  category: CategoryId;
  image: string;
  alt: string;
}

const badgeConfig: Record<Badge, {label: string;textColor: string;bg: string;}> = {
  nuevo: { label: 'Nuevo', textColor: '#2563EB', bg: '#EFF6FF' },
  oferta: { label: 'Oferta', textColor: '#FFFFFF', bg: '#1C1C1C' },
  top: { label: 'Top Ventas', textColor: '#FFFFFF', bg: '#2C2C2C' }
};

const allProducts: Product[] = [
{
  id: 1, name: 'Monitor Ultra 4K 32"', description: 'Panel IPS de alta resolución, cobertura sRGB 99% y HDR400.', price: '€649', originalPrice: '€799', rating: 5, reviews: 248, badge: 'oferta', category: 'setup',
  image: "https://images.unsplash.com/photo-1495521939206-a217db9df264",
  alt: 'Large 4K monitor on clean white desk in bright airy studio with natural window light'
},
{
  id: 2, name: 'Teclado Mecánico Pro', description: 'Switches táctiles premium, retroiluminación RGB y cuerpo de aluminio.', price: '€189', rating: 5, reviews: 412, badge: 'top', category: 'setup',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_116f799df-1769196847067.png",
  alt: 'Premium mechanical keyboard with aluminum body on clean light desk surface in well-lit workspace'
},
{
  id: 3, name: 'Auriculares ANC Studio', description: 'Cancelación activa de ruido 40dB, 30h de batería, drivers 40mm.', price: '€299', rating: 4, reviews: 189, badge: 'nuevo', category: 'audio',
  image: "https://images.unsplash.com/photo-1674230100409-5fc79a435c6b",
  alt: 'Premium over-ear headphones on bright clean white surface with soft diffused daylight'
},
{
  id: 4, name: 'Lámpara de Escritorio LED', description: 'Temperatura de color ajustable, intensidad regulable y carga USB-C.', price: '€129', rating: 5, reviews: 367, badge: 'top', category: 'lighting',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1cc9b0dc7-1772172128875.png",
  alt: 'Modern minimalist desk lamp on clean white desk in bright well-lit home office with natural light'
},
{
  id: 5, name: 'Ratón Ergonómico Inalámbrico', description: 'Sensor de 25.600 DPI, conectividad tri-modo, batería 70 días.', price: '€149', rating: 5, reviews: 534, badge: 'top', category: 'setup',
  image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
  alt: 'Sleek wireless ergonomic mouse on clean white desk surface in bright natural daylight'
},
{
  id: 6, name: 'Hub USB-C 12 en 1', description: 'Conectividad total: Thunderbolt 4, HDMI 8K, SD card, Ethernet.', price: '€89', originalPrice: '€119', rating: 4, reviews: 278, badge: 'oferta', category: 'accessories',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d9aec071-1767065457217.png",
  alt: 'Modern USB-C hub with multiple ports on clean bright white surface in well-lit product photography'
},
{
  id: 7, name: 'Micrófono de Condensador', description: 'Grabación de estudio en casa, cardioide, 192kHz/24bit, USB-C.', price: '€219', rating: 5, reviews: 143, badge: 'nuevo', category: 'audio',
  image: "https://images.unsplash.com/photo-1615661433945-8c7ee7e7cef1",
  alt: 'Professional condenser microphone on stand in bright clean studio environment with natural light'
},
{
  id: 8, name: 'SSD Externo 2TB', description: 'Velocidades de lectura 2.000 MB/s, resistente a golpes, compacto.', price: '€179', rating: 4, reviews: 621, badge: 'top', category: 'storage',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_179fb9967-1770692223983.png",
  alt: 'Compact external SSD drive on clean white surface in bright well-lit product photography'
},
{
  id: 9, name: 'Soporte Laptop Premium', description: 'Aluminio aeroespacial, altura ajustable, compatible 11"–17".', price: '€69', rating: 5, reviews: 892, badge: 'top', category: 'accessories',
  image: "https://images.unsplash.com/photo-1730299788847-b7fc97c82f2a",
  alt: 'Premium aluminum laptop stand on clean minimal desk in bright airy modern office'
},
{
  id: 10, name: 'Webcam 4K Ultra HD', description: 'Resolución 4K 60fps, HDR, autofoco AI, micrófono dual estéreo.', price: '€259', originalPrice: '€299', rating: 4, reviews: 167, badge: 'oferta', category: 'tech',
  image: "https://images.unsplash.com/photo-1518472803163-8d3a9e90792c",
  alt: 'Modern 4K webcam on clean white surface in bright well-lit home office with natural daylight'
},
{
  id: 11, name: 'Tira LED Ambiente RGB', description: 'Control por app, 16M colores, sincronización musical, IP67.', price: '€49', rating: 4, reviews: 1243, badge: 'top', category: 'lighting',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b2325139-1775201374322.png",
  alt: 'RGB LED strip lights creating colorful ambient lighting in modern clean room setup'
},
{
  id: 12, name: 'Altavoz Bluetooth Studio', description: '360° sonido inmersivo, 20h batería, resistente al agua IPX7.', price: '€199', rating: 5, reviews: 389, badge: 'nuevo', category: 'audio',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_15bf57617-1772327620552.png",
  alt: 'Premium bluetooth speaker on clean white surface in bright airy modern studio with natural light'
}];


function StarRating({ rating }: {rating: number;}) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) =>
      <Icon
        key={i}
        name="StarIcon"
        size={11}
        variant="solid"
        className={i < rating ? 'star-filled' : 'star-empty'} />

      )}
    </div>);

}

function ProductCard({ product, index }: {product: Product;index: number;}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const badge = product.badge ? badgeConfig[product.badge] : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index % 4 * 0.08, ease: [0.4, 0, 0.2, 1] }}
      className="product-card group">
      
      {/* Image */}
      <Link href={`/product/${product.id}`} className="block">
        <div className="product-card-image aspect-square">
          <AppImage
            src={product.image}
            alt={product.alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
          

          {badge &&
          <div
            className="absolute top-3 left-3 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest z-10"
            style={{ backgroundColor: badge.bg, color: badge.textColor }}>
          
              {badge.label}
            </div>
          }

          {/* Hover actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300 flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100 z-10">
            <button
              aria-label={`Añadir ${product.name} al carrito`}
              onClick={(e) => e.preventDefault()}
              className="size-10 bg-white shadow-nova-md flex items-center justify-center hover:bg-[#1C1C1C] hover:text-white transition-colors">
              
              <Icon name="ShoppingBagIcon" size={16} variant="outline" />
            </button>
            <button
              aria-label={`Añadir ${product.name} a favoritos`}
              onClick={(e) => e.preventDefault()}
              className="size-10 bg-white shadow-nova-md flex items-center justify-center hover:bg-[#1C1C1C] hover:text-white transition-colors">
              
              <Icon name="HeartIcon" size={16} variant="outline" />
            </button>
            <button
              aria-label={`Vista rápida de ${product.name}`}
              onClick={(e) => e.preventDefault()}
              className="size-10 bg-white shadow-nova-md flex items-center justify-center hover:bg-[#1C1C1C] hover:text-white transition-colors">
              
              <Icon name="EyeIcon" size={16} variant="outline" />
            </button>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} />
          <span className="text-[10px] text-[#8A8A8A] font-500">({product.reviews})</span>
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
            <span className="text-lg font-900 text-[#1C1C1C] font-display">{product.price}</span>
            {product.originalPrice &&
            <span className="text-[12px] text-[#8A8A8A] line-through">{product.originalPrice}</span>
            }
          </div>
          <button
            aria-label={`Añadir ${product.name} al carrito`}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1C1C1C] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#2563EB] transition-colors">
            
            Añadir
            <Icon name="PlusIcon" size={12} variant="outline" />
          </button>
        </div>
      </div>
    </motion.div>);

}

export default function ProductGridSection({ searchQuery = '' }: { searchQuery?: string }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSort, setActiveSort] = useState('featured');

  const filtered = useMemo(() => {
    let list = activeCategory === 'all' ?
    allProducts :
    allProducts.filter((p) => p.category === activeCategory);

    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (activeSort === 'newest') {
      list = [...list].reverse();
    } else if (activeSort === 'price-asc') {
      list = [...list].sort((a, b) => {
        const pa = parseFloat(a.price.replace('€', '').replace(',', '.'));
        const pb = parseFloat(b.price.replace('€', '').replace(',', '.'));
        return pa - pb;
      });
    } else if (activeSort === 'price-desc') {
      list = [...list].sort((a, b) => {
        const pa = parseFloat(a.price.replace('€', '').replace(',', '.'));
        const pb = parseFloat(b.price.replace('€', '').replace(',', '.'));
        return pb - pa;
      });
    } else if (activeSort === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    }

    return list;
  }, [activeCategory, activeSort, searchQuery]);

  return (
    <>
      <ProductFiltersSection
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activeSort={activeSort}
        onSortChange={setActiveSort}
        productCount={filtered.length} />
      

      <section className="py-10 lg:py-16 bg-[#F8F7F5]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Count on mobile */}
          <div className="flex items-center justify-between mb-8 sm:hidden">
            <span className="label-eyebrow text-[#8A8A8A]">{filtered.length} productos</span>
          </div>

          {/* Product grid */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ?
            <motion.div
              key={activeCategory + activeSort}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              
                {filtered.map((product, i) =>
              <ProductCard key={product.id} product={product} index={i} />
              )}
              </motion.div> :

            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 gap-6">
              
                <div className="size-16 bg-[#EFEDE9] flex items-center justify-center">
                  <Icon name="MagnifyingGlassIcon" size={28} variant="outline" className="text-[#8A8A8A]" />
                </div>
                <div className="text-center">
                  <p className="font-700 text-[#1C1C1C] text-xl mb-2">Sin resultados</p>
                  <p className="text-[#5A5A5A] text-sm">No hay productos en esta categoría por el momento.</p>
                </div>
                <button
                onClick={() => setActiveCategory('all')}
                className="px-8 py-3 bg-[#1C1C1C] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#2563EB] transition-colors">
                
                  Ver todos los productos
                </button>
              </motion.div>
            }
          </AnimatePresence>

          {/* Load more */}
          {filtered.length > 0 &&
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col items-center gap-4 mt-16">
            
              <p className="label-eyebrow text-[#8A8A8A]">
                Mostrando {filtered.length} de {filtered.length} productos
              </p>
              <div className="w-full max-w-xs bg-[#DDD9D3] h-1 rounded-full overflow-hidden">
                <div className="bg-[#1C1C1C] h-1 w-full rounded-full" />
              </div>
              <button className="mt-4 px-10 py-4 border-2 border-[#1C1C1C] text-[#1C1C1C] text-[11px] font-black uppercase tracking-widest hover:bg-[#1C1C1C] hover:text-white transition-all duration-300 inline-flex items-center gap-3 group">
                Cargar más productos
                <Icon name="ArrowDownIcon" size={14} variant="outline" className="group-hover:translate-y-1 transition-transform" />
              </button>
            </motion.div>
          }
        </div>
      </section>
    </>);

}