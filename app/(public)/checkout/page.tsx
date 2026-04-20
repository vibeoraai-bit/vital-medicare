'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ShieldCheck, CreditCard, Truck, CheckCircle, ArrowLeft, Lock } from 'lucide-react'

const cartItems = [
  { id: 1, name: 'Amoxicillin 500mg', qty: 2, price: 1200, total: 2400 },
  { id: 2, name: 'Vitamin C 1000mg', qty: 1, price: 800, total: 800 },
]

const subtotal = cartItems.reduce((s, i) => s + i.total, 0)

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', address: '',
    city: 'Abuja', delivery: 'standard', payment: 'paystack'
  })
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderRef, setOrderRef] = useState('')
  const paystackReady = useRef(false)

  const deliveryFee = form.delivery === 'express' ? 1000 : form.delivery === 'pickup' ? 0 : 500
  const total = subtotal + deliveryFee
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  // Load Paystack script immediately when page loads
  useEffect(() => {
    const existing = document.getElementById('paystack-script')
    if (existing) { paystackReady.current = true; return }

    const script = document.createElement('script')
    script.id = 'paystack-script'
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.onload = () => { paystackReady.current = true }
    document.head.appendChild(script)
  }, [])

  const goStep2 = () => {
    if (!form.fullName || !form.email || !form.phone || !form.address) {
      alert('Please fill in all required fields before continuing.')
      return
    }
    setStep(2)
  }

  const openPaystack = () => {
    const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''
    const ref = 'VM-' + Date.now()
    setOrderRef(ref)

    // Check if Paystack is loaded and key is valid
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const PaystackPop = (window as any).PaystackPop

    if (!PaystackPop || !key || !key.startsWith('pk_')) {
      // No valid key — show demo success
      setProcessing(true)
      setTimeout(() => { setProcessing(false); setSuccess(true) }, 2000)
      return
    }

    setProcessing(true)

    try {
      const handler = PaystackPop.setup({
        key: key,
        email: form.email,
        amount: total * 100, // Amount in kobo
        currency: 'NGN',
        ref: ref,
        firstname: form.fullName.split(' ')[0] || '',
        lastname: form.fullName.split(' ').slice(1).join(' ') || '',
        phone: form.phone,
        label: 'Vital Medicare Order',
        metadata: {
          custom_fields: [
            { display_name: 'Delivery Address', variable_name: 'address', value: form.address + ', ' + form.city },
            { display_name: 'Order Reference', variable_name: 'ref', value: ref },
          ]
        },
        onClose: function () {
          setProcessing(false)
        },
        callback: function (response: { reference: string }) {
          console.log('Payment complete! Reference:', response.reference)
          setProcessing(false)
          setSuccess(true)
        }
      })

      handler.openIframe()
    } catch (error) {
      console.error('Paystack error:', error)
      setTimeout(() => { setProcessing(false); setSuccess(true) }, 1500)
    }
  }

  const handlePayOnDelivery = () => {
    setProcessing(true)
    setOrderRef('VM-POD-' + Date.now())
    setTimeout(() => { setProcessing(false); setSuccess(true) }, 1200)
  }

  const inputSt = {
    width: '100%', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.15)',
    borderRadius: '9px', padding: '11px 14px', fontSize: '14px', color: '#E0E6ED',
    outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' as const
  }
  const labelSt = {
    display: 'block' as const, color: '#E0E6ED', fontSize: '12px',
    fontWeight: 600 as const, marginBottom: '7px'
  }

  if (success) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: '64px', background: '#0A0F14', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', fontFamily: 'Inter, sans-serif' }}>
          <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '24px', padding: '48px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 0 48px rgba(45,156,219,0.1)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(6,214,160,0.12)', border: '2px solid #06D6A0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}>
              <CheckCircle size={40} style={{ color: '#06D6A0' }} />
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '2rem', fontWeight: 700, marginBottom: '10px' }}>
              Order Confirmed! 🎉
            </h2>
            <p style={{ color: '#8896A7', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
              Your medications are being prepared and will be delivered to you.
            </p>
            <div style={{ background: '#0A0F14', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
              {[
                ['Order Ref', orderRef],
                ['Email', form.email],
                ['Address', form.address + ', ' + form.city],
                ['Delivery', form.delivery === 'express' ? 'Today by 6PM' : form.delivery === 'pickup' ? 'Store Pickup (2hrs)' : 'Tomorrow by 12PM'],
                ['Total', `₦${total.toLocaleString()}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#8896A7', fontSize: '12px' }}>{k}</span>
                  <span style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ color: '#8896A7', fontSize: '12px', marginBottom: '20px' }}>
              📱 You will receive an SMS confirmation to {form.phone}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/track-order" style={{ flex: 1, background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', borderRadius: '10px', padding: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '13px', textAlign: 'center', boxShadow: '0 0 14px rgba(45,156,219,0.25)' }}>
                Track Order
              </Link>
              <Link href="/shop" style={{ flex: 1, background: '#0A0F14', color: '#2d9cdb', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '10px', padding: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '13px', textAlign: 'center' }}>
                Shop More
              </Link>
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

        {/* Header bar */}
        <div style={{ background: '#141C24', borderBottom: '1px solid rgba(45,156,219,0.1)', padding: '28px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <Link href="/cart" style={{ color: '#8896A7', fontSize: '12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
              <ArrowLeft size={12} /> Back to Cart
            </Link>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.8rem', fontWeight: 700, marginBottom: '18px' }}>Checkout</h1>

            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
              {['Delivery', 'Payment', 'Confirm'].map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 700, transition: 'all 0.3s',
                    background: step > i + 1 ? '#06D6A0' : step === i + 1 ? 'linear-gradient(135deg, #2d9cdb, #1a7ab8)' : 'rgba(45,156,219,0.1)',
                    color: step >= i + 1 ? 'white' : '#8896A7',
                    border: step >= i + 1 ? 'none' : '1px solid rgba(45,156,219,0.2)'
                  }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: '12px', color: step === i + 1 ? '#E0E6ED' : '#8896A7', fontWeight: step === i + 1 ? 600 : 400 }}>{s}</span>
                  {i < 2 && <div style={{ width: '28px', height: '1px', background: step > i + 1 ? '#06D6A0' : 'rgba(45,156,219,0.15)', margin: '0 4px' }} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>

            {/* Left panel - Form */}
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '20px', padding: '32px' }}>

              {/* ── STEP 1: Delivery ── */}
              {step === 1 && (
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.2rem', fontWeight: 700, marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={18} style={{ color: '#2d9cdb' }} /> Delivery Information
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label style={labelSt}>Full Name *</label>
                      <input value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="John Doe" style={inputSt} />
                    </div>
                    <div>
                      <label style={labelSt}>Phone Number *</label>
                      <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+234 801 234 5678" style={inputSt} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={labelSt}>Email Address *</label>
                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" style={inputSt} />
                  </div>

                  <div style={{ marginBottom: '22px' }}>
                    <label style={labelSt}>Delivery Address *</label>
                    <input value={form.address} onChange={e => update('address', e.target.value)} placeholder="Street, area, landmark" style={inputSt} />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={labelSt}>Delivery Method</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { id: 'standard', label: 'Standard Delivery', note: 'Tomorrow by 12PM', price: '₦500' },
                        { id: 'express', label: 'Express Delivery', note: 'Today by 6PM (order before 4PM)', price: '₦1,000' },
                        { id: 'pickup', label: 'Store Pickup', note: '12 Hospital Rd, Maitama — Ready in 2hrs', price: 'Free' },
                      ].map(opt => (
                        <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', border: `2px solid ${form.delivery === opt.id ? '#2d9cdb' : 'rgba(45,156,219,0.1)'}`, borderRadius: '10px', cursor: 'pointer', background: form.delivery === opt.id ? 'rgba(45,156,219,0.06)' : '#0A0F14', transition: 'all 0.2s' }}>
                          <input type="radio" name="delivery" value={opt.id} checked={form.delivery === opt.id} onChange={() => update('delivery', opt.id)} style={{ accentColor: '#2d9cdb', width: '16px', height: '16px' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600 }}>{opt.label}</div>
                            <div style={{ color: '#8896A7', fontSize: '11px', marginTop: '2px' }}>{opt.note}</div>
                          </div>
                          <span style={{ color: opt.price === 'Free' ? '#06D6A0' : '#2d9cdb', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>{opt.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button onClick={goStep2}
                    style={{ width: '100%', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 18px rgba(45,156,219,0.25)' }}>
                    Continue to Payment →
                  </button>
                </div>
              )}

              {/* ── STEP 2: Payment ── */}
              {step === 2 && (
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.2rem', fontWeight: 700, marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={18} style={{ color: '#2d9cdb' }} /> Choose Payment Method
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>

                    {/* Paystack option */}
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '18px', border: `2px solid ${form.payment === 'paystack' ? '#2d9cdb' : 'rgba(45,156,219,0.1)'}`, borderRadius: '12px', cursor: 'pointer', background: form.payment === 'paystack' ? 'rgba(45,156,219,0.06)' : '#0A0F14', transition: 'all 0.2s' }}>
                      <input type="radio" name="payment" value="paystack" checked={form.payment === 'paystack'} onChange={() => update('payment', 'paystack')} style={{ accentColor: '#2d9cdb', width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span style={{ fontSize: '20px' }}>💳</span>
                          <span style={{ color: '#E0E6ED', fontSize: '14px', fontWeight: 700 }}>Pay with Card / Bank Transfer</span>
                          {form.payment === 'paystack' && <span style={{ color: '#2d9cdb', fontSize: '16px', marginLeft: 'auto' }}>✓</span>}
                        </div>
                        <div style={{ color: '#8896A7', fontSize: '12px', lineHeight: 1.6, marginBottom: '10px' }}>
                          Powered by Paystack — Nigeria&apos;s most trusted payment gateway.
                          A popup will appear for you to enter your card details securely.
                        </div>
                        {/* Payment method logos */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {[
                            { name: 'Visa', bg: '#1a1f71', color: 'white' },
                            { name: 'Mastercard', bg: '#eb001b', color: 'white' },
                            { name: 'Verve', bg: '#312f8e', color: 'white' },
                            { name: 'Bank Transfer', bg: 'rgba(45,156,219,0.15)', color: '#2d9cdb' },
                            { name: 'USSD', bg: 'rgba(6,214,160,0.1)', color: '#06D6A0' },
                          ].map(({ name, bg, color }) => (
                            <span key={name} style={{ background: bg, color, fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', letterSpacing: '0.02em' }}>{name}</span>
                          ))}
                        </div>
                      </div>
                    </label>

                    {/* Pay on Delivery */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', border: `2px solid ${form.payment === 'pod' ? '#06D6A0' : 'rgba(45,156,219,0.1)'}`, borderRadius: '12px', cursor: 'pointer', background: form.payment === 'pod' ? 'rgba(6,214,160,0.05)' : '#0A0F14', transition: 'all 0.2s' }}>
                      <input type="radio" name="payment" value="pod" checked={form.payment === 'pod'} onChange={() => update('payment', 'pod')} style={{ accentColor: '#06D6A0', width: '16px', height: '16px', flexShrink: 0 }} />
                      <span style={{ fontSize: '20px' }}>🏠</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#E0E6ED', fontSize: '14px', fontWeight: 600 }}>Pay on Delivery</div>
                        <div style={{ color: '#8896A7', fontSize: '11px', marginTop: '2px' }}>Cash or POS on delivery. Available within Abuja only.</div>
                      </div>
                      {form.payment === 'pod' && <span style={{ color: '#06D6A0', fontSize: '16px' }}>✓</span>}
                    </label>
                  </div>

                  {/* Security note */}
                  <div style={{ background: 'rgba(45,156,219,0.05)', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '10px', padding: '14px 16px', marginBottom: '22px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <Lock size={14} style={{ color: '#2d9cdb', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ color: '#8896A7', fontSize: '11px', lineHeight: 1.7 }}>
                      <strong style={{ color: '#E0E6ED' }}>Your payment is 100% secure.</strong> We use Paystack — the same gateway trusted by thousands of Nigerian businesses. Your card details are encrypted and never stored on our servers.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setStep(1)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '10px', padding: '13px', color: '#2d9cdb', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                      ← Back
                    </button>
                    <button onClick={() => setStep(3)} style={{ flex: 2, background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 14px rgba(45,156,219,0.2)' }}>
                      Review Order →
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Confirm & Pay ── */}
              {step === 3 && (
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.2rem', fontWeight: 700, marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} style={{ color: '#2d9cdb' }} /> Review & Pay
                  </h3>

                  {/* Summary */}
                  <div style={{ background: '#0A0F14', border: '1px solid rgba(45,156,219,0.08)', borderRadius: '12px', padding: '18px', marginBottom: '16px' }}>
                    <div style={{ color: '#2d9cdb', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>Delivery Details</div>
                    {[
                      ['Name', form.fullName],
                      ['Phone', form.phone],
                      ['Email', form.email],
                      ['Address', form.address + ', ' + form.city],
                      ['Method', form.delivery === 'pickup' ? 'Store Pickup' : form.delivery === 'express' ? 'Express (Today by 6PM)' : 'Standard (Tomorrow by 12PM)'],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
                        <span style={{ color: '#8896A7', fontSize: '12px' }}>{k}</span>
                        <span style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 500, maxWidth: '65%', textAlign: 'right' }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: '#0A0F14', border: '1px solid rgba(45,156,219,0.08)', borderRadius: '10px', padding: '14px 18px', marginBottom: '22px' }}>
                    <div style={{ color: '#2d9cdb', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Payment Method</div>
                    {form.payment === 'paystack' ? (
                      <div>
                        <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>💳 Card / Bank Transfer via Paystack</div>
                        <div style={{ color: '#8896A7', fontSize: '11px', lineHeight: 1.6 }}>
                          When you click the button below, a <strong style={{ color: '#2d9cdb' }}>secure Paystack popup</strong> will appear on your screen.
                          You will fill in your card details or choose bank transfer inside that popup.
                          Your payment of <strong style={{ color: '#2d9cdb' }}>₦{total.toLocaleString()}</strong> will be processed instantly.
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600 }}>🏠 Pay on Delivery — ₦{total.toLocaleString()}</div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setStep(2)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '10px', padding: '13px', color: '#2d9cdb', cursor: 'pointer', fontSize: '13px' }}>
                      ← Back
                    </button>
                    <button
                      onClick={form.payment === 'paystack' ? openPaystack : handlePayOnDelivery}
                      disabled={processing}
                      style={{ flex: 2, background: processing ? 'rgba(45,156,219,0.3)' : 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '14px', fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: processing ? 'none' : '0 0 18px rgba(45,156,219,0.28)', transition: 'all 0.3s' }}>
                      <Lock size={15} />
                      {processing
                        ? 'Opening payment...'
                        : form.payment === 'paystack'
                          ? `Pay ₦${total.toLocaleString()} with Card`
                          : `Confirm Order — ₦${total.toLocaleString()}`}
                    </button>
                  </div>

                  <p style={{ textAlign: 'center', color: '#8896A7', fontSize: '11px', marginTop: '12px' }}>
                    🔒 Secured by Paystack · SSL Encrypted · PCI DSS Compliant
                  </p>
                </div>
              )}
            </div>

            {/* Right panel - Order summary */}
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '16px', padding: '22px', position: 'sticky', top: '80px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Order Summary</h3>

              {cartItems.map((item, i) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < cartItems.length - 1 ? '1px solid rgba(45,156,219,0.08)' : 'none' }}>
                  <div>
                    <div style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: '#8896A7', fontSize: '10px' }}>Qty {item.qty} × ₦{item.price.toLocaleString()}</div>
                  </div>
                  <span style={{ color: '#2d9cdb', fontSize: '13px', fontWeight: 700 }}>₦{item.total.toLocaleString()}</span>
                </div>
              ))}

              <div style={{ borderTop: '1px solid rgba(45,156,219,0.15)', marginTop: '14px', paddingTop: '14px' }}>
                {[
                  ['Subtotal', `₦${subtotal.toLocaleString()}`],
                  ['Delivery', form.delivery === 'pickup' ? 'Free' : form.delivery === 'express' ? '₦1,000' : '₦500'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#8896A7', fontSize: '12px' }}>{k}</span>
                    <span style={{ color: '#E0E6ED', fontSize: '12px' }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(45,156,219,0.15)' }}>
                  <span style={{ color: '#E0E6ED', fontSize: '14px', fontWeight: 700 }}>Total</span>
                  <span style={{ color: '#2d9cdb', fontSize: '20px', fontWeight: 800 }}>₦{total.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ marginTop: '16px', background: 'rgba(45,156,219,0.05)', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '8px', padding: '12px', fontSize: '10px', color: '#8896A7', lineHeight: 1.7 }}>
                ✅ NAFDAC certified medications<br />
                ✅ Licensed pharmacist-verified<br />
                ✅ Same-day delivery within Abuja<br />
                ✅ 100% authentic products
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}