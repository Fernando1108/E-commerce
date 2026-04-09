'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column } from '../../components/DataTable';
import AdminModal from '../../components/AdminModal';
import AdminLoader from '../../components/AdminLoader';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';
import { exportToCSV } from '@/lib/export-csv';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [newPurchase, setNewPurchase] = useState({ supplier_id: '', total: '', notes: '' });

  const fetchPurchases = () => {
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
  };

  useEffect(() => {
    fetchPurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    fetch('/api/admin/suppliers?limit=100')
      .then((r) => r.json())
      .then((data) => setSuppliers(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleCreatePurchase = async () => {
    try {
      const res = await fetch('/api/admin/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplier_id: newPurchase.supplier_id,
          total: Number(newPurchase.total),
          notes: newPurchase.notes || null,
          status: 'pending',
        }),
      });
      if (!res.ok) throw new Error('Error al crear');
      toast.success('Compra creada exitosamente');
      setShowModal(false);
      setNewPurchase({ supplier_id: '', total: '', notes: '' });
      fetchPurchases();
    } catch {
      toast.error('Error al crear la compra');
    }
  };

  const filteredPurchases = searchTerm
    ? purchases.filter((p) =>
        (p.suppliers?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : purchases;

  const columns: Column<PurchaseRow>[] = [
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
      key: 'notes',
      label: 'Notas',
      render: (item) => (
        <span className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px] block">
          {item.notes || '—'}
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

  if (loading) return <AdminLoader message="Cargando compras" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
        <div className="flex gap-2">
          <button
            onClick={() =>
              exportToCSV(purchases as unknown as Record<string, unknown>[], 'compras', [
                { key: 'supplier_id', label: 'Proveedor ID' },
                { key: 'total', label: 'Total' },
                { key: 'status', label: 'Estado' },
                { key: 'notes', label: 'Notas' },
                { key: 'created_at', label: 'Fecha' },
              ])
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Icon name="ArrowDownTrayIcon" size={16} />
            Exportar
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
          >
            <Icon name="PlusIcon" size={16} />
            Nueva compra
          </button>
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
          placeholder="Buscar por proveedor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredPurchases}
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

      {/* Modal para crear nueva compra */}
      <AdminModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Nueva orden de compra"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Proveedor
            </label>
            <select
              value={newPurchase.supplier_id}
              onChange={(e) => setNewPurchase({ ...newPurchase, supplier_id: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white"
            >
              <option value="">Seleccionar proveedor</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Total ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={newPurchase.total}
              onChange={(e) => setNewPurchase({ ...newPurchase, total: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Notas
            </label>
            <textarea
              value={newPurchase.notes}
              onChange={(e) => setNewPurchase({ ...newPurchase, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white resize-none"
              rows={3}
              placeholder="Notas opcionales..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreatePurchase}
              disabled={!newPurchase.supplier_id || !newPurchase.total}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Crear Compra
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
