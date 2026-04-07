'use client';

import React, { useEffect, useState } from 'react';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import ChartCard from '../../components/ChartCard';
import StatCard from '../../components/StatCard';
import Icon from '@/components/ui/AppIcon';

interface ReportData {
  salesByDay: { date: string; total: number; orders: number }[];
  topProducts: { name: string; sold: number; revenue: number }[];
  categoryRevenue: { name: string; revenue: number }[];
  summary: { totalRevenue: number; totalOrders: number; averageOrder: number };
}

const COLORS = [
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#f97316',
];

export default function AdminReportes() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/reports?period=${period}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [period]);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => (window.location.href = '/admin/facturacion')}
            className="size-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Icon name="ArrowLeftIcon" size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reportes</h1>
            <p className="text-sm text-slate-500 mt-0.5">Análisis de ventas e ingresos</p>
          </div>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="7">Últimos 7 días</option>
          <option value="30">Últimos 30 días</option>
          <option value="90">Últimos 90 días</option>
        </select>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Ingresos del periodo"
          value={loading ? '—' : formatCurrency(data?.summary.totalRevenue || 0)}
          icon="CurrencyDollarIcon"
          color="green"
          loading={loading}
        />
        <StatCard
          label="Pedidos"
          value={loading ? '—' : data?.summary.totalOrders || 0}
          icon="ShoppingCartIcon"
          color="blue"
          loading={loading}
        />
        <StatCard
          label="Ticket promedio"
          value={loading ? '—' : formatCurrency(data?.summary.averageOrder || 0)}
          icon="ReceiptPercentIcon"
          color="purple"
          loading={loading}
        />
      </div>

      {/* Sales line chart */}
      <ChartCard title="Ventas por día" subtitle={`Últimos ${period} días`}>
        {loading ? (
          <div className="h-72 bg-slate-50 rounded-lg animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data?.salesByDay || []}
              margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1">
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
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: '#fff',
                }}
                formatter={(value: any) => [formatCurrency(Number(value)), 'Ventas']}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#reportGrad)"
                dot={{ r: 3, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Top products bar chart */}
        <ChartCard title="Productos más vendidos" subtitle="Por unidades vendidas">
          {loading ? (
            <div className="h-64 bg-slate-50 rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data?.topProducts?.slice(0, 8) || []}
                margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickFormatter={(v) => (v.length > 12 ? v.substring(0, 12) + '…' : v)}
                />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(value: any) => [Number(value), 'Vendidos']}
                />
                <Bar dataKey="sold" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Category revenue pie chart */}
        <ChartCard title="Ingresos por categoría" subtitle="Distribución de ventas">
          {loading ? (
            <div className="h-64 bg-slate-50 rounded-lg animate-pulse" />
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={280}>
                <PieChart>
                  <Pie
                    data={data?.categoryRevenue || []}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {(data?.categoryRevenue || []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: '#fff',
                    }}
                    formatter={(value: any) => [formatCurrency(Number(value)), 'Ingresos']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {(data?.categoryRevenue || []).slice(0, 6).map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div
                      className="size-3 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-xs text-slate-600 flex-1 truncate">{cat.name}</span>
                    <span className="text-xs font-semibold text-slate-800">
                      {formatCurrency(cat.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
