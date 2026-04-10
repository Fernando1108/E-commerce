'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import StarRating from '@/components/ui/StarRating';
import ProductFiltersSection from './ProductFiltersSection';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';
import type { Product } from '@/types';

const PAGE_SIZE = 8;

const badgeConfig: Record<string, { label: string; textColor: string; bg: string }> = {
  nuevo: { label: 'Nuevo', textColor: '#2563EB', bg: '#EFF6FF' },
  oferta: { label: 'Oferta', textColor: '#FFFFFF', bg: '#1C1C1C' },
  top: { label: 'Top Ventas', textColor: '#FFFFFF', bg: '#2C2C2C' },
};

// ─── Quick View Modal ─────────────────────────────────────────────────────────
function ProductQuickViewModal({
  product,
  onClose,
  onAddToCart,
}: {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}) {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white dark:bg-slate-800 max-w-2xl w-full grid grid-cols-1 sm:grid-cols-2 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Cerrar vista rápida"
          className="absolute top-3 right-3 z-10 size-8 flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-[#F8F7F5] transition-colors"
        >
          <Icon name="XMarkIcon" size={18} variant="outline" />
        </button>

        {/* Image */}
        <div className="relative aspect-square bg-[#EFEDE9] dark:bg-slate-700">
          <AppImage
            src={product.image_url || '/assets/images/no_image.png'}
            alt={product.name}
            fill
            className="object-cover"
          />
          {product.badge && badgeConfig[product.badge.toLowerCase()] && (
            <div
              className="absolute top-3 left-3 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest"
              style={{
                backgroundColor: badgeConfig[product.badge.toLowerCase()].bg,
                color: badgeConfig[product.badge.toLowerCase()].textColor,
              }}
            >
              {badgeConfig[product.badge.toLowerCase()].label}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-6 flex flex-col gap-4">
          <div>
            <h2 className="font-700 text-[#1C1C1C] text-xl leading-tight mb-2">{product.name}</h2>
            <p className="text-[13px] text-[#5A5A5A] leading-relaxed line-clamp-4">
              {product.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-900 text-[#1C1C1C] font-display">
              {formatPrice(product.price)}
            </span>
            {product.original_price && (
              <span className="text-sm text-[#8A8A8A] line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>

          <p className="text-[12px] text-[#5A5A5A]">
            Stock:{' '}
            <span className={`font-700 ${product.stock > 0 ? 'text-[#1C1C1C]' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
            </span>
          </p>

          <div className="flex flex-col gap-3 mt-auto pt-2">
            <button
              disabled={product.stock === 0}
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="w-full py-3 bg-[#1C1C1C] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#2563EB] transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="ShoppingBagIcon" size={14} variant="outline" />
              Añadir al carrito
            </button>
            <Link
              href={`/product/${product.slug || product.id}`}
              className="w-full py-3 border border-[#DDD9D3] text-[#1C1C1C] text-[11px] font-black uppercase tracking-widest hover:bg-[#F8F7F5] transition-colors text-center"
            >
              Ver detalle completo
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
  index,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onQuickView,
}: {
  product: Product;
  index: number;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
  onQuickView: (product: Product) => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const badge = product.badge ? badgeConfig[product.badge.toLowerCase()] : null;
  const rating = Math.round(product.avg_rating ?? 0);
  const reviewCount = product.review_count ?? 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
      className="product-card group"
    >
      {/* Image */}
      <Link href={`/product/${product.slug || product.id}`} className="block">
        <div className="product-card-image aspect-square">
          <AppImage
            src={product.image_url || '/assets/images/no_image.png'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {badge && (
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 18,
                delay: (index % 4) * 0.08 + 0.2,
              }}
              className="absolute top-3 left-3 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest z-10"
              style={{ backgroundColor: badge.bg, color: badge.textColor }}
            >
              {badge.label}
            </motion.div>
          )}

          {/* Hover actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300 flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100 z-10">
            <button
              aria-label={`Añadir ${product.name} al carrito`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="size-10 bg-white shadow-nova-md flex items-center justify-center hover:bg-[#1C1C1C] hover:text-white transition-colors"
            >
              <Icon name="ShoppingBagIcon" size={16} variant="outline" />
            </button>
            <button
              aria-label={`Añadir ${product.name} a favoritos`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleWishlist(product.id);
              }}
              className="size-10 bg-white shadow-nova-md flex items-center justify-center hover:bg-[#1C1C1C] hover:text-white transition-colors"
            >
              <Icon
                name="HeartIcon"
                size={16}
                variant={isWishlisted ? 'solid' : 'outline'}
                className={isWishlisted ? 'text-red-500' : ''}
              />
            </button>
            <button
              aria-label={`Vista rápida de ${product.name}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="size-10 bg-white shadow-nova-md flex items-center justify-center hover:bg-[#1C1C1C] hover:text-white transition-colors"
            >
              <Icon name="EyeIcon" size={16} variant="outline" />
            </button>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-center gap-1.5">
          <StarRating rating={rating} size="sm" />
          <span className="text-[10px] text-[#8A8A8A] font-500">({reviewCount})</span>
        </div>

        <div>
          <Link href={`/product/${product.slug || product.id}`}>
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
            <span className="text-lg font-900 text-[#1C1C1C] font-display">
              {formatPrice(product.price)}
            </span>
            {product.original_price && (
              <span className="text-[12px] text-[#8A8A8A] line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          <button
            aria-label={`Añadir ${product.name} al carrito`}
            onClick={() => onAddToCart(product)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1C1C1C] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#2563EB] transition-colors"
          >
            Añadir
            <Icon name="PlusIcon" size={12} variant="outline" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="skeleton-shimmer bg-white dark:bg-slate-800 border border-[#DDD9D3] dark:border-slate-700 overflow-hidden">
      <div className="bg-[#EFEDE9] dark:bg-slate-700 aspect-square" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 bg-[#EFEDE9] dark:bg-slate-700 rounded w-20" />
        <div className="h-4 bg-[#EFEDE9] dark:bg-slate-700 rounded w-3/4" />
        <div className="h-3 bg-[#EFEDE9] dark:bg-slate-700 rounded w-full" />
        <div className="h-5 bg-[#EFEDE9] dark:bg-slate-700 rounded w-16" />
      </div>
    </div>
  );
}

export default function ProductGridSection({
  searchQuery = '',
  initialCategory = 'all',
  initialSort = 'featured',
  initialBadge = '',
}: {
  searchQuery?: string;
  initialCategory?: string;
  initialSort?: string;
  initialBadge?: string;
}) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSort, setActiveSort] = useState(initialSort);
  const [activeBadge] = useState(initialBadge);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const fetchProducts = useCallback((category: string, search: string) => {
    setLoading(true);
    setProductsError(false);
    setOffset(0);
    setProducts([]);
    const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: '0' });
    if (category !== 'all') params.set('category', category);
    if (search.trim()) params.set('search', search.trim());
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(data);
        setHasMore(data.length === PAGE_SIZE);
        setLoading(false);
      })
      .catch(() => {
        setProductsError(true);
        setLoading(false);
      });
  }, []);

  // Reset and fetch on filter/search change
  useEffect(() => {
    fetchProducts(activeCategory, searchQuery);
  }, [activeCategory, searchQuery, fetchProducts]);

  const handleLoadMore = async () => {
    const nextOffset = offset + PAGE_SIZE;
    setLoadingMore(true);
    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(nextOffset),
      });
      if (activeCategory !== 'all') params.set('category', activeCategory);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (activeSort && activeSort !== 'featured') params.set('sort', activeSort);
      const res = await fetch(`/api/products?${params}`);
      const data: Product[] = await res.json();
      setProducts((prev) => [...prev, ...data]);
      setOffset(nextOffset);
      setHasMore(data.length === PAGE_SIZE);
    } catch {
      /* empty */
    }
    setLoadingMore(false);
  };

  const sorted = useMemo(() => {
    let list = [...products];
    if (activeBadge) {
      list = list.filter((p) => p.badge?.toLowerCase() === activeBadge.toLowerCase());
    }
    if (activeSort === 'newest') {
      return list.reverse();
    } else if (activeSort === 'price-asc') {
      return list.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-desc') {
      return list.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'rating') {
      return list.sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0));
    }
    return list;
  }, [products, activeSort, activeBadge]);

  const totalShown = sorted.length;

  return (
    <>
      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductQuickViewModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      <ProductFiltersSection
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activeSort={activeSort}
        onSortChange={setActiveSort}
        productCount={totalShown}
      />

      <section className="py-10 lg:py-16 bg-[#F8F7F5] dark:bg-slate-900">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Count on mobile */}
          <div className="flex items-center justify-between mb-8 sm:hidden">
            <span className="label-eyebrow text-[#8A8A8A]">{totalShown} productos</span>
          </div>

          {/* Product grid */}
          <AnimatePresence mode="wait">
            {productsError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 gap-6"
              >
                <div className="size-16 bg-[#EFEDE9] flex items-center justify-center">
                  <Icon
                    name="ExclamationTriangleIcon"
                    size={28}
                    variant="outline"
                    className="text-[#8A8A8A]"
                  />
                </div>
                <div className="text-center">
                  <p className="font-700 text-[#1C1C1C] text-xl mb-2">Error al cargar productos</p>
                  <p className="text-[#5A5A5A] text-sm">
                    No se pudieron cargar los productos. Inténtalo de nuevo.
                  </p>
                </div>
                <button
                  onClick={() => fetchProducts(activeCategory, searchQuery)}
                  className="px-8 py-3 bg-[#1C1C1C] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#2563EB] transition-colors"
                >
                  Reintentar
                </button>
              </motion.div>
            ) : loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5"
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </motion.div>
            ) : sorted.length > 0 ? (
              <motion.div
                key={activeCategory + activeSort}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5"
              >
                {sorted.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={isInWishlist(product.id)}
                    onQuickView={setSelectedProduct}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 gap-6"
              >
                <div className="size-16 bg-[#EFEDE9] flex items-center justify-center">
                  <Icon
                    name="MagnifyingGlassIcon"
                    size={28}
                    variant="outline"
                    className="text-[#8A8A8A]"
                  />
                </div>
                <div className="text-center">
                  <p className="font-700 text-[#1C1C1C] text-xl mb-2">Sin resultados</p>
                  <p className="text-[#5A5A5A] text-sm">
                    No hay productos en esta categoría por el momento.
                  </p>
                </div>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="px-8 py-3 bg-[#1C1C1C] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#2563EB] transition-colors"
                >
                  Ver todos los productos
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Load more */}
          {!loading && sorted.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col items-center gap-4 mt-16"
            >
              <p className="label-eyebrow text-[#8A8A8A]">
                Mostrando {totalShown} producto{totalShown !== 1 ? 's' : ''}
              </p>
              {hasMore && (
                <>
                  <div className="w-full max-w-xs bg-[#DDD9D3] h-1 rounded-full overflow-hidden">
                    <div
                      className={`bg-[#1C1C1C] h-1 rounded-full transition-all duration-500 ${
                        loadingMore ? 'animate-pulse' : ''
                      }`}
                      style={{
                        width: `${Math.min(((offset + PAGE_SIZE) / (offset + PAGE_SIZE * 2)) * 100, 90)}%`,
                      }}
                    />
                  </div>
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="mt-4 px-10 py-4 border-2 border-[#1C1C1C] text-[#1C1C1C] text-[11px] font-black uppercase tracking-widest hover:bg-[#1C1C1C] hover:text-white transition-all duration-300 inline-flex items-center gap-3 group disabled:opacity-60"
                  >
                    {loadingMore ? (
                      <>
                        <Icon
                          name="ArrowPathIcon"
                          size={14}
                          variant="outline"
                          className="animate-spin"
                        />
                        Cargando...
                      </>
                    ) : (
                      <>
                        Cargar más (+{PAGE_SIZE})
                        <Icon
                          name="ArrowDownIcon"
                          size={14}
                          variant="outline"
                          className="group-hover:translate-y-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </>
              )}
              {!hasMore && (
                <div className="w-full max-w-xs bg-[#DDD9D3] h-1 rounded-full overflow-hidden">
                  <div className="bg-[#1C1C1C] h-1 w-full rounded-full" />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
