import { NextRequest, NextResponse } from 'next/server';
import { getMiddlewareSession } from '@/lib/auth/session-manager';

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  try {
    const { supabase, session, error } = await getMiddlewareSession(req);

    if (error) {
      console.error('Middleware session error:', error);
    }

    // Update response cookies if session was refreshed
    if (session) {
      // The session manager handles cookie setting internally
      // We just need to ensure the response is properly configured
      response = NextResponse.next({
        request: {
          headers: req.headers,
        },
      });
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return response;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
