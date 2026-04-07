'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DataTable, { Column } from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';

interface CategoryRow {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  accent_color: string;
  display_size: string;
  product_count?: number;
}

export default function AdminCategorias() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    image_url: '',
    accent_color: '#6C63FF',
    display_size: 'normal',
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          image_url: form.image_url || null,
          accent_color: form.accent_color,
          display_size: form.display_size,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al crear categoría');
      }
      toast.success('Categoría creada');
      setModalOpen(false);
      setForm({
        name: '',
        description: '',
        image_url: '',
        accent_color: '#6C63FF',
        display_size: 'normal',
      });
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear categoría');
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<CategoryRow>[] = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div
            className="size-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: item.accent_color + '20' }}
          >
            <div className="size-3 rounded-full" style={{ backgroundColor: item.accent_color }} />
          </div>
          <span className="text-sm font-semibold text-slate-800">{item.name}</span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Descripción',
      render: (item) => (
        <span className="text-sm text-slate-500 line-clamp-1">{item.description || '—'}</span>
      ),
    },
    {
      key: 'product_count',
      label: 'Productos',
      sortable: true,
      render: (item) => (
        <span className="text-sm font-semibold text-slate-700">{item.product_count ?? 0}</span>
      ),
    },
    {
      key: 'display_size',
      label: 'Tamaño',
      render: (item) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-600">
          {item.display_size}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Categorías</h1>
          <p className="text-sm text-slate-500 mt-1">{categories.length} categorías</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-600 transition-colors"
        >
          <Icon name="PlusIcon" size={14} />
          Nueva categoría
        </motion.button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        pageSize={20}
        emptyMessage="No hay categorías"
      />

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva categoría">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Nombre *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              placeholder="Nombre de la categoría"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
              placeholder="Descripción de la categoría"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              URL de imagen
            </label>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Color de acento
              </label>
              <input
                type="color"
                value={form.accent_color}
                onChange={(e) => setForm({ ...form, accent_color: e.target.value })}
                className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Tamaño
              </label>
              <select
                value={form.display_size}
                onChange={(e) => setForm({ ...form, display_size: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              >
                <option value="normal">Normal</option>
                <option value="large">Grande</option>
                <option value="featured">Destacado</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !form.name.trim()}
              className="px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Creando...' : 'Crear categoría'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
