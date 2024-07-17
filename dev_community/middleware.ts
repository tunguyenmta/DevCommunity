import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
// Define base paths for protected routes
const protectedBasePaths = ['/posts', '/components', '/books', '/editProfile'];

export function middleware(request: NextRequest) {
  const cookieStore = cookies()
  const token = cookieStore.get('userToken')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedBasePaths.some(basePath => pathname.startsWith(basePath));
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  // NextResponse.next();

  // Continue with the request if it's not a protected route or if a token is present
}