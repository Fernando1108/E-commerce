'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminTopbar from './components/AdminTopbar';
import AdminPageTransition from './components/AdminPageTransition';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('admin-theme');
    if (saved === 'dark') setDarkMode(true);
  }, []);

  const handleToggleDark = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('admin-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        <div
          className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}
        >
          <AdminTopbar
            onMenuToggle={() => setMobileMenuOpen(true)}
            darkMode={darkMode}
            onToggleDark={handleToggleDark}
          />

          <main className="p-4 lg:p-8">
            <AdminPageTransition>{children}</AdminPageTransition>
          </main>
        </div>
      </div>
    </div>
  );
}
