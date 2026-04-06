import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE } from '@/features/auth/constants';

const PROTECTED_PATHS = ['/checkout', '/profile'];
const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password'];

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAuthenticated =
    request.cookies.get(AUTH_COOKIE_NAME)?.value === AUTH_COOKIE_VALUE;

  if (isAuthPath(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/homepage', request.url));
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (isAuthenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/auth/login', request.url);
  loginUrl.searchParams.set('redirect', `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/checkout/:path*',
    '/profile/:path*',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
  ],
};
