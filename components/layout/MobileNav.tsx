'use client'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, ClipboardList, LayoutDashboard, User, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function MobileNav() {
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const ADMIN_EMAIL = 'vitalmedicare.official@gmail.com'

  useEffect(() => {
    // Cart count from localStorage
    const updateCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('vm_cart') || '[]')
        setCartCount(cart.reduce((s: number, i: { qty: number }) => s + i.qty, 0))
      } catch { }
    }
    updateCart()
    window.addEventListener('storage', updateCart)
    window.addEventListener('cartUpdated', updateCart)

    // Check admin
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAdmin(user?.email === ADMIN_EMAIL)
    })

    return () => {
      window.removeEventListener('storage', updateCart)
      window.removeEventListener('cartUpdated', updateCart)
    }
  }, [])

  // Hide on auth pages
  if (pathname?.startsWith('/login') || pathname?.startsWith('/register')) return null

  const links = [
    { href: '/shop', icon: ShoppingBag, label: 'Shop' },
    { href: '/orders', icon: ClipboardList, label: 'Orders' },
    { href: '/patient-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    isAdmin
      ? { href: '/admin-dashboard', icon: Shield, label: 'Admin' }
      : { href: '/settings', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe"
      style={{ background: 'rgba(13,21,38,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(45,156,219,0.15)' }}>
      <div className="flex justify-around items-center py-2">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname?.startsWith(href)
          return (
            <Link key={href} href={href}
              className="flex flex-col items-center gap-1 px-4 py-2 relative"
              style={{ color: active ? '#2d9cdb' : '#8896A7', transition: 'color 0.2s' }}>
              <div className="relative">
                <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                {href === '/shop' && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
              {active && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ background: '#2d9cdb' }} />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}