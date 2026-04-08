import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/verify-admin';
import { subDays, format, startOfDay } from 'date-fns';

export async function GET() {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  try {
    const today = startOfDay(new Date()).toISOString();
    const sevenDaysAgo = subDays(new Date(), 7).toISOString();

    // Run all queries in parallel
    const [
      salesResult,
      todayOrdersResult,
      lowStockResult,
      customersResult,
      recentOrdersResult,
      topProductsResult,
      salesByDayResult,
    ] = await Promise.all([
      // Total sales (completed orders)
      supabase.from('orders').select('total').eq('status', 'completed'),

      // Orders today
      supabase.from('orders').select('id', { count: 'exact', head: true }).gte('created_at', today),

      // Low stock products (stock < 10)
      supabase.from('products').select('id', { count: 'exact', head: true }).lt('stock', 10),

      // Total customers
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'user'),

      // Recent 5 orders
      supabase
        .from('orders')
        .select('id, user_id, status, total, created_at')
        .order('created_at', { ascending: false })
        .limit(5),

      // Top products (by order_items quantity)
      supabase
        .from('order_items')
        .select('product_id, quantity, price, products(name)')
        .order('quantity', { ascending: false })
        .limit(10),

      // Sales last 7 days
      supabase.from('orders').select('total, created_at').gte('created_at', sevenDaysAgo),
    ]);

    // Calculate total sales
    const totalSales = (salesResult.data || []).reduce(
      (sum: number, o: { total: number }) => sum + (o.total || 0),
      0
    );

    // Build sales by day
    const salesMap: Record<string, { total: number; orders: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      salesMap[date] = { total: 0, orders: 0 };
    }
    for (const order of salesByDayResult.data || []) {
      const date = format(new Date(order.created_at), 'yyyy-MM-dd');
      if (salesMap[date]) {
        salesMap[date].total += order.total || 0;
        salesMap[date].orders += 1;
      }
    }
    const salesByDay = Object.entries(salesMap).map(([date, data]) => ({
      date: format(new Date(date), 'dd MMM'),
      total: Math.round(data.total * 100) / 100,
      orders: data.orders,
    }));

    // Build top products
    const productMap: Record<string, { name: string; sold: number; revenue: number }> = {};
    for (const item of topProductsResult.data || []) {
      const pid = item.product_id;
      const productData = item.products as unknown as { name: string } | null;
      const name = productData?.name || 'Producto eliminado';
      if (!productMap[pid]) {
        productMap[pid] = { name, sold: 0, revenue: 0 };
      }
      productMap[pid].sold += item.quantity;
      productMap[pid].revenue += item.quantity * item.price;
    }
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    return NextResponse.json({
      totalSales: Math.round(totalSales * 100) / 100,
      newOrdersToday: todayOrdersResult.count || 0,
      lowStockCount: lowStockResult.count || 0,
      totalCustomers: customersResult.count || 0,
      recentOrders: recentOrdersResult.data || [],
      topProducts,
      salesByDay,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
