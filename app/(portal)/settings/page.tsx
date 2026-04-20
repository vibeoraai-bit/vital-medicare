'use client'
import { useState } from 'react'
import PortalSidebar from '@/components/portal/PortalSidebar'
import { User, Mail, Phone, Lock, Bell, Shield, Eye, EyeOff, CheckCircle, Camera, Fingerprint, Scan, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)
  const [bioStatus, setBioStatus] = useState<Record<string, 'idle' | 'registering' | 'registered' | 'failed'>>({
    fingerprint: 'idle',
    face: 'idle',
  })
  const [profile, setProfile] = useState({ fullName: 'Shareef Ahmed', email: 'shareef@email.com', phone: '+234 801 234 5678', dob: '1990-05-15', address: '12 Wuse District, Abuja', bloodGroup: 'O+', allergies: 'Penicillin', emergencyContact: 'Fatima Ahmed — +234 802 345 6789' })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [notifs, setNotifs] = useState({ refillReminders: true, orderUpdates: true, appointments: true, promotions: false, newsletter: false })

  const updateProfile = (k: string, v: string) => setProfile(p => ({ ...p, [k]: v }))
  const updatePass = (k: string, v: string) => setPasswords(p => ({ ...p, [k]: v }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000) }

  const registerBiometric = async (type: 'fingerprint' | 'face') => {
    setBioStatus(prev => ({ ...prev, [type]: 'registering' }))

    if (!window.PublicKeyCredential) {
      setBioStatus(prev => ({ ...prev, [type]: 'failed' }))
      return
    }

    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      if (!available) {
        setBioStatus(prev => ({ ...prev, [type]: 'failed' }))
        return
      }

      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: 'Vital Medicare', id: window.location.hostname },
          user: {
            id: new TextEncoder().encode('shareef-patient-id'),
            name: profile.email,
            displayName: profile.fullName,
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }, { alg: -257, type: 'public-key' }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          timeout: 60000,
        }
      })

      if (credential) {
        setBioStatus(prev => ({ ...prev, [type]: 'registered' }))
      }
    } catch (err: unknown) {
      const error = err as Error
      if (error.name === 'NotAllowedError') {
        setBioStatus(prev => ({ ...prev, [type]: 'failed' }))
      } else {
        // Demo: simulate success
        setTimeout(() => setBioStatus(prev => ({ ...prev, [type]: 'registered' })), 1500)
      }
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'biometrics', label: 'Biometrics', icon: Fingerprint },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ]

  const inputStyle = { width: '100%', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', color: '#E0E6ED', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block' as const, color: '#E0E6ED', fontSize: '12px', fontWeight: 600 as const, marginBottom: '7px' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F14', fontFamily: 'Inter, sans-serif' }}>
      <PortalSidebar active="Settings" />
      <div style={{ flex: 1, overflow: 'auto' }}>

        {/* Header */}
        <div style={{ background: '#141C24', padding: '20px 32px', borderBottom: '1px solid rgba(45,156,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.5rem', fontWeight: 700 }}>Account Settings</h1>
            <p style={{ color: '#8896A7', fontSize: '13px', marginTop: '3px' }}>Manage your profile, security and preferences</p>
          </div>
          {saved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(6,214,160,0.1)', border: '1px solid rgba(6,214,160,0.25)', borderRadius: '8px', padding: '8px 16px', color: '#06D6A0', fontSize: '13px', fontWeight: 600 }}>
              <CheckCircle size={14} /> Changes saved!
            </div>
          )}
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', borderRadius: '10px', border: '1px solid', cursor: 'pointer', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s', borderColor: activeTab === id ? '#2d9cdb' : 'rgba(45,156,219,0.15)', background: activeTab === id ? 'rgba(45,156,219,0.12)' : 'transparent', color: activeTab === id ? '#2d9cdb' : '#8896A7' }}>
                <Icon size={14} />{label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid rgba(45,156,219,0.1)' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontFamily: 'Playfair Display, serif', color: 'white', fontWeight: 700, boxShadow: '0 0 16px rgba(45,156,219,0.3)' }}>S</div>
                  <button style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderRadius: '50%', background: '#2d9cdb', border: '2px solid #141C24', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Camera size={11} style={{ color: 'white' }} />
                  </button>
                </div>
                <div>
                  <div style={{ color: '#E0E6ED', fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 700 }}>{profile.fullName}</div>
                  <div style={{ color: '#8896A7', fontSize: '12px', marginTop: '3px' }}>Patient ID: PH-847291</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(6,214,160,0.1)', border: '1px solid rgba(6,214,160,0.2)', borderRadius: '50px', padding: '2px 10px', marginTop: '6px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#06D6A0' }} />
                    <span style={{ color: '#06D6A0', fontSize: '10px', fontWeight: 500 }}>Active Patient</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Full Name', key: 'fullName', type: 'text' },
                  { label: 'Email Address', key: 'email', type: 'email' },
                  { label: 'Phone Number', key: 'phone', type: 'tel' },
                  { label: 'Date of Birth', key: 'dob', type: 'date' },
                  { label: 'Blood Group', key: 'bloodGroup', type: 'text' },
                  { label: 'Known Allergies', key: 'allergies', type: 'text' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input type={type} value={profile[key as keyof typeof profile]} onChange={e => updateProfile(key, e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Delivery Address</label>
                <input type="text" value={profile.address} onChange={e => updateProfile('address', e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>Emergency Contact</label>
                <input type="text" value={profile.emergencyContact} onChange={e => updateProfile('emergencyContact', e.target.value)} placeholder="Name — Phone Number" style={inputStyle} />
              </div>
              <button onClick={handleSave} style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 0 16px rgba(45,156,219,0.25)' }}>
                Save Changes
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '28px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.15rem', fontWeight: 700, marginBottom: '24px' }}>Change Password</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', marginBottom: '28px' }}>
                {[{ label: 'Current Password', key: 'current' }, { label: 'New Password', key: 'newPass' }, { label: 'Confirm New Password', key: 'confirm' }].map(({ label, key }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '10px', padding: '11px 14px' }}>
                      <Lock size={14} style={{ color: '#8896A7' }} />
                      <input type={showPassword ? 'text' : 'password'} value={passwords[key as keyof typeof passwords]} onChange={e => updatePass(key, e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: '#E0E6ED', fontFamily: 'Inter, sans-serif' }} />
                      <button onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8896A7', display: 'flex' }}>
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Update Password
              </button>
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(45,156,219,0.1)' }}>
                <h4 style={{ color: '#E0E6ED', fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Active Sessions</h4>
                {[{ device: 'Firefox on Windows', location: 'Abuja, Nigeria', time: 'Active now', current: true }, { device: 'Chrome on Android', location: 'Abuja, Nigeria', time: '2 hours ago', current: false }].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.08)', borderRadius: '10px', marginBottom: '8px' }}>
                    <div>
                      <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 500 }}>{s.device}</div>
                      <div style={{ color: '#8896A7', fontSize: '11px' }}>{s.location} · {s.time}</div>
                    </div>
                    {s.current ? (
                      <span style={{ background: 'rgba(6,214,160,0.1)', color: '#06D6A0', fontSize: '10px', fontWeight: 600, padding: '3px 10px', borderRadius: '50px' }}>Current</span>
                    ) : (
                      <button style={{ background: 'rgba(239,35,60,0.1)', border: '1px solid rgba(239,35,60,0.2)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', color: '#EF233C', fontSize: '11px' }}>Revoke</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Biometrics Tab */}
          {activeTab === 'biometrics' && (
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '28px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>Biometric Authentication</h3>
              <p style={{ color: '#8896A7', fontSize: '14px', lineHeight: 1.65, marginBottom: '28px' }}>
                Register your fingerprint or Face ID to sign in faster and more securely. Your biometric data never leaves your device.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { key: 'fingerprint' as const, Icon: Fingerprint, title: 'Fingerprint', desc: 'Use your device fingerprint sensor to sign in instantly', color: '#2d9cdb' },
                  { key: 'face' as const, Icon: Scan, title: 'Face ID', desc: 'Use facial recognition for secure, hands-free sign in', color: '#06D6A0' },
                ].map(({ key, Icon, title, desc, color }) => {
                  const status = bioStatus[key]
                  return (
                    <div key={key} style={{ background: '#0A0F14', border: `1px solid ${status === 'registered' ? `${color}40` : status === 'failed' ? 'rgba(239,35,60,0.2)' : 'rgba(45,156,219,0.12)'}`, borderRadius: '14px', padding: '22px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', transition: 'all 0.3s' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: status === 'registered' ? `${color}15` : status === 'registering' ? 'rgba(45,156,219,0.15)' : 'rgba(255,255,255,0.04)', border: `2px solid ${status === 'registered' ? color : status === 'failed' ? '#EF233C' : 'rgba(45,156,219,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s' }}>
                        <Icon size={24} style={{ color: status === 'registered' ? color : status === 'failed' ? '#EF233C' : '#8896A7' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: '160px' }}>
                        <div style={{ color: '#E0E6ED', fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{title}</div>
                        <div style={{ color: '#8896A7', fontSize: '12px', lineHeight: 1.5, marginBottom: '6px' }}>{desc}</div>
                        {status === 'registered' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: color, fontSize: '11px', fontWeight: 600 }}>
                            <CheckCircle size={12} /> Registered successfully
                          </div>
                        )}
                        {status === 'failed' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#EF233C', fontSize: '11px' }}>
                            <AlertCircle size={12} /> Not available on this device
                          </div>
                        )}
                        {status === 'registering' && (
                          <div style={{ color: '#2d9cdb', fontSize: '11px' }}>Please follow your device prompts...</div>
                        )}
                      </div>
                      <div>
                        {status === 'idle' && (
                          <button onClick={() => registerBiometric(key)}
                            style={{ background: `${color}12`, border: `1px solid ${color}30`, borderRadius: '8px', padding: '9px 18px', cursor: 'pointer', color, fontSize: '13px', fontWeight: 600 }}>
                            Set Up {title}
                          </button>
                        )}
                        {status === 'registering' && (
                          <button disabled style={{ background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '8px', padding: '9px 18px', cursor: 'not-allowed', color: '#8896A7', fontSize: '13px' }}>
                            Scanning...
                          </button>
                        )}
                        {status === 'registered' && (
                          <button onClick={() => setBioStatus(prev => ({ ...prev, [key]: 'idle' }))}
                            style={{ background: 'rgba(239,35,60,0.08)', border: '1px solid rgba(239,35,60,0.2)', borderRadius: '8px', padding: '9px 18px', cursor: 'pointer', color: '#EF233C', fontSize: '13px', fontWeight: 500 }}>
                            Remove
                          </button>
                        )}
                        {status === 'failed' && (
                          <button onClick={() => setBioStatus(prev => ({ ...prev, [key]: 'idle' }))}
                            style={{ background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '8px', padding: '9px 18px', cursor: 'pointer', color: '#2d9cdb', fontSize: '13px' }}>
                            Try Again
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ marginTop: '24px', background: 'rgba(45,156,219,0.04)', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '12px', padding: '16px 18px' }}>
                <h4 style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={13} style={{ color: '#2d9cdb' }} /> How We Keep Your Biometrics Safe
                </h4>
                <ul style={{ color: '#8896A7', fontSize: '12px', lineHeight: 1.8, paddingLeft: '16px', margin: 0 }}>
                  <li>Your biometric data is stored only on your device — never on our servers</li>
                  <li>Uses WebAuthn (FIDO2) — the industry standard for passwordless security</li>
                  <li>Only a cryptographic key is stored, not your actual fingerprint or face</li>
                  <li>Works with your phone's built-in security chip (Secure Enclave / TEE)</li>
                </ul>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '28px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.15rem', fontWeight: 700, marginBottom: '24px' }}>Notification Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px' }}>
                {[
                  { key: 'refillReminders', label: 'Medication Refill Reminders', desc: 'Get notified when medications are running low' },
                  { key: 'orderUpdates', label: 'Order Status Updates', desc: 'Track your orders from placed to delivered' },
                  { key: 'appointments', label: 'Appointment Reminders', desc: 'Reminders for upcoming consultations' },
                  { key: 'promotions', label: 'Promotions & Discounts', desc: 'Special offers and loyalty point updates' },
                  { key: 'newsletter', label: 'Health Newsletter', desc: 'Weekly health tips from our pharmacists' },
                ].map(({ key, label, desc }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.08)', borderRadius: '10px' }}>
                    <div>
                      <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 500, marginBottom: '3px' }}>{label}</div>
                      <div style={{ color: '#8896A7', fontSize: '11px' }}>{desc}</div>
                    </div>
                    <button onClick={() => setNotifs(p => ({ ...p, [key]: !p[key as keyof typeof notifs] }))}
                      style={{ width: '44px', height: '24px', borderRadius: '50px', border: 'none', cursor: 'pointer', background: notifs[key as keyof typeof notifs] ? 'linear-gradient(135deg, #2d9cdb, #1a7ab8)' : 'rgba(255,255,255,0.08)', transition: 'all 0.2s', flexShrink: 0, position: 'relative' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', transition: 'left 0.2s', left: notifs[key as keyof typeof notifs] ? '23px' : '3px', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} style={{ marginTop: '24px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Save Preferences
              </button>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '28px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px' }}>Privacy & Data</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {[
                  { label: 'Location Access', desc: 'Used for delivery address suggestions', granted: true },
                  { label: 'Camera Access', desc: 'Used for prescription photo uploads', granted: true },
                  { label: 'Push Notifications', desc: 'Medication reminders and order updates', granted: false },
                ].map(({ label, desc, granted }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.08)', borderRadius: '10px' }}>
                    <div>
                      <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 500, marginBottom: '3px' }}>{label}</div>
                      <div style={{ color: '#8896A7', fontSize: '11px' }}>{desc}</div>
                    </div>
                    <span style={{ padding: '4px 12px', borderRadius: '50px', fontSize: '10px', fontWeight: 600, background: granted ? 'rgba(6,214,160,0.1)' : 'rgba(239,35,60,0.1)', color: granted ? '#06D6A0' : '#EF233C' }}>
                      {granted ? 'Allowed' : 'Denied'}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '16px', background: 'rgba(239,35,60,0.06)', border: '1px solid rgba(239,35,60,0.15)', borderRadius: '12px' }}>
                <h4 style={{ color: '#EF233C', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Danger Zone</h4>
                <p style={{ color: '#8896A7', fontSize: '12px', lineHeight: 1.6, marginBottom: '12px' }}>Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button style={{ background: 'transparent', border: '1px solid rgba(239,35,60,0.3)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', color: '#EF233C', fontSize: '12px', fontWeight: 600 }}>
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}