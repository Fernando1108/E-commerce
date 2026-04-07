'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCartStore } from '@/store/cart-store';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!cleared) {
      clearCart();
      setCleared(true);
    }
  }, [cleared, clearCart]);

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F5] px-4 pt-[72px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="border border-[#DDD9D3] bg-white/90 backdrop-blur-xl shadow-[0_24px_80px_rgba(28,28,28,0.08)] p-8 md:p-12 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-[#EFF6FF] flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-[#2563EB]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#2563EB] mb-3">
            NovaStore
          </p>
          <h1 className="font-display font-900 italic uppercase text-2xl text-[#1C1C1C] tracking-[-0.03em] mb-3">
            ¡Pago exitoso!
          </h1>
          <p className="text-[#5A5A5A] text-sm leading-relaxed mb-8">
            Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación en breve.
          </p>
          <div className="space-y-3">
            <Link
              href="/profile/orders"
              className="block w-full bg-[#1C1C1C] text-white py-4 text-[11px] font-black uppercase tracking-[0.24em] hover:bg-[#2563EB] transition-colors"
            >
              Ver mis pedidos
            </Link>
            <Link
              href="/products"
              className="block w-full border border-[#DDD9D3] text-[#1C1C1C] py-4 text-[11px] font-black uppercase tracking-[0.24em] hover:border-[#1C1C1C] hover:bg-[#F8F7F5] transition-colors"
            >
              Seguir comprando
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
