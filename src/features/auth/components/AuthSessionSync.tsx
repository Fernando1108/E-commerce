'use client';

import { useEffect } from 'react';
import { hasAuthCookie } from '@/features/auth/utils/auth-cookie';
import { useAuthStore } from '@/store/auth-store';

export default function AuthSessionSync() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const cookieExists = hasAuthCookie();

    if (!cookieExists) {
      logout();
      return;
    }

    if (!user && !isAuthenticated) {
      restoreSession();
    }
  }, [isAuthenticated, logout, restoreSession, user]);

  return null;
}
