'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/hooks/useAuth';

interface AdminTopbarProps {
  onMenuToggle: () => void;
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

export default function AdminTopbar({ onMenuToggle }: AdminTopbarProps) {
  const pathname = usePathname();
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
    // If we have a dynamic segment like /admin/pedidos/[id]
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

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
      {/* Left: mobile menu + breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden size-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Abrir menú"
        >
          <Icon name="Bars3Icon" size={20} />
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm">
          <span className="text-slate-400">Admin</span>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.path}>
              <Icon name="ChevronRightIcon" size={12} className="text-slate-300" />
              <span
                className={
                  i === breadcrumbs.length - 1 ? 'text-slate-900 font-semibold' : 'text-slate-400'
                }
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: user info */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-700">
              {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Admin'}
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Administrador
            </p>
          </div>
          <div className="size-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {(user?.user_metadata?.name || user?.email || 'A').charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200" />

        <button
          onClick={() => signOut()}
          className="size-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <Icon name="ArrowRightOnRectangleIcon" size={18} />
        </button>
      </div>
    </header>
  );
}
