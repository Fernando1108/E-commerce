'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import StatCard from './components/StatCard';
import ChartCard from './components/ChartCard';
import Icon from '@/components/ui/AppIcon';
import type { AdminStats } from '@/types';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Resumen general de NovaStore</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Ventas totales"
          value={loading ? '—' : formatCurrency(stats?.totalSales || 0)}
          icon="CurrencyDollarIcon"
          color="green"
          loading={loading}
        />
        <StatCard
          label="Pedidos hoy"
          value={loading ? '—' : stats?.newOrdersToday || 0}
          icon="ShoppingCartIcon"
          color="blue"
          loading={loading}
        />
        <StatCard
          label="Stock bajo"
          value={loading ? '—' : stats?.lowStockCount || 0}
          icon="ExclamationTriangleIcon"
          color={stats?.lowStockCount && stats.lowStockCount > 0 ? 'red' : 'amber'}
          loading={loading}
        />
        <StatCard
          label="Clientes"
          value={loading ? '—' : stats?.totalCustomers || 0}
          icon="UsersIcon"
          color="purple"
          loading={loading}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Sales chart — spans 2 columns */}
        <ChartCard
          title="Ventas últimos 7 días"
          subtitle="Ingresos diarios"
          className="xl:col-span-2"
        >
          {loading ? (
            <div className="h-64 bg-slate-50 rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={stats?.salesByDay || []}
                margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#fff',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Ventas']}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#salesGradient)"
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Top products */}
        <ChartCard title="Top productos" subtitle="Más vendidos">
          {loading ? (
            <div className="h-64 bg-slate-50 rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={stats?.topProducts || []}
                layout="vertical"
                margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  width={100}
                  tickFormatter={(v) => (v.length > 14 ? v.substring(0, 14) + '…' : v)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#fff',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [Number(value), 'Vendidos']}
                />
                <Bar dataKey="sold" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Bottom row: recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-slate-200 overflow-hidden"
      >
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Pedidos recientes</h3>
            <p className="text-xs text-slate-400 mt-0.5">Últimos 5 pedidos</p>
          </div>
          <a
            href="/admin/pedidos"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Ver todos →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Orden
                </th>
                <th className="px-5 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Fecha
                </th>
                <th className="px-5 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Total
                </th>
                <th className="px-5 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="px-5 py-3">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3">
                      <span className="text-sm font-mono font-semibold text-slate-700">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500">
                      {new Date(order.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold text-slate-700">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                          statusColors[order.status] || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-400">
                    <Icon name="InboxIcon" size={28} className="mx-auto mb-2 text-slate-300" />
                    No hay pedidos recientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
