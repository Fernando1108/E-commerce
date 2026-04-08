'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column } from '../../components/DataTable';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

const LIMIT = 20;

interface PurchaseRow {
  id: string;
  supplier_id: string;
  total: number;
  status: string;
  notes: string | null;
  created_at: string;
  suppliers?: { name: string };
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  received: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};
const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  received: 'Recibida',
  cancelled: 'Cancelada',
};

export default function AdminCompras() {
  const router = useRouter();
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/purchases?page=${page}&limit=${LIMIT}`)
      .then((r) => r.json())
      .then((d) => {
        setPurchases(Array.isArray(d.data) ? d.data : []);
        setTotalPages(d.pagination?.totalPages ?? 1);
        setTotal(d.pagination?.total ?? 0);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Error al cargar órdenes de compra');
        setLoading(false);
      });
  }, [page]);

  const columns: Column<PurchaseRow>[] = [
    {
      key: 'id',
      label: 'ID',
      render: (item) => (
        <span className="font-mono text-sm text-slate-700 dark:text-slate-300">
          #{item.id.slice(0, 8)}
        </span>
      ),
    },
    {
      key: 'supplier',
      label: 'Proveedor',
      render: (item) => (
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {item.suppliers?.name || '—'}
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/proveedores')}
          className="size-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <Icon name="ArrowLeftIcon" size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Órdenes de compra
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {total} compras registradas
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={purchases}
        loading={loading}
        pageSize={LIMIT}
        emptyMessage="No hay compras registradas"
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="ChevronLeftIcon" size={14} />
            Anterior
          </button>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
            <Icon name="ChevronRightIcon" size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
