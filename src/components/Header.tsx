'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';
import { useProfile } from '@/hooks/useProfile';

// ─── Nav Links ────────────────────────────────────────────────────────────────
const navLinks = [
  { label: 'Tienda', href: '/products' },
  { label: 'Categorías', href: '/products?view=categories' },
  { label: 'Novedades', href: '/products?sort=newest' },
  { label: 'Ofertas', href: '/products?badge=oferta' },
  { label: 'Soporte', href: '/contacto' },
] as const;

// ─── Shared active-link helper ────────────────────────────────────────────────
function getIsActive(
  pathname: string,
  searchParams: { get(key: string): string | null },
  href: string
): boolean {
  const [base, query] = href.split('?');
  if (pathname !== base) return false;
  if (!query) {
    return (
      !searchParams.get('view') &&
      !searchParams.get('sort') &&
      !searchParams.get('badge') &&
      !searchParams.get('category')
    );
  }
  const hrefParams = new URLSearchParams(query);
  for (const [key, value] of hrefParams.entries()) {
    if (searchParams.get(key) !== value) return false;
  }
  return true;
}

// ─── Desktop Nav (needs useSearchParams → must be Suspense-wrapped) ───────────
function DesktopNavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (href: string) => getIsActive(pathname, searchParams, href);

  return (
    <>
      {navLinks.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.label}
            href={link.href}
            onClick={onLinkClick}
            className={`relative text-[11px] font-bold uppercase tracking-widest transition-colors duration-200 group pb-0.5 ${
              active ? 'text-[#2563EB]' : 'text-[#5A5A5A] hover:text-[#1C1C1C]'
            }`}
          >
            {link.label}
            <span
              className={`absolute -bottom-0.5 left-1/2 h-[1.5px] bg-[#2563EB] -translate-x-1/2 transition-all duration-300 ${
                active ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
            />
            {active && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 size-1 rounded-full bg-[#2563EB]" />
            )}
          </Link>
        );
      })}
    </>
  );
}

// ─── Mobile Nav Links (same active logic) ─────────────────────────────────────
function MobileNavLinkList({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (href: string) => getIsActive(pathname, searchParams, href);

  return (
    <>
      {navLinks.map((link, i) => (
        <motion.div
          key={link.label}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07 + 0.1 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            href={link.href}
            onClick={onClose}
            className={`mobile-nav-link block py-4 text-3xl font-display font-900 italic tracking-editorial border-b border-[#DDD9D3] transition-colors ${
              isActive(link.href) ? 'text-[#2563EB]' : 'text-[#1C1C1C] hover:text-[#2563EB]'
            }`}
          >
            {link.label}
          </Link>
        </motion.div>
      ))}
    </>
  );
}

// ─── Inline Search ────────────────────────────────────────────────────────────
interface SearchResult {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
}

function InlineSearch({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Debounced search — 300ms
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(val.trim())}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setResults(Array.isArray(data) ? data : (data.products ?? []));
        }
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleResultClick = (id: string) => {
    onClose();
    router.push(`/product/${id}`);
  };

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, x: 16, width: 0 }}
      animate={{ opacity: 1, x: 0, width: 'auto' }}
      exit={{ opacity: 0, x: 16, width: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-center"
    >
      <div className="relative flex items-center">
        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
          className="w-[220px] sm:w-[280px] border border-[#DDD9D3] bg-white px-4 py-2 text-[13px] text-[#1C1C1C] placeholder-[#8A8A8A] outline-none focus:border-[#2563EB] transition-colors duration-200"
        />
        {/* Loading spinner / clear */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 size-5 flex items-center justify-center">
          {loading ? (
            <div className="size-3.5 border-2 border-[#DDD9D3] border-t-[#2563EB] rounded-full animate-spin" />
          ) : query ? (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              className="size-4 flex items-center justify-center text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors"
            >
              <Icon name="XMarkIcon" size={14} variant="outline" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown results */}
      <AnimatePresence>
        {query && (results.length > 0 || !loading) && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 left-0 mt-1 bg-white border border-[#DDD9D3] shadow-[0_8px_32px_rgba(0,0,0,0.08)] z-50 overflow-hidden"
          >
            {results.length === 0 && !loading ? (
              <p className="px-4 py-3 text-[12px] text-[#8A8A8A]">
                Sin resultados para &ldquo;{query}&rdquo;
              </p>
            ) : (
              <ul>
                {results.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleResultClick(item.id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F8F7F5] transition-colors text-left"
                    >
                      {/* Thumbnail */}
                      <div className="size-9 bg-[#EFEDE9] flex-shrink-0 overflow-hidden">
                        {item.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon name="PhotoIcon" size={14} className="text-[#8A8A8A]" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-600 text-[#1C1C1C] truncate">{item.name}</p>
                        <p className="text-[11px] text-[#2563EB] font-700">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <Icon
                        name="ChevronRightIcon"
                        size={12}
                        className="text-[#8A8A8A] flex-shrink-0"
                      />
                    </button>
                  </li>
                ))}
                {results.length > 0 && (
                  <li className="border-t border-[#DDD9D3]">
                    <button
                      onClick={() => {
                        onClose();
                        router.push(`/products?search=${encodeURIComponent(query)}`);
                      }}
                      className="w-full px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-[#2563EB] hover:bg-[#EFF6FF] transition-colors text-center"
                    >
                      Ver todos los resultados →
                    </button>
                  </li>
                )}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── User Dropdown ────────────────────────────────────────────────────────────
interface UserDropdownProps {
  user: { email?: string } | null;
  isAdmin: boolean;
  onSignOut: () => void;
  onClose: () => void;
}

function UserDropdown({ user, isAdmin, onSignOut, onClose }: UserDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full right-0 mt-2 w-52 bg-white border border-[#DDD9D3] shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-50 overflow-hidden"
    >
      {/* Email header */}
      <div className="px-4 py-3 border-b border-[#DDD9D3]">
        <p className="text-[9px] font-black uppercase tracking-widest text-[#8A8A8A]">
          Sesión activa
        </p>
        <p className="text-[12px] font-600 text-[#1C1C1C] mt-0.5 truncate">{user?.email}</p>
      </div>

      <div className="py-1">
        {/* Admin link — only for admins/employees */}
        {isAdmin && (
          <>
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-[12px] font-700 text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
            >
              <div className="size-5 bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                <Icon name="Squares2X2Icon" size={12} variant="solid" className="text-white" />
              </div>
              Dashboard Admin
            </Link>
            <div className="my-1 border-t border-[#DDD9D3]" />
          </>
        )}

        <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-[12px] font-600 text-[#1C1C1C] hover:bg-[#F8F7F5] transition-colors"
        >
          <Icon
            name="UserIcon"
            size={15}
            variant="outline"
            className="text-[#5A5A5A] flex-shrink-0"
          />
          Mi perfil
        </Link>

        <Link
          href="/profile/orders"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-[12px] font-600 text-[#1C1C1C] hover:bg-[#F8F7F5] transition-colors"
        >
          <Icon
            name="ShoppingBagIcon"
            size={15}
            variant="outline"
            className="text-[#5A5A5A] flex-shrink-0"
          />
          Mis pedidos
        </Link>

        <div className="my-1 border-t border-[#DDD9D3]" />

        <button
          onClick={() => {
            onSignOut();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-600 text-[#C33D2F] hover:bg-[#FFF7F5] transition-colors"
        >
          <Icon
            name="ArrowRightOnRectangleIcon"
            size={15}
            variant="outline"
            className="flex-shrink-0"
          />
          Cerrar sesión
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────
export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const { itemCount: wishlistCount } = useWishlist();
  const { isAdmin } = useProfile();

  // Scroll → glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close search when route changes
  useEffect(() => {
    setSearchOpen(false);
    setUserDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const handleSearchToggle = useCallback(() => {
    setSearchOpen((v) => !v);
    setUserDropdownOpen(false);
  }, []);

  const handleUserToggle = useCallback(() => {
    setUserDropdownOpen((v) => !v);
    setSearchOpen(false);
  }, []);

  return (
    <>
      {/* ── Desktop / Tablet Header ─────────────────────────────────── */}
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#F8F7F5]/97 backdrop-blur-xl shadow-[0_1px_0_0_#DDD9D3]'
            : 'bg-[#F8F7F5]/90 backdrop-blur-md'
        }`}
      >
        {/* Animated bottom highlight line on scroll */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-px header-gradient-line transition-opacity duration-500 ${
            scrolled ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-[72px] flex items-center justify-between gap-6">
          {/* LEFT: Logo */}
          <Link
            href="/homepage"
            className="flex items-center gap-2.5 shrink-0 z-10 transition-transform duration-300 hover:scale-[1.02]"
            aria-label="NovaStore — Inicio"
          >
            <AppLogo size={137} />
          </Link>

          {/* CENTER: Nav links (desktop) */}
          <nav
            className="hidden lg:flex items-center gap-8 xl:gap-10"
            aria-label="Navegación principal"
          >
            <Suspense
              fallback={
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="relative text-[11px] font-bold uppercase tracking-widest text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors duration-200 pb-0.5"
                    >
                      {link.label}
                    </Link>
                  ))}
                </>
              }
            >
              <DesktopNavLinks />
            </Suspense>
          </nav>

          {/* RIGHT: Icon actions */}
          <div className="flex items-center gap-1">
            {/* ── Search (inline expand) ── */}
            <div className="relative flex items-center">
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <InlineSearch key="search-open" onClose={() => setSearchOpen(false)} />
                ) : null}
              </AnimatePresence>

              <button
                aria-label="Buscar productos"
                onClick={handleSearchToggle}
                className={`ml-1 flex size-9 items-center justify-center transition-colors duration-200 ${
                  searchOpen ? 'text-[#2563EB]' : 'text-[#8A8A8A] hover:text-[#1C1C1C]'
                }`}
              >
                <Icon
                  name={searchOpen ? 'XMarkIcon' : 'MagnifyingGlassIcon'}
                  size={20}
                  variant="outline"
                />
              </button>
            </div>

            {/* ── Wishlist ── */}
            <Link
              aria-label="Lista de deseos"
              href="/wishlist"
              className="relative hidden sm:flex size-9 items-center justify-center text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors duration-200"
            >
              <Icon name="HeartIcon" size={20} variant="outline" />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    key="wishlist-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 size-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none"
                  >
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* ── Cart ── */}
            <Link
              aria-label="Ver carrito"
              href="/cart"
              className="relative flex size-9 items-center justify-center text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors duration-200"
            >
              <Icon name="ShoppingBagIcon" size={20} variant="outline" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 size-4 bg-[#2563EB] text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none"
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* ── User / Auth ── */}
            <div className="relative hidden sm:block">
              {user ? (
                <>
                  <button
                    aria-label="Menú de cuenta"
                    aria-expanded={userDropdownOpen}
                    onClick={handleUserToggle}
                    className={`flex size-9 items-center justify-center transition-colors duration-200 ${
                      userDropdownOpen ? 'text-[#2563EB]' : 'text-[#8A8A8A] hover:text-[#1C1C1C]'
                    }`}
                  >
                    <Icon name="UserCircleIcon" size={22} variant="outline" />
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <UserDropdown
                        user={user}
                        isAdmin={isAdmin}
                        onSignOut={signOut}
                        onClose={() => setUserDropdownOpen(false)}
                      />
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  aria-label="Iniciar sesión"
                  className="flex size-9 items-center justify-center text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors duration-200"
                >
                  <Icon name="UserIcon" size={20} variant="outline" />
                </Link>
              )}
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="lg:hidden flex size-9 items-center justify-center text-[#1C1C1C]"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <Icon name={mobileOpen ? 'XMarkIcon' : 'Bars3Icon'} size={22} variant="outline" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Menu ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#F8F7F5] flex flex-col"
          >
            {/* Mobile header bar */}
            <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#DDD9D3]">
              <Link
                href="/homepage"
                className="flex items-center gap-2.5"
                onClick={() => setMobileOpen(false)}
              >
                <AppLogo size={32} />
                <span className="font-display font-800 text-xl tracking-tightest text-[#1C1C1C]">
                  NovaStore
                </span>
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
            <nav className="flex flex-col px-6 pt-10 gap-1" aria-label="Navegación móvil">
              <Suspense
                fallback={
                  <>
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="mobile-nav-link block py-4 text-3xl font-display font-900 italic tracking-editorial border-b border-[#DDD9D3] text-[#1C1C1C]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </>
                }
              >
                <MobileNavLinkList onClose={() => setMobileOpen(false)} />
              </Suspense>
            </nav>

            {/* Mobile bottom area */}
            <div className="mt-auto px-6 pb-10 flex flex-col gap-4">
              {/* Auth row */}
              <div className="flex flex-wrap gap-4">
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors"
                    >
                      <Icon name="UserIcon" size={18} variant="outline" />
                      Mi Cuenta
                    </Link>
                    <Link
                      href="/profile/orders"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors"
                    >
                      <Icon name="ShoppingBagIcon" size={18} variant="outline" />
                      Pedidos
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileOpen(false);
                      }}
                      className="text-[11px] font-bold uppercase tracking-widest text-[#8A8A8A] hover:text-red-500 transition-colors"
                    >
                      Salir
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors"
                  >
                    <Icon name="UserIcon" size={18} variant="outline" />
                    Iniciar sesión
                  </Link>
                )}
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors"
                >
                  <Icon name="ShoppingBagIcon" size={18} variant="outline" />
                  Carrito{itemCount > 0 ? ` (${itemCount})` : ''}
                </Link>
              </div>

              {/* CTA */}
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
