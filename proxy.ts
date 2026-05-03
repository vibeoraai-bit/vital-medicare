import { NextRequest, NextResponse } from 'next/server'

const ALWAYS_PUBLIC = [
  '/login',
  '/register',
  '/',
  '/shop',
  '/about',
  '/services',
  '/blog',
  '/contact',
  '/faq',
  '/booking',
  '/track-order',
  '/privacy',
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow public routes
  const isPublic = ALWAYS_PUBLIC.some(r =>
    pathname === r || pathname.startsWith(r + '/') || pathname.startsWith('/api/') || pathname.startsWith('/_next/')
  )
  if (isPublic) return NextResponse.next()

  // Check for Supabase session cookie (any sb- prefixed cookie)
  const cookies = request.cookies.getAll()
  const hasSession = cookies.some(c =>
    c.name.startsWith('sb-') ||
    c.name === 'vm-auth-token' ||
    c.name.includes('supabase-auth')
  )

  if (!hasSession) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.webp|.*\\.ico|.*\\.css|.*\\.js).*)',
  ],
}