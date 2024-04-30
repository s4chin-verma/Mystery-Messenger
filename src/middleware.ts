import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export { default } from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  if (
    token &&
    (url.pathname.startsWith('/auth/signin') ||
      url.pathname.startsWith('/signup') ||
      url.pathname.startsWith('/verify'))
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: [
    '/auth/signin',
    '/auth/signup',
    '/',
    '/dashboard/:path*',
    '/verify/:path*',
  ],
};
