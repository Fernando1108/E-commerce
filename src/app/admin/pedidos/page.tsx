'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DataTable, { Column } from '../components/DataTable';
import AdminLoader from '../components/AdminLoader';
import Icon from '@/components/ui/AppIcon';
import { statusColors, statusLabels } from '@/constants';
import { formatPrice } from '@/lib/utils';
import { exportToCSV } from '@/lib/export-csv';

const statusFilters = [
  'all',
  'pending',
  'processing',
  'paid',
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
  const [fetchError, setFetchError] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await fetch(`/api/admin/orders?${params}`);
      if (!res.ok) throw new Error('Error de red');
      const data = await res.json();
      setOrders(data.data || []);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const columns: Column<OrderRow>[] = [
    {
      key: 'id',
      label: 'Orden',
      render: (item) => (
        <span className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">
          #{item.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'customer',
      label: 'Cliente',
      render: (item) => (
        <span className="text-sm text-slate-700 dark:text-slate-300">
          {item.profiles?.name || 'Cliente'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Fecha',
      sortable: true,
      render: (item) => (
        <span className="text-sm text-slate-500 dark:text-slate-400">
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
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {formatPrice(item.total)}
        </span>
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

  if (loading) return <AdminLoader message="Cargando pedidos" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Pedidos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{orders.length} pedidos</p>
        </div>
        <button
          onClick={() => exportToCSV(orders as unknown as Record<string, unknown>[], 'pedidos', [
            { key: 'id', label: 'ID' },
            { key: 'total', label: 'Total' },
            { key: 'status', label: 'Estado' },
            { key: 'created_at', label: 'Fecha' },
          ])}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <Icon name="ArrowDownTrayIcon" size={16} />
          Exportar
        </button>
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
                ? 'bg-slate-900 dark:bg-slate-600 text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {s === 'all' ? 'Todos' : statusLabels[s] || s}
          </motion.button>
        ))}
      </div>

      {fetchError && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 py-10 text-center dark:border-red-800 dark:bg-red-950/30">
          <Icon
            name="ExclamationTriangleIcon"
            size={24}
            className="text-red-500"
            variant="outline"
          />
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">
            Error al cargar pedidos. Intenta de nuevo.
          </p>
          <button
            onClick={fetchOrders}
            className="mt-1 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors"
          >
            <Icon name="ArrowPathIcon" size={13} variant="outline" />
            Reintentar
          </button>
        </div>
      )}

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
