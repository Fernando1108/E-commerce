import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Header />

      <section className="px-6 pb-20 pt-[120px] lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl border border-[#DDD9D3] bg-white/90 p-8 shadow-[0_24px_80px_rgba(28,28,28,0.08)] backdrop-blur-xl lg:p-12">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#2563EB]">
              NovaStore Checkout
            </p>
            <h1 className="mt-4 text-4xl font-display font-900 uppercase italic text-[#1C1C1C] lg:text-5xl">
              Checkout
            </h1>
            <p className="mt-6 text-base leading-relaxed text-[#5A5A5A]">
              Checkout en construcción.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
