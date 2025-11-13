import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If environment variables are missing, allow all requests to pass through
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables missing in middleware - allowing all requests');
    return response;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Check if user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser();
    
    // If there's an error getting user, allow request to proceed
    if (error) {
      console.warn('Error getting user in middleware:', error.message);
      return response;
    }
    
    // Allow public access to dashboard (main page)
    // Only protect specific routes that require authentication
    const protectedRoutes = ['/dashboard/settings'];
    const isProtectedRoute = protectedRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    );

    // If not authenticated and trying to access protected routes, redirect to login
    if (!user && isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If authenticated and trying to access auth pages, redirect to dashboard
    if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;
  } catch (error) {
    // If any error occurs in middleware, log it and allow the request to proceed
    console.error('Middleware error:', error);
    return response;
  }
}

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