import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const PROTECTED = ['/patient-dashboard', '/orders', '/prescriptions', '/appointments', '/medications', '/loyalty', '/settings', '/checkout', '/admin-dashboard', '/rx-review']
  const AUTH_ONLY = ['/login', '/register']

  const isProtected = PROTECTED.some(r => pathname.startsWith(r))
  const isAuthOnly = AUTH_ONLY.includes(pathname)

  if (!isProtected && !isAuthOnly) return NextResponse.next()

  let response = NextResponse.next({ request })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (isProtected && !user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (isAuthOnly && user) {
      const profile = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile.data?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin-dashboard', request.url))
      }
      return NextResponse.redirect(new URL('/patient-dashboard', request.url))
    }
  } catch {
    if (isProtected) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
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
    '/checkout/:path*',
    '/admin-dashboard/:path*',
    '/rx-review/:path*',
    '/login',
    '/register',
  ],
}