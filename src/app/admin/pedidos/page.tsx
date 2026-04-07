'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DataTable, { Column } from '../components/DataTable';
import Icon from '@/components/ui/AppIcon';

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

const statusFilters = [
  'all',
  'pending',
  'processing',
  'shipped',
  'delivered',
  'completed',
  'cancelled',
];

interface OrderRow {
  id: string;
  user_id: string;
  status: string;
  total: number;
  created_at: string;
  profiles?: { name: string | null; phone: string | null };
}

export default function AdminPedidos() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      setOrders(data.data || []);
      setLoading(false);
    };
    fetchOrders();
  }, [statusFilter]);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

  const columns: Column<OrderRow>[] = [
    {
      key: 'id',
      label: 'Orden',
      render: (item) => (
        <span className="font-mono text-sm font-semibold text-slate-700">
          #{item.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'customer',
      label: 'Cliente',
      render: (item) => (
        <span className="text-sm text-slate-700">{item.profiles?.name || 'Cliente'}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Fecha',
      sortable: true,
      render: (item) => (
        <span className="text-sm text-slate-500">
          {new Date(item.created_at).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (item) => (
        <span className="text-sm font-semibold text-slate-800">{formatCurrency(item.total)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (item) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${statusColors[item.status] || 'bg-slate-100 text-slate-600'}`}
        >
          {statusLabels[item.status] || item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pedidos</h1>
        <p className="text-sm text-slate-500 mt-1">{orders.length} pedidos</p>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((s) => (
          <motion.button
            key={s}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              statusFilter === s
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            {s === 'all' ? 'Todos' : statusLabels[s] || s}
          </motion.button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        pageSize={15}
        emptyMessage="No hay pedidos con este filtro"
        actions={(item) => (
          <Link
            href={`/admin/pedidos/${item.id}`}
            className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Ver detalle"
          >
            <Icon name="EyeIcon" size={16} />
          </Link>
        )}
      />
    </div>
  );
}
