'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: { value: number; label: string };
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  loading?: boolean;
}

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
  green: { bg: 'bg-emerald-50', icon: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
  red: { bg: 'bg-red-50', icon: 'text-red-600', badge: 'bg-red-100 text-red-700' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
};

export default function StatCard({ label, value, icon, trend, color = 'blue', loading }: StatCardProps) {
  const c = colorMap[color];

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="h-3 w-20 bg-slate-200 rounded" />
            <div className="h-8 w-28 bg-slate-200 rounded" />
          </div>
          <div className="size-11 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:shadow-slate-100 transition-shadow duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
          {trend && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${
                trend.value >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                <Icon name={trend.value >= 0 ? 'ArrowUpIcon' : 'ArrowDownIcon'} size={10} />
                {Math.abs(trend.value)}%
              </span>
              <span className="text-[10px] text-slate-400">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`size-11 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon name={icon} size={20} className={c.icon} />
        </div>
      </div>
    </motion.div>
  );
}
