import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Frontend ONLY checks a generic backend session cookie
  const hasSession = request.cookies.has('eloco_session');

  // Admin protection
  // DISABLED FOR CROSS-DOMAIN AUTH (Railway Backend + Vercel Frontend)
  // Middleware cannot see cookies set by Backend on a different domain.
  // We rely on Client-Side Layout Protection in app/(dashboard)/admin/layout.tsx
  // if (pathname.startsWith('/admin') && !hasSession) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // Auth-required pages
  const protectedPaths = ['/dashboard', '/profile', '/orders'];
  if (protectedPaths.some((p) => pathname.startsWith(p)) && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Prevent logged-in users accessing login/register
  if (hasSession && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
