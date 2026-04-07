'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/hooks/useAuth';

interface AdminTopbarProps {
  onMenuToggle: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

const breadcrumbMap: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/productos': 'Productos',
  '/admin/productos/nuevo': 'Nuevo Producto',
  '/admin/pedidos': 'Pedidos',
  '/admin/inventario': 'Inventario',
  '/admin/proveedores': 'Proveedores',
  '/admin/proveedores/compras': 'Compras',
  '/admin/empleados': 'Empleados',
  '/admin/facturacion': 'Facturación',
  '/admin/facturacion/reportes': 'Reportes',
  '/admin/clientes': 'Clientes',
};

export default function AdminTopbar({ onMenuToggle, darkMode, onToggleDark }: AdminTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    const crumbs: { label: string; path: string }[] = [];
    let currentPath = '';
    for (const part of parts) {
      currentPath += `/${part}`;
      const label = breadcrumbMap[currentPath];
      if (label) {
        crumbs.push({ label, path: currentPath });
      }
    }
    if (crumbs.length === 0 || crumbs[crumbs.length - 1].path !== pathname) {
      const closestParent = Object.keys(breadcrumbMap)
        .filter((key) => pathname.startsWith(key))
        .sort((a, b) => b.length - a.length)[0];
      if (closestParent && !crumbs.find((c) => c.path === closestParent)) {
        crumbs.push({ label: breadcrumbMap[closestParent], path: closestParent });
      }
    }
    return crumbs;
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8 transition-colors duration-300">
      {/* Left: mobile menu + breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden size-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Abrir menú"
        >
          <Icon name="Bars3Icon" size={20} />
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm">
          <span className="text-slate-400 dark:text-slate-500">Admin</span>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.path}>
              <Icon name="ChevronRightIcon" size={12} className="text-slate-300 dark:text-slate-600" />
              <span
                className={
                  i === breadcrumbs.length - 1
                    ? 'text-slate-900 dark:text-slate-100 font-semibold'
                    : 'text-slate-400 dark:text-slate-500'
                }
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: theme toggle + user info */}
      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <motion.button
          onClick={onToggleDark}
          animate={{ rotate: darkMode ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="size-9 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={darkMode ? 'Modo claro' : 'Modo oscuro'}
        >
          <Icon name={darkMode ? 'SunIcon' : 'MoonIcon'} size={18} variant="outline" />
        </motion.button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Admin'}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">
              Administrador
            </p>
          </div>
          <div className="size-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {(user?.user_metadata?.name || user?.email || 'A').charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

        <button
          onClick={handleLogout}
          className="size-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <Icon name="ArrowRightOnRectangleIcon" size={18} />
        </button>
      </div>
    </header>
  );
}
