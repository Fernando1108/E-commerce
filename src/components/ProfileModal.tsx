'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
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

// ─── Constants ────────────────────────────────────────────────────────────────
const INPUT =
  'mt-1 w-full h-10 px-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 ' +
  'placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 rounded-lg transition-colors';
const LABEL =
  'block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400';

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

const ORDER_STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Pendiente', cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  processing: { label: 'Procesando', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  shipped: { label: 'Enviado', cls: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  delivered: { label: 'Entregado', cls: 'bg-green-100 text-green-700 border-green-200' },
  completed: { label: 'Completado', cls: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelado', cls: 'bg-red-100 text-red-700 border-red-200' },
};

// ─── Shared modal shell ───────────────────────────────────────────────────────
function SubModalShell({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <>
      <motion.div
        key="sub-bd"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-[60]"
        onClick={onClose}
      />
      <motion.div
        key="sub-card"
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-white dark:bg-slate-800 w-full max-w-lg max-h-[85vh] flex flex-col pointer-events-auto shadow-2xl rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h2>
            <button
              onClick={onClose}
              className="size-8 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors rounded-lg"
            >
              <Icon name="XMarkIcon" size={16} variant="outline" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 px-6 py-4">{children}</div>
          {footer && (
            <div className="border-t border-slate-100 dark:border-slate-700 px-6 py-4">
              {footer}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ─── Orders sub-modal ─────────────────────────────────────────────────────────
type OrderItem = { product_name: string; quantity: number; price: number };
type Order = { id: string; created_at: string; total: number; status: string; items?: OrderItem[] };

function OrdersSubModal({ onClose }: { onClose: () => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SubModalShell
      title="Mis Pedidos"
      onClose={onClose}
      footer={
        <Link
          href="/profile/orders"
          onClick={onClose}
          className="block w-full py-2.5 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest text-center hover:bg-blue-700 transition-colors rounded-lg"
        >
          Ver todos los pedidos
        </Link>
      }
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="size-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-10">No tienes pedidos aún.</p>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => {
            const cfg = ORDER_STATUS[order.status] ?? {
              label: order.status,
              cls: 'bg-slate-100 text-slate-500 border-slate-200',
            };
            const expanded = expandedId === order.id;
            return (
              <div
                key={order.id}
                className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  onClick={() => setExpandedId(expanded ? null : order.id)}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      name={expanded ? 'ChevronDownIcon' : 'ChevronRightIcon'}
                      size={13}
                      variant="outline"
                      className="text-slate-400"
                    />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(order.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${cfg.cls}`}
                    >
                      {cfg.label}
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </button>
                {expanded && order.items && order.items.length > 0 && (
                  <div className="border-t border-slate-100 dark:border-slate-700 px-4 py-3 space-y-1.5 bg-slate-50 dark:bg-slate-700/50">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-slate-700 dark:text-slate-300">
                          {item.product_name}{' '}
                          <span className="text-slate-400 dark:text-slate-500">
                            ×{item.quantity}
                          </span>
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </SubModalShell>
  );
}

// ─── Wishlist sub-modal ───────────────────────────────────────────────────────
type WishlistProduct = { id: string; name: string; price: number; image_url: string | null };
type WishlistItem = { id: string; product_id: string; products: WishlistProduct };

function WishlistSubModal({ onClose }: { onClose: () => void }) {
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
    load();
  }, [load]);

  const handleRemove = async (productId: string) => {
    try {
      const res = await fetch(`/api/wishlist/${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Eliminado de la wishlist');
      load();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <SubModalShell
      title="Mi Wishlist"
      onClose={onClose}
      footer={
        <Link
          href="/wishlist"
          onClick={onClose}
          className="block w-full py-2.5 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest text-center hover:bg-blue-700 transition-colors rounded-lg"
        >
          Ver wishlist completa
        </Link>
      }
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="size-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-10">Tu wishlist está vacía.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => {
            const p = item.products;
            if (!p) return null;
            return (
              <div
                key={item.id}
                className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
              >
                <Link
                  href={`/product/${p.id}`}
                  onClick={onClose}
                  className="block relative bg-slate-50 dark:bg-slate-700"
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
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 mb-1">
                    {p.name}
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {formatPrice(p.price)}
                  </p>
                  <button
                    onClick={() => handleRemove(item.product_id)}
                    className="w-full py-1.5 border border-red-200 text-red-500 text-[9px] font-bold uppercase tracking-wider hover:bg-red-50 transition-colors rounded-lg flex items-center justify-center gap-1"
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
    </SubModalShell>
  );
}

// ─── Reviews sub-modal ────────────────────────────────────────────────────────
type UserReview = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  products?: { name: string } | null;
};

function ReviewsSubModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('reviews')
        .select('id, rating, comment, created_at, products(name)')
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
    load();
  }, [load]);

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
    <SubModalShell title="Mis Reseñas" onClose={onClose}>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="size-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-10">No has dejado reseñas aún.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-slate-200 dark:border-slate-700 rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    {(review.products as { name: string } | null)?.name ?? 'Producto'}
                  </p>
                  <StarRating rating={review.rating} size="sm" readOnly />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-400">
                    {new Date(review.created_at).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="size-7 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 border border-slate-200 dark:border-slate-600 hover:border-red-200 transition-colors rounded-lg"
                  >
                    <Icon name="TrashIcon" size={12} variant="outline" />
                  </button>
                </div>
              </div>
              {review.comment && (
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </SubModalShell>
  );
}

// ─── Edit form: Personal ──────────────────────────────────────────────────────
function PersonalEditForm({
  user,
  onSuccess,
  onCancel,
}: {
  user: { email?: string; user_metadata?: Record<string, string> } | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
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
      toast.success('Datos actualizados');
      onSuccess();
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className={LABEL}>Email</label>
        <div className="mt-1 h-10 px-3 flex items-center border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm text-slate-500 dark:text-slate-400 rounded-lg">
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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Teléfono</label>
          <input type="tel" {...register('phone')} className={INPUT} placeholder="+507 6644-9530" />
        </div>
        <div>
          <label className={LABEL}>Código postal</label>
          <input {...register('postal_code')} className={INPUT} placeholder="0801" />
        </div>
      </div>
      <div>
        <label className={LABEL}>Dirección</label>
        <input
          {...register('address')}
          className={INPUT}
          placeholder="Calle, número, apartamento"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Ciudad</label>
          <input {...register('city')} className={INPUT} placeholder="Ciudad" />
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
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 h-10 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-colors rounded-lg"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-10 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors rounded-lg"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ─── Edit form: Security ──────────────────────────────────────────────────────
function SecurityEditForm({
  user,
  onSuccess,
  onCancel,
}: {
  user: { email?: string } | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
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
      toast.error('Las contraseñas no coinciden.');
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
      toast.success('Contraseña actualizada');
      reset();
      onSuccess();
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className={LABEL}>Contraseña actual *</label>
        <input
          type="password"
          {...register('currentPassword', { required: 'Obligatoria.' })}
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
            required: 'Obligatoria.',
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
        <label className={LABEL}>Confirmar contraseña</label>
        <input
          type="password"
          {...register('confirmPassword', {
            required: 'Obligatoria.',
            validate: (v) => v === newPwd || 'No coinciden.',
          })}
          className={INPUT}
          placeholder="Repite la nueva contraseña"
          autoComplete="new-password"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 h-10 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-colors rounded-lg"
        >
          {saving ? 'Verificando...' : 'Cambiar contraseña'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-10 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors rounded-lg"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ─── Action icon button ───────────────────────────────────────────────────────
function ActionIcon({
  icon,
  title,
  onClick,
}: {
  icon: Parameters<typeof Icon>[0]['name'];
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
    >
      <Icon name={icon} size={18} variant="outline" />
    </button>
  );
}

// ─── Main ProfileModal ────────────────────────────────────────────────────────
export default function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { itemCount: wishlistCount } = useWishlist();

  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<'personal' | 'security' | null>(null);
  const [subModal, setSubModal] = useState<'orders' | 'wishlist' | 'reviews' | null>(null);

  // Fetch order count when modal opens
  useEffect(() => {
    if (open && user) {
      fetch('/api/orders')
        .then((r) => r.json())
        .then((d) => setOrderCount(Array.isArray(d) ? d.length : null))
        .catch(() => setOrderCount(0));
    }
  }, [open, user]);

  // Reset edit mode when closing
  useEffect(() => {
    if (!open) {
      setEditMode(null);
      setSubModal(null);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (subModal) setSubModal(null);
        else if (editMode) setEditMode(null);
        else onClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose, editMode, subModal]);

  const displayName =
    user?.user_metadata?.name ??
    user?.user_metadata?.full_name ??
    user?.email?.split('@')[0] ??
    'Usuario';

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })
    : '—';

  const meta = (user?.user_metadata ?? {}) as Record<string, string | undefined>;
  const role = (profile?.role ?? '') as string;
  const isStaff = role === 'admin' || role === 'employee';
  const roleBadge = ROLE_BADGE[role];

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="pm-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[40]"
              onClick={onClose}
            />

            {/* Card */}
            <motion.div
              key="pm-card"
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className="fixed inset-0 z-[40] flex items-start justify-center pt-20 px-4 pointer-events-none"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden">
                <div className="max-h-[80vh] overflow-y-auto">
                  {/* ── View mode ── */}
                  {!editMode && (
                    <div className="p-6">
                      {/* Close button */}
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={onClose}
                          className="size-8 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors rounded-lg"
                        >
                          <Icon name="XMarkIcon" size={16} variant="outline" />
                        </button>
                      </div>

                      {/* Avatar section */}
                      <div className="flex flex-col items-center text-center mb-6">
                        {/* Role badge */}
                        {roleBadge && (
                          <span
                            className={`mb-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-widest ${roleBadge.cls}`}
                          >
                            <Icon name="ShieldCheckIcon" size={9} variant="outline" />
                            {roleBadge.label}
                          </span>
                        )}

                        {/* Avatar + edit pencil */}
                        <div className="relative mb-3">
                          <div className="w-16 h-16 rounded-full border-4 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 flex items-center justify-center overflow-hidden shadow-sm">
                            {user?.user_metadata?.avatar_url ? (
                              <AppImage
                                src={user.user_metadata.avatar_url as string}
                                alt={displayName}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Icon
                                name="UserCircleIcon"
                                size={44}
                                className="text-slate-400"
                                variant="solid"
                              />
                            )}
                          </div>
                          {/* Edit pencil */}
                          <button
                            title="Editar perfil"
                            onClick={() => setEditMode('personal')}
                            className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors"
                          >
                            <Icon
                              name="PencilSquareIcon"
                              size={11}
                              variant="solid"
                              className="text-white"
                            />
                          </button>
                        </div>

                        {/* Name + email */}
                        <h2 className="text-2xl font-display font-900 italic text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
                          {displayName}
                        </h2>
                        <p className="text-sm text-slate-400 mt-0.5">{user?.email}</p>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-slate-100 dark:border-slate-700 mb-5" />

                      {/* Info grid 3 cols */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[
                          { icon: 'CalendarIcon' as const, label: 'Desde', value: memberSince },
                          {
                            icon: 'ShoppingBagIcon' as const,
                            label: 'Pedidos',
                            value: orderCount !== null ? String(orderCount) : '—',
                          },
                          {
                            icon: 'HeartIcon' as const,
                            label: 'Wishlist',
                            value: String(wishlistCount),
                          },
                        ].map((stat) => (
                          <div
                            key={stat.label}
                            className="flex flex-col items-center gap-1 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
                          >
                            <Icon
                              name={stat.icon}
                              size={16}
                              variant="outline"
                              className="text-blue-500"
                            />
                            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                              {stat.label}
                            </p>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 text-center">
                              {stat.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Extra meta (phone/city/country) */}
                      {(meta.phone || meta.city || meta.country) && (
                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 justify-center mb-4">
                          {meta.phone && (
                            <span className="text-xs text-slate-400">{meta.phone}</span>
                          )}
                          {meta.city && <span className="text-xs text-slate-400">{meta.city}</span>}
                          {meta.country && (
                            <span className="text-xs text-slate-400">{meta.country}</span>
                          )}
                        </div>
                      )}

                      {/* Divider */}
                      <div className="border-t border-slate-100 dark:border-slate-700 mb-5" />

                      {/* Quick action icons */}
                      <div className="flex items-center justify-center gap-3 mb-5">
                        <ActionIcon
                          icon="ShoppingBagIcon"
                          title="Mis pedidos"
                          onClick={() => setSubModal('orders')}
                        />
                        <ActionIcon
                          icon="HeartIcon"
                          title="Wishlist"
                          onClick={() => setSubModal('wishlist')}
                        />
                        <ActionIcon
                          icon="StarIcon"
                          title="Mis reseñas"
                          onClick={() => setSubModal('reviews')}
                        />
                        <ActionIcon
                          icon="PencilSquareIcon"
                          title="Editar perfil"
                          onClick={() => setEditMode('personal')}
                        />
                        <Link
                          href="/profile"
                          onClick={onClose}
                          title="Ver perfil completo"
                          className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                          <Icon name="UserIcon" size={18} variant="outline" />
                        </Link>
                      </div>

                      {/* Admin banner */}
                      {isStaff && (
                        <Link
                          href="/admin"
                          onClick={onClose}
                          className="flex items-center justify-center gap-2 w-full p-3 bg-slate-900 rounded-xl text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors"
                        >
                          <Icon name="Squares2X2Icon" size={14} variant="solid" />
                          Ir al Panel de Administración
                        </Link>
                      )}
                    </div>
                  )}

                  {/* ── Edit mode ── */}
                  {editMode && (
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-5">
                        <button
                          onClick={() => setEditMode(null)}
                          className="size-8 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors rounded-lg"
                        >
                          <Icon name="ArrowLeftIcon" size={16} variant="outline" />
                        </button>
                        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                          Editar perfil
                        </h2>
                      </div>

                      {/* Tabs */}
                      <div className="flex gap-1 mb-5 bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
                        <button
                          onClick={() => setEditMode('personal')}
                          className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors ${
                            editMode === 'personal'
                              ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                          }`}
                        >
                          Personal
                        </button>
                        <button
                          onClick={() => setEditMode('security')}
                          className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors ${
                            editMode === 'security'
                              ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                          }`}
                        >
                          Seguridad
                        </button>
                      </div>

                      {/* Form */}
                      {editMode === 'personal' ? (
                        <PersonalEditForm
                          user={user}
                          onSuccess={() => setEditMode(null)}
                          onCancel={() => setEditMode(null)}
                        />
                      ) : (
                        <SecurityEditForm
                          user={user}
                          onSuccess={() => setEditMode(null)}
                          onCancel={() => setEditMode(null)}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sub-modals (stack above profile modal) */}
      <AnimatePresence>
        {subModal === 'orders' && <OrdersSubModal key="orders" onClose={() => setSubModal(null)} />}
        {subModal === 'wishlist' && (
          <WishlistSubModal key="wishlist" onClose={() => setSubModal(null)} />
        )}
        {subModal === 'reviews' && (
          <ReviewsSubModal
            key="reviews"
            userId={user?.id ?? ''}
            onClose={() => setSubModal(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
