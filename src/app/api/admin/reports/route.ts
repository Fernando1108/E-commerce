import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/verify-admin';
import { subDays, format } from 'date-fns';
import { logger } from '@/lib/logger';

export async function GET(request: Request) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '30'; // days
  const days = Number(period);
  const since = subDays(new Date(), days).toISOString();

  const [ordersResult, itemsResult, categorySalesResult] = await Promise.all([
    // Orders in period
    supabase
      .from('orders')
      .select('id, total, status, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: true }),

    // Top products by quantity sold
    supabase
      .from('order_items')
      .select('product_id, quantity, price, products(name, category_id, categories(name))')
      .limit(200),

    // Category revenue
    supabase
      .from('order_items')
      .select('price, quantity, products(category_id, categories(name))')
      .limit(500),
  ]);

  // Sales by day
  const salesByDay: Record<string, { total: number; orders: number }> = {};
  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    salesByDay[date] = { total: 0, orders: 0 };
  }
  for (const order of ordersResult.data || []) {
    const date = format(new Date(order.created_at), 'yyyy-MM-dd');
    if (salesByDay[date]) {
      salesByDay[date].total += order.total || 0;
      salesByDay[date].orders += 1;
    }
  }

  // Top products
  const productMap: Record<string, { name: string; sold: number; revenue: number }> = {};
  for (const item of itemsResult.data || []) {
    const pid = item.product_id;
    const productData = item.products as unknown as { name: string } | null;
    if (!productMap[pid]) {
      productMap[pid] = { name: productData?.name || 'Producto', sold: 0, revenue: 0 };
    }
    productMap[pid].sold += item.quantity;
    productMap[pid].revenue += item.quantity * item.price;
  }

  // Revenue by category
  const categoryMap: Record<string, { name: string; revenue: number }> = {};
  for (const item of categorySalesResult.data || []) {
    const productData = item.products as unknown as {
      category_id: string;
      categories: { name: string } | null;
    } | null;
    const catName = productData?.categories?.name || 'Sin categoría';
    if (!categoryMap[catName]) categoryMap[catName] = { name: catName, revenue: 0 };
    categoryMap[catName].revenue += item.quantity * item.price;
  }

  return NextResponse.json({
    salesByDay: Object.entries(salesByDay).map(([date, d]) => ({
      date: format(new Date(date), 'dd MMM'),
      total: Math.round(d.total * 100) / 100,
      orders: d.orders,
    })),
    topProducts: Object.values(productMap)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10),
    categoryRevenue: Object.values(categoryMap).sort((a, b) => b.revenue - a.revenue),
    summary: {
      totalRevenue: (ordersResult.data || []).reduce((s, o) => s + (o.total || 0), 0),
      totalOrders: (ordersResult.data || []).length,
      averageOrder:
        (ordersResult.data || []).length > 0
          ? (ordersResult.data || []).reduce((s, o) => s + (o.total || 0), 0) /
            (ordersResult.data || []).length
          : 0,
    },
  });
}
