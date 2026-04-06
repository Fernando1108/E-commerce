import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, variantId?: string | null) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, variantId = null) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.product_id === product.id && item.variant_id === variantId
          )
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product_id === product.id && item.variant_id === variantId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                id: crypto.randomUUID(),
                product_id: product.id,
                variant_id: variantId,
                quantity,
                product,
              },
            ],
          }
        })
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product_id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((item) => item.product_id !== productId)
            : state.items.map((item) =>
                item.product_id === productId ? { ...item, quantity } : item
              ),
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () =>
        get().items.reduce(
          (total, item) => total + (item.product?.price || 0) * item.quantity,
          0
        ),
      getItemCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    { name: 'novastore-cart' }
  )
)
