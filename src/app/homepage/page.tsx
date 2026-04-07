import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './components/HeroSection';
import CategoryBannersSection from './components/CategoryBannersSection';
import FeaturedProductsSection from './components/FeaturedProductsSection';
import WhyNovaStoreSection from './components/WhyNovaStoreSection';
import PromoBannerSection from './components/PromoBannerSection';
import TestimonialsSection from './components/TestimonialsSection';
import NewsletterSection from './components/NewsletterSection';

export default function HomepagePage() {
  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Header />
      <HeroSection />
      <CategoryBannersSection />
      <FeaturedProductsSection />
      <WhyNovaStoreSection />
      <PromoBannerSection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
