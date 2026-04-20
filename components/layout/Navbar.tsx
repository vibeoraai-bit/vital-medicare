'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Menu, X, User, LogOut, Settings, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'vitalmedicare.official@gmail.com'

interface UserProfile {
  email: string | undefined
  full_name: string
  role: string
}

export default function Navbar() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [cartCount] = useState(0)

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()
        setUserProfile({
          email: user.email,
          full_name: profile?.full_name || user.email?.split('@')[0] || 'User',
          role: profile?.role || 'patient',
        })
      }
    }
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase.from('profiles').select('full_name, role').eq('id', session.user.id).single()
          .then(({ data }) => {
            setUserProfile({
              email: session.user.email,
              full_name: data?.full_name || session.user.email?.split('@')[0] || 'User',
              role: data?.role || 'patient',
            })
          })
      } else {
        setUserProfile(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserProfile(null)
    setUserMenuOpen(false)
    router.push('/')
  }

  const isAdmin = userProfile?.email === ADMIN_EMAIL

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(10,15,20,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(45,156,219,0.12)', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '9px', flexShrink: 0 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(45,156,219,0.3)' }}>
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><rect x="12" y="4" width="8" height="24" rx="4" fill="white" /><rect x="4" y="12" width="24" height="8" rx="4" fill="white" /></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1rem', fontWeight: 700, lineHeight: 1 }}>Vital Medicare</div>
            <div style={{ color: '#2d9cdb', fontSize: '7px', letterSpacing: '0.1em', lineHeight: 1.2 }}>PHARMACEUTICAL LTD.</div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, justifyContent: 'center' }} className="nav-desktop">
          {navLinks.map(({ label, href }) => (
            <Link key={label} href={href}
              style={{ color: '#8896A7', fontSize: '13px', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', transition: 'all 0.2s', fontWeight: 500 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#E0E6ED'; (e.currentTarget as HTMLElement).style.background = 'rgba(45,156,219,0.08)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#8896A7'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>

          {/* Cart */}
          <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.15)', color: '#8896A7', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#2d9cdb'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#8896A7'}>
            <ShoppingCart size={16} />
            {cartCount > 0 && (
              <div style={{ position: 'absolute', top: '-5px', right: '-5px', width: '16px', height: '16px', borderRadius: '50%', background: '#EF233C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 700, color: 'white', border: '2px solid #0A0F14' }}>
                {cartCount}
              </div>
            )}
          </Link>

          {/* Admin Icon — ONLY shows when admin email is logged in */}
          {isAdmin && (
            <Link href="/admin-dashboard" title="Admin Dashboard"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(239,35,60,0.1)', border: '1px solid rgba(239,35,60,0.25)', color: '#EF233C', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,35,60,0.18)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,35,60,0.1)'}>
              <Shield size={15} />
            </Link>
          )}

          {/* User Account */}
          {userProfile ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: '#E0E6ED', fontSize: '12px', fontWeight: 500 }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                  {userProfile.full_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="nav-desktop">{userProfile.full_name?.split(' ')[0]}</span>
              </button>

              {userMenuOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#141C24', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '12px', padding: '8px', minWidth: '180px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 1001 }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(45,156,219,0.1)', marginBottom: '6px' }}>
                    <div style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 600 }}>{userProfile.full_name}</div>
                    <div style={{ color: '#8896A7', fontSize: '10px', marginTop: '2px' }}>{userProfile.email}</div>
                  </div>

                  {isAdmin ? (
                    <Link href="/admin-dashboard" onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', textDecoration: 'none', color: '#EF233C', fontSize: '12px', marginBottom: '2px' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,35,60,0.08)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      <Shield size={13} /> Admin Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link href="/patient-dashboard" onClick={() => setUserMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', textDecoration: 'none', color: '#E0E6ED', fontSize: '12px', marginBottom: '2px' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(45,156,219,0.08)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                        <User size={13} /> My Dashboard
                      </Link>
                      <Link href="/settings" onClick={() => setUserMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', textDecoration: 'none', color: '#E0E6ED', fontSize: '12px', marginBottom: '2px' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(45,156,219,0.08)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                        <Settings size={13} /> Settings
                      </Link>
                    </>
                  )}

                  <button onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#EF233C', fontSize: '12px', width: '100%', marginTop: '4px', borderTop: '1px solid rgba(45,156,219,0.08)', paddingTop: '10px' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,35,60,0.06)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href="/login"
                style={{ display: 'flex', alignItems: 'center', padding: '7px 14px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(45,156,219,0.2)', color: '#2d9cdb', textDecoration: 'none', fontSize: '12px', fontWeight: 600, transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(45,156,219,0.08)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                Sign In
              </Link>
              <Link href="/register"
                style={{ display: 'flex', alignItems: 'center', padding: '7px 14px', borderRadius: '8px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', textDecoration: 'none', fontSize: '12px', fontWeight: 700, boxShadow: '0 0 10px rgba(45,156,219,0.25)', transition: 'all 0.2s' }}>
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="nav-mobile"
            style={{ background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#E0E6ED' }}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: '#141C24', borderTop: '1px solid rgba(45,156,219,0.1)', padding: '16px 24px' }}>
          {navLinks.map(({ label, href }) => (
            <Link key={label} href={href} onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '12px 0', color: '#8896A7', fontSize: '14px', textDecoration: 'none', borderBottom: '1px solid rgba(45,156,219,0.06)' }}>
              {label}
            </Link>
          ))}
          {userProfile ? (
            <div style={{ paddingTop: '12px' }}>
              <Link href={isAdmin ? '/admin-dashboard' : '/patient-dashboard'} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '10px 14px', background: 'rgba(45,156,219,0.08)', borderRadius: '8px', color: '#2d9cdb', fontSize: '13px', fontWeight: 600, textDecoration: 'none', marginBottom: '8px', textAlign: 'center' }}>
                {isAdmin ? '⚡ Admin Dashboard' : '👤 My Dashboard'}
              </Link>
              <button onClick={handleLogout}
                style={{ width: '100%', padding: '10px', background: 'rgba(239,35,60,0.1)', borderRadius: '8px', border: 'none', color: '#EF233C', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', paddingTop: '12px' }}>
              <Link href="/login" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '11px', background: 'transparent', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '8px', color: '#2d9cdb', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Sign In</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '11px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', borderRadius: '8px', color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>Register</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media(max-width:768px){.nav-desktop{display:none!important}}
        @media(min-width:769px){.nav-mobile{display:none!important}}
        .nav-mobile{display:none}
      `}</style>
    </nav>
  )
}