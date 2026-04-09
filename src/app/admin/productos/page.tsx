'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import DataTable, { Column } from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import AdminLoader from '../components/AdminLoader';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { formatPrice } from '@/lib/utils';
import { exportToCSV } from '@/lib/export-csv';
import { useDebounce } from '@/hooks/useDebounce';
import type { Product, Category } from '@/types';

interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  category_id: string;
  image_url: string;
  stock: number;
  badge: string;
  featured: boolean;
  slug: string;
}

const INPUT_CLS =
  'mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all';

const LABEL_CLS =
  'text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider';

function ProductFormModal({
  open,
  onClose,
  editProduct,
  categories,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  editProduct: Product | null;
  categories: Category[];
  onSaved: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imgError, setImgError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      original_price: null,
      category_id: '',
      image_url: '',
      stock: 0,
      badge: '',
      featured: false,
      slug: '',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (open) {
      if (editProduct) {
        reset({
          name: editProduct.name,
          description: editProduct.description || '',
          price: editProduct.price,
          original_price: editProduct.original_price,
          category_id: editProduct.category_id || '',
          image_url: editProduct.image_url || '',
          stock: editProduct.stock,
          badge: editProduct.badge || '',
          featured: editProduct.featured,
          slug: editProduct.slug || '',
        });
      } else {
        reset({
          name: '',
          description: '',
          price: 0,
          original_price: null,
          category_id: '',
          image_url: '',
          stock: 0,
          badge: '',
          featured: false,
          slug: '',
        });
      }
    }
  }, [open, editProduct, reset]);

  // Image preview with 500ms debounce
  const imageUrlValue = watch('image_url');
  useEffect(() => {
    setImgError(false);
    const t = setTimeout(() => {
      const val = imageUrlValue?.trim() ?? '';
      setPreviewUrl(val.startsWith('http') ? val : '');
    }, 500);
    return () => clearTimeout(t);
  }, [imageUrlValue]);

  // Reset preview when modal closes
  useEffect(() => {
    if (!open) {
      setPreviewUrl('');
      setImgError(false);
    }
  }, [open]);

  // Auto-slug from name (only on create)
  const nameValue = watch('name');
  useEffect(() => {
    if (!editProduct && nameValue) {
      setValue(
        'slug',
        nameValue
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
      );
    }
  }, [nameValue, editProduct, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    try {
      const url = editProduct ? `/api/products/${editProduct.id}` : '/api/products';
      const method = editProduct ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          price: Number(data.price),
          original_price: data.original_price ? Number(data.original_price) : null,
          stock: Number(data.stock),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al guardar');
      }
      toast.success(editProduct ? 'Producto actualizado' : 'Producto creado');
      onSaved();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error desconocido');
    }
    setSubmitting(false);
  });

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={editProduct ? 'Editar producto' : 'Nuevo producto'}
      subtitle={editProduct ? 'Modifica los datos del producto' : 'Completa los datos del producto'}
      size="xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <motion.button
            type="button"
            onClick={() => onSubmit()}
            disabled={submitting}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20 disabled:opacity-50"
          >
            {submitting
              ? editProduct
                ? 'Guardando...'
                : 'Creando...'
              : editProduct
                ? 'Guardar cambios'
                : 'Crear producto'}
          </motion.button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <label className="block sm:col-span-2">
          <span className={LABEL_CLS}>Nombre *</span>
          <input
            {...register('name', { required: 'El nombre es obligatorio' })}
            className={INPUT_CLS}
            placeholder="Ej: MacBook Pro M4"
          />
          {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name.message}</span>}
        </label>

        {/* Description */}
        <label className="block sm:col-span-2">
          <span className={LABEL_CLS}>Descripción</span>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1.5 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
            placeholder="Descripción del producto..."
          />
        </label>

        {/* Price */}
        <label className="block">
          <span className={LABEL_CLS}>Precio *</span>
          <input
            type="number"
            step="0.01"
            {...register('price', {
              required: 'El precio es obligatorio',
              min: { value: 0.01, message: 'Precio debe ser positivo' },
            })}
            className={INPUT_CLS}
          />
          {errors.price && (
            <span className="text-xs text-red-500 mt-1">{errors.price.message}</span>
          )}
        </label>

        {/* Original price */}
        <label className="block">
          <span className={LABEL_CLS}>Precio original</span>
          <input
            type="number"
            step="0.01"
            {...register('original_price')}
            className={INPUT_CLS}
            placeholder="Para mostrar descuento"
          />
        </label>

        {/* Category */}
        <label className="block">
          <span className={LABEL_CLS}>Categoría</span>
          <select {...register('category_id')} className={INPUT_CLS}>
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        {/* Stock */}
        <label className="block">
          <span className={LABEL_CLS}>Stock</span>
          <input type="number" {...register('stock', { min: 0 })} className={INPUT_CLS} />
        </label>

        {/* Image URL + Preview */}
        <div className="sm:col-span-2">
          <span className={LABEL_CLS}>URL de imagen</span>
          <div className="mt-1.5 flex gap-3 items-start">
            <input
              {...register('image_url')}
              className={INPUT_CLS + ' flex-1'}
              placeholder="https://..."
            />
            <div className="flex-shrink-0 size-[60px] rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 overflow-hidden flex items-center justify-center">
              {previewUrl && !imgError ? (
                <AppImage
                  src={previewUrl}
                  alt="Preview"
                  width={60}
                  height={60}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <Icon
                  name="PhotoIcon"
                  size={22}
                  className="text-slate-300 dark:text-slate-500"
                  variant="outline"
                />
              )}
            </div>
          </div>
        </div>

        {/* Badge */}
        <label className="block">
          <span className={LABEL_CLS}>Badge</span>
          <input
            {...register('badge')}
            className={INPUT_CLS}
            placeholder="Ej: Nuevo, Oferta, -20%"
          />
        </label>

        {/* Slug */}
        <label className="block">
          <span className={LABEL_CLS}>Slug</span>
          <input
            {...register('slug')}
            className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </label>

        {/* Featured */}
        <label className="flex items-center gap-3 sm:col-span-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('featured')}
            className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Producto destacado
          </span>
        </label>
      </div>
    </AdminModal>
  );
}

export default function AdminProductos() {
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
  const debouncedSearch = useDebounce(search, 300);
  const [productModal, setProductModal] = useState<{
    open: boolean;
    editProduct: Product | null;
  }>({ open: false, editProduct: null });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', '100');
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (categoryFilter) params.set('category', categoryFilter);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Error al cargar productos');
    }
    setLoading(false);
  }, [debouncedSearch, categoryFilter]);

  // Initial parallel load: products + categories at the same time
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('limit', '100');
    Promise.all([
      fetch(`/api/products?${params}`).then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      })
      .catch(() => toast.error('Error al cargar datos'))
      .finally(() => setLoading(false));
  }, []);

  // Re-fetch products when search/filter changes (after initial load)
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
      toast.success('Producto eliminado');
    } catch {
      toast.error('Error al eliminar');
    }
    setDeleting(false);
  };

  const columns: Column<Product>[] = [
    {
      key: 'image',
      label: 'Imagen',
      className: 'w-16',
      render: (item) => (
        <div className="size-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
          {item.image_url ? (
            <AppImage
              src={item.image_url}
              alt={item.name}
              width={40}
              height={40}
              className="size-full object-cover"
            />
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
          <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{item.name}</p>
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
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            {formatPrice(item.price)}
          </span>
          {item.original_price && (
            <span className="text-xs text-slate-400 line-through ml-2">
              {formatPrice(item.original_price)}
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

  if (loading) return <AdminLoader message="Cargando productos" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Productos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {products.length} productos en total
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(products as unknown as Record<string, unknown>[], 'productos', [
              { key: 'name', label: 'Nombre' },
              { key: 'price', label: 'Precio' },
              { key: 'stock', label: 'Stock' },
              { key: 'featured', label: 'Destacado' },
              { key: 'created_at', label: 'Fecha' },
            ])}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Icon name="ArrowDownTrayIcon" size={16} />
            Exportar
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setProductModal({ open: true, editProduct: null })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
          >
            <Icon name="PlusIcon" size={16} />
            Nuevo producto
          </motion.button>
        </div>
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
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
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
              onClick={() => setProductModal({ open: true, editProduct: item })}
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

      {/* Create / Edit Modal */}
      <ProductFormModal
        open={productModal.open}
        onClose={() => setProductModal({ open: false, editProduct: null })}
        editProduct={productModal.editProduct}
        categories={categories}
        onSaved={fetchProducts}
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
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
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
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Esta acción no se puede deshacer. El producto será eliminado permanentemente.
        </p>
      </AdminModal>
    </div>
  );
}
