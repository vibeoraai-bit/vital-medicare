import { NextRequest, NextResponse } from 'next/server'

const PROTECTED = [
  '/patient-dashboard',
  '/orders',
  '/prescriptions',
  '/appointments',
  '/medications',
  '/loyalty',
  '/settings',
  '/admin-dashboard',
  '/rx-review',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED.some(r => pathname.startsWith(r))
  if (!isProtected) return NextResponse.next()

  // Check for Supabase session cookie (any format)
  const cookies = request.cookies.getAll()
  const hasSession = cookies.some(c =>
    c.name.includes('auth-token') ||
    c.name.includes('supabase') ||
    c.name.startsWith('sb-')
  )

  if (!hasSession) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/patient-dashboard/:path*',
    '/orders/:path*',
    '/prescriptions/:path*',
    '/appointments/:path*',
    '/medications/:path*',
    '/loyalty/:path*',
    '/settings/:path*',
    '/admin-dashboard/:path*',
    '/rx-review/:path*',
  ],
}