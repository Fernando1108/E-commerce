'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
  products?: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    slug: string;
    stock: number;
  };
}

export function useWishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast('Inicia sesión para guardar favoritos');
      return false;
    }
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems((prev) => [...prev, data]);
      toast.success('Agregado a tu lista de deseos');
      return true;
    } catch {
      toast.error('Error al agregar a favoritos');
      return false;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return false;
    try {
      const res = await fetch(`/api/wishlist/${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((item) => item.product_id !== productId));
      toast.success('Eliminado de tu lista de deseos');
      return true;
    } catch {
      toast.error('Error al eliminar de favoritos');
      return false;
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.product_id === productId);
  };

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      return removeFromWishlist(productId);
    }
    return addToWishlist(productId);
  };

  return {
    items,
    loading,
    itemCount: items.length,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    refresh: fetchWishlist,
  };
}
