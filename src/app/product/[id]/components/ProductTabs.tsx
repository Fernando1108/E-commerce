'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { StarRating } from './ProductInfo';
import ProductSpecs from './ProductSpecs';
import type { Product } from '@/types';

/* ─── Reviews Section ─────────────────────────────────────────── */
function ReviewsTab({
  product,
  rating,
  reviewCount,
  user,
}: {
  product: Product;
  rating: number;
  reviewCount: number;
  user: { email?: string | null } | null;
}) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStar || !comment.trim()) return;
    setSubmitting(true);
    // Placeholder: connect to /api/reviews when Anderson has the endpoint
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setSubmitting(false);
    setComment('');
    setSelectedStar(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
      {/* Rating summary */}
      <div>
        <p className="label-eyebrow text-[#8A8A8A] mb-6">Valoración general</p>
        <div className="p-8 bg-[#EFEDE9] border border-[#DDD9D3] inline-block mb-6">
          <p className="font-display font-900 italic text-[#1C1C1C] text-7xl tracking-tightest leading-none mb-3">
            {product.avg_rating?.toFixed(1) || '0.0'}
          </p>
          <StarRating rating={rating} size={20} />
          <p className="text-[11px] text-[#5A5A5A] mt-3">{reviewCount} valoraciones</p>
        </div>
        {reviewCount === 0 && (
          <p className="text-[#8A8A8A] text-sm">Sé el primero en valorar este producto.</p>
        )}
      </div>

      {/* Review form */}
      <div>
        <p className="label-eyebrow text-[#8A8A8A] mb-6">Deja tu reseña</p>
        {!user ? (
          <div className="border border-[#DDD9D3] bg-[#F8F7F5] p-6 text-center">
            <Icon
              name="UserIcon"
              size={32}
              variant="outline"
              className="text-[#8A8A8A] mx-auto mb-3"
            />
            <p className="text-[#5A5A5A] text-sm mb-4">Inicia sesión para dejar una reseña</p>
            <a
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C1C1C] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#2563EB] transition-colors"
            >
              Iniciar sesión
            </a>
          </div>
        ) : submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-[#D8E4FF] bg-[#EFF6FF] p-6 text-center"
          >
            <Icon
              name="CheckCircleIcon"
              size={32}
              variant="outline"
              className="text-[#2563EB] mx-auto mb-3"
            />
            <p className="text-[#2563EB] font-bold text-sm">¡Gracias por tu reseña!</p>
            <p className="text-[#2563EB]/70 text-xs mt-1">Tu valoración será visible pronto.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star selector */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#5A5A5A] mb-3">
                Tu puntuación
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setSelectedStar(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <svg
                      width={28}
                      height={28}
                      viewBox="0 0 20 20"
                      fill={star <= (hoveredStar || selectedStar) ? '#C8922A' : 'none'}
                      stroke={star <= (hoveredStar || selectedStar) ? '#C8922A' : '#DDD9D3'}
                      strokeWidth="1.5"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
                {(hoveredStar || selectedStar) > 0 && (
                  <span className="text-[12px] text-[#8A8A8A] self-center ml-1">
                    {
                      ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][
                        hoveredStar || selectedStar
                      ]
                    }
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-[#5A5A5A] mb-2">
                Comentario
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comparte tu experiencia con este producto..."
                rows={4}
                className="w-full border border-[#DDD9D3] bg-[#FCFBF9] focus:border-[#1C1C1C] focus:bg-white px-4 py-3 text-[14px] text-[#1C1C1C] outline-none transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedStar || !comment.trim() || submitting}
              className="inline-flex h-12 items-center justify-center px-8 bg-[#1C1C1C] text-white text-[10px] font-black uppercase tracking-[0.22em] hover:bg-[#2563EB] disabled:bg-[#8A8A8A] disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Enviando...' : 'Publicar reseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── Main Tabs Component ─────────────────────────────────────── */
type ProductTabsProps = {
  product: Product;
  galleryImages: { src: string; alt: string }[];
  rating: number;
  reviewCount: number;
  user: { email?: string | null } | null;
};

type Tab = 'descripcion' | 'especificaciones' | 'resenas';

export default function ProductTabs({
  product,
  galleryImages,
  rating,
  reviewCount,
  user,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('descripcion');
  const highlights = product.highlights || [];
  const specsEntries = Object.entries(product.specs || {});

  const tabs: { id: Tab; label: string }[] = [
    { id: 'descripcion', label: 'Descripción' },
    ...(specsEntries.length > 0
      ? [{ id: 'especificaciones' as Tab, label: 'Especificaciones' }]
      : []),
    { id: 'resenas', label: `Valoraciones (${reviewCount})` },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white border-t border-[#DDD9D3]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex gap-0 border-b border-[#DDD9D3] mb-12 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-7 py-5 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors duration-200 ${activeTab === tab.id ? 'text-[#1C1C1C]' : 'text-[#8A8A8A] hover:text-[#5A5A5A]'}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1C1C1C]"
                />
              )}
            </button>
          ))}
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
                <p className="text-[#5A5A5A] text-[15px] leading-[1.75] mb-8">
                  {product.description}
                </p>
                {galleryImages.length > 1 && (
                  <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <AppImage
                      src={galleryImages[1].src}
                      alt={galleryImages[1].alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                )}
              </div>
              {highlights.length > 0 && (
                <div>
                  <p className="label-eyebrow text-[#8A8A8A] mb-6">Características principales</p>
                  <ul className="space-y-4">
                    {highlights.map((h, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.4 }}
                        className="flex items-start gap-3.5 pb-4 border-b border-[#EFEDE9] last:border-0"
                      >
                        <div className="size-5 bg-[#EFF6FF] flex items-center justify-center shrink-0 mt-0.5">
                          <Icon
                            name="CheckIcon"
                            size={10}
                            variant="outline"
                            className="text-[#2563EB]"
                          />
                        </div>
                        <span className="text-[14px] text-[#1C1C1C] font-500 leading-relaxed">
                          {h}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'especificaciones' && (
            <motion.div
              key="specs"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductSpecs specs={product.specs || {}} />
            </motion.div>
          )}

          {activeTab === 'resenas' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <ReviewsTab product={product} rating={rating} reviewCount={reviewCount} user={user} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
