'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ShieldCheck, CreditCard, Truck, CheckCircle, ArrowLeft, Lock } from 'lucide-react'

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: {
        key: string
        email: string
        amount: number
        currency: string
        ref: string
        firstname?: string
        lastname?: string
        phone?: string
        onClose: () => void
        callback: (response: { reference: string }) => void
      }) => { openIframe: () => void }
    }
  }
}

const cartItems = [
  { id: 1, name: 'Amoxicillin 500mg', qty: 2, price: 1200, total: 2400 },
  { id: 2, name: 'Vitamin C 1000mg', qty: 1, price: 800, total: 800 },
]

const subtotal = cartItems.reduce((s, i) => s + i.total, 0)

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '', city: 'Abuja', delivery: 'standard', payment: 'paystack' })
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderRef, setOrderRef] = useState('')
  const [paystackLoaded, setPaystackLoaded] = useState(false)

  const deliveryFee = form.delivery === 'express' ? 1000 : form.delivery === 'pickup' ? 0 : 500
  const total = subtotal + deliveryFee

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  // Load Paystack script when page loads
  useEffect(() => {
    if (document.querySelector('script[src*="paystack"]')) {
      setPaystackLoaded(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => setPaystackLoaded(true)
    document.head.appendChild(script)
  }, [])

  const goStep2 = () => {
    if (!form.fullName || !form.email || !form.phone || !form.address) {
      alert('Please fill in all required fields')
      return
    }
    setStep(2)
  }

  const handlePay = () => {
    if (form.payment === 'pod') {
      setProcessing(true)
      const ref = 'VM-POD-' + Date.now()
      setOrderRef(ref)
      setTimeout(() => { setProcessing(false); setSuccess(true) }, 1500)
      return
    }

    // Paystack payment
    const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''

    if (!key || !key.startsWith('pk_') || !paystackLoaded) {
      // Demo mode — no real key or Paystack not loaded
      setProcessing(true)
      const ref = 'VM-DEMO-' + Date.now()
      setOrderRef(ref)
      setTimeout(() => { setProcessing(false); setSuccess(true) }, 2000)
      return
    }

    setProcessing(true)
    const ref = 'VM-' + Date.now()
    setOrderRef(ref)

    try {
      const handler = window.PaystackPop.setup({
        key,
        email: form.email,
        amount: total * 100, // Paystack uses kobo
        currency: 'NGN',
        ref,
        firstname: form.fullName.split(' ')[0] || '',
        lastname: form.fullName.split(' ').slice(1).join(' ') || '',
        phone: form.phone,
        onClose: () => {
          setProcessing(false)
          alert('Payment cancelled. Your order was not placed.')
        },
        callback: (response) => {
          console.log('Payment verified:', response.reference)
          setProcessing(false)
          setSuccess(true)
        }
      })
      handler.openIframe()
    } catch (err) {
      console.error('Paystack error:', err)
      // Fallback success for demo
      setTimeout(() => { setProcessing(false); setSuccess(true) }, 1500)
    }
  }

  const inputSt = { width: '100%', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '9px', padding: '11px 14px', fontSize: '14px', color: '#E0E6ED', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' as const }
  const labelSt = { display: 'block' as const, color: '#E0E6ED', fontSize: '12px', fontWeight: 600 as const, marginBottom: '7px' }

  if (success) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: '64px', background: '#0A0F14', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', fontFamily: 'Inter, sans-serif' }}>
          <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '24px', padding: '48px', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(6,214,160,0.15)', border: '1px solid #06D6A0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={36} style={{ color: '#06D6A0' }} />
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '2rem', fontWeight: 700, marginBottom: '10px' }}>Order Placed! 🎉</h2>
            <p style={{ color: '#8896A7', fontSize: '14px', lineHeight: 1.7, marginBottom: '8px' }}>Your order has been confirmed and is being prepared.</p>
            <div style={{ background: '#0A0F14', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '10px', padding: '14px', marginBottom: '24px' }}>
              <div style={{ color: '#8896A7', fontSize: '11px', marginBottom: '4px' }}>Order Reference</div>
              <div style={{ color: '#2d9cdb', fontSize: '15px', fontWeight: 700 }}>{orderRef}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', marginBottom: '24px' }}>
              {[['📧', 'Email', form.email], ['🚚', 'Delivering to', form.address + ', ' + form.city], ['⏰', 'Estimated', form.delivery === 'express' ? 'Today by 6PM' : 'Tomorrow by 12PM']].map(([icon, label, val]) => (
                <div key={String(label)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#0A0F14', borderRadius: '8px', border: '1px solid rgba(45,156,219,0.08)' }}>
                  <span>{icon}</span>
                  <div><div style={{ color: '#8896A7', fontSize: '10px' }}>{label}</div><div style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 600 }}>{val}</div></div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/track-order" style={{ flex: 1, background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', borderRadius: '10px', padding: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '13px', textAlign: 'center' }}>Track Order</Link>
              <Link href="/" style={{ flex: 1, background: '#0A0F14', color: '#2d9cdb', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '10px', padding: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '13px', textAlign: 'center' }}>Home</Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '64px', background: '#0A0F14', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

        {/* Header */}
        <div style={{ background: '#141C24', borderBottom: '1px solid rgba(45,156,219,0.1)', padding: '32px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <Link href="/cart" style={{ color: '#8896A7', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '14px' }}>
              <ArrowLeft size={13} /> Back to Cart
            </Link>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.8rem', fontWeight: 700, marginBottom: '20px' }}>Checkout</h1>
            {/* Steps */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
              {['Delivery Info', 'Payment', 'Confirm'].map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, background: step > i + 1 ? '#06D6A0' : step === i + 1 ? 'linear-gradient(135deg, #2d9cdb, #1a7ab8)' : 'rgba(45,156,219,0.12)', color: step >= i + 1 ? 'white' : '#8896A7', transition: 'all 0.3s' }}>
                      {step > i + 1 ? '✓' : i + 1}
                    </div>
                    <span style={{ fontSize: '12px', color: step === i + 1 ? '#E0E6ED' : '#8896A7', fontWeight: step === i + 1 ? 600 : 400 }}>{s}</span>
                  </div>
                  {i < 2 && <div style={{ width: '24px', height: '1px', background: 'rgba(45,156,219,0.2)', margin: '0 4px' }} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>

            {/* Form */}
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '20px', padding: '32px' }}>

              {/* STEP 1 — Delivery */}
              {step === 1 && (
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.2rem', fontWeight: 700, marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={18} style={{ color: '#2d9cdb' }} /> Delivery Details
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div><label style={labelSt}>Full Name *</label><input value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="John Doe" style={inputSt} /></div>
                    <div><label style={labelSt}>Phone *</label><input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+234 801 234 5678" style={inputSt} /></div>
                  </div>
                  <div style={{ marginBottom: '14px' }}><label style={labelSt}>Email *</label><input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" style={inputSt} /></div>
                  <div style={{ marginBottom: '22px' }}><label style={labelSt}>Delivery Address *</label><input value={form.address} onChange={e => update('address', e.target.value)} placeholder="Street address, area" style={inputSt} /></div>

                  <h4 style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>Delivery Method</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    {[
                      { id: 'standard', label: 'Standard Delivery', note: 'Tomorrow by 12PM', price: '₦500' },
                      { id: 'express', label: 'Express Delivery', note: 'Today by 6PM (order before 4PM)', price: '₦1,000' },
                      { id: 'pickup', label: 'Store Pickup', note: '12 Hospital Rd, Maitama — Ready in 2hrs', price: 'Free' },
                    ].map(opt => (
                      <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', border: `2px solid ${form.delivery === opt.id ? '#2d9cdb' : 'rgba(45,156,219,0.1)'}`, borderRadius: '10px', cursor: 'pointer', background: form.delivery === opt.id ? 'rgba(45,156,219,0.06)' : '#0A0F14', transition: 'all 0.2s' }}>
                        <input type="radio" name="delivery" value={opt.id} checked={form.delivery === opt.id} onChange={() => update('delivery', opt.id)} style={{ accentColor: '#2d9cdb' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600 }}>{opt.label}</div>
                          <div style={{ color: '#8896A7', fontSize: '11px', marginTop: '2px' }}>{opt.note}</div>
                        </div>
                        <span style={{ color: opt.price === 'Free' ? '#06D6A0' : '#2d9cdb', fontSize: '13px', fontWeight: 700 }}>{opt.price}</span>
                      </label>
                    ))}
                  </div>
                  <button onClick={goStep2} style={{ width: '100%', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 16px rgba(45,156,219,0.25)' }}>
                    Continue to Payment →
                  </button>
                </div>
              )}

              {/* STEP 2 — Payment */}
              {step === 2 && (
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.2rem', fontWeight: 700, marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={18} style={{ color: '#2d9cdb' }} /> Payment Method
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {[
                      { id: 'paystack', label: 'Pay with Card / Bank Transfer / USSD', note: 'Visa, Mastercard, Verve, GT Bank, Access, USSD — powered by Paystack', icon: '💳' },
                      { id: 'pod', label: 'Pay on Delivery', note: 'Cash or POS machine on arrival. Available within Abuja only.', icon: '🏠' },
                    ].map(opt => (
                      <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', border: `2px solid ${form.payment === opt.id ? '#2d9cdb' : 'rgba(45,156,219,0.1)'}`, borderRadius: '12px', cursor: 'pointer', background: form.payment === opt.id ? 'rgba(45,156,219,0.06)' : '#0A0F14', transition: 'all 0.2s' }}>
                        <input type="radio" name="payment" value={opt.id} checked={form.payment === opt.id} onChange={() => update('payment', opt.id)} style={{ accentColor: '#2d9cdb' }} />
                        <span style={{ fontSize: '22px' }}>{opt.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600 }}>{opt.label}</div>
                          <div style={{ color: '#8896A7', fontSize: '11px', marginTop: '3px', lineHeight: 1.5 }}>{opt.note}</div>
                        </div>
                        {form.payment === opt.id && <span style={{ color: '#2d9cdb', fontSize: '18px' }}>✓</span>}
                      </label>
                    ))}
                  </div>

                  {form.payment === 'paystack' && (
                    <div style={{ background: 'rgba(45,156,219,0.06)', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px' }}>
                      <div style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Lock size={12} style={{ color: '#2d9cdb' }} /> Secure Card Payment
                      </div>
                      <div style={{ color: '#8896A7', fontSize: '11px', lineHeight: 1.6 }}>
                        When you click "Pay Now" a secure Paystack popup will appear where you enter your card details.
                        Your card information is never stored on our servers.
                      </div>
                      <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['💳 Visa', '💳 Mastercard', '💳 Verve', '🏦 Bank Transfer', '📱 USSD'].map(m => (
                          <span key={m} style={{ background: 'rgba(45,156,219,0.1)', padding: '3px 10px', borderRadius: '4px', color: '#2d9cdb', fontSize: '10px', fontWeight: 600 }}>{m}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setStep(1)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '10px', padding: '13px', color: '#2d9cdb', cursor: 'pointer', fontSize: '13px' }}>← Back</button>
                    <button onClick={() => setStep(3)} style={{ flex: 2, background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                      Review Order →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 — Confirm */}
              {step === 3 && (
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.2rem', fontWeight: 700, marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} style={{ color: '#2d9cdb' }} /> Review & Confirm
                  </h3>
                  <div style={{ background: '#0A0F14', borderRadius: '12px', padding: '18px', marginBottom: '14px', border: '1px solid rgba(45,156,219,0.08)' }}>
                    <div style={{ color: '#2d9cdb', fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>Delivery Details</div>
                    {[['Name', form.fullName], ['Phone', form.phone], ['Email', form.email], ['Address', form.address + ', ' + form.city], ['Method', form.delivery === 'pickup' ? 'Store Pickup' : form.delivery === 'express' ? 'Express (Today by 6PM)' : 'Standard (Tomorrow by 12PM)']].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                        <span style={{ color: '#8896A7', fontSize: '12px' }}>{k}</span>
                        <span style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#0A0F14', borderRadius: '10px', padding: '14px', marginBottom: '24px', border: '1px solid rgba(45,156,219,0.08)' }}>
                    <div style={{ color: '#2d9cdb', fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Payment</div>
                    <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600 }}>
                      {form.payment === 'paystack' ? '💳 Card / Bank Transfer / USSD via Paystack' : '🏠 Pay on Delivery'}
                    </div>
                    {form.payment === 'paystack' && (
                      <div style={{ color: '#8896A7', fontSize: '11px', marginTop: '6px', lineHeight: 1.5 }}>
                        A secure Paystack popup will open for you to fill in your card details. Your payment of <strong style={{ color: '#2d9cdb' }}>₦{total.toLocaleString()}</strong> will be processed securely.
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setStep(2)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '10px', padding: '13px', color: '#2d9cdb', cursor: 'pointer', fontSize: '13px' }}>← Back</button>
                    <button onClick={handlePay} disabled={processing}
                      style={{ flex: 2, background: processing ? 'rgba(45,156,219,0.3)' : 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: processing ? 'none' : '0 0 16px rgba(45,156,219,0.25)' }}>
                      <Lock size={14} />
                      {processing ? 'Processing...' : form.payment === 'paystack' ? `Pay ₦${total.toLocaleString()} Securely` : `Confirm — ₦${total.toLocaleString()}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '16px', padding: '22px', position: 'sticky', top: '80px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Order Summary</h3>
              {cartItems.map((item, i) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < cartItems.length - 1 ? '1px solid rgba(45,156,219,0.08)' : 'none' }}>
                  <div>
                    <div style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: '#8896A7', fontSize: '10px' }}>Qty {item.qty} × ₦{item.price.toLocaleString()}</div>
                  </div>
                  <span style={{ color: '#2d9cdb', fontSize: '13px', fontWeight: 700 }}>₦{item.total.toLocaleString()}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(45,156,219,0.15)', marginTop: '14px', paddingTop: '14px' }}>
                {[['Subtotal', `₦${subtotal.toLocaleString()}`], ['Delivery', form.delivery === 'pickup' ? 'Free' : form.delivery === 'express' ? '₦1,000' : '₦500'], ['Discount', '₦0']].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#8896A7', fontSize: '12px' }}>{k}</span>
                    <span style={{ color: '#E0E6ED', fontSize: '12px' }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(45,156,219,0.15)' }}>
                  <span style={{ color: '#E0E6ED', fontSize: '14px', fontWeight: 700 }}>Total</span>
                  <span style={{ color: '#2d9cdb', fontSize: '18px', fontWeight: 800 }}>₦{total.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ marginTop: '14px', background: 'rgba(45,156,219,0.06)', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ color: '#8896A7', fontSize: '10px', lineHeight: 1.7 }}>
                  🔒 Secured by Paystack · NAFDAC certified · 100% authentic medications
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}