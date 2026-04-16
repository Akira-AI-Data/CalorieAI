import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Allow auth API routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Allow public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icons') ||
    pathname === '/sw.js' ||
    pathname === '/manifest.json'
  ) {
    return NextResponse.next();
  }

  // Public pages accessible to everyone
  const publicPages = ['/', '/pricing', '/login'];
  const isPublicPage = publicPages.includes(pathname);

  // Redirect logged-in users from landing/login to dashboard
  if ((pathname === '/login' || pathname === '/') && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Allow public pages
  if (isPublicPage) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
