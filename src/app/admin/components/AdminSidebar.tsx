'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: 'ChartBarIcon' },
  { label: 'Productos', href: '/admin/productos', icon: 'CubeIcon' },
  { label: 'Categorías', href: '/admin/categorias', icon: 'TagIcon' },
  { label: 'Pedidos', href: '/admin/pedidos', icon: 'ShoppingCartIcon' },
  { label: 'Inventario', href: '/admin/inventario', icon: 'ArchiveBoxIcon' },
  { label: 'Proveedores', href: '/admin/proveedores', icon: 'TruckIcon' },
  { label: 'Empleados', href: '/admin/empleados', icon: 'UserGroupIcon' },
  { label: 'Facturación', href: '/admin/facturacion', icon: 'DocumentTextIcon' },
  { label: 'Clientes', href: '/admin/clientes', icon: 'UsersIcon' },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={`flex items-center h-16 border-b border-slate-700/50 ${collapsed ? 'justify-center px-2' : 'px-6'}`}
      >
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="size-8 rounded-lg overflow-hidden flex items-center justify-center">
            <Image
              src="/logo/logo-dashboard.png"
              alt="Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-white font-bold text-lg tracking-tight"
            >
              NovaStore
            </motion.span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
        {!collapsed && (
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 px-3 mb-3">
            Menú principal
          </p>
        )}
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                href={item.href}
                onClick={onMobileClose}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 overflow-hidden ${
                  active ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                {/* Slide-in hover background (inactive items only) */}
                {!active && (
                  <span className="absolute inset-0 rounded-lg bg-slate-800 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out" />
                )}

                {/* Active: left bar with gradient */}
                {active && (
                  <motion.span
                    layoutId="admin-nav-bar"
                    className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full"
                    style={{ background: 'linear-gradient(180deg, #3b82f6, #6366f1)' }}
                  />
                )}

                <Icon
                  name={item.icon}
                  size={20}
                  variant={active ? 'solid' : 'outline'}
                  className={`relative z-10 transition-colors duration-200 ${
                    active ? 'text-blue-400' : 'text-slate-500 group-hover:text-white'
                  }`}
                />
                {!collapsed && <span className="relative z-10">{item.label}</span>}
              </Link>

              {/* Collapsed tooltip */}
              <AnimatePresence>
                {collapsed && hoveredItem === item.href && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.14, ease: 'easeOut' }}
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-700 text-white text-xs font-semibold rounded-lg whitespace-nowrap z-50 shadow-xl pointer-events-none"
                  >
                    {item.label}
                    <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 size-3 bg-slate-700 rotate-45 rounded-sm" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`border-t border-slate-700/50 p-4 ${collapsed ? 'text-center' : ''}`}>
        <Link
          href="/homepage"
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <Icon name="ArrowLeftIcon" size={14} />
          {!collapsed && <span>Volver a la tienda</span>}
        </Link>
      </div>

      {/* Collapse toggle (desktop only) */}
      <button
        onClick={onToggle}
        className="hidden lg:flex items-center justify-center h-10 border-t border-slate-700/50 text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
        aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
      >
        <Icon name={collapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'} size={16} />
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:block fixed top-0 left-0 h-screen bg-[#0f172a] border-r border-slate-800 z-30 transition-all duration-300 ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 left-0 h-screen w-72 bg-[#0f172a] z-50 lg:hidden shadow-2xl"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Icon name="XMarkIcon" size={18} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
