'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

type ProductActionsProps = {
  stock: number;
  quantity: number;
  addedToCart: boolean;
  isWishlisted: boolean;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  onBuyNow: () => void;
  onShare: () => void;
};

export default function ProductActions({
  stock,
  quantity,
  addedToCart,
  isWishlisted,
  onQuantityChange,
  onAddToCart,
  onToggleWishlist,
  onBuyNow,
  onShare,
}: ProductActionsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-nova-fg">Cantidad</p>
        <p className="text-[11px] text-[#8A8A8A]">Máx. {stock} unidades</p>
      </div>

      <div className="flex gap-3">
        {/* Qty selector */}
        <div className="flex items-center border-2 border-[#E8E5E0] hover:border-[#0F0F0F] transition-colors duration-200">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="size-12 flex items-center justify-center text-[#5A5A5A] hover:text-[#1C1C1C] hover:bg-[#EFEDE9] transition-colors"
            aria-label="Reducir cantidad"
          >
            <Icon name="MinusIcon" size={14} variant="outline" />
          </button>
          <span className="w-10 text-center text-[15px] font-700 text-[#0F0F0F]">{quantity}</span>
          <button
            onClick={() => onQuantityChange(Math.min(stock, quantity + 1))}
            className="size-12 flex items-center justify-center text-[#5A5A5A] hover:text-[#1C1C1C] hover:bg-[#EFEDE9] transition-colors"
            aria-label="Aumentar cantidad"
          >
            <Icon name="PlusIcon" size={14} variant="outline" />
          </button>
        </div>

        {/* Add to cart */}
        <motion.button
          onClick={onAddToCart}
          whileTap={{ scale: 0.97 }}
          animate={stock < 5 ? { x: [0, -5, 5, -5, 5, -3, 3, 0] } : { x: 0 }}
          transition={
            stock < 5
              ? { duration: 0.5, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }
              : {}
          }
          className={`btn-shine flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-400 ${
            addedToCart ? 'bg-[#22C55E] text-white' : 'bg-[#1C1C1C] text-white hover:bg-[#2563EB]'
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
        onClick={onBuyNow}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.98 }}
        className="btn-shine w-full py-4 border-2 border-[#1C1C1C] text-[#1C1C1C] text-[10px] font-black uppercase tracking-widest hover:bg-[#1C1C1C] hover:text-white transition-all duration-300 flex items-center justify-center gap-2.5"
      >
        <Icon name="BoltIcon" size={14} variant="outline" />
        Comprar ahora — Entrega en 24h
      </motion.button>

      {/* Wishlist + Share */}
      <div className="flex items-center gap-4 pt-1">
        <motion.button
          onClick={onToggleWishlist}
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
        <button
          onClick={onShare}
          className="flex items-center gap-1.5 text-[10px] font-700 uppercase tracking-widest text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors"
        >
          <Icon name="ShareIcon" size={14} variant="outline" />
          Compartir
        </button>
      </div>
    </div>
  );
}
