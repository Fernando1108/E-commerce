'use client';

import React from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

export type AuthFieldProps = {
  label: string;
  type: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: { message?: string };
  className?: string;
};

export default function AuthField({
  label,
  type,
  placeholder,
  registration,
  error,
  className,
}: AuthFieldProps) {
  return (
    <label className={className ?? 'block'}>
      <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-[#5A5A5A]">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        {...registration}
        className={`h-14 w-full border px-4 text-[15px] text-[#1C1C1C] outline-none transition ${
          error
            ? 'border-[#C33D2F] bg-[#FFF7F5] focus:border-[#C33D2F]'
            : 'border-[#DDD9D3] bg-[#FCFBF9] focus:border-[#1C1C1C] focus:bg-white'
        }`}
      />
      {error?.message && <span className="mt-2 block text-sm text-[#C33D2F]">{error.message}</span>}
    </label>
  );
}
