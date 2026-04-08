'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function EditarProducto({ params }: { params: Promise<{ id: string }> }) {
  const { id: _id } = use(params);
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/productos');
  }, [router]);
  return null;
}
