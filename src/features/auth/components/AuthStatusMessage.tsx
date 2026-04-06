import React from 'react';
import type { AuthStatus } from '@/features/auth/types';

type AuthStatusMessageProps = {
  status: AuthStatus;
  message: string | null;
};

export default function AuthStatusMessage({ status, message }: AuthStatusMessageProps) {
  if (!message || status === 'idle') {
    return null;
  }

  const toneClass =
    status === 'success'
      ? 'border-[#D8E4FF] bg-[#EFF6FF] text-[#2563EB]'
      : 'border-[#F1C8C2] bg-[#FFF7F5] text-[#C33D2F]';

  return (
    <div className={`border px-4 py-3 text-sm leading-relaxed ${toneClass}`}>
      {message}
    </div>
  );
}
