'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';
import { getProductById, getProductImages, getProducts } from '@/lib/supabase/services';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';
import type { Product } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/ProductInfo';
import ProductVariants from './components/ProductVariants';
import ProductActions from './components/ProductActions';
import ProductTabs from './components/ProductTabs';
import RelatedProducts from './components/RelatedProducts';

function TrustSignals() {
  const signals = [
    { icon: 'TruckIcon', title: 'Envío gratuito', desc: 'En pedidos superiores a $50' },
    {
      icon: 'ArrowPathIcon',
      title: 'Devolución 30 días',
      desc: 'Sin preguntas, sin complicaciones',
    },
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
          transition={{ delay: 0.7 + i * 0.07, duration: 0.45 }}
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
            <p className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1C] leading-tight">
              {s.title}
            </p>
            <p className="text-[10px] text-[#6B6B6B] mt-0.5 leading-snug">{s.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [galleryImages, setGalleryImages] = useState<{ src: string; alt: string }[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    Promise.all([getProductById(productId), getProductImages(productId)])
      .then(([prod, images]) => {
        if (!prod) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setProduct(prod);
        const gallery: { src: string; alt: string }[] = prod.image_url
          ? [{ src: prod.image_url, alt: prod.name }]
          : [];
        images.forEach((img) => gallery.push({ src: img.url, alt: img.alt || prod.name }));
        setGalleryImages(
          gallery.length > 0 ? gallery : [{ src: '/assets/images/no_image.png', alt: prod.name }]
        );
        getProducts({ categoryId: prod.category_id, limit: 4 })
          .then((related) =>
            setRelatedProducts(related.filter((r) => r.id !== prod.id).slice(0, 4))
          )
          .catch(() => {});
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity, selectedVariant);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2400);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(productId);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, quantity, selectedVariant);
    router.push('/cart');
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product?.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copiado');
    }
  };

  if (loading)
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#F8F7F5] pt-[88px]">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-12 lg:gap-20 animate-pulse">
              <div className="bg-[#EFEDE9] aspect-[4/5]" />
              <div className="space-y-6">
                <div className="h-4 bg-[#EFEDE9] rounded w-24" />
                <div className="h-10 bg-[#EFEDE9] rounded w-3/4" />
                <div className="h-12 bg-[#EFEDE9] rounded w-40" />
                <div className="h-14 bg-[#EFEDE9] rounded w-full" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );

  if (notFound || !product)
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#F8F7F5] pt-[88px] flex flex-col items-center justify-center">
          <div className="text-center space-y-6">
            <div className="size-20 bg-[#EFEDE9] rounded-full flex items-center justify-center mx-auto">
              <Icon
                name="ExclamationTriangleIcon"
                size={36}
                variant="outline"
                className="text-[#8A8A8A]"
              />
            </div>
            <h1 className="font-display font-900 italic text-3xl text-[#1C1C1C] tracking-editorial">
              Producto no encontrado
            </h1>
            <p className="text-[#5A5A5A] text-sm">
              El producto que buscas no existe o ha sido eliminado.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1C1C1C] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#2563EB] transition-colors"
            >
              <Icon name="ArrowLeftIcon" size={13} variant="outline" />
              Ver catálogo
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );

  const rating = Math.round(product.avg_rating ?? 0);
  const reviewCount = product.review_count ?? 0;
  const discount = product.original_price
    ? `-${Math.round(((product.original_price - product.price) / product.original_price) * 100)}%`
    : null;

  return (
    <>
    <Header />
    <div className="min-h-screen bg-[#F8F7F5]">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-[88px] pb-5 bg-white border-b border-[#DDD9D3]"
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <nav className="flex items-center gap-2 text-[10px] font-700 text-[#8A8A8A] uppercase tracking-widest">
            <Link href="/homepage" className="hover:text-[#1C1C1C] transition-colors">
              Inicio
            </Link>
            <Icon name="ChevronRightIcon" size={9} variant="outline" />
            <Link href="/products" className="hover:text-[#1C1C1C] transition-colors">
              Tienda
            </Link>
            <Icon name="ChevronRightIcon" size={9} variant="outline" />
            {product.category?.name && (
              <>
                <Link href="/products" className="hover:text-[#1C1C1C] transition-colors">
                  {product.category.name}
                </Link>
                <Icon name="ChevronRightIcon" size={9} variant="outline" />
              </>
            )}
            <span className="text-[#1C1C1C]">{product.name}</span>
          </nav>
        </div>
      </motion.div>

      {/* Main Product Section */}
      <section className="py-12 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_500px] gap-12 lg:gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductGallery images={galleryImages} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:sticky lg:top-[96px] space-y-7"
            >
              <ProductInfo
                product={product}
                rating={rating}
                reviewCount={reviewCount}
                discount={discount}
              />
              <ProductVariants
                variants={product.variants || []}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
              />
              <ProductActions
                stock={product.stock}
                quantity={quantity}
                addedToCart={addedToCart}
                isWishlisted={isInWishlist(productId)}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onBuyNow={handleBuyNow}
                onShare={handleShare}
              />
              <TrustSignals />
              {product.stock <= 10 && product.stock > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="flex items-center gap-3 p-4 bg-[#FFF7ED] border border-[#FED7AA]"
                >
                  <Icon
                    name="FireIcon"
                    size={17}
                    variant="solid"
                    className="text-[#EA580C] shrink-0"
                  />
                  <p className="text-[11px] text-[#9A3412] font-600 leading-snug">
                    <span className="font-black">¡Solo quedan {product.stock} unidades!</span> —
                    Alta demanda en las últimas 24h.
                  </p>
                </motion.div>
              )}
              <div className="pt-1 border-t border-[#DDD9D3]">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#8A8A8A] mb-3">
                  Métodos de pago aceptados
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {['Visa', 'Mastercard', 'PayPal', 'Bizum', 'Apple Pay'].map((m) => (
                    <span
                      key={m}
                      className="px-2.5 py-1.5 border border-[#DDD9D3] text-[9px] font-black uppercase tracking-widest text-[#5A5A5A] bg-white"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ProductTabs
        product={product}
        galleryImages={galleryImages}
        rating={rating}
        reviewCount={reviewCount}
        user={user}
      />
      <RelatedProducts products={relatedProducts} />
    </div>
    <Footer />
    </>
  );
}
