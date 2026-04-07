'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DataTable, { Column } from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import Icon from '@/components/ui/AppIcon';
import type { Product, Category } from '@/types';

export default function AdminProductos() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', '100');
      if (search) params.set('search', search);
      if (categoryFilter) params.set('category', categoryFilter);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      /* empty */
    }
    setLoading(false);
  }, [search, categoryFilter]);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteModal.product) return;
    setDeleting(true);
    try {
      await fetch(`/api/products/${deleteModal.product.id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== deleteModal.product!.id));
      setDeleteModal({ open: false, product: null });
    } catch {
      /* empty */
    }
    setDeleting(false);
  };

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

  const columns: Column<Product>[] = [
    {
      key: 'image',
      label: 'Imagen',
      className: 'w-16',
      render: (item) => (
        <div className="size-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="size-full object-cover" />
          ) : (
            <div className="size-full flex items-center justify-center text-slate-300">
              <Icon name="PhotoIcon" size={16} />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Producto',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
          {item.category_name && (
            <p className="text-xs text-slate-400 mt-0.5">{item.category_name}</p>
          )}
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Precio',
      sortable: true,
      render: (item) => (
        <div>
          <span className="font-semibold text-slate-800">{formatCurrency(item.price)}</span>
          {item.original_price && (
            <span className="text-xs text-slate-400 line-through ml-2">
              {formatCurrency(item.original_price)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      render: (item) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
            item.stock < 10
              ? 'bg-red-100 text-red-700'
              : item.stock < 30
                ? 'bg-amber-100 text-amber-700'
                : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {item.stock} uds
        </span>
      ),
    },
    {
      key: 'featured',
      label: 'Destacado',
      render: (item) => (
        <span
          className={`size-5 rounded-full flex items-center justify-center ${item.featured ? 'bg-blue-100' : 'bg-slate-100'}`}
        >
          <Icon
            name="StarIcon"
            size={12}
            variant={item.featured ? 'solid' : 'outline'}
            className={item.featured ? 'text-blue-600' : 'text-slate-300'}
          />
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Productos</h1>
          <p className="text-sm text-slate-500 mt-1">{products.length} productos en total</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/admin/productos/nuevo')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
        >
          <Icon name="PlusIcon" size={16} />
          Nuevo producto
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Icon
            name="MagnifyingGlassIcon"
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        pageSize={12}
        emptyMessage="No se encontraron productos"
        actions={(item) => (
          <>
            <button
              onClick={() => router.push(`/admin/productos/${item.id}/editar`)}
              className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Editar"
            >
              <Icon name="PencilSquareIcon" size={16} />
            </button>
            <button
              onClick={() => setDeleteModal({ open: true, product: item })}
              className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Eliminar"
            >
              <Icon name="TrashIcon" size={16} />
            </button>
          </>
        )}
      />

      {/* Delete Confirmation Modal */}
      <AdminModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, product: null })}
        title="Eliminar producto"
        subtitle={`¿Estás seguro de eliminar "${deleteModal.product?.name}"?`}
        size="sm"
        footer={
          <>
            <button
              onClick={() => setDeleteModal({ open: false, product: null })}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Esta acción no se puede deshacer. El producto será eliminado permanentemente de la base de
          datos.
        </p>
      </AdminModal>
    </div>
  );
}
