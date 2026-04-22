import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const host = req.nextUrl.hostname;

  if (
    host === 'myposha.com' ||
    host === 'calorieai-omega.vercel.app'
  ) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.hostname = 'www.myposha.com';
    redirectUrl.protocol = 'https:';
    return NextResponse.redirect(redirectUrl, 308);
  }

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
