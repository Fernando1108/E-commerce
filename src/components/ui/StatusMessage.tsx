'use client';

import React from 'react';

export type StatusMessageProps = {
  message: string | null;
  type: 'success' | 'error';
};

export default function StatusMessage({ message, type }: StatusMessageProps) {
  if (!message) return null;
  const cls =
    type === 'success'
      ? 'border-[#D8E4FF] bg-[#EFF6FF] text-[#2563EB]'
      : 'border-[#F1C8C2] bg-[#FFF7F5] text-[#C33D2F]';
  return <div className={`border px-4 py-3 text-sm leading-relaxed ${cls}`}>{message}</div>;
}
