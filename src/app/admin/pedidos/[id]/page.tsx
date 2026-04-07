'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};
const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  completed: 'Completado',
  cancelled: 'Cancelado',
};
const allStatuses = ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'];

interface OrderDetail {
  id: string;
  user_id: string;
  status: string;
  total: number;
  created_at: string;
  profiles?: { name: string | null; phone: string | null };
  items: {
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    products?: { name: string; image_url: string | null; price: number };
  }[];
}

export default function PedidoDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setOrder(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        toast.success(`Estado actualizado a: ${statusLabels[newStatus] || newStatus}`);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Error al actualizar estado');
      }
    } catch {
      toast.error('Error al actualizar estado');
    }
    setUpdating(false);
  };

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

  if (loading) {
    return (
      <div className="max-w-4xl space-y-6 animate-pulse">
        <div className="h-8 w-60 bg-slate-200 rounded" />
        <div className="h-64 bg-slate-100 rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <Icon name="ExclamationCircleIcon" size={40} className="mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500">Pedido no encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="size-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Icon name="ArrowLeftIcon" size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pedido #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {new Date(order.created_at).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${statusColors[order.status] || 'bg-slate-100 text-slate-600'}`}
        >
          {statusLabels[order.status] || order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order items */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Items del pedido</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3">
                <div className="size-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                  {item.products?.image_url ? (
                    <img src={item.products.image_url} alt="" className="size-full object-cover" />
                  ) : (
                    <div className="size-full flex items-center justify-center text-slate-300">
                      <Icon name="PhotoIcon" size={16} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {item.products?.name || 'Producto'}
                  </p>
                  <p className="text-xs text-slate-400">Cantidad: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">Total</span>
            <span className="text-lg font-bold text-slate-900">{formatCurrency(order.total)}</span>
          </div>
        </motion.div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-slate-200 p-5 space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-900">Cliente</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Icon name="UserIcon" size={14} className="text-slate-400" />
                {order.profiles?.name || 'Sin nombre'}
              </div>
              {order.profiles?.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Icon name="PhoneIcon" size={14} className="text-slate-400" />
                  {order.profiles.phone}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-slate-200 p-5 space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-900">Cambiar estado</h3>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 disabled:opacity-50"
            >
              {allStatuses.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
            {updating && <p className="text-xs text-blue-600">Actualizando...</p>}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
