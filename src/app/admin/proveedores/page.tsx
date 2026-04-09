'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DataTable, { Column } from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import AdminLoader from '../components/AdminLoader';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export-csv';
import { useDebounce } from '@/hooks/useDebounce';
import type { Supplier } from '@/types';

const LIMIT = 20;

export default function AdminProveedores() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [form, setForm] = useState({
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    notes: '',
    status: 'active',
  });

  const fetchSuppliers = async (p: number = page) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/suppliers?page=${p}&limit=${LIMIT}`);
      const d = await res.json();
      setSuppliers(Array.isArray(d.data) ? d.data : []);
      setTotalPages(d.pagination?.totalPages ?? 1);
      setTotal(d.pagination?.total ?? 0);
    } catch {
      toast.error('Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: '',
      contact_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      notes: '',
      status: 'active',
    });
    setModalOpen(true);
  };

  const openEdit = (s: Supplier) => {
    setEditing(s);
    setForm({
      name: s.name,
      contact_name: s.contact_name || '',
      email: s.email || '',
      phone: s.phone || '',
      address: s.address || '',
      city: s.city || '',
      country: s.country || '',
      notes: s.notes || '',
      status: s.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        const res = await fetch(`/api/admin/suppliers/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Error al actualizar proveedor');
        toast.success('Proveedor actualizado');
      } else {
        const res = await fetch('/api/admin/suppliers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Error al crear proveedor');
        toast.success('Proveedor creado');
      }
      setModalOpen(false);
      fetchSuppliers(page);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar proveedor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/suppliers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar proveedor');
      toast.success('Proveedor eliminado');
      fetchSuppliers(page);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar proveedor');
    }
  };

  const columns: Column<Supplier>[] = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      render: (item) => (
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.name}</p>
          <p className="text-xs text-slate-400">{item.contact_name || '—'}</p>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (item) => (
        <span className="text-sm text-slate-600 dark:text-slate-300">{item.email || '—'}</span>
      ),
    },
    {
      key: 'city',
      label: 'Ciudad',
      render: (item) => (
        <span className="text-sm text-slate-600 dark:text-slate-300">
          {item.city ? `${item.city}, ${item.country || ''}` : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (item) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${item.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
        >
          {item.status === 'active' ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  if (loading) return <AdminLoader message="Cargando proveedores" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Proveedores
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{total} proveedores</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(suppliers as unknown as Record<string, unknown>[], 'proveedores', [
              { key: 'name', label: 'Nombre' },
              { key: 'contact_name', label: 'Contacto' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Teléfono' },
              { key: 'city', label: 'Ciudad' },
              { key: 'country', label: 'País' },
              { key: 'status', label: 'Estado' },
            ])}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Icon name="ArrowDownTrayIcon" size={16} />
            Exportar
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/admin/proveedores/compras')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Icon name="DocumentTextIcon" size={16} />
            Compras
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
          >
            <Icon name="PlusIcon" size={16} />
            Nuevo proveedor
          </motion.button>
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
          placeholder="Buscar proveedor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        />
      </div>

      <DataTable
        columns={columns}
        data={suppliers.filter(s => {
          if (!debouncedSearch) return true;
          const term = debouncedSearch.toLowerCase();
          return (s.name || '').toLowerCase().includes(term) || (s.contact_name || '').toLowerCase().includes(term);
        })}
        loading={loading}
        pageSize={LIMIT}
        emptyMessage="No hay proveedores"
        actions={(item) => (
          <>
            <button
              onClick={() => openEdit(item)}
              className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Icon name="PencilSquareIcon" size={16} />
            </button>
            <button
              onClick={() => setDeleteId(item.id)}
              className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Icon name="TrashIcon" size={16} />
            </button>
          </>
        )}
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

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar proveedor' : 'Nuevo proveedor'}
        size="lg"
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !form.name}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear proveedor'}
            </button>
          </>
        }
      >
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Nombre *
            </span>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white"
              required
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Contacto
            </span>
            <input
              value={form.contact_name}
              onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Email
            </span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Teléfono
            </span>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Ciudad
            </span>
            <input
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              País
            </span>
            <input
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Estado
            </span>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Notas
            </span>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="mt-1.5 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white resize-none"
            />
          </label>
        </form>
      </AdminModal>

      <AdminModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Eliminar proveedor"
      >
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          ¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteId(null)}
            className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => { handleDelete(deleteId!); setDeleteId(null); }}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </AdminModal>
    </div>
  );
}
