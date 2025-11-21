import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for route protection and authentication
 * TODO: Implement based on your auth provider
 */

export function middleware(request: NextRequest) {
  // Example: Protect student routes
  if (request.nextUrl.pathname.startsWith('/courses') ||
      request.nextUrl.pathname.startsWith('/assessment')) {
    // TODO: Check authentication status
    // If not authenticated, redirect to login
    // const isAuthenticated = checkAuth(request);
    // if (!isAuthenticated) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
  }

  // Example: Protect admin/instructor routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // TODO: Check role/permissions
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)',
  ],
};
