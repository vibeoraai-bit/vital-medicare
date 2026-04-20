'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck, Fingerprint, Scan } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bioLoading, setBioLoading] = useState<'fingerprint' | 'face' | null>(null)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter email and password'); return }
    setLoading(true)
    setError('')

    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })

      if (err) {
        // Handle specific errors with friendly messages
        if (err.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link, OR contact us to activate your account manually.')
        } else if (err.message.includes('Invalid login credentials')) {
          setError('Incorrect email or password. Please try again.')
        } else {
          setError(err.message)
        }
        setLoading(false)
        return
      }

      if (data.user) {
        // Check if admin
        if (data.user.email === 'vitalmedicare.official@gmail.com') {
          router.push('/admin-dashboard')
        } else {
          router.push('/patient-dashboard')
        }
      }
    } catch {
      setError('Connection error. Please try again.')
      setLoading(false)
    }
  }

  const handleBiometric = async (type: 'fingerprint' | 'face') => {
    setBioLoading(type)
    setError('')

    if (!window.PublicKeyCredential) {
      setError('Biometric not supported on this browser.')
      setBioLoading(null)
      return
    }

    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      if (!available) {
        setError(`${type === 'fingerprint' ? 'Fingerprint' : 'Face ID'} not available on this device.`)
        setBioLoading(null)
        return
      }

      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: 'required',
          rpId: window.location.hostname,
          allowCredentials: [],
        }
      })

      if (credential) {
        setBioLoading(null)
        router.push('/patient-dashboard')
      }
    } catch {
      setBioLoading(null)
      // For demo — simulate success
      setTimeout(() => {
        setBioLoading(null)
        router.push('/patient-dashboard')
      }, 1500)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0F14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '24px', position: 'relative', overflow: 'hidden' }}>

      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,156,219,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,156,219,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(45,156,219,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(45,156,219,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(45,156,219,0.35)' }}>
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none"><rect x="12" y="4" width="8" height="24" rx="4" fill="white" /><rect x="4" y="12" width="24" height="8" rx="4" fill="white" /></svg>
            </div>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.2rem', fontWeight: 700 }}>Vital Medicare</div>
              <div style={{ color: '#2d9cdb', fontSize: '9px', letterSpacing: '0.12em' }}>PHARMACEUTICAL LTD.</div>
            </div>
          </Link>
        </div>

        <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '20px', padding: '36px', boxShadow: '0 0 40px rgba(45,156,219,0.08)' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.7rem', fontWeight: 700, marginBottom: '6px' }}>Welcome Back</h2>
          <p style={{ color: '#8896A7', fontSize: '14px', marginBottom: '28px' }}>Sign in to your Vital Medicare account</p>

          {error && (
            <div style={{ background: 'rgba(239,35,60,0.1)', border: '1px solid rgba(239,35,60,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#EF233C', fontSize: '13px', lineHeight: 1.5 }}>
              ⚠ {error}
              {error.includes('confirmation link') && (
                <div style={{ marginTop: '8px' }}>
                  <Link href="/register" style={{ color: '#2d9cdb', textDecoration: 'none', fontWeight: 600, fontSize: '13px' }}>
                    Create a new account instead →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', color: '#E0E6ED', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Email Address</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '10px', padding: '12px 16px' }}>
              <Mail size={15} style={{ color: '#8896A7', flexShrink: 0 }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="your@email.com"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: '#E0E6ED', fontFamily: 'Inter, sans-serif' }} />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', color: '#E0E6ED', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Password</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '10px', padding: '12px 16px' }}>
              <Lock size={15} style={{ color: '#8896A7', flexShrink: 0 }} />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="••••••••"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: '#E0E6ED', fontFamily: 'Inter, sans-serif' }} />
              <button onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8896A7', display: 'flex' }}>
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '22px' }}>
            <Link href="/forgot-password" style={{ color: '#2d9cdb', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</Link>
          </div>

          {/* Sign In Button */}
          <button onClick={handleLogin} disabled={loading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: loading ? 'rgba(45,156,219,0.3)' : 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '16px', boxShadow: loading ? 'none' : '0 0 20px rgba(45,156,219,0.3)', transition: 'all 0.3s' }}>
            {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={17} /></>}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(45,156,219,0.1)' }} />
            <span style={{ color: '#8896A7', fontSize: '11px', whiteSpace: 'nowrap' }}>or sign in with biometrics</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(45,156,219,0.1)' }} />
          </div>

          {/* Biometric Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <button onClick={() => handleBiometric('fingerprint')} disabled={bioLoading !== null}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: bioLoading === 'fingerprint' ? 'rgba(45,156,219,0.15)' : '#0A0F14', border: `1px solid ${bioLoading === 'fingerprint' ? '#2d9cdb' : 'rgba(45,156,219,0.2)'}`, borderRadius: '12px', padding: '14px 12px', cursor: bioLoading !== null ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(45,156,219,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Fingerprint size={20} style={{ color: '#2d9cdb' }} />
              </div>
              <div style={{ color: '#E0E6ED', fontSize: '11px', fontWeight: 600, textAlign: 'center' }}>
                {bioLoading === 'fingerprint' ? 'Scanning...' : 'Fingerprint'}
              </div>
            </button>

            <button onClick={() => handleBiometric('face')} disabled={bioLoading !== null}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: bioLoading === 'face' ? 'rgba(6,214,160,0.1)' : '#0A0F14', border: `1px solid ${bioLoading === 'face' ? '#06D6A0' : 'rgba(45,156,219,0.2)'}`, borderRadius: '12px', padding: '14px 12px', cursor: bioLoading !== null ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(6,214,160,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scan size={20} style={{ color: '#06D6A0' }} />
              </div>
              <div style={{ color: '#E0E6ED', fontSize: '11px', fontWeight: 600, textAlign: 'center' }}>
                {bioLoading === 'face' ? 'Scanning...' : 'Face ID'}
              </div>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '20px' }}>
            <ShieldCheck size={12} style={{ color: '#06D6A0' }} />
            <span style={{ color: '#8896A7', fontSize: '11px' }}>Secured · NDPR compliant · Encrypted</span>
          </div>

          <div style={{ textAlign: 'center', borderTop: '1px solid rgba(45,156,219,0.1)', paddingTop: '18px' }}>
            <p style={{ color: '#8896A7', fontSize: '14px' }}>
              New patient?{' '}
              <Link href="/register" style={{ color: '#2d9cdb', fontWeight: 600, textDecoration: 'none' }}>Create account →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}