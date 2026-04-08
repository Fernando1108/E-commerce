'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DataTable, { Column } from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import Icon from '@/components/ui/AppIcon';
import { formatPrice } from '@/lib/utils';
import type { Employee } from '@/types';

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-slate-100 text-slate-500',
  terminated: 'bg-red-100 text-red-700',
};
const statusLabels: Record<string, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  terminated: 'Terminado',
};

export default function AdminEmpleados() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    position: '',
    department: '',
    phone: '',
    email: '',
    hire_date: '',
    salary: '',
    status: 'active',
  });

  const fetchEmployees = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/employees');
    const data = await res.json();
    setEmployees(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: '',
      position: '',
      department: '',
      phone: '',
      email: '',
      hire_date: new Date().toISOString().split('T')[0],
      salary: '',
      status: 'active',
    });
    setModalOpen(true);
  };

  const openEdit = (e: Employee) => {
    setEditing(e);
    setForm({
      name: e.name,
      position: e.position || '',
      department: e.department || '',
      phone: e.phone || '',
      email: e.email || '',
      hire_date: e.hire_date || '',
      salary: String(e.salary || ''),
      status: e.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitting(true);
    try {
      const url = editing ? `/api/admin/employees/${editing.id}` : '/api/admin/employees';
      await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setModalOpen(false);
      fetchEmployees();
    } catch {
      /* empty */
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar empleado?')) return;
    await fetch(`/api/admin/employees/${id}`, { method: 'DELETE' });
    fetchEmployees();
  };

  const columns: Column<Employee>[] = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      render: (item) => (
        <div>
          <p className="text-sm font-semibold text-slate-800">{item.name}</p>
          <p className="text-xs text-slate-400">{item.position || '—'}</p>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Departamento',
      render: (item) => <span className="text-sm text-slate-600">{item.department || '—'}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (item) => <span className="text-sm text-slate-600">{item.email || '—'}</span>,
    },
    {
      key: 'salary',
      label: 'Salario',
      sortable: true,
      render: (item) => (
        <span className="text-sm font-semibold text-slate-800">{formatPrice(item.salary)}</span>
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Empleados
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {employees.length} empleados
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
        >
          <Icon name="PlusIcon" size={16} />
          Nuevo empleado
        </motion.button>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        loading={loading}
        pageSize={10}
        emptyMessage="No hay empleados"
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
        title={editing ? 'Editar empleado' : 'Nuevo empleado'}
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
              {submitting ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear empleado'}
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
              Cargo
            </span>
            <input
              value={form.position}
              onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Departamento
            </span>
            <input
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
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
              Fecha contratación
            </span>
            <input
              type="date"
              value={form.hire_date}
              onChange={(e) => setForm((f) => ({ ...f, hire_date: e.target.value }))}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Salario
            </span>
            <input
              type="number"
              step="0.01"
              value={form.salary}
              onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))}
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
              <option value="terminated">Terminado</option>
            </select>
          </label>
        </form>
      </AdminModal>
    </div>
  );
}
