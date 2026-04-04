'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView, useScroll, useMotionValueEvent,  } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

/* ─── Types ─────────────────────────────────────────────────── */
interface ProductVariant {
  label: string;
  value: string;
  available: boolean;
}

interface ProductData {
  id: number;
  name: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: number;
  reviews: number;
  stock: number;
  sku: string;
  badge?: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  colorVariants: ProductVariant[];
  storageVariants: ProductVariant[];
  images: { src: string; alt: string }[];
}

interface RelatedProduct {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  image: string;
  alt: string;
  badge?: string;
}

/* ─── Mock Data ──────────────────────────────────────────────── */
const productData: ProductData = {
  id: 1,
  name: 'Monitor Ultra 4K 32"',
  subtitle: 'Panel IPS de alta resolución con tecnología HDR',
  price: '€649',
  originalPrice: '€799',
  discount: '-19%',
  rating: 5,
  reviews: 248,
  stock: 7,
  sku: 'NS-MON-4K-32',
  badge: 'Oferta',
  description:
    'Experimenta la perfección visual con el Monitor Ultra 4K 32". Diseñado para profesionales creativos y entusiastas del rendimiento, este monitor ofrece una cobertura de color sRGB del 99%, compatibilidad HDR400 y una frecuencia de actualización de 144Hz para una fluidez sin igual.',
  highlights: [
    'Panel IPS 4K UHD (3840×2160) con 144Hz',
    'Cobertura sRGB 99% y DCI-P3 95%',
    'HDR400 con brillo máximo de 400 nits',
    'Tiempo de respuesta de 1ms (GtG)',
    'Conectividad: 2× HDMI 2.1, 1× DisplayPort 1.4, 4× USB-A',
    'Soporte ergonómico con ajuste de altura, inclinación y rotación',
  ],
  specs: [
    { label: 'Tamaño de pantalla', value: '32 pulgadas' },
    { label: 'Resolución', value: '3840 × 2160 (4K UHD)' },
    { label: 'Tipo de panel', value: 'IPS' },
    { label: 'Frecuencia de actualización', value: '144 Hz' },
    { label: 'Tiempo de respuesta', value: '1 ms (GtG)' },
    { label: 'Brillo', value: '400 cd/m²' },
    { label: 'Contraste', value: '1000:1' },
    { label: 'Cobertura de color', value: 'sRGB 99%, DCI-P3 95%' },
    { label: 'Conectividad', value: '2× HDMI 2.1, 1× DP 1.4, 4× USB-A' },
    { label: 'Dimensiones', value: '714 × 476 × 232 mm' },
    { label: 'Peso', value: '7.8 kg' },
    { label: 'Garantía', value: '3 años NovaStore' },
  ],
  colorVariants: [
    { label: 'Negro Espacial', value: 'negro', available: true },
    { label: 'Plata Ártico', value: 'plata', available: true },
    { label: 'Blanco Lunar', value: 'blanco', available: false },
  ],
  storageVariants: [],
  images: [
    {
      src: 'https://images.unsplash.com/photo-1674083324755-94b34240ac99',
      alt: 'Monitor Ultra 4K 32 pulgadas en escritorio blanco con iluminación natural de estudio',
    },
    {
      src: 'https://img.rocket.new/generatedImages/rocket_gen_img_172ef71c2-1772217963581.png',
      alt: 'Vista lateral del monitor mostrando el diseño delgado y el soporte ergonómico premium',
    },
    {
      src: 'https://img.rocket.new/generatedImages/rocket_gen_img_175e586cb-1775202540384.png',
      alt: 'Detalle de los puertos de conectividad en la parte trasera del monitor',
    },
    {
      src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f9dbe984-1775202541984.png',
      alt: 'Monitor en uso con contenido creativo mostrando la calidad de color excepcional',
    },
  ],
};

const relatedProducts: RelatedProduct[] = [
  {
    id: 2,
    name: 'Teclado Mecánico Pro',
    price: '€189',
    rating: 5,
    reviews: 412,
    badge: 'Top Ventas',
    image: 'https://images.unsplash.com/photo-1643295054171-faf3f2491ecb',
    alt: 'Teclado mecánico premium con cuerpo de aluminio y retroiluminación RGB en escritorio limpio',
  },
  {
    id: 5,
    name: 'Ratón Ergonómico Inalámbrico',
    price: '€149',
    rating: 5,
    reviews: 534,
    badge: 'Top Ventas',
    image: 'https://images.unsplash.com/photo-1686730491164-56dc2145cdf9',
    alt: 'Ratón inalámbrico ergonómico sobre superficie blanca con luz natural difusa',
  },
  {
    id: 9,
    name: 'Soporte Laptop Premium',
    price: '€69',
    rating: 5,
    reviews: 892,
    badge: 'Top Ventas',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f9ea2001-1764658995251.png',
    alt: 'Soporte de aluminio para laptop en escritorio minimalista en oficina moderna',
  },
  {
    id: 6,
    name: 'Hub USB-C 12 en 1',
    price: '€89',
    originalPrice: '€119',
    rating: 4,
    reviews: 278,
    badge: 'Oferta',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1d9aec071-1767065457217.png',
    alt: 'Hub USB-C con múltiples puertos sobre superficie blanca en fotografía de producto',
  },
];

/* ─── Star Rating ────────────────────────────────────────────── */
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

/* ─── Premium Gallery ────────────────────────────────────────── */
function ProductGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [direction, setDirection] = useState(0);

  const navigate = (dir: number) => {
    setDirection(dir);
    setActive((a) => (a + dir + images.length) % images.length);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Main image — cinematic tall format */}
      <div
        className="relative overflow-hidden bg-[#F4F2EF] cursor-zoom-in group"
        style={{ aspectRatio: '4 / 5' }}
        onClick={() => setZoomed(!zoomed)}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40, scale: 1.03 }}
            animate={{ opacity: 1, x: 0, scale: zoomed ? 1.3 : 1 }}
            exit={{ opacity: 0, x: direction * -30, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <AppImage
              src={images[active].src}
              alt={images[active].alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Subtle gradient overlay bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {/* Zoom hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-5 right-5 flex items-center gap-1.5 bg-white/85 backdrop-blur-md px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#6B6B6B]"
        >
          <Icon name="MagnifyingGlassPlusIcon" size={11} variant="outline" />
          {zoomed ? 'Reducir' : 'Ampliar'}
        </motion.div>

        {/* Image counter */}
        <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-sm px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
          {active + 1} / {images.length}
        </div>

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 size-11 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:shadow-nova-md transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Imagen anterior"
            >
              <Icon name="ChevronLeftIcon" size={18} variant="outline" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 size-11 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:shadow-nova-md transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Imagen siguiente"
            >
              <Icon name="ChevronRightIcon" size={18} variant="outline" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setDirection(i > active ? 1 : -1); setActive(i); }}
              className={`transition-all duration-400 ${active === i ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'}`}
              aria-label={`Ir a imagen ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails row */}
      <div className="grid grid-cols-4 gap-2.5">
        {images.map((img, i) => (
          <motion.button
            key={i}
            onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`relative overflow-hidden border-2 transition-all duration-300 ${
              active === i
                ? 'border-[#1C1C1C] shadow-nova-sm'
                : 'border-[#DDD9D3] hover:border-[#8A8A8A]'
            }`}
            style={{ aspectRatio: '1/1' }}
          >
            <AppImage src={img.src} alt={img.alt} fill className="object-cover" sizes="120px" />
            {active !== i && (
              <div className="absolute inset-0 bg-white/30 hover:bg-transparent transition-colors duration-200" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Social proof strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex items-center gap-5 p-5 bg-white border border-[#E8E5E0]"
      >
        <div className="flex -space-x-2.5">
          {[
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
            'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop',
          ].map((src, i) => (
            <div key={i} className="size-9 rounded-full overflow-hidden border-2 border-white shadow-nova-sm">
              <AppImage src={src} alt="Cliente verificado" width={36} height={36} className="object-cover" />
            </div>
          ))}
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-700 text-[#0F0F0F]">+{productData.reviews} clientes satisfechos</p>
          <p className="text-[11px] text-[#6B6B6B] mt-0.5">Han comprado este producto este mes</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating rating={5} size={13} />
          <span className="text-[11px] font-700 text-[#0F0F0F]">4.9 / 5.0</span>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Trust Signals ──────────────────────────────────────────── */
function TrustSignals() {
  const signals = [
    { icon: 'TruckIcon', title: 'Envío gratuito', desc: 'En pedidos superiores a €50' },
    { icon: 'ArrowPathIcon', title: 'Devolución 30 días', desc: 'Sin preguntas, sin complicaciones' },
    { icon: 'ShieldCheckIcon', title: 'Garantía 3 años', desc: 'Cobertura total NovaStore' },
    { icon: 'LockClosedIcon', title: 'Pago 100% seguro', desc: 'Encriptación SSL 256-bit' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 mt-2">
      {signals.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 + i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="group flex items-start gap-3 p-4 bg-[#F8F7F5] border border-[#DDD9D3] hover:border-[#1C1C1C] hover:bg-white transition-all duration-300"
        >
          <div className="size-8 bg-[#EFF6FF] flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] transition-colors duration-300">
            <Icon
              name={s.icon as Parameters<typeof Icon>[0]['name']}
              size={15}
              variant="outline"
              className="text-[#2563EB] group-hover:text-white transition-colors duration-300"
            />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1C] leading-tight">{s.title}</p>
            <p className="text-[10px] text-[#6B6B6B] mt-0.5 leading-snug">{s.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Related Product Card ───────────────────────────────────── */
function RelatedProductCard({ product, index }: { product: RelatedProduct; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white border border-[#E8E5E0] overflow-hidden hover:border-[#0F0F0F] hover:shadow-nova-xl transition-all duration-500"
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-[#F4F2EF]" style={{ aspectRatio: '4/5' }}>
          <AppImage
            src={product.image}
            alt={product.alt}
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
          {/* Quick add overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] z-10">
            <button className="w-full py-3 bg-[#1C1C1C] text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#2563EB] transition-colors flex items-center justify-center gap-1.5">
              <Icon name="ShoppingBagIcon" size={12} variant="outline" />
              Añadir al carrito
            </button>
          </div>
          {/* Index ghost number */}
          <div className="absolute top-3 right-3 z-10">
            <span className="font-display font-900 italic text-white/10 group-hover:text-white/20 transition-colors duration-500 text-3xl leading-none">
              0{index + 1}
            </span>
          </div>
        </div>
        <div className="p-5 space-y-2.5">
          <div className="flex items-center gap-1.5">
            <StarRating rating={product.rating} size={11} />
            <span className="text-[10px] text-[#8A8A8A]">({product.reviews})</span>
          </div>
          <h3 className="font-700 text-[#1C1C1C] text-[14px] leading-tight group-hover:text-[#2563EB] transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 pt-1 border-t border-[#EFEDE9]">
            <span className="text-xl font-900 text-[#1C1C1C] font-display tracking-tightest">{product.price}</span>
            {product.originalPrice && (
              <span className="text-[12px] text-[#8A8A8A] line-through">{product.originalPrice}</span>
            )}
          </div>
        </div>
      </Link>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function ProductDetailPage() {
  const [selectedColor, setSelectedColor] = useState('negro');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'descripcion' | 'especificaciones' | 'resenas'>('descripcion');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 80));

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2400);
  };

  const product = productData;

  return (
    <div className="min-h-screen bg-[#F8F7F5]">

      {/* ── Breadcrumb ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="pt-[88px] pb-5 bg-white border-b border-[#DDD9D3]"
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <nav className="flex items-center gap-2 text-[10px] font-700 text-[#8A8A8A] uppercase tracking-widest">
            <Link href="/homepage" className="hover:text-[#1C1C1C] transition-colors">Inicio</Link>
            <Icon name="ChevronRightIcon" size={9} variant="outline" />
            <Link href="/products" className="hover:text-[#1C1C1C] transition-colors">Tienda</Link>
            <Icon name="ChevronRightIcon" size={9} variant="outline" />
            <Link href="/products" className="hover:text-[#1C1C1C] transition-colors">Setup</Link>
            <Icon name="ChevronRightIcon" size={9} variant="outline" />
            <span className="text-[#1C1C1C]">{product.name}</span>
          </nav>
        </div>
      </motion.div>

      {/* ── Main Product Section ── */}
      <section className="py-12 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_500px] gap-12 lg:gap-20 items-start">

            {/* Left: Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductGallery images={product.images} />
            </motion.div>

            {/* Right: Purchase Panel (sticky) */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:sticky lg:top-[96px] space-y-7"
            >
              {/* Badge + SKU row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {product.badge && (
                    <span className="px-3 py-1.5 bg-[#0F0F0F] text-white text-[9px] font-black uppercase tracking-widest">
                      {product.badge}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-[10px] text-[#22C55E] font-black uppercase tracking-widest">
                    <span className="relative flex size-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-60" />
                      <span className="relative inline-flex rounded-full size-2 bg-[#22C55E]" />
                    </span>
                    En stock
                  </span>
                </div>
                <span className="text-[10px] text-[#9A9A9A] font-500 uppercase tracking-widest">
                  SKU: {product.sku}
                </span>
              </div>

              {/* Title block */}
              <div className="space-y-3 pb-6 border-b border-[#E8E5E0]">
                <h1
                  className="font-display font-900 italic text-[#0F0F0F] uppercase leading-[0.88] tracking-[-0.04em]"
                  style={{ fontSize: 'clamp(2rem, 3.8vw, 3.2rem)' }}
                >
                  {product.name}
                </h1>
                <p className="text-[#5A5A5A] text-[15px] leading-relaxed max-w-sm">{product.subtitle}</p>

                {/* Rating row */}
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-2">
                    <StarRating rating={product.rating} size={15} />
                    <span className="text-[13px] font-700 text-[#1C1C1C]">4.9</span>
                  </div>
                  <button className="text-[11px] text-[#2563EB] hover:underline font-600">
                    {product.reviews} valoraciones
                  </button>
                  <span className="text-[11px] text-[#8A8A8A]">·</span>
                  <span className="text-[11px] text-[#5A5A5A] font-500">{product.stock} unidades restantes</span>
                </div>
              </div>

              {/* Price block */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="flex items-baseline gap-4"
              >
                <span
                  className="font-display font-900 italic text-[#0F0F0F] tracking-tightest"
                  style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)' }}
                >
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-[#8A8A8A] line-through font-400">{product.originalPrice}</span>
                )}
                {product.discount && (
                  <span className="px-2.5 py-1 bg-[#EFF6FF] text-[#2563EB] text-[10px] font-black uppercase tracking-widest">
                    {product.discount}
                  </span>
                )}
              </motion.div>

              {/* Color Variants */}
              {product.colorVariants.length > 0 && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0F0F0F]">Color</p>
                    <p className="text-[12px] text-[#5A5A5A] font-500">
                      {product.colorVariants.find((v) => v.value === selectedColor)?.label}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {product.colorVariants.map((variant) => (
                      <motion.button
                        key={variant.value}
                        onClick={() => variant.available && setSelectedColor(variant.value)}
                        disabled={!variant.available}
                        whileHover={variant.available ? { scale: 1.02 } : {}}
                        whileTap={variant.available ? { scale: 0.97 } : {}}
                        className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-200 ${
                          !variant.available
                            ? 'border-[#DDD9D3] text-[#C4C4C4] cursor-not-allowed line-through'
                            : selectedColor === variant.value
                            ? 'border-[#1C1C1C] bg-[#1C1C1C] text-white shadow-nova-sm'
                            : 'border-[#DDD9D3] text-[#5A5A5A] hover:border-[#1C1C1C] hover:text-[#1C1C1C]'
                        }`}
                      >
                        {variant.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + CTA block */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#0F0F0F]">Cantidad</p>
                  <p className="text-[11px] text-[#8A8A8A]">Máx. {product.stock} unidades</p>
                </div>

                <div className="flex gap-3">
                  {/* Qty selector */}
                  <div className="flex items-center border-2 border-[#E8E5E0] hover:border-[#0F0F0F] transition-colors duration-200">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="size-12 flex items-center justify-center text-[#5A5A5A] hover:text-[#1C1C1C] hover:bg-[#EFEDE9] transition-colors"
                      aria-label="Reducir cantidad"
                    >
                      <Icon name="MinusIcon" size={14} variant="outline" />
                    </button>
                    <span className="w-10 text-center text-[15px] font-700 text-[#0F0F0F]">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="size-12 flex items-center justify-center text-[#5A5A5A] hover:text-[#1C1C1C] hover:bg-[#EFEDE9] transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Icon name="PlusIcon" size={14} variant="outline" />
                    </button>
                  </div>

                  {/* Add to cart */}
                  <motion.button
                    onClick={handleAddToCart}
                    whileTap={{ scale: 0.97 }}
                    className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-400 ${
                      addedToCart
                        ? 'bg-[#22C55E] text-white'
                        : 'bg-[#1C1C1C] text-white hover:bg-[#2563EB]'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {addedToCart ? (
                        <motion.span
                          key="added"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex items-center gap-2"
                        >
                          <Icon name="CheckIcon" size={15} variant="outline" />
                          ¡Añadido al carrito!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="add"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex items-center gap-2"
                        >
                          <Icon name="ShoppingBagIcon" size={15} variant="outline" />
                          Añadir al carrito
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                {/* Buy now */}
                <motion.button
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 border-2 border-[#1C1C1C] text-[#1C1C1C] text-[10px] font-black uppercase tracking-widest hover:bg-[#1C1C1C] hover:text-white transition-all duration-300 flex items-center justify-center gap-2.5"
                >
                  <Icon name="BoltIcon" size={14} variant="outline" />
                  Comprar ahora — Entrega en 24h
                </motion.button>
              </div>

              {/* Wishlist + Share row */}
              <div className="flex items-center gap-4 pt-1">
                <motion.button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-1.5 text-[10px] font-700 uppercase tracking-widest text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors"
                >
                  <Icon
                    name="HeartIcon"
                    size={14}
                    variant={isWishlisted ? 'solid' : 'outline'}
                    className={isWishlisted ? 'text-red-500' : ''}
                  />
                  {isWishlisted ? 'Guardado' : 'Guardar'}
                </motion.button>
                <span className="text-[#DDD9D3]">|</span>
                <button className="flex items-center gap-1.5 text-[10px] font-700 uppercase tracking-widest text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors">
                  <Icon name="ShareIcon" size={14} variant="outline" />
                  Compartir
                </button>
                <span className="text-[#DDD9D3]">|</span>
                <button className="flex items-center gap-1.5 text-[10px] font-700 uppercase tracking-widest text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors">
                  <Icon name="ArrowsRightLeftIcon" size={14} variant="outline" />
                  Comparar
                </button>
              </div>

              {/* Trust Signals */}
              <TrustSignals />

              {/* Urgency strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="flex items-center gap-3 p-4 bg-[#FFF7ED] border border-[#FED7AA]"
              >
                <Icon name="FireIcon" size={17} variant="solid" className="text-[#EA580C] shrink-0" />
                <p className="text-[11px] text-[#9A3412] font-600 leading-snug">
                  <span className="font-black">¡Solo quedan {product.stock} unidades!</span> — Alta demanda en las últimas 24h.
                </p>
              </motion.div>

              {/* Payment methods */}
              <div className="pt-1 border-t border-[#DDD9D3]">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#8A8A8A] mb-3">Métodos de pago aceptados</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {['Visa', 'Mastercard', 'PayPal', 'Bizum', 'Apple Pay'].map((method) => (
                    <span
                      key={method}
                      className="px-2.5 py-1.5 border border-[#DDD9D3] text-[9px] font-black uppercase tracking-widest text-[#5A5A5A] bg-white"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Tabs: Description / Specs / Reviews ── */}
      <section className="py-16 lg:py-24 bg-white border-t border-[#DDD9D3]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Tab bar */}
          <div className="flex gap-0 border-b border-[#DDD9D3] mb-12 overflow-x-auto">
            {(['descripcion', 'especificaciones', 'resenas'] as const).map((tab) => {
              const labels = {
                descripcion: 'Descripción',
                especificaciones: 'Especificaciones',
                resenas: `Valoraciones (${product.reviews})`,
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-7 py-5 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab ? 'text-[#1C1C1C]' : 'text-[#8A8A8A] hover:text-[#5A5A5A]'
                  }`}
                >
                  {labels[tab]}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1C1C1C]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'descripcion' && (
              <motion.div
                key="desc"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-14"
              >
                <div>
                  <p className="label-eyebrow text-[#8A8A8A] mb-5">Descripción del producto</p>
                  <p className="text-[#5A5A5A] text-[15px] leading-[1.75] mb-8">{product.description}</p>
                  <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <AppImage
                      src={product.images[1].src}
                      alt={product.images[1].alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <div>
                  <p className="label-eyebrow text-[#8A8A8A] mb-6">Características principales</p>
                  <ul className="space-y-4">
                    {product.highlights.map((h, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.4 }}
                        className="flex items-start gap-3.5 pb-4 border-b border-[#EFEDE9] last:border-0"
                      >
                        <div className="size-5 bg-[#EFF6FF] flex items-center justify-center shrink-0 mt-0.5">
                          <Icon name="CheckIcon" size={10} variant="outline" className="text-[#2563EB]" />
                        </div>
                        <span className="text-[14px] text-[#1C1C1C] font-500 leading-relaxed">{h}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'especificaciones' && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl"
              >
                <p className="label-eyebrow text-[#8A8A8A] mb-6">Especificaciones técnicas</p>
                <div className="divide-y divide-[#DDD9D3] border border-[#DDD9D3]">
                  {product.specs.map((spec, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex items-start gap-4 px-6 py-4 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F7F5]'}`}
                    >
                      <span className="text-[11px] font-black uppercase tracking-widest text-[#8A8A8A] w-44 shrink-0 pt-0.5">
                        {spec.label}
                      </span>
                      <span className="text-[14px] text-[#1C1C1C] font-500">{spec.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'resenas' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12"
              >
                {/* Summary */}
                <div className="space-y-5">
                  <div className="text-center p-8 bg-[#EFEDE9] border border-[#DDD9D3]">
                    <p className="font-display font-900 italic text-[#1C1C1C] text-7xl tracking-tightest leading-none mb-3">
                      4.9
                    </p>
                    <StarRating rating={5} size={20} />
                    <p className="text-[11px] text-[#5A5A5A] mt-3">{product.reviews} valoraciones verificadas</p>
                  </div>
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const pct = stars === 5 ? 82 : stars === 4 ? 12 : stars === 3 ? 4 : stars === 2 ? 1 : 1;
                    return (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="text-[11px] font-700 text-[#6B6B6B] w-4 text-right">{stars}</span>
                        <Icon name="StarIcon" size={11} variant="solid" className="text-[#C8922A] shrink-0" />
                        <div className="flex-1 h-1.5 bg-[#DDD9D3] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full bg-[#1C1C1C]"
                          />
                        </div>
                        <span className="text-[11px] text-[#8A8A8A] w-8">{pct}%</span>
                      </div>
                    );
                  })}
                </div>

                {/* Reviews list */}
                <div className="space-y-5">
                  {[
                    {
                      name: 'Carlos M.',
                      date: 'Hace 2 días',
                      rating: 5,
                      text: 'Increíble monitor. Los colores son absolutamente perfectos para mi trabajo de diseño gráfico. La calidad de imagen es impresionante y la frecuencia de actualización de 144Hz hace que todo se vea muy fluido.',
                      verified: true,
                    },
                    {
                      name: 'Laura P.',
                      date: 'Hace 1 semana',
                      rating: 5,
                      text: 'Compré este monitor para trabajar desde casa y ha superado todas mis expectativas. La pantalla es enorme y muy nítida. El soporte ergonómico es muy útil para ajustar la altura.',
                      verified: true,
                    },
                    {
                      name: 'Alejandro R.',
                      date: 'Hace 2 semanas',
                      rating: 4,
                      text: 'Muy buen monitor en general. La calidad de imagen es excelente y la conectividad es perfecta. Le quito una estrella porque el menú OSD podría ser más intuitivo.',
                      verified: true,
                    },
                  ].map((review, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-7 bg-white border border-[#DDD9D3] hover:border-[#1C1C1C] transition-colors duration-300"
                    >
                      <div className="flex items-center gap-2.5 mb-4">
                        <span className="font-700 text-[#1C1C1C] text-[14px]">{review.name}</span>
                        {review.verified && (
                          <span className="px-2 py-0.5 bg-[#EFF6FF] text-[#2563EB] text-[9px] font-black uppercase tracking-widest">
                            Verificado
                          </span>
                        )}
                      </div>
                      <StarRating rating={review.rating} size={13} />
                      <span className="text-[11px] text-[#8A8A8A]">{review.date}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Related Products ── */}
      <section className="py-20 lg:py-32 bg-[#EFEDE9]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Section header */}
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
            {relatedProducts.map((p, i) => (
              <RelatedProductCard key={p.id} product={p} index={i} />
            ))}
          </div>

          {/* Mobile CTA */}
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
    </div>
  );
}