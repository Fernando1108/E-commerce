'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductsHeroSection from './components/ProductsHeroSection';
import ProductGridSection from './components/ProductGridSection';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSort = searchParams.get('sort') || 'featured';
  const initialBadge = searchParams.get('badge') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const view = searchParams.get('view') || '';
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <ProductsHeroSection
        onSearch={setSearchQuery}
        categoryId={initialCategory}
        sort={initialSort}
        badge={initialBadge}
        view={view}
      />
      <ProductGridSection
        searchQuery={searchQuery}
        initialCategory={initialCategory}
        initialSort={initialSort}
        initialBadge={initialBadge}
      />
    </>
  );
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Header />
      <Suspense fallback={null}>
        <ProductsContent />
      </Suspense>
      <Footer />
    </main>
  );
}
