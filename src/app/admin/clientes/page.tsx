'use client';

import React, { useEffect, useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import Icon from '@/components/ui/AppIcon';
import { formatPrice } from '@/lib/utils';

interface CustomerRow {
  id: string;
  name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
  order_count: number;
  total_spent: number;
}

export default function AdminClientes() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/customers')
      .then((r) => r.json())
      .then((d) => {
        setCustomers(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  }, []);

  const filteredCustomers = search
    ? customers.filter((c) => (c.name || '').toLowerCase().includes(search.toLowerCase()))
    : customers;

  const columns: Column<CustomerRow>[] = [
    {
      key: 'name',
      label: 'Cliente',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 text-xs font-bold flex-shrink-0">
            {(item.name || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{item.name || 'Sin nombre'}</p>
            <p className="text-xs text-slate-400">{item.phone || '—'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Rol',
      render: (item) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${item.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}
        >
          {item.role === 'admin' ? 'Admin' : 'Cliente'}
        </span>
      ),
    },
    {
      key: 'order_count',
      label: 'Pedidos',
      sortable: true,
      render: (item) => <span className="text-sm text-slate-700">{item.order_count}</span>,
    },
    {
      key: 'total_spent',
      label: 'Total gastado',
      sortable: true,
      render: (item) => (
        <span className="text-sm font-semibold text-slate-800">
          {formatPrice(item.total_spent)}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Registro',
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
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Clientes
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {customers.length} usuarios registrados
        </p>
      </div>

      <div className="relative max-w-sm">
        <Icon
          name="MagnifyingGlassIcon"
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredCustomers}
        loading={loading}
        pageSize={15}
        emptyMessage="No hay clientes registrados"
      />
    </div>
  );
}
