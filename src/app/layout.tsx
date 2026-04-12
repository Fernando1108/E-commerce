import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';
import { Toaster } from 'sonner';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import SessionManager from '@/components/SessionManager';
import ScrollProgress from '@/components/ui/ScrollProgress';
import { AuthProvider } from '@/providers/AuthProvider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'NovaStore - Tecnologia Premium para tu Mundo',
  description:
    'Descubre gadgets, accesorios de workspace y tecnologia premium en NovaStore. Envios seguros, productos seleccionados y calidad garantizada en cada pedido.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
  openGraph: {
    title: 'NovaStore - Tecnologia Premium',
    description: 'Gadgets y workspace premium seleccionados para profesionales.',
    images: [{ url: '/logo/novastore-logo.png', width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ScrollProgress />
        <GoogleAnalytics />
        <SessionManager />
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
