'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useWishlist } from '@/hooks/useWishlist';
import { createClient } from '@/lib/supabase/client';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import StarRating from '@/components/ui/StarRating';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────
type PersonalForm = {
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ModalUser = { email?: string; user_metadata?: Record<string, string> } | null;

// ─── Constants ────────────────────────────────────────────────────────────────
const INPUT =
  'mt-1.5 w-full h-11 px-4 border border-[#DDD9D3] bg-white text-sm text-[#1C1C1C] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#2563EB] transition-colors';
const LABEL = 'block text-[10px] font-black uppercase tracking-[0.22em] text-[#8A8A8A]';

const LATAM_COUNTRIES = [
  'Argentina',
  'Bolivia',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Cuba',
  'Ecuador',
  'El Salvador',
  'España',
  'Estados Unidos',
  'Guatemala',
  'Honduras',
  'México',
  'Nicaragua',
  'Panamá',
  'Paraguay',
  'Perú',
  'Puerto Rico',
  'República Dominicana',
  'Uruguay',
  'Venezuela',
];

const ROLE_BADGE: Record<string, { label: string; cls: string }> = {
  admin: { label: 'Admin', cls: 'bg-red-100 text-red-700 border-red-200' },
  manager: { label: 'Manager', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  editor: { label: 'Editor', cls: 'bg-green-100 text-green-700 border-green-200' },
  employee: { label: 'Empleado', cls: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  viewer: { label: 'Viewer', cls: 'bg-slate-100 text-slate-500 border-slate-200' },
};

// ─── Quick actions ─────────────────────────────────────────────────────────────
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

// ─── Sub-components ────────────────────────────────────────────────────────────
function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8A8A8A]">{label}</p>
      {value ? (
        <p className="text-[14px] font-500 text-[#1C1C1C] leading-snug">{value}</p>
      ) : (
        <p className="text-[13px] text-[#BDBAB5]">Sin completar</p>
      )}
    </div>
  );
}

function InfoBadge({
  icon,
  label,
  value,
}: {
  icon: Parameters<typeof Icon>[0]['name'];
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border border-[#E6E1DA] bg-[#FAFAF8]">
      <div className="size-7 bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
        <Icon name={icon} size={14} variant="outline" className="text-[#2563EB]" />
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#8A8A8A]">{label}</p>
        <p className="text-[13px] font-700 text-[#1C1C1C]">{value}</p>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const config = ROLE_BADGE[role] ?? {
    label: role,
    cls: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  return (
    <div className="flex items-center gap-3 px-4 py-3 border border-[#E6E1DA] bg-[#FAFAF8]">
      <div className="size-7 bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
        <Icon name="ShieldCheckIcon" size={14} variant="outline" className="text-emerald-600" />
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#8A8A8A]">Rol</p>
        <span
          className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border ${config.cls}`}
        >
          {config.label}
        </span>
      </div>
    </div>
  );
}

// ─── Modal: Personal form ──────────────────────────────────────────────────────
function PersonalForm({ user, onSuccess }: { user: ModalUser; onSuccess: () => void }) {
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalForm>({
    defaultValues: { name: '', phone: '', address: '', city: '', country: '', postal_code: '' },
  });

  useEffect(() => {
    if (user) {
      reset({
        name:
          user.user_metadata?.name ??
          user.user_metadata?.full_name ??
          user.email?.split('@')[0] ??
          '',
        phone: user.user_metadata?.phone ?? '',
        address: user.user_metadata?.address ?? '',
        city: user.user_metadata?.city ?? '',
        country: user.user_metadata?.country ?? '',
        postal_code: user.user_metadata?.postal_code ?? '',
      });
    }
  }, [user, reset]);

  const onSubmit = handleSubmit(async ({ name, phone, address, city, country, postal_code }) => {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        country,
        postal_code: postal_code.trim(),
      },
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Datos actualizados correctamente');
      onSuccess();
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className={LABEL}>Email</label>
        <div className="mt-1.5 h-11 px-4 flex items-center border border-[#E6E1DA] bg-[#F8F7F5] text-sm text-[#5A5A5A]">
          {user?.email ?? '—'}
        </div>
      </div>
      <div>
        <label className={LABEL}>Nombre</label>
        <input
          {...register('name', { minLength: { value: 2, message: 'Mínimo 2 caracteres.' } })}
          className={INPUT}
          placeholder="Tu nombre"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className={LABEL}>Teléfono</label>
        <input type="tel" {...register('phone')} className={INPUT} placeholder="+507 6644-9530" />
      </div>
      <div>
        <label className={LABEL}>Dirección</label>
        <input
          {...register('address')}
          className={INPUT}
          placeholder="Calle, número, apartamento"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Ciudad</label>
          <input {...register('city')} className={INPUT} placeholder="Ciudad" />
        </div>
        <div>
          <label className={LABEL}>Código postal</label>
          <input {...register('postal_code')} className={INPUT} placeholder="0801" />
        </div>
      </div>
      <div>
        <label className={LABEL}>País</label>
        <select {...register('country')} className={INPUT + ' appearance-none cursor-pointer'}>
          <option value="">Selecciona un país</option>
          {LATAM_COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center gap-2 bg-[#1C1C1C] px-6 text-[11px] font-black uppercase tracking-[0.26em] text-white hover:bg-[#2563EB] disabled:opacity-50 transition-colors"
        >
          <Icon name="CheckIcon" size={13} variant="outline" />
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
}

// ─── Modal: Security form ──────────────────────────────────────────────────────
function SecurityForm({ user, onSuccess }: { user: ModalUser; onSuccess: () => void }) {
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });
  const newPwd = watch('newPassword');

  const onSubmit = handleSubmit(async ({ currentPassword, newPassword, confirmPassword }) => {
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas nuevas no coinciden.');
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user?.email ?? '',
      password: currentPassword,
    });
    if (signInErr) {
      setSaving(false);
      toast.error('Contraseña actual incorrecta.');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Contraseña actualizada correctamente');
      reset();
      onSuccess();
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className={LABEL}>Contraseña actual *</label>
        <input
          type="password"
          {...register('currentPassword', { required: 'La contraseña actual es obligatoria.' })}
          className={INPUT}
          placeholder="Tu contraseña actual"
          autoComplete="current-password"
        />
        {errors.currentPassword && (
          <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>
        )}
      </div>
      <div>
        <label className={LABEL}>Nueva contraseña</label>
        <input
          type="password"
          {...register('newPassword', {
            required: 'Introduce la nueva contraseña.',
            minLength: { value: 6, message: 'Mínimo 6 caracteres.' },
          })}
          className={INPUT}
          placeholder="Nueva contraseña"
          autoComplete="new-password"
        />
        {errors.newPassword && (
          <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
        )}
      </div>
      <div>
        <label className={LABEL}>Confirmar nueva contraseña</label>
        <input
          type="password"
          {...register('confirmPassword', {
            required: 'Confirma la nueva contraseña.',
            validate: (v) => v === newPwd || 'Las contraseñas no coinciden.',
          })}
          className={INPUT}
          placeholder="Repite la nueva contraseña"
          autoComplete="new-password"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center gap-2 bg-[#1C1C1C] px-6 text-[11px] font-black uppercase tracking-[0.26em] text-white hover:bg-[#2563EB] disabled:opacity-50 transition-colors"
        >
          <Icon name="LockClosedIcon" size={13} variant="outline" />
          {saving ? 'Verificando...' : 'Cambiar contraseña'}
        </button>
      </div>
    </form>
  );
}

// ─── Edit profile modal ────────────────────────────────────────────────────────
function EditProfileModal({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: ModalUser;
}) {
  const [tab, setTab] = useState<'personal' | 'security'>('personal');

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#E6E1DA]">
                <h2 className="text-base font-display font-900 italic uppercase text-[#1C1C1C]">
                  Editar Perfil
                </h2>
                <button
                  onClick={onClose}
                  className="size-8 flex items-center justify-center text-[#8A8A8A] hover:text-[#1C1C1C] hover:bg-[#F2F0EC] transition-colors rounded"
                >
                  <Icon name="XMarkIcon" size={16} variant="outline" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#E6E1DA]">
                <button
                  onClick={() => setTab('personal')}
                  className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] transition-colors border-b-2 -mb-px ${
                    tab === 'personal'
                      ? 'text-[#1C1C1C] border-[#1C1C1C]'
                      : 'text-[#8A8A8A] border-transparent hover:text-[#5A5A5A]'
                  }`}
                >
                  Datos personales
                </button>
                <button
                  onClick={() => setTab('security')}
                  className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] transition-colors border-b-2 -mb-px ${
                    tab === 'security'
                      ? 'text-[#1C1C1C] border-[#1C1C1C]'
                      : 'text-[#8A8A8A] border-transparent hover:text-[#5A5A5A]'
                  }`}
                >
                  Seguridad
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                {tab === 'personal' ? (
                  <PersonalForm user={user} onSuccess={onClose} />
                ) : (
                  <SecurityForm user={user} onSuccess={onClose} />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Orders modal ─────────────────────────────────────────────────────────────
const ORDER_STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Pendiente', cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  processing: { label: 'Procesando', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  shipped: { label: 'Enviado', cls: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  delivered: { label: 'Entregado', cls: 'bg-green-100 text-green-700 border-green-200' },
  completed: { label: 'Completado', cls: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelado', cls: 'bg-red-100 text-red-700 border-red-200' },
};

type OrderItem = { product_name: string; quantity: number; price: number };
type Order = {
  id: string;
  created_at: string;
  total: number;
  status: string;
  items?: OrderItem[];
};

function OrdersModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="orders-bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            key="orders-modal"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white w-full max-w-lg max-h-[85vh] flex flex-col pointer-events-auto shadow-xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#E6E1DA]">
                <h2 className="text-base font-display font-900 italic uppercase text-[#1C1C1C]">
                  Mis Pedidos
                </h2>
                <button
                  onClick={onClose}
                  className="size-8 flex items-center justify-center text-[#8A8A8A] hover:text-[#1C1C1C] hover:bg-[#F2F0EC] transition-colors rounded"
                >
                  <Icon name="XMarkIcon" size={16} variant="outline" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="size-6 border-2 border-[#1C1C1C] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <p className="text-center text-[#8A8A8A] text-sm py-10">No tienes pedidos aún.</p>
                ) : (
                  orders.map((order) => {
                    const cfg = ORDER_STATUS[order.status] ?? {
                      label: order.status,
                      cls: 'bg-slate-100 text-slate-500 border-slate-200',
                    };
                    const expanded = expandedId === order.id;
                    return (
                      <div key={order.id} className="border border-[#E6E1DA] bg-[#FAFAF8]">
                        <button
                          className="w-full flex items-center justify-between px-4 py-3 text-left"
                          onClick={() => setExpandedId(expanded ? null : order.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              name={expanded ? 'ChevronDownIcon' : 'ChevronRightIcon'}
                              size={13}
                              variant="outline"
                              className="text-[#8A8A8A]"
                            />
                            <div>
                              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#1C1C1C]">
                                #{order.id.slice(0, 8).toUpperCase()}
                              </p>
                              <p className="text-[11px] text-[#8A8A8A]">
                                {new Date(order.created_at).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-full ${cfg.cls}`}
                            >
                              {cfg.label}
                            </span>
                            <span className="font-display font-900 italic text-[#1C1C1C] text-sm">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                        </button>
                        {expanded && order.items && order.items.length > 0 && (
                          <div className="border-t border-[#E6E1DA] px-4 py-3 space-y-2 bg-white">
                            {order.items.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between text-[12px]"
                              >
                                <span className="text-[#1C1C1C] font-500">
                                  {item.product_name}{' '}
                                  <span className="text-[#8A8A8A]">×{item.quantity}</span>
                                </span>
                                <span className="text-[#5A5A5A]">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="border-t border-[#E6E1DA] px-6 py-4">
                <Link
                  href="/profile/orders"
                  onClick={onClose}
                  className="block w-full py-3 bg-[#1C1C1C] text-white text-[10px] font-black uppercase tracking-[0.22em] text-center hover:bg-[#2563EB] transition-colors"
                >
                  Ver todos los pedidos
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Wishlist modal ────────────────────────────────────────────────────────────
type WishlistProduct = { id: string; name: string; price: number; image_url: string | null };
type WishlistItem = { id: string; product_id: string; products: WishlistProduct };

function WishlistModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/wishlist')
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const handleRemove = async (productId: string) => {
    try {
      const res = await fetch(`/api/wishlist/${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error');
      toast.success('Eliminado de la wishlist');
      load();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="wl-bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            key="wl-modal"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white w-full max-w-lg max-h-[85vh] flex flex-col pointer-events-auto shadow-xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#E6E1DA]">
                <h2 className="text-base font-display font-900 italic uppercase text-[#1C1C1C]">
                  Mi Wishlist
                </h2>
                <button
                  onClick={onClose}
                  className="size-8 flex items-center justify-center text-[#8A8A8A] hover:text-[#1C1C1C] hover:bg-[#F2F0EC] transition-colors rounded"
                >
                  <Icon name="XMarkIcon" size={16} variant="outline" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 px-6 py-4">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="size-6 border-2 border-[#1C1C1C] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : items.length === 0 ? (
                  <p className="text-center text-[#8A8A8A] text-sm py-10">
                    Tu wishlist está vacía.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {items.map((item) => {
                      const p = item.products;
                      if (!p) return null;
                      return (
                        <div
                          key={item.id}
                          className="border border-[#E6E1DA] bg-[#FAFAF8] overflow-hidden"
                        >
                          <Link
                            href={`/product/${p.id}`}
                            onClick={onClose}
                            className="block relative bg-[#F2F0EC]"
                            style={{ aspectRatio: '4/3' }}
                          >
                            <AppImage
                              src={p.image_url || '/assets/images/no_image.png'}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="200px"
                            />
                          </Link>
                          <div className="p-3">
                            <p className="text-[12px] font-700 text-[#1C1C1C] line-clamp-2 mb-1">
                              {p.name}
                            </p>
                            <p className="text-[13px] font-display font-900 italic text-[#1C1C1C] mb-2">
                              {formatPrice(p.price)}
                            </p>
                            <button
                              onClick={() => handleRemove(item.product_id)}
                              className="w-full py-1.5 border border-red-200 text-red-500 text-[9px] font-black uppercase tracking-wider hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                            >
                              <Icon name="TrashIcon" size={10} variant="outline" />
                              Quitar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border-t border-[#E6E1DA] px-6 py-4">
                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="block w-full py-3 bg-[#1C1C1C] text-white text-[10px] font-black uppercase tracking-[0.22em] text-center hover:bg-[#2563EB] transition-colors"
                >
                  Ir a wishlist completa
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Reviews modal ─────────────────────────────────────────────────────────────
type UserReview = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  product_id: string;
  products?: { name: string } | null;
};

function ReviewsModal({
  open,
  onClose,
  userId,
}: {
  open: boolean;
  onClose: () => void;
  userId: string;
}) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('reviews')
        .select('id, rating, comment, created_at, product_id, products(name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      setReviews(Array.isArray(data) ? (data as unknown as UserReview[]) : []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const handleDelete = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error');
      }
      toast.success('Reseña eliminada');
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="rv-bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            key="rv-modal"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white w-full max-w-lg max-h-[85vh] flex flex-col pointer-events-auto shadow-xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#E6E1DA]">
                <h2 className="text-base font-display font-900 italic uppercase text-[#1C1C1C]">
                  Mis Reseñas
                </h2>
                <button
                  onClick={onClose}
                  className="size-8 flex items-center justify-center text-[#8A8A8A] hover:text-[#1C1C1C] hover:bg-[#F2F0EC] transition-colors rounded"
                >
                  <Icon name="XMarkIcon" size={16} variant="outline" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="size-6 border-2 border-[#1C1C1C] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : reviews.length === 0 ? (
                  <p className="text-center text-[#8A8A8A] text-sm py-10">
                    No has dejado reseñas aún.
                  </p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border border-[#E6E1DA] bg-[#FAFAF8] p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="text-[12px] font-black text-[#1C1C1C] mb-1.5">
                            {(review.products as { name: string } | null)?.name ?? 'Producto'}
                          </p>
                          <StarRating rating={review.rating} size="sm" readOnly />
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-[#8A8A8A]">
                            {new Date(review.created_at).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="size-7 flex items-center justify-center text-[#8A8A8A] hover:text-red-500 border border-[#E6E1DA] hover:border-red-200 transition-colors"
                            title="Eliminar reseña"
                          >
                            <Icon name="TrashIcon" size={12} variant="outline" />
                          </button>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-[12px] text-[#5A5A5A] leading-relaxed mt-2">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-[#E6E1DA] px-6 py-4">
                <button
                  onClick={onClose}
                  className="block w-full py-3 border border-[#DDD9D3] text-[#5A5A5A] text-[10px] font-black uppercase tracking-[0.22em] text-center hover:bg-[#F8F7F5] transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Modal key map ─────────────────────────────────────────────────────────────
const MODAL_MAP: Record<string, 'orders' | 'wishlist' | 'reviews'> = {
  'Mis pedidos': 'orders',
  Wishlist: 'wishlist',
  'Mis reseñas': 'reviews',
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { profile, isAdmin } = useProfile();
  const { itemCount: wishlistCount } = useWishlist();
  const router = useRouter();
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [openModal, setOpenModal] = useState<'orders' | 'wishlist' | 'reviews' | null>(null);

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
        .catch(() => setOrderCount(0));
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

  const meta = (user?.user_metadata ?? {}) as Record<string, string | undefined>;
  const role = (profile?.role ?? '') as string;
  const isStaff = role === 'admin' || role === 'employee';
  const position = meta.position;

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Header />

      <div className="pt-[72px]">
        <div className="max-w-2xl mx-auto px-6 py-12 space-y-6">
          {/* ── Main profile card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white border border-[#E6E1DA] shadow-sm overflow-hidden"
          >
            {/* Avatar + name */}
            <div className="flex flex-col items-center py-10 px-8">
              {/* Role badge above avatar */}
              {!loading && role && (
                <span
                  className={`mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.22em] ${
                    (
                      ROLE_BADGE[role] ?? {
                        cls: 'bg-slate-100 text-slate-500 border-slate-200',
                      }
                    ).cls
                  }`}
                >
                  <Icon name="ShieldCheckIcon" size={10} variant="outline" />
                  {(ROLE_BADGE[role] ?? { label: role }).label}
                </span>
              )}
              <div className="size-24 rounded-full border-4 border-[#F2F0EC] bg-[#EFEDE9] flex items-center justify-center overflow-hidden shadow-sm">
                {user?.user_metadata?.avatar_url ? (
                  <AppImage
                    src={user.user_metadata.avatar_url as string}
                    alt={displayName}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon
                    name="UserCircleIcon"
                    size={64}
                    className="text-[#8A8A8A]"
                    variant="solid"
                  />
                )}
              </div>

              {loading ? (
                <div className="mt-5 space-y-2 flex flex-col items-center">
                  <div className="h-7 w-40 bg-[#EFEDE9] rounded animate-pulse" />
                  <div className="h-4 w-56 bg-[#EFEDE9] rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <h1 className="mt-5 text-3xl font-display font-900 italic text-[#1C1C1C] tracking-tight text-center">
                    {displayName}
                  </h1>
                  <p className="text-sm text-[#8A8A8A] mt-1 text-center">{user?.email}</p>
                </>
              )}
            </div>

            <div className="border-t border-[#E6E1DA]" />

            {/* Personal info grid */}
            {loading ? (
              <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-2.5 w-20 bg-[#EFEDE9] rounded animate-pulse" />
                    <div className="h-4 w-32 bg-[#EFEDE9] rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoField label="Nombre" value={displayName} />
                <InfoField label="Email" value={user?.email} />
                <InfoField label="Teléfono" value={meta.phone} />
                <InfoField label="Dirección" value={meta.address} />
                <InfoField label="Ciudad" value={meta.city} />
                <InfoField label="País" value={meta.country} />
              </div>
            )}

            <div className="border-t border-[#E6E1DA]" />

            {/* Info badges */}
            <div className="px-8 py-5 flex flex-wrap gap-3">
              <InfoBadge
                icon="CalendarIcon"
                label="Miembro desde"
                value={loading ? '—' : memberSince}
              />
              <InfoBadge
                icon="ShoppingBagIcon"
                label="Pedidos"
                value={loading ? '—' : orderCount !== null ? String(orderCount) : '—'}
              />
              <InfoBadge icon="HeartIcon" label="Wishlist" value={String(wishlistCount)} />
              {isStaff && position && (
                <InfoBadge icon="BriefcaseIcon" label="Cargo" value={position} />
              )}
              {isStaff && role && <RoleBadge role={role} />}
            </div>

            <div className="border-t border-[#E6E1DA]" />

            {/* Action buttons */}
            <div className="px-8 py-5 flex flex-wrap gap-3">
              <button
                onClick={() => setEditOpen(true)}
                className="inline-flex h-10 items-center gap-2 bg-[#1C1C1C] px-5 text-[10px] font-black uppercase tracking-[0.26em] text-white hover:bg-[#2563EB] transition-colors"
              >
                <Icon name="PencilSquareIcon" size={12} variant="outline" />
                Editar perfil
              </button>
              <Link
                href="/profile/orders"
                className="inline-flex h-10 items-center gap-2 border border-[#DDD9D3] px-5 text-[10px] font-black uppercase tracking-[0.26em] text-[#5A5A5A] hover:border-[#1C1C1C] hover:text-[#1C1C1C] transition-colors"
              >
                <Icon name="ShoppingBagIcon" size={12} variant="outline" />
                Mis pedidos
              </Link>
            </div>
          </motion.div>

          {/* ── Quick actions ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="size-7 bg-[#EFF6FF] flex items-center justify-center">
                <Icon
                  name="RectangleGroupIcon"
                  size={14}
                  variant="outline"
                  className="text-[#2563EB]"
                />
              </div>
              <h2 className="text-[12px] font-black uppercase tracking-[0.22em] text-[#1C1C1C]">
                Acciones rápidas
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickActions.map((action, i) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{
                    y: -2,
                    transition: { type: 'spring', stiffness: 400, damping: 25 },
                  }}
                >
                  {(() => {
                    const modalKey = MODAL_MAP[action.label];
                    const inner = (
                      <>
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
                          <p className="mt-1 text-[12px] text-[#8A8A8A] leading-snug">
                            {action.desc}
                          </p>
                        </div>
                        <Icon
                          name="ChevronRightIcon"
                          size={13}
                          variant="outline"
                          className="ml-auto flex-shrink-0 text-[#DDD9D3] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all duration-300 mt-0.5"
                        />
                      </>
                    );
                    return modalKey ? (
                      <button
                        onClick={() => setOpenModal(modalKey)}
                        className="group flex items-start gap-4 bg-white border border-[#E6E1DA] p-5 shadow-sm hover:border-[#1C1C1C] hover:shadow-md transition-all duration-300 h-full w-full text-left"
                      >
                        {inner}
                      </button>
                    ) : (
                      <Link
                        href={action.href}
                        className="group flex items-start gap-4 bg-white border border-[#E6E1DA] p-5 shadow-sm hover:border-[#1C1C1C] hover:shadow-md transition-all duration-300 h-full"
                      >
                        {inner}
                      </Link>
                    );
                  })()}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Admin panel ── */}
          {!loading && isAdmin && (
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
          )}
        </div>
      </div>

      {/* Quick-action modals */}
      <OrdersModal open={openModal === 'orders'} onClose={() => setOpenModal(null)} />
      <WishlistModal open={openModal === 'wishlist'} onClose={() => setOpenModal(null)} />
      <ReviewsModal
        open={openModal === 'reviews'}
        onClose={() => setOpenModal(null)}
        userId={user?.id ?? ''}
      />

      {/* Edit profile modal */}
      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} user={user} />

      <Footer />
    </main>
  );
}
