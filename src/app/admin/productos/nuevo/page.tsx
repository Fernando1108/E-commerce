'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import type { Category } from '@/types';

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

export default function NuevoProducto() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
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

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []));
  }, []);

  // Auto-generate slug from name
  const nameValue = watch('name');
  useEffect(() => {
    if (nameValue) {
      setValue(
        'slug',
        nameValue
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
      );
    }
  }, [nameValue, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
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
        throw new Error(err.error || 'Error al crear producto');
      }
      router.push('/admin/productos');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
    setSubmitting(false);
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="size-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Icon name="ArrowLeftIcon" size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Nuevo producto</h1>
          <p className="text-sm text-slate-500 mt-0.5">Completa los datos del producto</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 p-6 space-y-5"
        >
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Información básica
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Nombre *
              </span>
              <input
                {...register('name', { required: 'El nombre es obligatorio' })}
                className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                placeholder="Ej: MacBook Pro M4"
              />
              {errors.name && (
                <span className="text-xs text-red-500 mt-1">{errors.name.message}</span>
              )}
            </label>

            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Descripción
              </span>
              <textarea
                {...register('description')}
                rows={4}
                className="mt-1.5 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
                placeholder="Descripción detallada del producto..."
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Precio *
              </span>
              <input
                type="number"
                step="0.01"
                {...register('price', {
                  required: 'El precio es obligatorio',
                  min: { value: 0.01, message: 'Precio debe ser positivo' },
                })}
                className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
              {errors.price && (
                <span className="text-xs text-red-500 mt-1">{errors.price.message}</span>
              )}
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Precio original
              </span>
              <input
                type="number"
                step="0.01"
                {...register('original_price')}
                className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                placeholder="Para mostrar descuento"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Categoría
              </span>
              <select
                {...register('category_id')}
                className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              >
                <option value="">Sin categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Stock
              </span>
              <input
                type="number"
                {...register('stock', { min: 0 })}
                className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                URL de imagen
              </span>
              <input
                {...register('image_url')}
                className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                placeholder="https://..."
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Badge
              </span>
              <input
                {...register('badge')}
                className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                placeholder="Ej: Nuevo, Oferta, -20%"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Slug
              </span>
              <input
                {...register('slug')}
                className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </label>

            <label className="flex items-center gap-3 sm:col-span-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('featured')}
                className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-slate-700">Producto destacado</span>
            </label>
          </div>
        </motion.div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <motion.button
            type="submit"
            disabled={submitting}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20 disabled:opacity-50"
          >
            {submitting ? 'Creando...' : 'Crear producto'}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
