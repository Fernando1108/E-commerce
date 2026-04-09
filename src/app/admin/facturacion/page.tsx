'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DataTable, { Column } from '../components/DataTable';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';
import { exportToCSV } from '@/lib/export-csv';

interface InvoiceRow {
  id: string;
  order_id: string;
  total: number;
  status: string;
  created_at: string;
  orders?: {
    id: string;
    status: string;
    total: number;
    created_at: string;
    profiles?: { name: string | null };
  };
}

const statusColors: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',
};
const statusLabels: Record<string, string> = {
  paid: 'Pagada',
  pending: 'Pendiente',
  cancelled: 'Cancelada',
  refunded: 'Reembolsada',
};

export default function AdminFacturacion() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/admin/invoices?limit=100')
      .then((r) => r.json())
      .then((d) => {
        setInvoices(Array.isArray(d.data) ? d.data : Array.isArray(d) ? d : []);
        setTotal(d.pagination?.total ?? (Array.isArray(d) ? d.length : 0));
        setLoading(false);
      })
      .catch(() => {
        toast.error('Error al cargar facturas');
        setLoading(false);
      });
  }, []);

  const columns: Column<InvoiceRow>[] = [
    {
      key: 'id',
      label: 'Factura',
      render: (item) => (
        <span className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">
          #{item.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'order',
      label: 'Pedido',
      render: (item) => (
        <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
          #{item.order_id.slice(0, 8)}
        </span>
      ),
    },
    {
      key: 'customer',
      label: 'Cliente',
      render: (item) => (
        <span className="text-sm text-slate-700 dark:text-slate-300">
          {item.orders?.profiles?.name || 'Cliente'}
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Facturación
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {total} facturas
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(invoices as unknown as Record<string, unknown>[], 'facturas', [
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
          <Link
            href="/admin/facturacion/reportes"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-700 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
          >
            <Icon name="ChartBarIcon" size={16} />
            Ver reportes
          </Link>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Icon
          name="MagnifyingGlassIcon"
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Buscar factura..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        />
      </div>
      <DataTable
        columns={columns}
        data={invoices.filter(i => {
          if (!searchTerm) return true;
          return (i.id || '').toLowerCase().includes(searchTerm.toLowerCase());
        })}
        loading={loading}
        pageSize={15}
        emptyMessage="No hay facturas"
      />
    </div>
  );
}
