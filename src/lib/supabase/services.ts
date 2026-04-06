import { createClient } from './client'
import type { Product, Category, Coupon, ProductImage } from '@/types'

const supabase = createClient()

// Productos con categoría (catálogo)
export async function getProducts(params?: {
  limit?: number
  offset?: number
  categoryId?: string | null
  search?: string | null
}) {
  const { data, error } = await supabase.rpc('get_products_with_category', {
    p_limit: params?.limit ?? 20,
    p_offset: params?.offset ?? 0,
    p_category_id: params?.categoryId ?? null,
    p_search: params?.search ?? null,
  })
  if (error) throw error
  return data as Product[]
}

// Producto individual con variantes
export async function getProductById(id: string) {
  const { data, error } = await supabase.rpc('get_product_by_id', { p_id: id })
  if (error) throw error
  if (!data || data.length === 0) return null

  const first = data[0]
  const product: Product = {
    id: first.id,
    name: first.name,
    description: first.description,
    price: first.price,
    original_price: first.original_price,
    badge: first.badge,
    specs: first.specs || {},
    highlights: first.highlights || [],
    image_url: first.image_url,
    slug: first.slug,
    stock: first.stock,
    featured: first.featured,
    created_at: first.created_at,
    category_id: first.category_id,
    category: first.category_name
      ? {
          id: first.category_id,
          name: first.category_name,
          description: null,
          image_url: null,
          accent_color: '#6C63FF',
          display_size: 'normal',
        }
      : undefined,
    avg_rating: Number(first.avg_rating) || 0,
    review_count: Number(first.review_count) || 0,
    variants: data
      .filter((row: any) => row.variant_id !== null)
      .map((row: any) => ({
        id: row.variant_id,
        product_id: first.id,
        name: row.variant_name,
        stock: row.variant_stock,
        price: row.variant_price,
      })),
  }
  return product
}

// Productos destacados (homepage)
export async function getFeaturedProducts(limit = 8) {
  const { data, error } = await supabase.rpc('get_featured_products', {
    p_limit: limit,
  })
  if (error) throw error
  return data as Product[]
}

// Categorías con conteo
export async function getCategories() {
  const { data, error } = await supabase.rpc('get_categories_with_count')
  if (error) throw error
  return data as (Category & { product_count: number })[]
}

// Validar cupón
export async function validateCoupon(code: string) {
  const { data, error } = await supabase.rpc('validate_coupon', {
    p_code: code,
  })
  if (error) throw error
  return data?.[0] ?? null
}

// Crear pedido
export async function createOrder(userId: string, items: any[], total: number) {
  const { data, error } = await supabase.rpc('create_order', {
    p_user_id: userId,
    p_items: JSON.stringify(items),
    p_total: total,
  })
  if (error) throw error
  return data as string
}

// Pedidos del usuario
export async function getUserOrders(userId: string) {
  const { data, error } = await supabase.rpc('get_user_orders', {
    p_user_id: userId,
  })
  if (error) throw error
  return data
}

// Imágenes de un producto
export async function getProductImages(productId: string): Promise<ProductImage[]> {
  const { data, error } = await supabase.rpc('get_product_images', { p_product_id: productId })
  if (error) throw error
  return (data || []) as ProductImage[]
}
