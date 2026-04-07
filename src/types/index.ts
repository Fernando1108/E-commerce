export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  badge: string | null;
  specs: Record<string, string>;
  highlights: string[];
  image_url: string | null;
  slug: string | null;
  stock: number;
  featured: boolean;
  created_at: string;
  category_id: string | null;
  category?: Category;
  category_name?: string;
  variants?: ProductVariant[];
  images?: ProductImage[];
  avg_rating?: number;
  review_count?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  sort_order: number;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  accent_color: string;
  display_size: string;
  product_count?: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  stock: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total: number;
  created_at: string;
  item_count?: number;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  price: number;
  product?: Product;
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  product?: Product;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  is_valid: boolean;
}

export interface Shipment {
  id: string;
  order_id: string;
  carrier: string | null;
  tracking_number: string | null;
  status: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  created_at?: string;
}

// ─── Admin Panel Interfaces ────────────────────────────────

export interface Employee {
  id: string;
  user_id: string | null;
  name: string;
  position: string | null;
  department: string | null;
  phone: string | null;
  email: string | null;
  hire_date: string | null;
  salary: number;
  status: 'active' | 'inactive' | 'terminated';
  created_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  notes: string | null;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Purchase {
  id: string;
  supplier_id: string | null;
  total: number;
  status: 'pending' | 'received' | 'cancelled';
  notes: string | null;
  created_at: string;
  supplier?: Supplier;
  items?: PurchaseItem[];
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  product_id: string | null;
  quantity: number;
  unit_price: number;
  product?: Product;
}

export interface InventoryMovement {
  id: string;
  product_id: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string | null;
  created_by: string | null;
  created_at: string;
  product?: Product;
}

export interface Invoice {
  id: string;
  order_id: string;
  total: number;
  status: 'paid' | 'pending' | 'cancelled' | 'refunded';
  created_at: string;
  order?: Order;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface AdminStats {
  totalSales: number;
  newOrdersToday: number;
  lowStockCount: number;
  totalCustomers: number;
  recentOrders: Order[];
  topProducts: { name: string; sold: number; revenue: number }[];
  salesByDay: { date: string; total: number; orders: number }[];
}
