export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  original_price: number | null
  badge: string | null
  specs: Record<string, string>
  highlights: string[]
  image_url: string | null
  slug: string | null
  stock: number
  featured: boolean
  created_at: string
  category_id: string | null
  category?: Category
  category_name?: string
  variants?: ProductVariant[]
  images?: ProductImage[]
  avg_rating?: number
  review_count?: number
}

export interface ProductImage {
  id: string
  url: string
  alt: string | null
  sort_order: number
}

export interface Category {
  id: string
  name: string
  description: string | null
  image_url: string | null
  accent_color: string
  display_size: string
  product_count?: number
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  stock: number
  price: number
}

export interface Order {
  id: string
  user_id: string
  status: string
  total: number
  created_at: string
  item_count?: number
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string | null
  quantity: number
  price: number
  product?: Product
}

export interface CartItem {
  id: string
  product_id: string
  variant_id: string | null
  quantity: number
  product?: Product
}

export interface UserProfile {
  id: string
  name: string | null
  email: string
  phone: string | null
  created_at: string
}

export interface Coupon {
  id: string
  code: string
  type: string
  value: number
  is_valid: boolean
}

export interface Shipment {
  id: string
  order_id: string
  carrier: string | null
  tracking_number: string | null
  status: string | null
}
