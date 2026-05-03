'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'vitalmedicare.official@gmail.com'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/patient-dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Check if already logged in
  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        if (session.user.email === ADMIN_EMAIL) {
          window.location.href = '/admin-dashboard'
        } else {
          window.location.href = redirect
        }
      }
    }
    check()
  }, [])

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!email.trim()) { setError('Please enter your email address'); return }
    if (!password) { setError('Please enter your password'); return }

    setError('')
    setLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Wrong email or password. Please check and try again.')
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Please verify your email address first. Check your inbox.')
        } else if (authError.message.includes('Too many requests')) {
          setError('Too many login attempts. Please wait a few minutes.')
        } else {
          setError(authError.message || 'Login failed. Please try again.')
        }
        setLoading(false)
        return
      }

      if (!data?.user) {
        setError('Login failed. Please try again.')
        setLoading(false)
        return
      }

      // Use window.location for hard redirect — fixes Next.js 16 session cookie issue
      if (data.user.email === ADMIN_EMAIL) {
        window.location.href = '/admin-dashboard'
      } else {
        window.location.href = redirect.startsWith('/') ? redirect : '/patient-dashboard'
      }

    } catch (err) {
      console.error('Login error:', err)
      setError('Something went wrong. Please check your internet connection.')
      setLoading(false)
    }
  }

  // ── STYLES ──
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(10,15,20,0.8)',
    border: '1.5px solid rgba(45,156,219,0.2)',
    borderRadius: 12,
    padding: '14px 14px 14px 44px',
    fontSize: isMobile ? 16 : 14, // 16px prevents iOS zoom
    color: '#E0E6ED',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    WebkitAppearance: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0F14',
      display: 'flex',
      fontFamily: 'DM Sans, -apple-system, sans-serif',
      color: '#E0E6ED',
    }}>

      {/* ── LEFT PANEL (desktop only) ── */}
      {!isMobile && (
        <div style={{
          width: 460,
          flexShrink: 0,
          background: 'linear-gradient(160deg, #0D1F3C 0%, #0A1628 55%, #060B14 100%)',
          padding: '48px 52px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -100, right: -80, width: 350, height: 350, borderRadius: '50%', background: 'rgba(45,156,219,0.05)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(45,156,219,0.04)', pointerEvents: 'none' }} />

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(45,156,219,0.35)', flexShrink: 0 }}>
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                <rect x="12" y="4" width="8" height="24" rx="4" fill="white" />
                <rect x="4" y="12" width="24" height="8" rx="4" fill="white" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#E0E6ED', fontSize: '1.15rem', fontWeight: 700, lineHeight: 1 }}>Vital Medicare</div>
              <div style={{ color: '#2d9cdb', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}>Pharmaceutical Ltd.</div>
            </div>
          </Link>

          {/* Headline */}
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#E0E6ED', fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.2, marginBottom: 18 }}>
              Nigeria's Premier<br />
              <span style={{ color: '#2d9cdb' }}>Digital Pharmacy</span>
            </h1>
            <p style={{ color: '#8896A7', fontSize: '15px', lineHeight: 1.8, marginBottom: 40 }}>
              NAFDAC-certified medications, uploaded prescriptions, and same-day delivery across Abuja.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['🏥', 'NAFDAC & PCN certified'],
                ['🚚', 'Same-day delivery in Abuja'],
                ['👨‍⚕️', 'Licensed pharmacists 24/7'],
                ['📱', 'Works offline on your phone'],
                ['🔒', 'Your data is fully protected'],
              ].map(([emoji, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{emoji}</span>
                  <span style={{ color: '#8896A7', fontSize: '13px', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ color: '#334155', fontSize: '12px' }}>
            © 2026 Vital Medicare & Pharmaceutical Ltd. · Maitama, Abuja
          </p>
        </div>
      )}

      {/* ── RIGHT PANEL — LOGIN FORM ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '40px 20px' : '32px 48px',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Mobile logo */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, justifyContent: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(45,156,219,0.3)' }}>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  <rect x="12" y="4" width="8" height="24" rx="4" fill="white" />
                  <rect x="4" y="12" width="24" height="8" rx="4" fill="white" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#E0E6ED', fontSize: '1.1rem', fontWeight: 700 }}>Vital Medicare</div>
                <div style={{ color: '#2d9cdb', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Pharmaceutical Ltd.</div>
              </div>
            </div>
          )}

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#E0E6ED', fontSize: isMobile ? '1.8rem' : '2rem', fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>
              Welcome back 👋
            </h2>
            <p style={{ color: '#8896A7', fontSize: 14, lineHeight: 1.6 }}>
              Sign in to your Vital Medicare account
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(239,35,60,0.08)', border: '1px solid rgba(239,35,60,0.25)', borderRadius: 12, padding: '13px 16px', marginBottom: 22 }}>
              <AlertCircle size={17} style={{ color: '#EF233C', flexShrink: 0, marginTop: 1 }} />
              <span style={{ color: '#EF233C', fontSize: 13, lineHeight: 1.55 }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#E0E6ED', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8896A7', pointerEvents: 'none' }} />
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="your@email.com"
                  required
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#2d9cdb'; e.target.style.boxShadow = '0 0 0 3px rgba(45,156,219,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(45,156,219,0.2)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ color: '#E0E6ED', fontSize: 13, fontWeight: 600 }}>Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8896A7', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="Your password"
                  required
                  style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={e => { e.target.style.borderColor = '#2d9cdb'; e.target.style.boxShadow = '0 0 0 3px rgba(45,156,219,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(45,156,219,0.2)'; e.target.style.boxShadow = 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8896A7', padding: 4, display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                background: loading ? 'rgba(45,156,219,0.35)' : 'linear-gradient(135deg, #2d9cdb, #1a7ab8)',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                padding: isMobile ? '16px' : '15px',
                fontSize: isMobile ? 16 : 15,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(45,156,219,0.28)',
                transition: 'all 0.2s',
                WebkitAppearance: 'none',
                marginBottom: 20,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />
                  Signing in...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Sign In to My Account
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <p style={{ textAlign: 'center', color: '#8896A7', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: '#2d9cdb', fontWeight: 700, textDecoration: 'none' }}>
              Create account →
            </Link>
          </p>

          {/* Admin hint box */}
          <div style={{ marginTop: 28, padding: '14px 18px', background: 'rgba(45,156,219,0.06)', border: '1px solid rgba(45,156,219,0.15)', borderRadius: 12 }}>
            <p style={{ color: '#2d9cdb', fontSize: 12, fontWeight: 700, marginBottom: 5 }}>🔐 Admin Access</p>
            <p style={{ color: '#8896A7', fontSize: 12, lineHeight: 1.65 }}>
              Admin users are automatically redirected to the admin dashboard after signing in.
            </p>
          </div>

          {/* Terms */}
          <p style={{ textAlign: 'center', color: '#334155', fontSize: 11, marginTop: 24, lineHeight: 1.6 }}>
            By signing in you agree to our{' '}
            <Link href="/privacy" style={{ color: '#8896A7', textDecoration: 'none' }}>Privacy Policy</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0A0F14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} style={{ color: '#2d9cdb', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}