'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable, { Column } from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';
import type { Employee } from '@/types';

const LIMIT = 20;

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

const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-700',
  manager: 'bg-blue-100 text-blue-700',
  editor: 'bg-emerald-100 text-emerald-700',
  viewer: 'bg-slate-100 text-slate-600',
};
const roleLabels: Record<string, string> = {
  admin: 'Admin',
  manager: 'Manager',
  editor: 'Editor',
  viewer: 'Viewer',
};

const ROLES = [
  { value: 'admin', label: 'Admin — Acceso total a todos los módulos' },
  { value: 'manager', label: 'Manager — Productos, pedidos, inventario, categorías y clientes' },
  { value: 'editor', label: 'Editor — Acceso a productos y categorías' },
  { value: 'viewer', label: 'Viewer — Solo lectura en todos los módulos' },
];

interface CustomerSuggestion {
  id: string;
  name: string | null;
  phone: string | null;
  email?: string | null;
}

export default function AdminEmpleados() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({
    name: '',
    position: '',
    department: '',
    phone: '',
    email: '',
    hire_date: '',
    salary: '',
    status: 'active',
    role: 'viewer',
  });

  // Autocomplete state
  const [allCustomers, setAllCustomers] = useState<CustomerSuggestion[]>([]);
  const [suggestions, setSuggestions] = useState<CustomerSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [customersLoaded, setCustomersLoaded] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Preload customers when create modal opens (load all for autocomplete — separate use case)
  const loadCustomers = async () => {
    if (customersLoaded) return;
    try {
      const res = await fetch('/api/admin/customers?limit=100');
      const d = await res.json();
      setAllCustomers(Array.isArray(d.data) ? d.data : []);
      setCustomersLoaded(true);
    } catch {
      // silently fail — manual entry still works
    }
  };

  const fetchEmployees = async (p: number = page) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/employees?page=${p}&limit=${LIMIT}`);
      const d = await res.json();
      setEmployees(Array.isArray(d.data) ? d.data : []);
      setTotalPages(d.pagination?.totalPages ?? 1);
      setTotal(d.pagination?.total ?? 0);
    } catch {
      toast.error('Error al cargar empleados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
      role: 'viewer',
    });
    setSuggestions([]);
    setShowSuggestions(false);
    setModalOpen(true);
    loadCustomers();
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
      role: (e as Employee & { role?: string }).role || 'viewer',
    });
    setSuggestions([]);
    setShowSuggestions(false);
    setModalOpen(true);
  };

  const handleNameChange = (value: string) => {
    setForm((f) => ({ ...f, name: value }));

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const lower = value.toLowerCase();
      const filtered = allCustomers.filter((c) => (c.name || '').toLowerCase().includes(lower));
      setSuggestions(filtered);
      setShowSuggestions(true);
    }, 300);
  };

  const handleSelectSuggestion = (customer: CustomerSuggestion) => {
    setForm((f) => ({
      ...f,
      name: customer.name || '',
      email: customer.email || f.email,
      phone: customer.phone || f.phone,
    }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitting(true);
    try {
      const url = editing ? `/api/admin/employees/${editing.id}` : '/api/admin/employees';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok)
        throw new Error(editing ? 'Error al actualizar empleado' : 'Error al crear empleado');
      toast.success(editing ? 'Empleado actualizado' : 'Empleado creado');
      setModalOpen(false);
      fetchEmployees(page);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar empleado');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar empleado?')) return;
    try {
      const res = await fetch(`/api/admin/employees/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar empleado');
      toast.success('Empleado eliminado');
      fetchEmployees(page);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar empleado');
    }
  };

  const columns: Column<Employee>[] = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      render: (item) => (
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.name}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{item.position || '—'}</p>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Departamento',
      render: (item) => (
        <span className="text-sm text-slate-600 dark:text-slate-300">{item.department || '—'}</span>
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
      key: 'salary',
      label: 'Salario',
      sortable: true,
      render: (item) => (
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {formatPrice(item.salary)}
        </span>
      ),
    },
    {
      key: 'role',
      label: 'Rol',
      render: (item) => {
        const role = (item as Employee & { role?: string }).role || 'viewer';
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${roleColors[role] || 'bg-slate-100 text-slate-600'}`}
          >
            {roleLabels[role] || role}
          </span>
        );
      },
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
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{total} empleados</p>
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
        pageSize={LIMIT}
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
          {/* Nombre con autocompletado (solo al crear) */}
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Nombre *
            </span>
            <div ref={dropdownRef} className="relative mt-1.5">
              <input
                value={form.name}
                onChange={(e) => {
                  if (!editing) {
                    handleNameChange(e.target.value);
                  } else {
                    setForm((f) => ({ ...f, name: e.target.value }));
                  }
                }}
                onFocus={() => {
                  if (!editing && suggestions.length > 0) setShowSuggestions(true);
                }}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                placeholder={editing ? '' : 'Escribe 3+ caracteres para buscar…'}
                required
                autoComplete="off"
              />

              <AnimatePresence>
                {!editing && showSuggestions && (
                  <motion.ul
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 top-full left-0 right-0 mt-1 max-h-52 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-lg shadow-slate-900/10"
                  >
                    {suggestions.length === 0 ? (
                      <li className="px-4 py-3 text-sm text-slate-400 dark:text-slate-500 text-center">
                        No se encontraron usuarios
                      </li>
                    ) : (
                      suggestions.map((c) => (
                        <li key={c.id}>
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSelectSuggestion(c);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                          >
                            <div className="size-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {(c.name || '?').charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                                {c.name || 'Sin nombre'}
                              </p>
                              <p className="text-xs text-slate-400 dark:text-slate-400 truncate">
                                {c.email || c.phone || '—'}
                              </p>
                            </div>
                            <Icon
                              name="ArrowDownLeftIcon"
                              size={12}
                              className="ml-auto flex-shrink-0 text-slate-300 dark:text-slate-500"
                            />
                          </button>
                        </li>
                      ))
                    )}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            {!editing && (
              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                Busca un usuario registrado o escribe el nombre manualmente
              </p>
            )}
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
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Rol *
            </span>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              required
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
        </form>
      </AdminModal>
    </div>
  );
}
