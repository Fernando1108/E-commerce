'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Fetch results
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/products?search=${encodeURIComponent(debouncedQuery)}&limit=6`)
      .then((r) => r.json())
      .then((data) => {
        setResults(Array.isArray(data) ? data : (data.products ?? []));
        setLoading(false);
      })
      .catch(() => {
        setResults([]);
        setLoading(false);
      });
  }, [debouncedQuery]);

  const handleResultClick = useCallback(() => {
    onClose();
    setQuery('');
    setResults([]);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
          >
            <div className="bg-white border border-[#DDD9D3] shadow-[0_24px_80px_rgba(28,28,28,0.18)] overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#DDD9D3]">
                <Icon
                  name="MagnifyingGlassIcon"
                  size={18}
                  variant="outline"
                  className="text-[#8A8A8A] shrink-0"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="flex-1 bg-transparent text-[15px] text-[#1C1C1C] placeholder-[#8A8A8A] outline-none"
                />
                {loading && (
                  <div className="size-4 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin shrink-0" />
                )}
                <button
                  onClick={onClose}
                  className="text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors shrink-0"
                >
                  <Icon name="XMarkIcon" size={18} variant="outline" />
                </button>
              </div>

              {/* Results */}
              <AnimatePresence mode="wait">
                {results.length > 0 && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="max-h-[400px] overflow-y-auto"
                  >
                    <p className="px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.22em] text-[#8A8A8A] border-b border-[#EFEDE9]">
                      {results.length} resultado{results.length !== 1 ? 's' : ''}
                    </p>
                    {results.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.04 }}
                      >
                        <Link
                          href={`/product/${product.id}`}
                          onClick={handleResultClick}
                          className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#F8F7F5] transition-colors border-b border-[#EFEDE9] last:border-0 group"
                        >
                          <div className="size-12 bg-[#F4F2EF] overflow-hidden shrink-0">
                            <AppImage
                              src={product.image_url || '/assets/images/no_image.png'}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-[#1C1C1C] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                              {product.name}
                            </p>
                            {product.category_name && (
                              <p className="text-[10px] text-[#8A8A8A] mt-0.5">
                                {product.category_name}
                              </p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[14px] font-display font-900 italic text-[#1C1C1C] tracking-editorial">
                              {formatPrice(product.price)}
                            </p>
                            {product.original_price && (
                              <p className="text-[11px] text-[#8A8A8A] line-through">
                                {formatPrice(product.original_price)}
                              </p>
                            )}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {debouncedQuery && !loading && results.length === 0 && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-10 text-center"
                  >
                    <Icon
                      name="MagnifyingGlassIcon"
                      size={28}
                      variant="outline"
                      className="text-[#DDD9D3] mx-auto mb-3"
                    />
                    <p className="text-[#5A5A5A] text-sm">
                      Sin resultados para{' '}
                      <span className="font-bold">&ldquo;{debouncedQuery}&rdquo;</span>
                    </p>
                  </motion.div>
                )}

                {!debouncedQuery && (
                  <motion.div
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-5 py-5 text-[11px] text-[#8A8A8A]"
                  >
                    Escribe para buscar productos, categorías y más...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
