'use client';

import React, { useEffect, useState } from 'react';
import DataTable, { Column } from '../../components/DataTable';
import Icon from '@/components/ui/AppIcon';
import { formatPrice } from '@/lib/utils';

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
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/purchases')
      .then((r) => r.json())
      .then((d) => {
        setPurchases(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  }, []);

  const columns: Column<PurchaseRow>[] = [
    {
      key: 'id',
      label: 'ID',
      render: (item) => (
        <span className="font-mono text-sm text-slate-700">#{item.id.slice(0, 8)}</span>
      ),
    },
    {
      key: 'supplier',
      label: 'Proveedor',
      render: (item) => (
        <span className="text-sm font-semibold text-slate-800">{item.suppliers?.name || '—'}</span>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (item) => (
        <span className="text-sm font-semibold text-slate-800">{formatPrice(item.total)}</span>
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
        <span className="text-sm text-slate-500">
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
          onClick={() => (window.location.href = '/admin/proveedores')}
          className="size-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Icon name="ArrowLeftIcon" size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Órdenes de compra</h1>
          <p className="text-sm text-slate-500 mt-1">{purchases.length} compras registradas</p>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={purchases}
        loading={loading}
        pageSize={15}
        emptyMessage="No hay compras registradas"
      />
    </div>
  );
}
