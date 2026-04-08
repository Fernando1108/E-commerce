'use client';

import React, { useEffect, useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

const LIMIT = 20;

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/customers?page=${page}&limit=${LIMIT}`)
      .then((r) => r.json())
      .then((d) => {
        setCustomers(Array.isArray(d.data) ? d.data : []);
        setTotalPages(d.pagination?.totalPages ?? 1);
        setTotal(d.pagination?.total ?? 0);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Error al cargar clientes');
        setLoading(false);
      });
  }, [page]);

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
          <div className="size-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 text-xs font-bold flex-shrink-0">
            {(item.name || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {item.name || 'Sin nombre'}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{item.phone || '—'}</p>
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
      render: (item) => (
        <span className="text-sm text-slate-700 dark:text-slate-300">{item.order_count}</span>
      ),
    },
    {
      key: 'total_spent',
      label: 'Total gastado',
      sortable: true,
      render: (item) => (
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
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
          {total} usuarios registrados
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
        pageSize={LIMIT}
        emptyMessage="No hay clientes registrados"
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
