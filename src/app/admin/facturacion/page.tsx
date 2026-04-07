'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DataTable, { Column } from '../components/DataTable';
import Icon from '@/components/ui/AppIcon';

interface InvoiceRow {
  id: string; order_id: string; total: number; status: string; created_at: string;
  orders?: { id: string; status: string; total: number; created_at: string; profiles?: { name: string | null } };
}

const statusColors: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-700', pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-700', refunded: 'bg-purple-100 text-purple-700',
};
const statusLabels: Record<string, string> = { paid: 'Pagada', pending: 'Pendiente', cancelled: 'Cancelada', refunded: 'Reembolsada' };

export default function AdminFacturacion() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/invoices').then(r => r.json()).then(d => { setInvoices(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const formatCurrency = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

  const columns: Column<InvoiceRow>[] = [
    { key: 'id', label: 'Factura', render: (item) => <span className="font-mono text-sm font-semibold text-slate-700">#{item.id.slice(0, 8).toUpperCase()}</span> },
    { key: 'order', label: 'Pedido', render: (item) => <span className="font-mono text-sm text-slate-500">#{item.order_id.slice(0, 8)}</span> },
    { key: 'customer', label: 'Cliente', render: (item) => <span className="text-sm text-slate-700">{item.orders?.profiles?.name || 'Cliente'}</span> },
    { key: 'total', label: 'Total', sortable: true, render: (item) => <span className="text-sm font-semibold text-slate-800">{formatCurrency(item.total)}</span> },
    { key: 'status', label: 'Estado', render: (item) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${statusColors[item.status] || 'bg-slate-100 text-slate-600'}`}>{statusLabels[item.status] || item.status}</span>
    )},
    { key: 'created_at', label: 'Fecha', sortable: true, render: (item) => <span className="text-sm text-slate-500">{new Date(item.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Facturación</h1>
          <p className="text-sm text-slate-500 mt-1">{invoices.length} facturas</p>
        </div>
        <Link href="/admin/facturacion/reportes" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors">
          <Icon name="ChartBarIcon" size={16} />
          Ver reportes
        </Link>
      </div>
      <DataTable columns={columns} data={invoices} loading={loading} pageSize={15} emptyMessage="No hay facturas" />
    </div>
  );
}
