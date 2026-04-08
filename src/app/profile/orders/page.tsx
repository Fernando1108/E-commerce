'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types';
import { statusColors, statusLabels } from '@/constants';

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login?redirect=/profile/orders');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : (data.orders ?? []));
        setLoading(false);
      })
      .catch(() => {
        toast.error('Error al cargar pedidos');
        setError('No se pudieron cargar tus pedidos.');
        setLoading(false);
      });
  }, [user]);

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Header />

      <section className="relative overflow-hidden px-6 pb-20 pt-[120px] lg:px-12">
        <div className="absolute inset-0 pointer-events-none opacity-[0.025] bg-dot-pattern" />
        <div className="absolute top-0 right-0 h-[360px] w-[360px] rounded-full bg-[#E8E5DF] blur-[120px] opacity-70 pointer-events-none" />

        <div className="relative mx-auto max-w-[1440px]">
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <Link
              href="/profile"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors"
            >
              <Icon name="ArrowLeftIcon" size={13} variant="outline" />
              Mi perfil
            </Link>
            <span className="text-[#DDD9D3]">/</span>
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1C1C1C]">
              Historial de pedidos
            </span>
          </div>

          <div className="mb-10">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#2563EB] mb-3">
              NovaStore Account
            </p>
            <h1 className="text-4xl font-display font-900 uppercase italic text-[#1C1C1C] lg:text-5xl">
              Mis pedidos
            </h1>
          </div>

          {/* Loading */}
          {(loading || authLoading) && (
            <div className="flex justify-center py-20">
              <div className="size-8 border-2 border-[#1C1C1C] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="border border-[#F1C8C2] bg-[#FFF7F5] text-[#C33D2F] px-6 py-4 text-sm">
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && orders.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-24 flex flex-col items-center gap-6"
            >
              <div className="size-24 rounded-full bg-[#EFEDE9] border border-[#DDD9D3] flex items-center justify-center">
                <Icon
                  name="ShoppingBagIcon"
                  size={40}
                  variant="outline"
                  className="text-[#8A8A8A]"
                />
              </div>
              <div>
                <h2 className="font-display italic font-900 text-2xl text-[#1C1C1C] tracking-editorial mb-2">
                  No tienes pedidos aún
                </h2>
                <p className="text-[#5A5A5A] text-sm">
                  Explora nuestra tienda y realiza tu primer pedido.
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#1C1C1C] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#2563EB] transition-colors"
              >
                Ir a la tienda
              </Link>
            </motion.div>
          )}

          {/* Orders list */}
          {!loading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order, index) => {
                const isExpanded = expandedId === order.id;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="border border-[#DDD9D3] bg-white overflow-hidden hover:border-[#1C1C1C] transition-colors duration-300"
                  >
                    {/* Order header - clickable */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left group"
                    >
                      <div className="flex items-center gap-6 flex-wrap">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8A8A8A] mb-1">
                            Pedido
                          </p>
                          <p className="text-[13px] font-bold text-[#1C1C1C] font-mono">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8A8A8A] mb-1">
                            Fecha
                          </p>
                          <p className="text-[13px] text-[#1C1C1C]">
                            {new Date(order.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8A8A8A] mb-1">
                            Total
                          </p>
                          <p className="text-[15px] font-display font-900 italic text-[#1C1C1C] tracking-editorial">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                        {order.item_count !== undefined && (
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8A8A8A] mb-1">
                              Artículos
                            </p>
                            <p className="text-[13px] text-[#1C1C1C]">{order.item_count}</p>
                          </div>
                        )}
                        <span
                          className={`px-3 py-1.5 border text-[9px] font-black uppercase tracking-[0.18em] ${statusColors[order.status] ?? 'bg-gray-50 text-gray-700 border-gray-200'}`}
                        >
                          {statusLabels[order.status] ?? order.status}
                        </span>
                      </div>
                      <Icon
                        name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                        size={16}
                        variant="outline"
                        className="text-[#8A8A8A] group-hover:text-[#1C1C1C] transition-colors shrink-0 ml-4"
                      />
                    </button>

                    {/* Expanded items */}
                    <AnimatePresence>
                      {isExpanded && order.items && order.items.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden border-t border-[#DDD9D3]"
                        >
                          <div className="px-6 py-5 space-y-3">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between gap-4 py-2 border-b border-[#EFEDE9] last:border-0"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="size-10 bg-[#EFEDE9] flex items-center justify-center shrink-0">
                                    <Icon
                                      name="CubeIcon"
                                      size={16}
                                      variant="outline"
                                      className="text-[#8A8A8A]"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-[13px] font-bold text-[#1C1C1C]">
                                      {item.product?.name ||
                                        `Producto #${item.product_id.slice(0, 6)}`}
                                    </p>
                                    <p className="text-[11px] text-[#8A8A8A]">
                                      Cantidad: {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-[13px] font-bold text-[#1C1C1C]">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      {isExpanded && (!order.items || order.items.length === 0) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden border-t border-[#DDD9D3]"
                        >
                          <p className="px-6 py-4 text-[12px] text-[#8A8A8A]">
                            No hay detalle de artículos disponible.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
