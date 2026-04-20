'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, ShieldCheck, CheckCircle, MapPin, Camera } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Permission = 'location' | 'camera' | 'notifications'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'form' | 'permissions'>('form')
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', dateOfBirth: '' })
  const [permissions, setPermissions] = useState<Record<Permission, 'granted' | 'denied' | 'pending'>>({
    location: 'pending',
    camera: 'pending',
    notifications: 'pending',
  })

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleRegister = async () => {
    if (!form.fullName || !form.email || !form.phone || !form.password) {
      setError('Please fill in all required fields')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setError('')
    setStep('permissions')
  }

  const requestPermission = async (type: Permission) => {
    try {
      if (type === 'location') {
        navigator.geolocation.getCurrentPosition(
          () => setPermissions(p => ({ ...p, location: 'granted' })),
          () => setPermissions(p => ({ ...p, location: 'denied' }))
        )
      } else if (type === 'camera') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach(t => t.stop())
        setPermissions(p => ({ ...p, camera: 'granted' }))
      } else if (type === 'notifications') {
        if ('Notification' in window) {
          const result = await Notification.requestPermission()
          setPermissions(p => ({ ...p, notifications: result === 'granted' ? 'granted' : 'denied' }))
        } else {
          setPermissions(p => ({ ...p, notifications: 'denied' }))
        }
      }
    } catch {
      setPermissions(p => ({ ...p, [type]: 'denied' }))
    }
  }

  const denyPermission = (type: Permission) => {
    setPermissions(p => ({ ...p, [type]: 'denied' }))
  }

 const completeRegistration = async () => {
  setLoading(true)
  setError('')
  try {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          phone: form.phone,
          date_of_birth: form.dateOfBirth,
        },
        // No email redirect needed since we disabled email confirmation
        emailRedirectTo: undefined,
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      setStep('form')
      return
    }

    if (data.user) {
      // Check if email confirmation is required
      if (data.user.identities?.length === 0) {
        setError('An account with this email already exists. Please sign in instead.')
        setLoading(false)
        setStep('form')
        return
      }

      // Profile is created automatically by the database trigger
      // But also try to upsert manually as backup
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        role: 'patient',
      }, { onConflict: 'id' })

      setSuccess(true)

      // If session exists (email confirmation OFF), redirect immediately
      if (data.session) {
        setTimeout(() => router.push('/patient-dashboard'), 1500)
      } else {
        // Email confirmation is ON — show message
        setTimeout(() => router.push('/login'), 3000)
      }
    }
  } catch {
    setError('Something went wrong. Please try again.')
    setStep('form')
  } finally {
    setLoading(false)
  }
}

  const allPermissionsDecided = Object.values(permissions).every(p => p !== 'pending')

  if (success) {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0F14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '40px', maxWidth: '400px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(6,214,160,0.15)', border: '1px solid #06D6A0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle size={36} style={{ color: '#06D6A0' }} />
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.8rem', marginBottom: '10px' }}>Account Created!</h2>
        <p style={{ color: '#8896A7', marginBottom: '8px' }}>Welcome to Vital Medicare, {form.fullName.split(' ')[0]}!</p>
        <p style={{ color: '#2d9cdb', fontSize: '13px' }}>Redirecting you now...</p>
      </div>
    </div>
  )
}
  // Permissions step
  if (step === 'permissions') {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0F14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,156,219,0.05) 0%, transparent 70%)' }}/>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none"><rect x="12" y="4" width="8" height="24" rx="4" fill="white"/><rect x="4" y="12" width="24" height="8" rx="4" fill="white"/></svg>
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>App Permissions</h2>
            <p style={{ color: '#8896A7', fontSize: '14px', lineHeight: 1.6 }}>Allow Vital Medicare to access these features for the best experience</p>
          </div>

          <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '20px', padding: '28px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { key: 'location' as Permission, icon: MapPin, title: 'Location Access', desc: 'To show nearest delivery options and find your address automatically', color: '#2d9cdb' },
                { key: 'camera' as Permission, icon: Camera, title: 'Camera Access', desc: 'To take photos of prescriptions for quick upload', color: '#06D6A0' },
                { key: 'notifications' as Permission, icon: Bell, title: 'Notifications', desc: 'To remind you about medication refills and order updates', color: '#F4A261' },
              ].map(({ key, icon: Icon, title, desc, color }) => (
                <div key={key} style={{ background: '#0A0F14', border: `1px solid ${permissions[key] === 'granted' ? `${color}40` : permissions[key] === 'denied' ? 'rgba(239,35,60,0.2)' : 'rgba(45,156,219,0.1)'}`, borderRadius: '12px', padding: '16px', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: permissions[key] === 'pending' ? '12px' : '0' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} style={{ color }}/>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>{title}</div>
                      <div style={{ color: '#8896A7', fontSize: '11px', lineHeight: 1.5 }}>{desc}</div>
                    </div>
                    {permissions[key] !== 'pending' && (
                      <div style={{ padding: '4px 10px', borderRadius: '50px', fontSize: '10px', fontWeight: 700, background: permissions[key] === 'granted' ? `${color}15` : 'rgba(239,35,60,0.1)', color: permissions[key] === 'granted' ? color : '#EF233C' }}>
                        {permissions[key] === 'granted' ? '✓ Allowed' : '✗ Denied'}
                      </div>
                    )}
                  </div>
                  {permissions[key] === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px', paddingLeft: '48px' }}>
                      <button onClick={() => requestPermission(key)}
                        style={{ flex: 1, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: '8px', padding: '8px', cursor: 'pointer', color, fontSize: '12px', fontWeight: 600 }}>
                        Allow
                      </button>
                      <button onClick={() => denyPermission(key)}
                        style={{ flex: 1, background: 'rgba(239,35,60,0.08)', border: '1px solid rgba(239,35,60,0.2)', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#EF233C', fontSize: '12px', fontWeight: 500 }}>
                        Deny
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button onClick={completeRegistration} disabled={!allPermissionsDecided || loading}
            style={{ width: '100%', background: allPermissionsDecided ? 'linear-gradient(135deg, #2d9cdb, #1a7ab8)' : 'rgba(45,156,219,0.3)', color: 'white', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '14px', fontWeight: 700, cursor: allPermissionsDecided ? 'pointer' : 'not-allowed', boxShadow: allPermissionsDecided ? '0 0 20px rgba(45,156,219,0.25)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            {loading ? 'Creating account...' : <><ArrowRight size={16}/> Complete Registration</>}
          </button>
          {!allPermissionsDecided && (
            <p style={{ textAlign: 'center', color: '#8896A7', fontSize: '12px' }}>Please respond to all permission requests above</p>
          )}
        </div>
      </div>
    )
  }

  // Registration form
  return (
    <div style={{ minHeight: '100vh', background: '#0A0F14', display: 'flex', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,156,219,0.06) 0%, transparent 70%)', pointerEvents: 'none' }}/>

      {/* Left panel */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #141C24, #0A0F14)', borderRight: '1px solid rgba(45,156,219,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px' }} className="register-left">
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '60px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><rect x="12" y="4" width="8" height="24" rx="4" fill="white"/><rect x="4" y="12" width="24" height="8" rx="4" fill="white"/></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.1rem', fontWeight: 700 }}>Vital Medicare</div>
            <div style={{ color: '#2d9cdb', fontSize: '9px', letterSpacing: '0.1em' }}>PHARMACEUTICALS LTD.</div>
          </div>
        </Link>
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '16px', lineHeight: 1.2 }}>
          Join Nigeria&apos;s Premier<br/><span style={{ color: '#2d9cdb' }}>Digital Pharmacy</span>
        </h1>
        <p style={{ color: '#8896A7', fontSize: '15px', lineHeight: 1.75, marginBottom: '40px', maxWidth: '380px' }}>
          Access NAFDAC-verified medications, upload prescriptions, and get same-day delivery in Abuja.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { text: 'NAFDAC & PCN certified pharmacy', color: '#2d9cdb' },
            { text: '12,000+ patients trust us', color: '#06D6A0' },
            { text: 'Same-day delivery across Maiduguri', color: '#F4A261' },
            { text: 'Licensed pharmacists 24/7', color: '#2d9cdb' },
          ].map(({ text, color }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={15} style={{ color, flexShrink: 0 }}/>
              <span style={{ color: '#8896A7', fontSize: '14px' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ width: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 48px', flexShrink: 0, overflowY: 'auto' }} className="register-right">
        <div style={{ width: '100%' }}>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.8rem', fontWeight: 700, marginBottom: '6px' }}>Create Account</h2>
            <p style={{ color: '#8896A7', fontSize: '14px' }}>Join 12,000+ patients on Vital Medicare</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,35,60,0.1)', border: '1px solid rgba(239,35,60,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#EF233C', fontSize: '13px' }}>
              ⚠ {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            {[
              { label: 'Full Name *', key: 'fullName', type: 'text', icon: User, placeholder: 'Shareef Ahmed' },
              { label: 'Email Address *', key: 'email', type: 'email', icon: Mail, placeholder: 'your@email.com' },
              { label: 'Phone Number *', key: 'phone', type: 'tel', icon: Phone, placeholder: '+234 814 904 5538' },
              { label: 'Date of Birth', key: 'dateOfBirth', type: 'date', icon: User, placeholder: '' },
            ].map(({ label, key, type, icon: Icon, placeholder }) => (
              <div key={key}>
                <label style={{ display: 'block', color: '#E0E6ED', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>{label}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#141C24', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '10px', padding: '11px 14px' }}>
                  <Icon size={15} style={{ color: '#8896A7', flexShrink: 0 }}/>
                  <input type={type} value={form[key as keyof typeof form]} onChange={e => update(key, e.target.value)} placeholder={placeholder}
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: '#E0E6ED', fontFamily: 'Inter, sans-serif', colorScheme: 'dark' }}/>
                </div>
              </div>
            ))}

            <div>
              <label style={{ display: 'block', color: '#E0E6ED', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Password *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#141C24', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '10px', padding: '11px 14px' }}>
                <Lock size={15} style={{ color: '#8896A7', flexShrink: 0 }}/>
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min 8 characters"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: '#E0E6ED', fontFamily: 'Inter, sans-serif' }}/>
                <button onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8896A7', display: 'flex' }}>
                  {showPassword ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: '6px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: form.password.length >= i * 2 ? (form.password.length >= 8 ? '#06D6A0' : '#F4A261') : 'rgba(255,255,255,0.08)' }}/>
                  ))}
                  <span style={{ color: form.password.length >= 8 ? '#06D6A0' : '#F4A261', fontSize: '10px', marginLeft: '6px', whiteSpace: 'nowrap' }}>
                    {form.password.length >= 8 ? '✓ Strong' : 'Too short'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button onClick={handleRegister}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginBottom: '14px', boxShadow: '0 0 20px rgba(45,156,219,0.25)' }}>
            <span>Continue</span><ArrowRight size={17}/>
          </button>

          <p style={{ color: '#8896A7', fontSize: '11px', textAlign: 'center', marginBottom: '18px' }}>
            By registering you agree to our{' '}
            <Link href="/privacy" style={{ color: '#2d9cdb', textDecoration: 'none' }}>Privacy Policy</Link>
          </p>

          <div style={{ textAlign: 'center', borderTop: '1px solid rgba(45,156,219,0.1)', paddingTop: '18px' }}>
            <p style={{ color: '#8896A7', fontSize: '14px' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#2d9cdb', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){.register-left{display:none!important}.register-right{width:100%!important;padding:32px 24px!important}}
      `}</style>
    </div>
  )
}

function Bell({ size, style }: { size: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )
}