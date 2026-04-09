'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DataTable, { Column } from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import AdminLoader from '../components/AdminLoader';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export-csv';

interface StockItem {
  id: string;
  name: string;
  image_url: string | null;
  stock: number;
  price: number;
  categories?: { name: string } | null;
}

interface Movement {
  id: string;
  product_id: string;
  type: string;
  quantity: number;
  reason: string | null;
  created_at: string;
  products?: { name: string; image_url: string | null };
}

const typeColors: Record<string, string> = {
  in: 'bg-emerald-100 text-emerald-700',
  out: 'bg-red-100 text-red-700',
  adjustment: 'bg-amber-100 text-amber-700',
};
const typeLabels: Record<string, string> = { in: 'Entrada', out: 'Salida', adjustment: 'Ajuste' };

export default function AdminInventario() {
  const [view, setView] = useState<'stock' | 'movements'>('stock');
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ product_id: '', type: 'in', quantity: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);

  // Initial load: fetch stock (always needed for modal selector) and current view in parallel
  useEffect(() => {
    setLoading(true);
    const viewUrl = `/api/admin/inventory?view=${view}`;
    const stockUrl = '/api/admin/inventory?view=stock';
    const fetches =
      view === 'stock'
        ? [fetch(stockUrl).then((r) => r.json())]
        : Promise.all([
            fetch(stockUrl).then((r) => r.json()),
            fetch(viewUrl).then((r) => r.json()),
          ]);

    Promise.resolve(fetches)
      .then((results) => {
        if (view === 'stock') {
          const d = (results as unknown[])[0];
          setStockData(Array.isArray(d) ? (d as StockItem[]) : []);
        } else {
          const [stockRes, movRes] = results as [unknown, unknown];
          if (Array.isArray(stockRes)) setStockData(stockRes as StockItem[]);
          const m = movRes as { data?: unknown[] } | unknown[];
          setMovements(
            Array.isArray((m as { data?: unknown[] }).data)
              ? (m as { data: Movement[] }).data
              : Array.isArray(m)
                ? (m as Movement[])
                : []
          );
        }
      })
      .catch(() => toast.error('Error al cargar inventario'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when view tab changes (after initial load)
  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/inventory?view=${view}`)
      .then((r) => r.json())
      .then((d) => {
        if (view === 'stock') setStockData(Array.isArray(d) ? d : []);
        else setMovements(Array.isArray(d.data) ? d.data : Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Error al cargar inventario');
        setLoading(false);
      });
  }, [view]);

  const handleSubmitMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, quantity: Number(form.quantity) }),
      });
      if (!res.ok) throw new Error('Error al registrar movimiento');
      toast.success('Movimiento registrado');
      setModalOpen(false);
      setForm({ product_id: '', type: 'in', quantity: '', reason: '' });
      const refreshRes = await fetch(`/api/admin/inventory?view=${view}`);
      const d = await refreshRes.json();
      if (view === 'stock') setStockData(d);
      else setMovements(d);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al registrar movimiento');
    } finally {
      setSubmitting(false);
    }
  };

  const stockColumns: Column<StockItem>[] = [
    {
      key: 'product',
      label: 'Producto',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-slate-100 overflow-hidden">
            {item.image_url ? (
              <AppImage
                src={item.image_url}
                alt={item.name}
                width={36}
                height={36}
                className="size-full object-cover"
              />
            ) : (
              <div className="size-full flex items-center justify-center text-slate-300">
                <Icon name="PhotoIcon" size={14} />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.name}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {(item.categories as { name: string } | null)?.name || 'Sin categoría'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      render: (item) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold ${
            item.stock < 10
              ? 'bg-red-100 text-red-700'
              : item.stock < 30
                ? 'bg-amber-100 text-amber-700'
                : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {item.stock < 10 && <Icon name="ExclamationTriangleIcon" size={10} />}
          {item.stock} uds
        </span>
      ),
    },
  ];

  const moveColumns: Column<Movement>[] = [
    {
      key: 'product',
      label: 'Producto',
      render: (item) => (
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {item.products?.name || '—'}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (item) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${typeColors[item.type] || ''}`}
        >
          {typeLabels[item.type] || item.type}
        </span>
      ),
    },
    {
      key: 'quantity',
      label: 'Cantidad',
      render: (item) => (
        <span
          className={`text-sm font-bold ${item.type === 'out' ? 'text-red-600' : 'text-emerald-600'}`}
        >
          {item.type === 'out' ? '-' : '+'}
          {Math.abs(item.quantity)}
        </span>
      ),
    },
    {
      key: 'reason',
      label: 'Razón',
      render: (item) => <span className="text-sm text-slate-500">{item.reason || '—'}</span>,
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
          })}
        </span>
      ),
    },
  ];

  if (loading) return <AdminLoader message="Cargando inventario" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Inventario
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestión de stock y movimientos
          </p>
        </div>
        <div className="flex gap-2">
          {view === 'stock' && (
            <button
              onClick={() =>
                exportToCSV(stockData as unknown as Record<string, unknown>[], 'inventario', [
                  { key: 'name', label: 'Producto' },
                  { key: 'stock', label: 'Stock' },
                  { key: 'price', label: 'Precio' },
                ])
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Icon name="ArrowDownTrayIcon" size={16} />
              Exportar
            </button>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
          >
            <Icon name="PlusIcon" size={16} />
            Registrar movimiento
          </motion.button>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        {(['stock', 'movements'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${view === v ? 'bg-slate-900 dark:bg-slate-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
          >
            {v === 'stock' ? 'Stock actual' : 'Movimientos'}
          </button>
        ))}
      </div>

      {view === 'stock' ? (
        <DataTable
          columns={stockColumns}
          data={stockData}
          loading={loading}
          pageSize={15}
          emptyMessage="No hay productos"
        />
      ) : (
        <DataTable
          columns={moveColumns}
          data={movements}
          loading={loading}
          pageSize={15}
          emptyMessage="No hay movimientos"
        />
      )}

      {/* Modal for new movement */}
      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Registrar movimiento"
        subtitle="Añade entrada, salida o ajuste de inventario"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmitMovement}
              disabled={submitting || !form.product_id || !form.quantity}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? 'Registrando...' : 'Registrar'}
            </button>
          </>
        }
      >
        <form className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Producto
            </span>
            <select
              value={form.product_id}
              onChange={(e) => setForm((f) => ({ ...f, product_id: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white"
            >
              <option value="">Seleccionar producto</option>
              {stockData.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock: {p.stock})
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Tipo
            </span>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white"
            >
              <option value="in">Entrada</option>
              <option value="out">Salida</option>
              <option value="adjustment">Ajuste</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Cantidad
            </span>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white"
              min="1"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Razón
            </span>
            <input
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white"
              placeholder="Motivo del movimiento..."
            />
          </label>
        </form>
      </AdminModal>
    </div>
  );
}
