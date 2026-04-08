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

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
});

// ─── Personal info field ──────────────────────────────────────────────────────
function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8A8A8A]">{label}</p>
      {value ? (
        <p className="text-[14px] font-500 text-[#1C1C1C] leading-snug">{value}</p>
      ) : (
        <Link
          href="/profile/settings"
          className="text-[13px] text-[#BDBAB5] hover:text-[#2563EB] transition-colors duration-200"
        >
          Sin completar
        </Link>
      )}
    </div>
  );
}

// ─── Quick action card ────────────────────────────────────────────────────────
const quickActions = [
  {
    icon: 'ShoppingBagIcon' as const,
    label: 'Mis pedidos',
    desc: 'Revisa el estado de tus compras',
    href: '/profile/orders',
  },
  {
    icon: 'HeartIcon' as const,
    label: 'Wishlist',
    desc: 'Productos que te gustan',
    href: '/wishlist',
  },
  {
    icon: 'Cog6ToothIcon' as const,
    label: 'Configuración',
    desc: 'Edita tus datos y contraseña',
    href: '/profile/settings',
  },
  {
    icon: 'ChatBubbleLeftIcon' as const,
    label: 'Soporte',
    desc: '¿Necesitas ayuda? Contáctanos',
    href: '/contacto',
  },
  {
    icon: 'BuildingStorefrontIcon' as const,
    label: 'Tienda',
    desc: 'Explora nuestro catálogo',
    href: '/products',
  },
  {
    icon: 'StarIcon' as const,
    label: 'Mis reseñas',
    desc: 'Productos que has valorado',
    href: '/products',
  },
] satisfies {
  icon: Parameters<typeof Icon>[0]['name'];
  label: string;
  desc: string;
  href: string;
}[];

// ─── Main page ────────────────────────────────────────────────────────────────
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

  const meta = user?.user_metadata ?? {};

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Header />

      {/* ── Sección 1: Header del perfil ── */}
      <div className="pt-[72px] bg-[#FAF9F7]">
        <div className="max-w-3xl mx-auto px-6">
          {/* Avatar + name */}
          <div className="flex flex-col items-center pt-12 pb-2">
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

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pb-10"
          >
            {[
              {
                icon: 'CalendarIcon' as const,
                label: 'Miembro desde',
                value: loading ? '—' : memberSince,
              },
              {
                icon: 'ShoppingBagIcon' as const,
                label: 'Total de pedidos',
                value: loading ? '—' : orderCount !== null ? String(orderCount) : '—',
              },
              {
                icon: 'HeartIcon' as const,
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
                    <Icon name={card.icon} size={18} className="text-[#2563EB]" variant="outline" />
                  </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#8A8A8A]">
                  {card.label}
                </p>
                <p className="mt-1.5 text-xl font-display font-900 text-[#1C1C1C]">{card.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Sección 2: Información personal ── */}
      <section className="bg-[#F2F0EC] border-t border-[#E6E1DA] py-10">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            {...fadeUp(0.28)}
            className="bg-white border border-[#E6E1DA] overflow-hidden shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E6E1DA]">
              <div className="flex items-center gap-3">
                <div className="size-8 bg-[#EFF6FF] flex items-center justify-center">
                  <Icon name="UserIcon" size={15} variant="outline" className="text-[#2563EB]" />
                </div>
                <h2 className="text-[13px] font-black uppercase tracking-[0.22em] text-[#1C1C1C]">
                  Información personal
                </h2>
              </div>
              <Link
                href="/profile/settings"
                className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#8A8A8A] hover:text-[#2563EB] transition-colors duration-200"
              >
                <Icon name="PencilSquareIcon" size={12} variant="outline" />
                Editar
              </Link>
            </div>

            {/* Fields grid */}
            {loading ? (
              <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-2.5 w-20 bg-[#EFEDE9] rounded animate-pulse" />
                    <div className="h-4 w-32 bg-[#EFEDE9] rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoField label="Teléfono" value={meta.phone} />
                <InfoField label="Email" value={user?.email} />
                <InfoField label="Dirección" value={meta.address} />
                <InfoField label="Ciudad" value={meta.city} />
                <InfoField label="País" value={meta.country} />
                <InfoField label="Código postal" value={meta.postal_code} />
              </div>
            )}

            {/* Footer CTA */}
            <div className="px-6 py-4 border-t border-[#F2F0EC] bg-[#FAFAF8] flex justify-end">
              <Link
                href="/profile/settings"
                className="inline-flex h-10 items-center gap-2 bg-[#1C1C1C] px-5 text-[10px] font-black uppercase tracking-[0.26em] text-white transition-colors hover:bg-[#2563EB]"
              >
                <Icon name="PencilSquareIcon" size={12} variant="outline" />
                Editar información
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Sección 3: Acciones rápidas ── */}
      <section className="bg-[#FAF9F7] border-t border-[#E6E1DA] py-10">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div {...fadeUp(0.34)} className="mb-6">
            <div className="flex items-center gap-3">
              <div className="size-8 bg-[#EFF6FF] flex items-center justify-center">
                <Icon
                  name="RectangleGroupIcon"
                  size={15}
                  variant="outline"
                  className="text-[#2563EB]"
                />
              </div>
              <h2 className="text-[13px] font-black uppercase tracking-[0.22em] text-[#1C1C1C]">
                Acciones rápidas
              </h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.38 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -2, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
              >
                <Link
                  href={action.href}
                  className="group flex items-start gap-4 bg-white border border-[#E6E1DA] p-5 shadow-sm hover:border-[#1C1C1C] hover:shadow-md transition-all duration-300 h-full"
                >
                  <div className="size-9 flex-shrink-0 bg-[#F2F0EC] group-hover:bg-[#EFF6FF] flex items-center justify-center transition-colors duration-300">
                    <Icon
                      name={action.icon}
                      size={17}
                      variant="outline"
                      className="text-[#5A5A5A] group-hover:text-[#2563EB] transition-colors duration-300"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#1C1C1C] group-hover:text-[#2563EB] transition-colors duration-300 leading-tight">
                      {action.label}
                    </p>
                    <p className="mt-1 text-[12px] text-[#8A8A8A] leading-snug">{action.desc}</p>
                  </div>
                  <Icon
                    name="ChevronRightIcon"
                    size={13}
                    variant="outline"
                    className="ml-auto flex-shrink-0 text-[#DDD9D3] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all duration-300 mt-0.5"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sección 4: Admin ── */}
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
