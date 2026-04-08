'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: { value: number; label: string };
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  loading?: boolean;
  index?: number;
}

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
  green: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
  red: { bg: 'bg-red-50', icon: 'text-red-600', badge: 'bg-red-100 text-red-700' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
};

export default function StatCard({
  label,
  value,
  icon,
  trend,
  color = 'blue',
  loading,
  index = 0,
}: StatCardProps) {
  const c = colorMap[color];
  const rafRef = useRef<number | null>(null);
  const [displayValue, setDisplayValue] = useState<string | number>(
    typeof value === 'number' ? 0 : value
  );

  // Count-up animation for numeric values
  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplayValue(value);
      return;
    }
    const startTime = performance.now();
    const duration = 900;
    const to = value;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplayValue(Math.round(to * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  if (loading) {
    return (
      <div className="skeleton-shimmer bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-8 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="size-11 bg-slate-100 dark:bg-slate-700 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -2,
        scale: 1.02,
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }}
      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 cursor-default hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-slate-900/60 transition-[box-shadow,background-color,border-color] duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {displayValue}
          </p>
          {trend && (
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${
                  trend.value >= 0
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                }`}
              >
                <Icon name={trend.value >= 0 ? 'ArrowUpIcon' : 'ArrowDownIcon'} size={10} />
                {Math.abs(trend.value)}%
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className={`size-11 rounded-xl ${c.bg} dark:bg-slate-700/50 flex items-center justify-center flex-shrink-0`}
        >
          <Icon name={icon} size={20} className={c.icon} />
        </div>
      </div>
    </motion.div>
  );
}
