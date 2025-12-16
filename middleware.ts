import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) {
    // Custom logic inside the middleware function if needed
    // Note: The redirection logic is primarily handled by the 'authorized' callback below
    // and the 'pages' config.

    // Allow request to proceed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // 1. Admin Routes Protection
        // Must be authenticated AND have 'admin' role
        if (pathname.startsWith('/admin')) {
          return !!token && token.role === 'admin';
        }

        // 2. Authenticated User Routes Protection
        // Must be authenticated
        const clientProtectedPaths = ['/dashboard', '/profile', '/orders'];
        const isClientProtected = clientProtectedPaths.some((route) =>
          pathname.startsWith(route),
        );

        if (isClientProtected) {
          return !!token;
        }

        // 3. Public Routes (Default)
        // All other routes are public.
        // Explicitly ensuring typical public paths are openly accessible:
        // /, /login, /register, /product/*, /shop/*, /search, /cart, /checkout
        return true;
      },
    },
    pages: {
      signIn: '/login',
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
