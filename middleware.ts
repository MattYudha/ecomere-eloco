import { withAuth } from "next-auth/middleware";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/utils/db";
import { createHash } from "crypto";

// Hashes a string using SHA-256
function hash(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

async function logVisitor(req: NextRequest) {
  // Exclude requests for static files, images, and API routes from being logged
  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/assets') || pathname === '/favicon.ico') {
    return;
  }

  try {
    const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
    const userAgent = req.headers.get("user-agent") ?? "unknown";

    // Simple bot detection
    if (userAgent.toLowerCase().includes("bot")) {
      return;
    }
    
    const ipHash = hash(ip);
    
    // Fire-and-forget the database call
    prisma.visitorLog.create({
      data: {
        ipHash: ipHash,
        userAgent: userAgent,
      },
    }).catch(err => {
      console.error("Error logging visitor in background:", err);
    });

  } catch (error) {
    console.error("Failed to log visitor:", error);
  }
}


export default withAuth(
  async function middleware(req: NextRequest) {
    // We run the visitor logging logic and auth logic.
    // We don't await logVisitor to avoid blocking the request.
    logVisitor(req);

    // Existing authentication logic for admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (req.nextauth.token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
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
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token && token.role === "admin";
        }
        
        // For any other route, access is always granted (public pages).
        return true;
      },
    },
  }
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
