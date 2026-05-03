'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Search, Package, CheckCircle, Clock, Truck, MapPin, Phone } from 'lucide-react'

interface TrackStep {
  label: string
  desc: string
  time: string
  done: boolean
  icon: React.ReactNode
}

export default function TrackOrderPage() {
  const [orderRef, setOrderRef] = useState('')
  const [result, setResult] = useState<{ found: boolean; ref: string; steps: TrackStep[] } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleTrack = () => {
    if (!orderRef.trim()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setResult({
        found: true,
        ref: orderRef.trim(),
        steps: [
          { label: 'Order Placed', desc: 'Your order was received and confirmed', time: '2:15 PM', done: true, icon: <Package size={16} /> },
          { label: 'Prescription Verified', desc: 'Our pharmacist verified your prescription', time: '2:35 PM', done: true, icon: <CheckCircle size={16} /> },
          { label: 'Order Prepared', desc: 'Your medications are being packaged', time: '3:00 PM', done: true, icon: <Clock size={16} /> },
          { label: 'Out for Delivery', desc: 'Your order is on its way to you', time: '3:45 PM', done: true, icon: <Truck size={16} /> },
          { label: 'Delivered', desc: 'Estimated delivery by 6:00 PM', time: '~6:00 PM', done: false, icon: <MapPin size={16} /> },
        ]
      })
    }, 1200)
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '64px', background: '#0A0F14', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #141C24 0%, #0f2035 50%, #0A0F14 100%)', borderBottom: '1px solid rgba(45,156,219,0.12)', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(45,156,219,0.1)', border: '1px solid rgba(45,156,219,0.25)', color: '#2d9cdb', padding: '5px 14px', borderRadius: '50px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>
            ORDER TRACKING
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 700, marginBottom: '14px' }}>
            Track Your Order
          </h1>
          <p style={{ color: '#8896A7', fontSize: '15px', marginBottom: '36px' }}>
            Enter your order number to see real-time delivery status
          </p>

          {/* Search Box */}
          <div style={{ display: 'flex', gap: '10px', maxWidth: '560px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#141C24', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '12px', padding: '14px 18px', flex: 1, minWidth: '280px' }}>
              <Package size={18} style={{ color: '#8896A7', flexShrink: 0 }} />
              <input
                value={orderRef}
                onChange={e => setOrderRef(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTrack()}
                placeholder="Enter order number e.g. VM-1234567890"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: '#E0E6ED', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <button onClick={handleTrack} disabled={loading || !orderRef.trim()}
              style={{ background: loading || !orderRef.trim() ? 'rgba(45,156,219,0.3)' : 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '12px', padding: '14px 28px', cursor: loading || !orderRef.trim() ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 16px rgba(45,156,219,0.25)', transition: 'all 0.2s' }}>
              <Search size={16} />
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </div>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>

          {/* Result */}
          {result && result.found && (
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '20px', padding: '32px', marginBottom: '24px', boxShadow: '0 0 32px rgba(45,156,219,0.08)' }}>

              {/* Order Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(45,156,219,0.1)' }}>
                <div>
                  <div style={{ color: '#8896A7', fontSize: '11px', marginBottom: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Order Reference</div>
                  <div style={{ color: '#2d9cdb', fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Playfair Display, serif' }}>{result.ref}</div>
                </div>
                <div style={{ background: 'rgba(244,162,97,0.1)', border: '1px solid rgba(244,162,97,0.25)', borderRadius: '10px', padding: '10px 18px', textAlign: 'center' }}>
                  <div style={{ color: '#8896A7', fontSize: '10px', marginBottom: '3px' }}>Estimated Delivery</div>
                  <div style={{ color: '#F4A261', fontSize: '14px', fontWeight: 700 }}>Today, by 6:00 PM</div>
                </div>
              </div>

              {/* Progress Steps */}
              <div style={{ position: 'relative' }}>
                {result.steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: i < result.steps.length - 1 ? '0' : '0', position: 'relative' }}>

                    {/* Line connector */}
                    {i < result.steps.length - 1 && (
                      <div style={{ position: 'absolute', left: '18px', top: '40px', width: '2px', height: 'calc(100% - 8px)', background: step.done ? '#2d9cdb' : 'rgba(45,156,219,0.15)', zIndex: 0 }} />
                    )}

                    {/* Icon */}
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: step.done ? 'linear-gradient(135deg, #2d9cdb, #1a7ab8)' : 'rgba(45,156,219,0.1)', border: `2px solid ${step.done ? '#2d9cdb' : 'rgba(45,156,219,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, position: 'relative', boxShadow: step.done ? '0 0 12px rgba(45,156,219,0.35)' : 'none', transition: 'all 0.3s' }}>
                      <div style={{ color: step.done ? 'white' : '#8896A7' }}>{step.icon}</div>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, paddingBottom: '28px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                        <div style={{ color: step.done ? '#E0E6ED' : '#8896A7', fontSize: '14px', fontWeight: step.done ? 700 : 500 }}>{step.label}</div>
                        <div style={{ color: step.done ? '#2d9cdb' : '#8896A7', fontSize: '12px', fontWeight: 600 }}>{step.time}</div>
                      </div>
                      <div style={{ color: '#8896A7', fontSize: '12px', marginTop: '4px', lineHeight: 1.5 }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Info */}
              <div style={{ background: '#0A0F14', border: '1px solid rgba(45,156,219,0.08)', borderRadius: '12px', padding: '16px 18px', marginTop: '8px' }}>
                <div style={{ color: '#8896A7', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Delivery Information</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                  {[['Carrier', 'Vital Medicare Dispatch'], ['Vehicle', 'Motorcycle Rider'], ['Contact', '+234 801 234 5678'], ['Status', 'On the way']].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ color: '#8896A7', fontSize: '10px', marginBottom: '3px' }}>{k}</div>
                      <div style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 600 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to action */}
              <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a href="tel:+2348012345678"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '10px', padding: '11px', textDecoration: 'none', color: '#2d9cdb', fontSize: '13px', fontWeight: 600 }}>
                  <Phone size={14} /> Call Rider
                </a>
                <button
                  style={{ flex: 1, background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '11px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, boxShadow: '0 0 12px rgba(45,156,219,0.25)' }}>
                  Live Map Track
                </button>
              </div>
            </div>
          )}

          {/* Not found */}
          {result && !result.found && (
            <div style={{ textAlign: 'center', padding: '60px', background: '#141C24', borderRadius: '16px', border: '1px solid rgba(45,156,219,0.1)' }}>
              <Package size={48} style={{ color: 'rgba(45,156,219,0.2)', marginBottom: '16px' }} />
              <h3 style={{ color: '#E0E6ED', fontSize: '1.2rem', marginBottom: '8px' }}>Order Not Found</h3>
              <p style={{ color: '#8896A7', fontSize: '14px' }}>Check your order number and try again. Order numbers start with VM-</p>
            </div>
          )}

          {/* Empty state */}
          {!result && !loading && (
            <div style={{ textAlign: 'center', padding: '40px 24px', background: '#141C24', borderRadius: '16px', border: '1px solid rgba(45,156,219,0.1)' }}>
              <Package size={48} style={{ color: 'rgba(45,156,219,0.2)', marginBottom: '16px' }} />
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.2rem', marginBottom: '8px' }}>Enter your order number above</h3>
              <p style={{ color: '#8896A7', fontSize: '14px', lineHeight: 1.7 }}>
                Your order number was sent to your phone and email after purchase.<br />
                It starts with <strong style={{ color: '#2d9cdb' }}>VM-</strong> followed by numbers.
              </p>
              <div style={{ marginTop: '24px', padding: '16px', background: '#0A0F14', borderRadius: '10px', border: '1px solid rgba(45,156,219,0.08)' }}>
                <div style={{ color: '#8896A7', fontSize: '12px', marginBottom: '6px' }}>Need help? Contact us:</div>
                <div style={{ color: '#2d9cdb', fontSize: '13px', fontWeight: 600 }}>📞 +234 801 234 5678</div>
                <div style={{ color: '#8896A7', fontSize: '12px', marginTop: '2px' }}>Mon–Sat, 8AM–10PM</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}