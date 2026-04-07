'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile';
import AdminSidebar from './components/AdminSidebar';
import AdminTopbar from './components/AdminTopbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading, isAdmin } = useProfile();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center animate-pulse">
            <span className="text-white text-lg font-black">N</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="size-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="size-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-sm text-slate-500">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Not admin (double protection — middleware already blocks this)
  if (!isAdmin) {
    router.push('/homepage');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}>
        <AdminTopbar onMenuToggle={() => setMobileMenuOpen(true)} />

        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
