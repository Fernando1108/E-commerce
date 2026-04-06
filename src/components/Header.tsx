'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const navLinks = [
  { label: 'Tienda', href: '/products' },
  { label: 'Categorías', href: '/products' },
  { label: 'Novedades', href: '/products' },
  { label: 'Ofertas', href: '/products' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#F8F7F5]/97 backdrop-blur-xl border-b border-[#DDD9D3]'
            : 'bg-[#F8F7F5]/90 backdrop-blur-md border-b border-[#DDD9D3]/60'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-[72px] flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/homepage" className="flex items-center gap-2.5 shrink-0 z-10 group">
            <AppLogo size={137} />
          </Link>

          {/* Center Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks?.map((link) => (
              <Link
                key={link?.label}
                href={link?.href}
                className="text-[11px] font-bold uppercase tracking-widest text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors duration-200 relative group"
              >
                {link?.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#2563EB] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              aria-label="Buscar productos"
              className="hidden sm:flex size-9 items-center justify-center text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors"
            >
              <Icon name="MagnifyingGlassIcon" size={20} variant="outline" />
            </button>

            {/* Account */}
            <button
              aria-label="Mi cuenta"
              className="hidden sm:flex size-9 items-center justify-center text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors"
            >
              <Icon name="UserIcon" size={20} variant="outline" />
            </button>

            {/* Cart */}
            <Link
              aria-label="Ver carrito"
              href="/cart"
              className="relative flex size-9 items-center justify-center text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors"
            >
              <Icon name="ShoppingBagIcon" size={20} variant="outline" />
              <span className="absolute -top-0.5 -right-0.5 size-4 bg-[#2563EB] text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none">
                3
              </span>
            </Link>

            {/* Support CTA */}
            <Link
              href="/homepage"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 border border-[#DDD9D3] text-[#1C1C1C] text-[10px] font-bold uppercase tracking-widest hover:bg-[#1C1C1C] hover:text-white hover:border-[#1C1C1C] transition-all duration-300 ml-2"
            >
              Soporte
            </Link>

            {/* Mobile hamburger */}
            <button
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="lg:hidden flex size-9 items-center justify-center text-[#1C1C1C]"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Icon name={mobileOpen ? 'XMarkIcon' : 'Bars3Icon'} size={22} variant="outline" />
            </button>
          </div>
        </div>
      </header>
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#F8F7F5] flex flex-col"
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#DDD9D3]">
              <Link href="/homepage" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                <AppLogo size={50} />
              </Link>
              <button
                aria-label="Cerrar menú"
                onClick={() => setMobileOpen(false)}
                className="size-9 flex items-center justify-center text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors"
              >
                <Icon name="XMarkIcon" size={22} variant="outline" />
              </button>
            </div>

            {/* Mobile nav links */}
            <nav className="flex flex-col px-6 pt-10 gap-1">
              {navLinks?.map((link, i) => (
                <motion.div
                  key={link?.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.1 }}
                >
                  <Link
                    href={link?.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-4 text-3xl font-display font-900 italic tracking-editorial text-[#1C1C1C] border-b border-[#DDD9D3] hover:text-[#2563EB] transition-colors"
                  >
                    {link?.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Mobile bottom */}
            <div className="mt-auto px-6 pb-10 flex flex-col gap-4">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#8A8A8A]">
                  <Icon name="UserIcon" size={18} variant="outline" />
                  Mi Cuenta
                </button>
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors"
                >
                  <Icon name="ShoppingBagIcon" size={18} variant="outline" />
                  Carrito (3)
                </Link>
              </div>
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="w-full py-4 bg-[#1C1C1C] text-white text-center text-[11px] font-black uppercase tracking-widest hover:bg-[#2563EB] transition-all duration-300"
              >
                Ver Tienda
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}