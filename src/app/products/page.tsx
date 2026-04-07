'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductsHeroSection from './components/ProductsHeroSection';
import ProductGridSection from './components/ProductGridSection';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Header />
      <ProductsHeroSection onSearch={setSearchQuery} />
      <ProductGridSection searchQuery={searchQuery} />
      <Footer />
    </main>
  );
}
