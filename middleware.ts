import { NextRequest, NextResponse } from 'next/server';
import {
  NATIONWIDE_HEADER_VALUE,
  VISITOR_STATE_COOKIE,
  VISITOR_STATE_HEADER,
  resolveVisitorLocation,
} from '@/lib/visitor-location';

const COOKIE_MAX_AGE = 60 * 60; // 1 hour — keeps a ?state= override across in-site clicks

export function middleware(request: NextRequest) {
  const stateParam = request.nextUrl.searchParams.get('state');
  const location = resolveVisitorLocation({
    stateParam,
    cookieState: request.cookies.get(VISITOR_STATE_COOKIE)?.value,
    country: request.headers.get('x-vercel-ip-country'),
    region: request.headers.get('x-vercel-ip-country-region'),
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    VISITOR_STATE_HEADER,
    location.hasValidUSState && location.visitorStateAbbreviation
      ? location.visitorStateAbbreviation
      : NATIONWIDE_HEADER_VALUE,
  );

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set('Vary', 'x-vercel-ip-country, x-vercel-ip-country-region');

  if (stateParam !== null) {
    if (location.hasValidUSState && location.visitorStateAbbreviation) {
      response.cookies.set(VISITOR_STATE_COOKIE, location.visitorStateAbbreviation, {
        path: '/',
        maxAge: COOKIE_MAX_AGE,
        sameSite: 'lax',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
    } else {
      // Invalid or empty ?state= drops any previous override.
      response.cookies.delete(VISITOR_STATE_COOKIE);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico|woff2?)$).*)',
  ],
};
