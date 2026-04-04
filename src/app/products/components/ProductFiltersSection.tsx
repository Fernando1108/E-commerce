'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

export const categories = [
  { id: 'all', label: 'Todo' },
  { id: 'setup', label: 'Setup & Productividad' },
  { id: 'audio', label: 'Audio & Workspace' },
  { id: 'tech', label: 'Tecnología Premium' },
  { id: 'lighting', label: 'Iluminación' },
  { id: 'accessories', label: 'Accesorios' },
  { id: 'storage', label: 'Almacenamiento' },
];

export const sortOptions = [
  { id: 'featured', label: 'Destacados' },
  { id: 'newest', label: 'Más recientes' },
  { id: 'price-asc', label: 'Precio: menor a mayor' },
  { id: 'price-desc', label: 'Precio: mayor a menor' },
  { id: 'rating', label: 'Mejor valorados' },
];

interface ProductFiltersProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  activeSort: string;
  onSortChange: (id: string) => void;
  productCount: number;
}

export default function ProductFiltersSection({
  activeCategory,
  onCategoryChange,
  activeSort,
  onSortChange,
  productCount,
}: ProductFiltersProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const currentSort = sortOptions.find((s) => s.id === activeSort)?.label ?? 'Destacados';

  return (
    <section className="bg-white border-b border-[#DDD9D3] sticky top-[72px] z-30">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
          {/* Category tabs — horizontal scroll on mobile */}
          <nav
            aria-label="Filtrar por categoría"
            className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1 sm:pb-0 flex-1 max-w-full"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`relative px-5 py-2.5 text-[11px] font-700 uppercase tracking-widest whitespace-nowrap transition-all duration-200 shrink-0 ${
                  activeCategory === cat.id
                    ? 'text-white bg-[#1C1C1C]'
                    : 'text-[#5A5A5A] hover:text-[#1C1C1C] hover:bg-[#EFEDE9]'
                }`}
              >
                {cat.label}
                {activeCategory === cat.id && (
                  <motion.div
                    layoutId="filter-indicator"
                    className="absolute inset-0 bg-[#1C1C1C] -z-10"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right: Count + Sort */}
          <div className="flex items-center gap-4 shrink-0">
            <span className="label-eyebrow text-[#8A8A8A] hidden sm:block">
              {productCount} productos
            </span>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                aria-expanded={sortOpen}
                aria-haspopup="listbox"
                className="flex items-center gap-2 px-4 py-2.5 border border-[#DDD9D3] text-[11px] font-700 uppercase tracking-widest text-[#5A5A5A] hover:border-[#1C1C1C] hover:text-[#1C1C1C] transition-all"
              >
                <Icon name="AdjustmentsHorizontalIcon" size={14} variant="outline" />
                {currentSort}
                <Icon
                  name="ChevronDownIcon"
                  size={12}
                  variant="outline"
                  className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  role="listbox"
                  className="absolute right-0 top-full mt-1 bg-white border border-[#DDD9D3] shadow-nova-md z-50 min-w-[220px]"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.id}
                      role="option"
                      aria-selected={activeSort === opt.id}
                      onClick={() => { onSortChange(opt.id); setSortOpen(false); }}
                      className={`w-full text-left px-5 py-3 text-[11px] font-600 uppercase tracking-widest transition-colors ${
                        activeSort === opt.id
                          ? 'bg-[#1C1C1C] text-white'
                          : 'text-[#5A5A5A] hover:bg-[#EFEDE9] hover:text-[#1C1C1C]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}