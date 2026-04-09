'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/hooks/useAuth';

interface AdminTopbarProps {
  onMenuToggle: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

const pathLabels: Record<string, string> = {
  admin: 'Dashboard',
  productos: 'Productos',
  pedidos: 'Pedidos',
  categorias: 'Categorías',
  inventario: 'Inventario',
  proveedores: 'Proveedores',
  compras: 'Compras',
  empleados: 'Empleados',
  facturacion: 'Facturación',
  reportes: 'Reportes',
  clientes: 'Clientes',
  nuevo: 'Nuevo',
  editar: 'Editar',
};

export default function AdminTopbar({ onMenuToggle, darkMode, onToggleDark }: AdminTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const generateBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    return parts.map((part, index) => ({
      label: pathLabels[part] || (part.length > 8 ? `#${part.slice(0, 8).toUpperCase()}` : part),
      href: '/' + parts.slice(0, index + 1).join('/'),
      isLast: index === parts.length - 1,
    }));
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Sesión cerrada');
    router.push('/auth/login');
  };

  const breadcrumbs = generateBreadcrumbs();

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
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.href}>
              {i > 0 && (
                <Icon
                  name="ChevronRightIcon"
                  size={12}
                  className="text-slate-300 dark:text-slate-600"
                />
              )}
              {crumb.isLast ? (
                <span className="text-slate-900 dark:text-slate-100 font-semibold">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
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
