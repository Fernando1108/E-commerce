'use client';

import { AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE } from '@/features/auth/constants';

export function hasAuthCookie() {
  return document.cookie
    .split('; ')
    .some((cookie) => cookie === `${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}`);
}

export function setAuthCookie() {
  document.cookie = `${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}; path=/; samesite=lax`;
}

export function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;
}
