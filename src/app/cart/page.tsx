'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

/* ─── Types ──────────────────────────────────────────────────── */
interface CartItem {
  id: number;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  alt: string;
  color: string;
  sku: string;
}

/* ─── Mock Cart Data ─────────────────────────────────────────── */
const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: 'Monitor Ultra 4K 32"',
    subtitle: 'Panel IPS · Negro Espacial',
    price: 649,
    originalPrice: 799,
    quantity: 1,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f449c7d4-1772443026055.png',
    alt: 'Monitor Ultra 4K 32 pulgadas en escritorio blanco con iluminación de estudio',
    color: 'Negro Espacial',
    sku: 'NS-MON-4K-32',
  },
  {
    id: 2,
    name: 'Teclado Mecánico Pro',
    subtitle: 'Switches Cherry MX · Retroiluminado RGB',
    price: 189,
    originalPrice: 229,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1679533662330-457ca8447e7d',
    alt: 'Teclado mecánico profesional con retroiluminación RGB sobre superficie oscura',
    color: 'Grafito',
    sku: 'NS-KB-MECH-PRO',
  },
  {
    id: 3,
    name: 'Auriculares Studio XR',
    subtitle: 'Cancelación activa de ruido · Inalámbrico',
    price: 299,
    originalPrice: undefined,
    quantity: 1,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_14edb55e2-1764708667214.png',
    alt: 'Auriculares premium de estudio con cancelación de ruido sobre fondo neutro',
    color: 'Plata Ártico',
    sku: 'NS-HP-STUDIO-XR',
  },
];

const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.95;

const VALID_COUPONS: Record<string, { label: string; discount: number; type: 'percent' | 'fixed' }> = {
  NOVA20: { label: '20% de descuento', discount: 20, type: 'percent' },
  BIENVENIDO: { label: '€15 de descuento', discount: 15, type: 'fixed' },
};

function formatEUR(amount: number) {
  return `€${amount.toFixed(2).replace('.', ',')}`;
}

/* ─── Quantity Button ─────────────────────────────────────────── */
function QtyButton({
  onClick,
  disabled,
  children,
  ariaLabel,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.88 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="w-9 h-9 flex items-center justify-center text-[#5A5A5A] hover:text-[#1C1C1C] hover:bg-[#EFEDE9] disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 rounded-sm"
    >
      {children}
    </motion.button>
  );
}

/* ─── Component ──────────────────────────────────────────────── */
export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initialCartItems);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<null | {
    code: string;
    label: string;
    discount: number;
    type: 'percent' | 'fixed';
  }>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [qtyFlash, setQtyFlash] = useState<number | null>(null);

  /* ── Quantity ── */
  const updateQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, Math.min(10, item.quantity + delta)) } : item
      )
    );
    setQtyFlash(id);
    setTimeout(() => setQtyFlash(null), 300);
  };

  /* ── Remove ── */
  const removeItem = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setRemovingId(null);
    }, 380);
  };

  /* ── Coupon ── */
  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    setCouponError('');
    setCouponSuccess('');
    if (!code) { setCouponError('Introduce un código de cupón.'); return; }
    const found = VALID_COUPONS[code];
    if (!found) { setCouponError('Código no válido. Inténtalo de nuevo.'); return; }
    setAppliedCoupon({ code, ...found });
    setCouponSuccess(`¡Cupón aplicado! ${found.label}`);
    setCouponInput('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  /* ── Totals ── */
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = items.reduce(
    (sum, item) => (item.originalPrice ? sum + (item.originalPrice - item.price) * item.quantity : sum),
    0
  );
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  let couponDiscount = 0;
  if (appliedCoupon) {
    couponDiscount =
      appliedCoupon.type === 'percent' ? subtotal * (appliedCoupon.discount / 100) : appliedCoupon.discount;
  }
  const total = Math.max(0, subtotal + shipping - couponDiscount);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingProgress = Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);

  return (
    <main className="min-h-screen bg-[#F8F7F5] pt-[72px]">

      {/* ── Page Header ── */}
      <section className="relative border-b border-[#DDD9D3] overflow-hidden">
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
                Tu Selección
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="font-display italic font-900 text-5xl lg:text-7xl tracking-editorial text-[#1C1C1C] leading-none"
              >
                Carrito
              </motion.h1>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden sm:flex items-center gap-2 text-[#8A8A8A] text-[10px] font-bold uppercase tracking-[0.18em]"
            >
              <Link href="/homepage" className="hover:text-[#1C1C1C] transition-colors duration-200">Inicio</Link>
              <span className="text-[#DDD9D3]">/</span>
              <span className="text-[#5A5A5A]">Carrito</span>
            </motion.div>
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        /* ── Empty State ── */
        <section className="max-w-[1440px] mx-auto px-6 lg:px-14 py-40 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-7"
          >
            <div className="relative">
              <div className="size-28 rounded-full bg-[#EFEDE9] border border-[#DDD9D3] flex items-center justify-center">
                <Icon name="ShoppingBagIcon" size={44} variant="outline" className="text-[#8A8A8A]" />
              </div>
            </div>
            <div>
              <h2 className="font-display italic font-900 text-3xl text-[#1C1C1C] tracking-editorial mb-3">
                Tu carrito está vacío
              </h2>
              <p className="text-[#5A5A5A] text-sm max-w-xs leading-relaxed">
                Explora nuestra colección y añade los productos que más te gusten.
              </p>
            </div>
            <Link
              href="/products"
              className="mt-2 inline-flex items-center gap-3 px-9 py-4 bg-[#1C1C1C] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#2563EB] transition-all duration-300"
            >
              <Icon name="ArrowLeftIcon" size={13} variant="outline" />
              Explorar Tienda
            </Link>
          </motion.div>
        </section>
      ) : (
        /* ── Main Layout ── */
        <section className="max-w-[1440px] mx-auto px-6 lg:px-14 py-12 lg:py-20">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_440px] gap-12 xl:gap-16 items-start">

            {/* ══════════════════════════════════════════════
                LEFT: Cart Items
            ══════════════════════════════════════════════ */}
            <div className="flex flex-col gap-8">

              {/* Items header bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="flex items-center justify-between pb-5 border-b border-[#DDD9D3]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5A5A5A]">
                    {totalItems} {totalItems === 1 ? 'Artículo' : 'Artículos'}
                  </span>
                  <span className="w-px h-3 bg-[#DDD9D3]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A8A8A]">
                    en tu carrito
                  </span>
                </div>
                <button
                  onClick={() => setItems([])}
                  className="group flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A8A8A] hover:text-red-500 transition-colors duration-200"
                >
                  <Icon name="TrashIcon" size={11} variant="outline" className="group-hover:text-red-500 transition-colors" />
                  Vaciar carrito
                </button>
              </motion.div>

              {/* Cart Items List */}
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: removingId === item.id ? 0 : 1,
                      y: 0,
                      x: removingId === item.id ? 60 : 0,
                    }}
                    exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
                    className="group relative bg-white border border-[#DDD9D3] hover:border-[#1C1C1C] transition-all duration-500 overflow-hidden"
                  >
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2563EB]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Left accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#2563EB]/0 via-[#2563EB]/40 to-[#2563EB]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex gap-0 sm:gap-0">
                      {/* Product Image */}
                      <Link
                        href={`/product/${item.id}`}
                        className="shrink-0 relative overflow-hidden bg-[#EFEDE9] w-[100px] h-[120px] sm:w-[130px] sm:h-[150px]"
                      >
                        <AppImage
                          src={item.image}
                          alt={item.alt}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-[#2563EB]/0 group-hover:bg-[#2563EB]/3 transition-colors duration-500" />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between p-5 sm:p-6">
                        {/* Top row: name + remove */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/product/${item.id}`}
                              className="font-display italic font-700 text-lg sm:text-xl text-[#1C1C1C] tracking-editorial leading-tight hover:text-[#2563EB] transition-colors duration-200 line-clamp-1 block"
                            >
                              {item.name}
                            </Link>
                            <p className="text-[#8A8A8A] text-[11px] font-medium mt-1.5 tracking-wide">
                              {item.subtitle}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8A8A8A] border border-[#DDD9D3] px-2 py-0.5">
                                {item.color}
                              </span>
                              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8A8A8A]">
                                SKU: {item.sku}
                              </span>
                            </div>
                          </div>
                          {/* Remove button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeItem(item.id)}
                            aria-label={`Eliminar ${item.name}`}
                            className="shrink-0 size-8 flex items-center justify-center text-[#8A8A8A] hover:text-red-500 hover:bg-red-50 rounded-sm transition-all duration-200"
                          >
                            <Icon name="XMarkIcon" size={14} variant="outline" />
                          </motion.button>
                        </div>

                        {/* Bottom row: quantity + price */}
                        <div className="flex items-center justify-between gap-4 mt-5">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-0 border border-[#DDD9D3] bg-[#F8F7F5] rounded-sm overflow-hidden">
                            <QtyButton
                              onClick={() => updateQty(item.id, -1)}
                              disabled={item.quantity <= 1}
                              ariaLabel="Reducir cantidad"
                            >
                              <Icon name="MinusIcon" size={11} variant="outline" />
                            </QtyButton>
                            <motion.span
                              key={`${item.id}-${item.quantity}`}
                              initial={{ scale: 1.25, opacity: 0.6 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                              className="w-11 text-center text-[#1C1C1C] text-sm font-bold tabular-nums border-x border-[#DDD9D3] py-2 select-none"
                            >
                              {item.quantity}
                            </motion.span>
                            <QtyButton
                              onClick={() => updateQty(item.id, 1)}
                              disabled={item.quantity >= 10}
                              ariaLabel="Aumentar cantidad"
                            >
                              <Icon name="PlusIcon" size={11} variant="outline" />
                            </QtyButton>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <motion.div
                              key={`price-${item.id}-${item.quantity}`}
                              initial={{ opacity: 0.5, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.25, ease: 'easeOut' }}
                              className="font-display italic font-700 text-2xl text-[#1C1C1C] tracking-editorial"
                            >
                              {formatEUR(item.price * item.quantity)}
                            </motion.div>
                            {item.originalPrice && (
                              <div className="text-[#8A8A8A] text-[11px] line-through mt-0.5 tabular-nums">
                                {formatEUR(item.originalPrice * item.quantity)}
                              </div>
                            )}
                            {item.originalPrice && (
                              <div className="text-[#2563EB] text-[9px] font-black uppercase tracking-[0.18em] mt-0.5">
                                Ahorro {formatEUR((item.originalPrice - item.price) * item.quantity)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* ── Coupon Field ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 }}
                className="bg-white border border-[#DDD9D3] overflow-hidden"
              >
                {/* Coupon header */}
                <div className="px-6 py-4 border-b border-[#DDD9D3] flex items-center gap-3">
                  <div className="size-7 rounded-sm bg-[#EFF6FF] flex items-center justify-center">
                    <Icon name="TagIcon" size={13} variant="outline" className="text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5A5A5A]">
                      Código Promocional
                    </p>
                    <p className="text-[9px] text-[#8A8A8A] mt-0.5">Introduce tu cupón de descuento</p>
                  </div>
                </div>

                <div className="px-6 py-5">
                  {appliedCoupon ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-between bg-[#EFF6FF] border border-[#2563EB]/20 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-6 rounded-full bg-[#2563EB]/15 flex items-center justify-center">
                          <Icon name="CheckIcon" size={11} variant="outline" className="text-[#2563EB]" />
                        </div>
                        <div>
                          <p className="text-[#2563EB] text-[11px] font-black uppercase tracking-[0.18em]">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-[#2563EB]/60 text-[10px] mt-0.5">{appliedCoupon.label}</p>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-[#8A8A8A] hover:text-red-500 text-[9px] font-black uppercase tracking-[0.18em] transition-colors flex items-center gap-1.5"
                      >
                        <Icon name="XMarkIcon" size={11} variant="outline" />
                        Eliminar
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value.toUpperCase());
                            setCouponError('');
                            setCouponSuccess('');
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                          placeholder="Ej. NOVA20"
                          className="w-full bg-[#F8F7F5] border border-[#DDD9D3] focus:border-[#2563EB] text-[#1C1C1C] placeholder-[#8A8A8A] text-sm font-bold px-4 py-3.5 outline-none transition-colors duration-200 tracking-[0.15em] uppercase"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={applyCoupon}
                        className="px-7 py-3.5 bg-[#EFEDE9] border border-[#DDD9D3] text-[#1C1C1C] text-[10px] font-black uppercase tracking-[0.22em] hover:bg-[#2563EB] hover:border-[#2563EB] hover:text-white transition-all duration-300 whitespace-nowrap"
                      >
                        Aplicar
                      </motion.button>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {couponError && (
                      <motion.p
                        key="error"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 text-red-500 text-[11px] font-medium flex items-center gap-2"
                      >
                        <Icon name="ExclamationCircleIcon" size={13} variant="outline" />
                        {couponError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* ── Continue Shopping ── */}
              <div className="flex items-center gap-4 pt-1">
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors duration-200"
                >
                  <span className="size-6 border border-[#DDD9D3] group-hover:border-[#1C1C1C] flex items-center justify-center transition-colors duration-200">
                    <Icon name="ArrowLeftIcon" size={11} variant="outline" />
                  </span>
                  Seguir Comprando
                </Link>
              </div>
            </div>

            {/* ══════════════════════════════════════════════
                RIGHT: Order Summary
            ══════════════════════════════════════════════ */}
            <div className="xl:sticky xl:top-[96px]">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white border border-[#DDD9D3] overflow-hidden"
              >
                {/* ── Card Header ── */}
                <div className="relative px-8 py-7 border-b border-[#DDD9D3] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#EFEDE9] via-transparent to-transparent" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#1C1C1C] via-[#DDD9D3] to-transparent" />
                  <div className="relative">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#2563EB] mb-2">
                      Resumen del Pedido
                    </p>
                    <h2 className="font-display italic font-700 text-2xl text-[#1C1C1C] tracking-editorial leading-none">
                      Tu Compra
                    </h2>
                    <p className="text-[#8A8A8A] text-[10px] mt-1.5">
                      {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'} seleccionados
                    </p>
                  </div>
                </div>

                {/* ── Summary Lines ── */}
                <div className="px-8 py-7 flex flex-col gap-0">

                  {/* Subtotal */}
                  <div className="flex items-center justify-between py-3 border-b border-[#EFEDE9]">
                    <span className="text-[#5A5A5A] text-[12px] font-medium">
                      Subtotal ({totalItems} {totalItems === 1 ? 'artículo' : 'artículos'})
                    </span>
                    <span className="text-[#1C1C1C] font-bold text-[13px] tabular-nums">{formatEUR(subtotal)}</span>
                  </div>

                  {/* Savings */}
                  {savings > 0 && (
                    <div className="flex items-center justify-between py-3 border-b border-[#EFEDE9]">
                      <span className="text-emerald-600 text-[12px] font-medium flex items-center gap-1.5">
                        <Icon name="ArrowTrendingDownIcon" size={12} variant="outline" />
                        Ahorro en oferta
                      </span>
                      <span className="text-emerald-600 font-bold text-[13px] tabular-nums">
                        -{formatEUR(savings)}
                      </span>
                    </div>
                  )}

                  {/* Coupon Discount */}
                  {appliedCoupon && couponDiscount > 0 && (
                    <div className="flex items-center justify-between py-3 border-b border-[#EFEDE9]">
                      <span className="text-[#2563EB] text-[12px] font-medium flex items-center gap-1.5">
                        <Icon name="TagIcon" size={12} variant="outline" />
                        Cupón {appliedCoupon.code}
                      </span>
                      <span className="text-[#2563EB] font-bold text-[13px] tabular-nums">
                        -{formatEUR(couponDiscount)}
                      </span>
                    </div>
                  )}

                  {/* Shipping */}
                  <div className="flex items-center justify-between py-3 border-b border-[#EFEDE9]">
                    <span className="text-[#5A5A5A] text-[12px] font-medium flex items-center gap-1.5">
                      <Icon name="TruckIcon" size={12} variant="outline" />
                      Envío
                    </span>
                    {shipping === 0 ? (
                      <span className="text-emerald-600 font-bold text-[13px] flex items-center gap-1">
                        <Icon name="CheckIcon" size={11} variant="outline" />
                        Gratis
                      </span>
                    ) : (
                      <span className="text-[#1C1C1C] font-bold text-[13px] tabular-nums">{formatEUR(shipping)}</span>
                    )}
                  </div>

                  {/* Free shipping progress bar */}
                  {shipping > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-1 mb-2 bg-[#F8F7F5] border border-[#DDD9D3] px-4 py-3.5"
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[#8A8A8A] text-[9px] font-bold uppercase tracking-[0.18em]">
                          Envío gratis desde {formatEUR(SHIPPING_THRESHOLD)}
                        </span>
                        <span className="text-[#2563EB] text-[9px] font-black">
                          {formatEUR(SHIPPING_THRESHOLD - subtotal)} restante
                        </span>
                      </div>
                      <div className="h-[3px] bg-[#DDD9D3] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${shippingProgress}%` }}
                          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full bg-gradient-to-r from-[#2563EB]/60 to-[#2563EB] rounded-full"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Total */}
                  <div className="mt-4 pt-5 border-t border-[#DDD9D3]">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#8A8A8A] block mb-1">
                          Total a Pagar
                        </span>
                        <span className="text-[#8A8A8A] text-[10px]">IVA incluido</span>
                      </div>
                      <div className="text-right">
                        <motion.span
                          key={total}
                          initial={{ opacity: 0.5, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className="font-display italic font-700 text-4xl text-[#1C1C1C] tracking-editorial block leading-none"
                        >
                          {formatEUR(total)}
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── CTA Buttons ── */}
                <div className="px-8 pb-8 flex flex-col gap-3">
                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    className="w-full py-4 bg-[#1C1C1C] text-white text-[10px] font-black uppercase tracking-[0.22em] hover:bg-[#2563EB] transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group"
                  >
                    <Icon name="LockClosedIcon" size={13} variant="outline" />
                    Finalizar Compra
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-4 border border-[#DDD9D3] text-[#1C1C1C] text-[10px] font-bold uppercase tracking-[0.2em] hover:border-[#1C1C1C] hover:text-[#1C1C1C] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Icon name="CreditCardIcon" size={13} variant="outline" />
                    Pago Express
                  </motion.button>
                </div>

                {/* ── Trust Signals ── */}
                <div className="border-t border-[#DDD9D3] px-8 py-6 grid grid-cols-2 gap-4">
                  {[
                    { icon: 'LockClosedIcon', label: 'Pago 100% seguro' },
                    { icon: 'ArrowPathIcon', label: 'Devolución 30 días' },
                    { icon: 'TruckIcon', label: 'Envío rápido' },
                    { icon: 'ShieldCheckIcon', label: 'Garantía oficial' },
                  ].map((trust) => (
                    <div key={trust.label} className="flex items-center gap-2.5">
                      <div className="size-6 rounded-sm bg-[#EFF6FF] flex items-center justify-center shrink-0">
                        <Icon name={trust.icon as any} size={11} variant="outline" className="text-[#2563EB]" />
                      </div>
                      <span className="text-[#5A5A5A] text-[10px] font-medium leading-tight">{trust.label}</span>
                    </div>
                  ))}
                </div>

                {/* ── Payment Methods ── */}
                <div className="border-t border-[#DDD9D3] px-8 py-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#8A8A8A] mb-3">
                    Métodos de Pago Aceptados
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {['Visa', 'MC', 'Amex', 'PayPal', 'Bizum'].map((method) => (
                      <span
                        key={method}
                        className="px-2.5 py-1 border border-[#DDD9D3] text-[#8A8A8A] text-[9px] font-bold uppercase tracking-[0.15em] hover:border-[#1C1C1C] hover:text-[#5A5A5A] transition-all duration-200"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ── Promo Note ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mt-4 flex items-start gap-3 px-1"
              >
                <Icon name="InformationCircleIcon" size={13} variant="outline" className="text-[#2563EB]/50 shrink-0 mt-0.5" />
                <p className="text-[#8A8A8A] text-[10px] leading-relaxed">
                  Los precios incluyen IVA. El coste de envío se calcula en el siguiente paso según tu dirección de entrega.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}