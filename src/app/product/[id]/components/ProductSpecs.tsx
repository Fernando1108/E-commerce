'use client';

import React from 'react';
import { motion } from 'framer-motion';

type ProductSpecsProps = {
  specs: Record<string, string>;
};

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  const entries = Object.entries(specs);
  if (entries.length === 0) return null;

  return (
    <div className="max-w-2xl">
      <p className="label-eyebrow text-[#8A8A8A] mb-6">Especificaciones técnicas</p>
      <div className="divide-y divide-[#DDD9D3] border border-[#DDD9D3]">
        {entries.map(([label, value], i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className={`flex items-start gap-4 px-6 py-4 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F7F5]'}`}
          >
            <span className="text-[11px] font-black uppercase tracking-widest text-[#8A8A8A] w-44 shrink-0 pt-0.5">
              {label}
            </span>
            <span className="text-[14px] text-[#1C1C1C] font-500">{value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
