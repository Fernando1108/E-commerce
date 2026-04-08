'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/types';

type CartItemCardProps = {
  item: CartItem;
  index: number;
  isRemoving: boolean;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
};

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

export default function CartItemCard({
  item,
  index,
  isRemoving,
  onRemove,
  onUpdateQuantity,
}: CartItemCardProps) {
  const { addItem } = useCart();
  if (!item.product) return null;
  const p = item.product;
  const itemPrice = p.price ?? 0;
  const itemOriginalPrice = p.original_price ?? null;
  const lineTotal = itemPrice * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isRemoving ? 0 : 1,
        y: 0,
        x: isRemoving ? 60 : 0,
      }}
      exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      className="group relative bg-white border border-[#DDD9D3] hover:border-[#1C1C1C] transition-all duration-500 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2563EB]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#2563EB]/0 via-[#2563EB]/40 to-[#2563EB]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex gap-0 sm:gap-0">
        <Link
          href={`/product/${item.product_id}`}
          className="shrink-0 relative overflow-hidden bg-[#EFEDE9] w-[100px] h-[120px] sm:w-[130px] sm:h-[150px]"
        >
          <AppImage
            src={p?.image_url || '/assets/images/no_image.png'}
            alt={p?.name || 'Producto'}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        <div className="flex-1 min-w-0 flex flex-col justify-between p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Link
                href={`/product/${item.product_id}`}
                className="font-display italic font-700 text-lg sm:text-xl text-[#1C1C1C] tracking-editorial leading-tight hover:text-[#2563EB] transition-colors duration-200 line-clamp-1 block"
              >
                {p?.name || 'Producto'}
              </Link>
              {p?.category_name && (
                <p className="text-[#8A8A8A] text-[11px] font-medium mt-1.5 tracking-wide">
                  {p.category_name}
                </p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                onRemove(item.product_id);
                toast('Producto eliminado', {
                  action: {
                    label: 'Deshacer',
                    onClick: () => addItem(p, item.quantity),
                  },
                });
              }}
              aria-label={`Eliminar ${p?.name}`}
              className="shrink-0 size-8 flex items-center justify-center text-[#8A8A8A] hover:text-red-500 hover:bg-red-50 rounded-sm transition-all duration-200"
            >
              <Icon name="XMarkIcon" size={14} variant="outline" />
            </motion.button>
          </div>

          <div className="flex items-center justify-between gap-4 mt-5">
            <div className="flex items-center gap-0 border border-[#DDD9D3] bg-[#F8F7F5] rounded-sm overflow-hidden">
              <QtyButton
                onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
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
                onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                disabled={item.quantity >= (item.product?.stock ?? 10)}
                ariaLabel="Aumentar cantidad"
              >
                <Icon name="PlusIcon" size={11} variant="outline" />
              </QtyButton>
            </div>

            <div className="text-right">
              <motion.div
                key={`price-${item.id}-${item.quantity}`}
                initial={{ opacity: 0.5, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="font-display italic font-700 text-2xl text-[#1C1C1C] tracking-editorial"
              >
                {formatPrice(lineTotal)}
              </motion.div>
              {itemOriginalPrice && (
                <div className="text-[#8A8A8A] text-[11px] line-through mt-0.5 tabular-nums">
                  {formatPrice(itemOriginalPrice * item.quantity)}
                </div>
              )}
              {itemOriginalPrice && (
                <div className="text-[#2563EB] text-[9px] font-black uppercase tracking-[0.18em] mt-0.5">
                  Ahorro {formatPrice((itemOriginalPrice - itemPrice) * item.quantity)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
