'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useWishlist } from '@/hooks/useWishlist';
import Icon from '@/components/ui/AppIcon';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { isAdmin } = useProfile();
  const { itemCount: wishlistCount } = useWishlist();
  const router = useRouter();
  const [orderCount, setOrderCount] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/profile');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      fetch('/api/orders')
        .then((r) => r.json())
        .then((d) => setOrderCount(Array.isArray(d) ? d.length : null))
        .catch(() => setOrderCount(null));
    }
  }, [user]);

  const displayName =
    user?.user_metadata?.name ??
    user?.user_metadata?.full_name ??
    user?.email?.split('@')[0] ??
    'Usuario';

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
      })
    : '—';

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Header />

      {/* ── Avatar ── */}
      <div className="pt-[72px]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-col items-center pt-12">
            <motion.div
              {...fadeUp(0)}
              className="size-32 rounded-full border-4 border-white shadow-xl bg-[#EFEDE9] flex items-center justify-center overflow-hidden"
            >
              {user?.user_metadata?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.user_metadata.avatar_url}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icon name="UserCircleIcon" size={80} className="text-[#8A8A8A]" variant="solid" />
              )}
            </motion.div>

            {loading ? (
              <div className="mt-6 space-y-2 flex flex-col items-center">
                <div className="h-7 w-40 bg-[#EFEDE9] rounded animate-pulse" />
                <div className="h-4 w-56 bg-[#EFEDE9] rounded animate-pulse" />
              </div>
            ) : (
              <>
                <motion.h1
                  {...fadeUp(0.08)}
                  className="mt-5 text-3xl lg:text-4xl font-display font-900 italic text-[#1C1C1C] tracking-tight text-center"
                >
                  {displayName}
                </motion.h1>
                <motion.p {...fadeUp(0.13)} className="text-sm text-[#8A8A8A] mt-1 text-center">
                  {user?.email}
                </motion.p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Info cards ── */}
      <section className="bg-[#FAF9F7] py-10">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              {
                icon: 'CalendarIcon',
                label: 'Miembro desde',
                value: loading ? '—' : memberSince,
              },
              {
                icon: 'ShoppingBagIcon',
                label: 'Total de pedidos',
                value: loading ? '—' : orderCount !== null ? String(orderCount) : '—',
              },
              {
                icon: 'HeartIcon',
                label: 'Wishlist',
                value: String(wishlistCount),
              },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 + i * 0.07 }}
                className="bg-white border border-[#E6E1DA] p-5 text-center shadow-sm"
              >
                <div className="flex justify-center mb-3">
                  <div className="size-9 bg-[#EFF6FF] flex items-center justify-center">
                    <Icon
                      name={card.icon as Parameters<typeof Icon>[0]['name']}
                      size={18}
                      className="text-[#2563EB]"
                      variant="outline"
                    />
                  </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#8A8A8A]">
                  {card.label}
                </p>
                <p className="mt-1.5 text-xl font-display font-900 text-[#1C1C1C]">{card.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Action buttons ── */}
          <motion.div
            {...fadeUp(0.38)}
            className="mt-6 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href="/profile/settings"
              className="inline-flex h-12 items-center justify-center gap-2 bg-[#1C1C1C] px-8 text-[11px] font-black uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#2563EB]"
            >
              <Icon name="PencilSquareIcon" size={14} variant="outline" />
              Editar perfil
            </Link>
            <Link
              href="/profile/orders"
              className="inline-flex h-12 items-center justify-center gap-2 border border-[#DDD9D3] bg-white px-8 text-[11px] font-black uppercase tracking-[0.28em] text-[#1C1C1C] transition-colors hover:bg-[#1C1C1C] hover:text-white hover:border-[#1C1C1C]"
            >
              <Icon name="ClipboardDocumentListIcon" size={14} variant="outline" />
              Mis pedidos
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Admin card ── */}
      {!loading && isAdmin && (
        <section className="bg-[#F2F0EC] border-t border-[#E6E1DA] py-10">
          <div className="max-w-3xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="relative overflow-hidden border border-[#1C1C1C] bg-[#1C1C1C] p-6"
            >
              <div className="absolute top-0 right-0 h-[160px] w-[160px] rounded-full bg-[#2563EB] opacity-10 blur-[60px] pointer-events-none" />
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex size-11 flex-shrink-0 items-center justify-center bg-[#2563EB]">
                    <Icon name="Squares2X2Icon" size={20} variant="solid" className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.26em] text-white/50">
                      Acceso privilegiado
                    </p>
                    <h3 className="mt-1 text-lg font-display font-900 uppercase italic text-white leading-tight">
                      Panel de Administración
                    </h3>
                    <p className="mt-1.5 text-[13px] text-white/55 leading-snug">
                      Gestiona productos, pedidos, inventario y más.
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin"
                  className="inline-flex flex-shrink-0 items-center gap-2 bg-[#2563EB] px-5 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-white transition hover:bg-[#1D4ED8]"
                >
                  <Icon name="ArrowRightIcon" size={13} variant="outline" />
                  Ir al Dashboard
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
