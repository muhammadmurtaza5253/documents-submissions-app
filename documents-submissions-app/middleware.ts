import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user has auth token in cookies
  // const authToken = request.cookies.get('auth-token')?.value;
  let userLoggedIn = false;
  try {
    userLoggedIn = Boolean(request.cookies.get('userLoggedIn')?.value);
  } catch (_) {
    userLoggedIn = false;
  }
  
  // Allow access to login page and public assets
  if (pathname.startsWith('/login') || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp)$/)) {
    return NextResponse.next();
  }
  
  // If no auth token and trying to access protected route, redirect to login
  if (!userLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

