'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { getProducts } from '@/lib/supabase/services';
import { toast } from 'sonner';
import type { Product } from '@/types';

const WISHLIST_KEY = 'novastore-wishlist';

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]') as string[];
    setWishlistIds(ids);
    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    // Fetch all products and filter by ids
    getProducts({ limit: 100 })
      .then((all) => {
        setProducts(all.filter((p) => ids.includes(p.id)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const removeFromWishlist = (productId: string) => {
    const updated = wishlistIds.filter((id) => id !== productId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    setWishlistIds(updated);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toast.success('Eliminado de tu lista de deseos');
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1, null);
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Header />

      {/* Page header */}
      <section className="relative border-b border-[#DDD9D3] overflow-hidden pt-[72px]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/4 w-[500px] h-[300px] bg-[#EFEDE9] rounded-full blur-[120px]" />
        </div>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-14 py-12 lg:py-16 relative">
          <div className="flex items-end justify-between gap-4">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[10px] font-black uppercase tracking-[0.22em] text-[#2563EB] mb-3"
              >
                Mi colección
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="font-display italic font-900 text-5xl lg:text-7xl tracking-editorial text-[#1C1C1C] leading-none"
              >
                Wishlist
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden sm:block text-[#8A8A8A] text-[10px] font-bold uppercase tracking-[0.18em]"
            >
              {wishlistIds.length} {wishlistIds.length === 1 ? 'producto' : 'productos'}
            </motion.p>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="size-8 border-2 border-[#1C1C1C] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : wishlistIds.length === 0 ? (
        /* Empty state */
        <section className="max-w-[1440px] mx-auto px-6 lg:px-14 py-40 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-7"
          >
            <div className="size-28 rounded-full bg-[#EFEDE9] border border-[#DDD9D3] flex items-center justify-center">
              <Icon name="HeartIcon" size={44} variant="outline" className="text-[#8A8A8A]" />
            </div>
            <div>
              <h2 className="font-display italic font-900 text-3xl text-[#1C1C1C] tracking-editorial mb-3">
                Tu lista de deseos está vacía
              </h2>
              <p className="text-[#5A5A5A] text-sm max-w-xs leading-relaxed">
                Guarda los productos que te gusten para encontrarlos fácilmente más tarde.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-9 py-4 bg-[#1C1C1C] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#2563EB] transition-all duration-300"
            >
              <Icon name="ArrowLeftIcon" size={13} variant="outline" />
              Explorar productos
            </Link>
          </motion.div>
        </section>
      ) : (
        <section className="max-w-[1440px] mx-auto px-6 lg:px-14 py-12 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative bg-white border border-[#DDD9D3] hover:border-[#1C1C1C] overflow-hidden transition-all duration-500"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label="Eliminar de wishlist"
                    className="absolute top-3 right-3 z-10 size-8 bg-white/90 border border-[#DDD9D3] flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-[#8A8A8A] transition-all duration-200"
                  >
                    <Icon name="HeartIcon" size={14} variant="solid" className="text-red-400" />
                  </button>

                  {/* Image */}
                  <Link
                    href={`/product/${product.id}`}
                    className="block relative overflow-hidden bg-[#F4F2EF]"
                    style={{ aspectRatio: '4/5' }}
                  >
                    <AppImage
                      src={product.image_url || '/assets/images/no_image.png'}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                    {product.badge && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-[#2563EB] text-white">
                        {product.badge}
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="p-5 space-y-3">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-700 text-[#1C1C1C] text-[14px] leading-tight group-hover:text-[#2563EB] transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-display font-900 italic text-[#1C1C1C] tracking-editorial">
                        {formatPrice(product.price)}
                      </span>
                      {product.original_price && (
                        <span className="text-[12px] text-[#8A8A8A] line-through">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 py-3 bg-[#1C1C1C] text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#2563EB] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Icon name="ShoppingBagIcon" size={12} variant="outline" />
                        Añadir al carrito
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="size-10 border border-[#DDD9D3] flex items-center justify-center text-[#8A8A8A] hover:text-red-500 hover:border-red-200 transition-all duration-200"
                      >
                        <Icon name="TrashIcon" size={13} variant="outline" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
