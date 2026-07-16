import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Strip locale from pathname for easier checking (e.g. /en/admin -> /admin)
  const pathnameWithoutLocale = pathname.replace(/^\/(en|az|ru)/, '') || '/';
  
  // Protect /admin and /demo routes
  if (pathnameWithoutLocale.startsWith('/admin') || pathnameWithoutLocale.startsWith('/demo')) {
    const userRole = request.cookies.get('userRole')?.value;
    
    if (!userRole || (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
      const url = request.nextUrl.clone();
      url.pathname = `/${pathname.match(/^\/(en|az|ru)/)?.[1] || 'en'}/login`;
      return NextResponse.redirect(url);
    }
  }
  
  // Protect /dashboard routes
  if (pathnameWithoutLocale.startsWith('/dashboard')) {
    const userRole = request.cookies.get('userRole')?.value;
    
    if (!userRole) {
      const url = request.nextUrl.clone();
      url.pathname = `/${pathname.match(/^\/(en|az|ru)/)?.[1] || 'en'}/login`;
      return NextResponse.redirect(url);
    }
  }

  // Handle i18n routing for all other requests
  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/', '/(az|en|ru)/:path*']
};
