'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import StarRating from '@/components/ui/StarRating';
import ProductSpecs from './ProductSpecs';
import { toast } from 'sonner';
import type { Product } from '@/types';

/* ─── Reviews Section ─────────────────────────────────────────── */

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  profiles?: { name: string | null };
}

function ReviewsTab({
  product,
  rating,
  reviewCount: initialReviewCount,
  user,
}: {
  product: Product;
  rating: number;
  reviewCount: number;
  user: { id?: string; email?: string | null } | null;
}) {
  const [selectedStar, setSelectedStar] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?product_id=${product.id}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error('Error al cargar reseñas');
    } finally {
      setLoadingReviews(false);
    }
  }, [product.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStar || !comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          rating: selectedStar,
          comment: comment.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al publicar reseña');
      }
      toast.success('Reseña publicada');
      setComment('');
      setSelectedStar(0);
      fetchReviews();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al publicar reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al eliminar reseña');
      }
      toast.success('Reseña eliminada');
      fetchReviews();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar reseña');
    }
  };

  const reviewCount = reviews.length || initialReviewCount;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
      {/* Rating summary + reviews list */}
      <div>
        <p className="label-eyebrow text-[#8A8A8A] mb-6">Valoración general</p>
        <div className="p-8 bg-[#EFEDE9] border border-[#DDD9D3] inline-block mb-6">
          <p className="font-display font-900 italic text-[#1C1C1C] text-7xl tracking-tightest leading-none mb-3">
            {product.avg_rating?.toFixed(1) || '0.0'}
          </p>
          <StarRating rating={rating} size="md" />
          <p className="text-[11px] text-[#5A5A5A] mt-3">{reviewCount} valoraciones</p>
        </div>

        {/* Reviews list */}
        {loadingReviews ? (
          <div className="flex justify-center py-8">
            <div className="size-6 border-2 border-[#1C1C1C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-[#8A8A8A] text-sm">Sé el primero en valorar este producto.</p>
        ) : (
          <div className="space-y-4 mt-6">
            {reviews.map((review) => (
              <div key={review.id} className="border border-[#DDD9D3] bg-[#FCFBF9] p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-[12px] font-bold text-[#1C1C1C]">
                      {review.profiles?.name || 'Cliente'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#8A8A8A]">
                      {new Date(review.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {user && user.id === review.user_id && (
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="text-[#8A8A8A] hover:text-red-500 transition-colors"
                        title="Eliminar reseña"
                        aria-label="Eliminar reseña"
                      >
                        <Icon name="TrashIcon" size={13} variant="outline" />
                      </button>
                    )}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-[13px] text-[#5A5A5A] leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
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
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C1C1C] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#2563EB] transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star selector */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#5A5A5A] mb-3">
                Tu puntuación
              </p>
              <StarRating
                rating={selectedStar}
                onChange={setSelectedStar}
                size="lg"
                readOnly={false}
              />
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
  user: { id?: string; email?: string | null } | null;
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
    <section id="product-tabs" className="py-16 lg:py-24 bg-white border-t border-[#DDD9D3]">
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
