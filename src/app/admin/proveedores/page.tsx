'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DataTable, { Column } from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import Icon from '@/components/ui/AppIcon';
import type { Supplier } from '@/types';

export default function AdminProveedores() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [submitting, setSubmitting] = useState(false);
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

  const fetchSuppliers = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/suppliers');
    const data = await res.json();
    setSuppliers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

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
        await fetch(`/api/admin/suppliers/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch('/api/admin/suppliers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      setModalOpen(false);
      fetchSuppliers();
    } catch {
      /* empty */
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar proveedor?')) return;
    await fetch(`/api/admin/suppliers/${id}`, { method: 'DELETE' });
    fetchSuppliers();
  };

  const columns: Column<Supplier>[] = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      render: (item) => (
        <div>
          <p className="text-sm font-semibold text-slate-800">{item.name}</p>
          <p className="text-xs text-slate-400">{item.contact_name || '—'}</p>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (item) => <span className="text-sm text-slate-600">{item.email || '—'}</span>,
    },
    {
      key: 'city',
      label: 'Ciudad',
      render: (item) => (
        <span className="text-sm text-slate-600">
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Proveedores</h1>
          <p className="text-sm text-slate-500 mt-1">{suppliers.length} proveedores</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => (window.location.href = '/admin/proveedores/compras')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
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

      <DataTable
        columns={columns}
        data={suppliers}
        loading={loading}
        pageSize={10}
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
              onClick={() => handleDelete(item.id)}
              className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Icon name="TrashIcon" size={16} />
            </button>
          </>
        )}
      />

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar proveedor' : 'Nuevo proveedor'}
        size="lg"
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
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
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Nombre *
            </span>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm"
              required
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Contacto
            </span>
            <input
              value={form.contact_name}
              onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Email
            </span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Teléfono
            </span>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Ciudad
            </span>
            <input
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              País
            </span>
            <input
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Estado
            </span>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Notas
            </span>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="mt-1.5 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none"
            />
          </label>
        </form>
      </AdminModal>
    </div>
  );
}
