import { withAuth } from 'next-auth/middleware';
import { NextResponse, type NextRequest } from 'next/server';

export default withAuth(
  async function middleware(req) {
    // Existing authentication logic for admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (req.nextauth.token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // For all other cases, continue as normal
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // This callback determines if the user is authorized to access the page.
        // If accessing an admin route, token must exist and have 'admin' role.
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token && token.role === 'admin';
        }

        // For any other route, access is always granted (public pages).
        return true;
      },
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
