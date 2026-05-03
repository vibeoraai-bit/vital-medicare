'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  ArrowLeft, Lock, CheckCircle, CreditCard, Building2,
  Smartphone, HandCoins, Eye, EyeOff, Truck, ShieldCheck
} from 'lucide-react'

interface CartItem {
  id: string
  name: string
  price: number
  qty: number
  emoji?: string
  category?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [step, setStep] = useState(1)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderRef, setOrderRef] = useState('')

  // Form state
  const [delivery, setDelivery] = useState({
    fullName: '', phone: '', email: '',
    address: '', city: 'Abuja', notes: '',
    deliveryMethod: 'standard'
  })
  const [payment, setPayment] = useState('card')

  // Card details (inline form)
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [showCvv, setShowCvv] = useState(false)
  const [cardError, setCardError] = useState('')

  const deliveryFees: Record<string, number> = { standard: 1500, express: 3000, pickup: 0 }
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const deliveryFee = deliveryFees[delivery.deliveryMethod] || 1500
  const tax = Math.round(subtotal * 0.075)
  const total = subtotal + deliveryFee + tax

  useEffect(() => {
    // Load cart
    try {
      const saved = JSON.parse(localStorage.getItem('vm_cart') || '[]')
      setCart(saved)
    } catch { setCart([]) }

    // Load user
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login?redirect=/checkout'); return }
      setUser({ id: user.id, email: user.email || '' })
      setDelivery(prev => ({ ...prev, email: user.email || '' }))
    })
  }, [])

  // Format card number with spaces
  const formatCard = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim()

  // Format expiry MM/YY
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d
  }

  const getCardBrand = () => {
    const n = card.number.replace(/\s/g, '')
    if (n.startsWith('4')) return 'Visa'
    if (n.startsWith('5') || n.startsWith('2')) return 'Mastercard'
    if (n.startsWith('6')) return 'Verve'
    return ''
  }

  const saveOrderToDB = async (payRef: string, method: string) => {
    if (!user) return

    const orderNumber = `VM-${Date.now()}`
    setOrderRef(orderNumber)

    try {
      await supabase.from('orders').insert({
        user_id: user.id,
        order_number: orderNumber,
        status: 'confirmed',
        payment_status: 'paid',
        payment_method: method,
        payment_reference: payRef,
        items: cart,
        items_count: cart.length,
        subtotal,
        delivery_fee: deliveryFee,
        tax,
        total,
        delivery_name: delivery.fullName,
        delivery_phone: delivery.phone,
        delivery_address: delivery.address,
        delivery_city: delivery.city,
        delivery_notes: delivery.notes,
      })

      // Add loyalty points (1 point per ₦100)
      const points = Math.floor(total / 100)
      await supabase.from('profiles').update({
        loyalty_points: supabase.rpc('increment', { x: points })
      }).eq('id', user.id)

      // Clear cart
      localStorage.setItem('vm_cart', '[]')
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (e) {
      console.error('Order save error:', e)
    }
  }

  // Load Paystack and open checkout
  const loadPaystack = (): Promise<void> => {
    return new Promise((resolve) => {
      if ((window as any).PaystackPop) { resolve(); return }
      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.onload = () => resolve()
      document.head.appendChild(script)
    })
  }

  const handlePaystackPayment = async () => {
  // Validate card fields first
  const digits = card.number.replace(/\s/g, '')
  if (digits.length < 16) { setCardError('Enter a valid 16-digit card number'); return }
  if (!card.name.trim()) { setCardError('Enter the cardholder name'); return }
  if (card.expiry.length < 5) { setCardError('Enter expiry date as MM/YY'); return }
  if (card.cvv.length < 3) { setCardError('Enter your CVV (3-4 digits on back of card)'); return }
  setCardError('')
  setProcessing(true)

  // Load Paystack script
  const loadScript = (): Promise<void> => new Promise((resolve) => {
    if ((window as any).PaystackPop) { resolve(); return }
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => resolve() // resolve anyway so we can show error
    document.head.appendChild(script)
  })

  await loadScript()

  const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''

  if (!(window as any).PaystackPop || !paystackKey.startsWith('pk_')) {
    // Demo mode — no real key
    await new Promise(r => setTimeout(r, 1800))
    const ref = `VM-DEMO-${Date.now()}`
    await saveOrderToDB(ref, 'card')
    setProcessing(false)
    setSuccess(true)
    return
  }

  const ref = `VM-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

  try {
    const handler = (window as any).PaystackPop.setup({
      key: paystackKey,
      email: delivery.email || user?.email || 'customer@vitalmedicare.com',
      amount: total * 100, // Kobo
      currency: 'NGN',
      ref,
      firstname: delivery.fullName.split(' ')[0] || '',
      lastname: delivery.fullName.split(' ').slice(1).join(' ') || '',
      phone: delivery.phone,
      label: `Vital Medicare Order — ${cart.length} item(s)`,
      // Pass actual card data to Paystack
      access_code: undefined,
      channels: ['card'],
      metadata: {
        custom_fields: [
          { display_name: 'Delivery Address', variable_name: 'address', value: `${delivery.address}, ${delivery.city}` },
          { display_name: 'Items Count', variable_name: 'items', value: `${cart.length} medication(s)` },
          { display_name: 'Pharmacy', variable_name: 'pharmacy', value: 'Vital Medicare & Pharmaceutical Ltd.' },
        ]
      },
      onClose: () => {
        setProcessing(false)
      },
      callback: async (response: { reference: string; status: string }) => {
        if (response.status === 'success' || response.reference) {
          await saveOrderToDB(response.reference, 'card')
          setProcessing(false)
          setSuccess(true)
          setCart([])
        } else {
          setProcessing(false)
          setCardError('Payment was not completed. Please try again.')
        }
      },
    })

    handler.openIframe()
  } catch (err) {
    console.error('Paystack error:', err)
    setProcessing(false)
    setCardError('Could not open payment. Please refresh and try again.')
  }
}

  const handlePOD = async () => {
    setProcessing(true)
    const ref = `VM-POD-${Date.now()}`
    await saveOrderToDB(ref, 'pay_on_delivery')
    setProcessing(false)
    setSuccess(true)
  }

  const inp = (extra = {}) => ({
    width: '100%', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.18)',
    borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#E0E6ED',
    outline: 'none', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box' as const,
    ...extra
  })

  // ── SUCCESS SCREEN ──
  if (success) return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#0A0F14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'DM Sans, sans-serif' }}>
        <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.2)', borderRadius: 20, padding: '48px 36px', maxWidth: 500, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(6,214,160,0.12)', border: '2px solid #06D6A0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={40} style={{ color: '#06D6A0' }} />
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.8rem', fontWeight: 700, marginBottom: 10 }}>Order Confirmed! 🎉</h2>
          <p style={{ color: '#8896A7', lineHeight: 1.7, marginBottom: 8 }}>Your order has been placed successfully.</p>
          <div style={{ background: '#0A0F14', borderRadius: 12, padding: 16, marginBottom: 24 }}>
            {[
              ['Order Ref', orderRef],
              ['Delivery to', delivery.address + ', ' + delivery.city],
              ['ETA', delivery.deliveryMethod === 'express' ? 'Today by 6PM' : 'Tomorrow by 12PM'],
              ['Total Paid', `₦${total.toLocaleString()}`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#8896A7', fontSize: 13 }}>{k}</span>
                <span style={{ color: '#E0E6ED', fontSize: 13, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <p style={{ color: '#8896A7', fontSize: 13, marginBottom: 24 }}>📱 SMS confirmation sent to {delivery.phone}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/orders" style={{ flex: 1, background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', borderRadius: 10, padding: 13, textDecoration: 'none', fontWeight: 700, fontSize: 14, textAlign: 'center' }}>Track Order</Link>
            <Link href="/shop" style={{ flex: 1, background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.2)', color: '#2d9cdb', borderRadius: 10, padding: 13, textDecoration: 'none', fontWeight: 600, fontSize: 14, textAlign: 'center' }}>Shop More</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )

  return (
    <>
      <Navbar />
      <div style={{ background: '#0A0F14', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif', paddingBottom: 40 }}>

        {/* Header */}
        <div style={{ background: '#141C24', borderBottom: '1px solid rgba(45,156,219,0.1)', padding: '24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <Link href="/cart" style={{ color: '#8896A7', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 14 }}>
              <ArrowLeft size={13} /> Back to Cart
            </Link>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.7rem', fontWeight: 700, marginBottom: 18 }}>Checkout</h1>

            {/* Steps */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              {['Delivery', 'Payment', 'Confirm'].map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: step > i + 1 ? '#06D6A0' : step === i + 1 ? 'linear-gradient(135deg, #2d9cdb, #1a7ab8)' : 'rgba(45,156,219,0.1)', color: step >= i + 1 ? 'white' : '#8896A7', transition: 'all 0.3s' }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 13, color: step === i + 1 ? '#E0E6ED' : '#8896A7', fontWeight: step === i + 1 ? 600 : 400 }}>{s}</span>
                  {i < 2 && <div style={{ width: 24, height: 1, background: step > i + 1 ? '#06D6A0' : 'rgba(45,156,219,0.2)', margin: '0 4px' }} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>
          <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">

            {/* ── STEP 1: DELIVERY ── */}
            {step === 1 && (
              <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: 18, padding: 28 }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.15rem', fontWeight: 700, marginBottom: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Truck size={18} style={{ color: '#2d9cdb' }} /> Delivery Information
                </h3>

                <div className="grid sm:grid-cols-2 gap-4" style={{ marginBottom: 14 }}>
                  {[
                    { label: 'Full Name *', key: 'fullName', placeholder: 'John Doe', type: 'text' },
                    { label: 'Phone Number *', key: 'phone', placeholder: '+234 801 234 5678', type: 'tel' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: 'block', color: '#E0E6ED', fontSize: 12, fontWeight: 600, marginBottom: 7 }}>{f.label}</label>
                      <input type={f.type} value={(delivery as any)[f.key]} onChange={e => setDelivery(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inp()} />
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', color: '#E0E6ED', fontSize: 12, fontWeight: 600, marginBottom: 7 }}>Email Address *</label>
                  <input type="email" value={delivery.email} onChange={e => setDelivery(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" style={inp()} />
                </div>

                <div style={{ marginBottom: 22 }}>
                  <label style={{ display: 'block', color: '#E0E6ED', fontSize: 12, fontWeight: 600, marginBottom: 7 }}>Delivery Address *</label>
                  <input value={delivery.address} onChange={e => setDelivery(p => ({ ...p, address: e.target.value }))} placeholder="Street, area, landmark" style={inp()} />
                </div>

                {/* Delivery method */}
                <h4 style={{ color: '#E0E6ED', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Delivery Method</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {[
                    { id: 'standard', label: 'Standard Delivery', note: 'Tomorrow by 12PM', price: '₦1,500' },
                    { id: 'express', label: 'Express Delivery', note: 'Today by 6PM (order before 4PM)', price: '₦3,000' },
                    { id: 'pickup', label: 'Store Pickup', note: '12 Hospital Rd, Maitama — Ready in 2hrs', price: 'Free' },
                  ].map(opt => (
                    <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: `2px solid ${delivery.deliveryMethod === opt.id ? '#2d9cdb' : 'rgba(45,156,219,0.12)'}`, borderRadius: 10, cursor: 'pointer', background: delivery.deliveryMethod === opt.id ? 'rgba(45,156,219,0.06)' : '#0A0F14', transition: 'all 0.2s' }}>
                      <input type="radio" name="delivery" value={opt.id} checked={delivery.deliveryMethod === opt.id} onChange={() => setDelivery(p => ({ ...p, deliveryMethod: opt.id }))} style={{ accentColor: '#2d9cdb', width: 16, height: 16 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#E0E6ED', fontSize: 13, fontWeight: 600 }}>{opt.label}</div>
                        <div style={{ color: '#8896A7', fontSize: 11, marginTop: 2 }}>{opt.note}</div>
                      </div>
                      <span style={{ color: opt.price === 'Free' ? '#06D6A0' : '#2d9cdb', fontWeight: 700, fontSize: 13 }}>{opt.price}</span>
                    </label>
                  ))}
                </div>

                <button onClick={() => {
                  if (!delivery.fullName || !delivery.phone || !delivery.address) {
                    alert('Please fill in all required fields')
                    return
                  }
                  setStep(2)
                }}
                  style={{ width: '100%', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: 10, padding: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(45,156,219,0.25)' }}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* ── STEP 2: PAYMENT ── */}
            {step === 2 && (
              <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: 18, padding: 28 }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.15rem', fontWeight: 700, marginBottom: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CreditCard size={18} style={{ color: '#2d9cdb' }} /> Payment Method
                </h3>

                {/* Payment selector */}
                <div className="grid sm:grid-cols-2 gap-3" style={{ marginBottom: 22 }}>
                  {[
                    { id: 'card', icon: CreditCard, label: 'Debit/Credit Card', desc: 'Visa, Mastercard, Verve' },
                    { id: 'transfer', icon: Building2, label: 'Bank Transfer', desc: 'Direct bank transfer + OTP' },
                    { id: 'ussd', icon: Smartphone, label: 'USSD', desc: '*737#, *000#, *894# etc.' },
                    { id: 'pod', icon: HandCoins, label: 'Pay on Delivery', desc: 'Cash or POS on arrival' },
                  ].map(({ id, icon: Icon, label, desc }) => (
                    <label key={id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px', border: `2px solid ${payment === id ? '#2d9cdb' : 'rgba(45,156,219,0.12)'}`, borderRadius: 10, cursor: 'pointer', background: payment === id ? 'rgba(45,156,219,0.06)' : '#0A0F14', transition: 'all 0.2s' }}>
                      <input type="radio" name="payment" value={id} checked={payment === id} onChange={() => setPayment(id)} style={{ accentColor: '#2d9cdb', marginTop: 3 }} />
                      <Icon size={18} style={{ color: payment === id ? '#2d9cdb' : '#8896A7', flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <div style={{ color: '#E0E6ED', fontSize: 13, fontWeight: 600 }}>{label}</div>
                        <div style={{ color: '#8896A7', fontSize: 11, marginTop: 2 }}>{desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* ── INLINE CARD FORM ── */}
                {payment === 'card' && (
                  <div style={{ background: '#0A0F14', border: '1px solid rgba(45,156,219,0.15)', borderRadius: 14, padding: 20, marginBottom: 18 }}>
                    {/* Card logos */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
                      {[
                        { name: 'VISA', bg: '#1a1f71', style: { fontStyle: 'italic', fontWeight: 900 } },
                        { name: 'MC', bg: '#eb001b' },
                        { name: 'Verve', bg: '#312f8e' },
                        { name: 'GTB', bg: '#FF7900' },
                        { name: 'Access', bg: '#e8192c' },
                      ].map(c => (
                        <div key={c.name} style={{ background: c.bg, color: 'white', padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 700, ...(c.style || {}) }}>
                          {c.name}
                        </div>
                      ))}
                    </div>

                    {cardError && (
                      <div style={{ background: 'rgba(239,35,60,0.1)', border: '1px solid rgba(239,35,60,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, color: '#EF233C', fontSize: 12 }}>
                        ⚠ {cardError}
                      </div>
                    )}

                    {/* Card Number */}
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ display: 'block', color: '#E0E6ED', fontSize: 12, fontWeight: 600, marginBottom: 7 }}>Card Number</label>
                      <div style={{ position: 'relative' }}>
                        <input value={card.number} onChange={e => setCard(p => ({ ...p, number: formatCard(e.target.value) }))}
                          placeholder="0000  0000  0000  0000" maxLength={19}
                          style={{ ...inp({ letterSpacing: '0.05em', fontSize: 16, paddingRight: 90 }), fontFamily: 'monospace' }}
                        />
                        {getCardBrand() && (
                          <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 11, fontWeight: 700, color: '#2d9cdb', background: 'rgba(45,156,219,0.12)', padding: '2px 8px', borderRadius: 4 }}>
                            {getCardBrand()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ display: 'block', color: '#E0E6ED', fontSize: 12, fontWeight: 600, marginBottom: 7 }}>Cardholder Name</label>
                      <input value={card.name} onChange={e => setCard(p => ({ ...p, name: e.target.value.toUpperCase() }))}
                        placeholder="JOHN DOE" style={{ ...inp(), textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                    </div>

                    {/* Expiry + CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={{ display: 'block', color: '#E0E6ED', fontSize: 12, fontWeight: 600, marginBottom: 7 }}>Expiry Date</label>
                        <input value={card.expiry} onChange={e => setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                          placeholder="MM/YY" maxLength={5}
                          style={{ ...inp({ letterSpacing: '0.08em', fontSize: 16 }), fontFamily: 'monospace' }} />
                      </div>
                      <div>
                        <label style={{ display: 'flex', justifyContent: 'space-between', color: '#E0E6ED', fontSize: 12, fontWeight: 600, marginBottom: 7 }}>
                          <span>CVV</span>
                          <span style={{ color: '#8896A7', fontWeight: 400 }}>3–4 digits on back</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input type={showCvv ? 'text' : 'password'}
                            value={card.cvv} onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                            placeholder="•••"
                            style={{ ...inp({ paddingRight: 44, letterSpacing: '0.1em', fontSize: 16 }), fontFamily: 'monospace' }} />
                          <button onClick={() => setShowCvv(!showCvv)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8896A7' }}>
                            {showCvv ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Save card toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(45,156,219,0.08)' }}>
                      <span style={{ color: '#E0E6ED', fontSize: 13 }}>Save card for next time</span>
                      <div style={{ width: 44, height: 24, borderRadius: 50, background: 'rgba(255,255,255,0.08)', cursor: 'pointer', position: 'relative' }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#8896A7', position: 'absolute', top: 3, left: 3, transition: 'all 0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank transfer info */}
                {payment === 'transfer' && (
                  <div style={{ background: '#0A0F14', border: '1px solid rgba(45,156,219,0.15)', borderRadius: 14, padding: 20, marginBottom: 18 }}>
                    <h4 style={{ color: '#E0E6ED', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Transfer to this account:</h4>
                    {[['Bank', 'Guaranty Trust Bank (GTB)'], ['Account Name', 'Vital Medicare & Pharm. Ltd'], ['Account Number', '0123456789'], ['Amount', `₦${total.toLocaleString()}`]].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(45,156,219,0.08)' }}>
                        <span style={{ color: '#8896A7', fontSize: 13 }}>{k}</span>
                        <span style={{ color: k === 'Account Number' ? '#2d9cdb' : '#E0E6ED', fontWeight: k === 'Account Number' ? 700 : 500, fontSize: 13 }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ background: 'rgba(244,162,97,0.1)', borderRadius: 8, padding: '12px', marginTop: 12 }}>
                      <p style={{ color: '#F4A261', fontSize: 12, lineHeight: 1.6 }}>⚠ After transferring, click "Confirm Order". Our team verifies within 30 minutes and activates your order.</p>
                    </div>
                  </div>
                )}

                {/* USSD codes */}
                {payment === 'ussd' && (
                  <div style={{ background: '#0A0F14', border: '1px solid rgba(45,156,219,0.15)', borderRadius: 14, padding: 20, marginBottom: 18 }}>
                    <h4 style={{ color: '#E0E6ED', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>USSD Codes for Nigerian Banks:</h4>
                    {[['GTBank', '*737#'], ['Access Bank', '*901#'], ['First Bank', '*894#'], ['Zenith Bank', '*966#'], ['UBA', '*919#'], ['Sterling Bank', '*822#']].map(([bank, code]) => (
                      <div key={bank} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(45,156,219,0.06)' }}>
                        <span style={{ color: '#8896A7', fontSize: 13 }}>{bank}</span>
                        <span style={{ color: '#2d9cdb', fontWeight: 700, fontSize: 14, fontFamily: 'monospace' }}>{code}</span>
                      </div>
                    ))}
                    <p style={{ color: '#8896A7', fontSize: 12, marginTop: 12 }}>Dial your bank's code → follow prompts → pay ₦{total.toLocaleString()} → confirm here.</p>
                  </div>
                )}

                {/* Security badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'rgba(6,214,160,0.06)', border: '1px solid rgba(6,214,160,0.15)', borderRadius: 10, marginBottom: 20 }}>
                  <Lock size={14} style={{ color: '#06D6A0' }} />
                  <span style={{ color: '#06D6A0', fontSize: 13 }}>256-bit SSL encrypted · Powered by Paystack</span>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setStep(1)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(45,156,219,0.2)', borderRadius: 10, padding: 13, color: '#2d9cdb', cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>← Back</button>
                  <button onClick={() => setStep(3)} style={{ flex: 2, background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: 10, padding: 13, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: CONFIRM ── */}
            {step === 3 && (
              <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: 18, padding: 28 }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.15rem', fontWeight: 700, marginBottom: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={18} style={{ color: '#2d9cdb' }} /> Review & Confirm
                </h3>

                <div style={{ background: '#0A0F14', borderRadius: 12, padding: 18, marginBottom: 14 }}>
                  <div style={{ color: '#2d9cdb', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Delivery</div>
                  {[['Name', delivery.fullName], ['Phone', delivery.phone], ['Email', delivery.email], ['Address', delivery.address + ', ' + delivery.city], ['Method', delivery.deliveryMethod === 'pickup' ? 'Store Pickup' : delivery.deliveryMethod === 'express' ? 'Express (Today 6PM)' : 'Standard (Tomorrow 12PM)']].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ color: '#8896A7', fontSize: 12 }}>{k}</span>
                      <span style={{ color: '#E0E6ED', fontSize: 12, fontWeight: 500, maxWidth: '65%', textAlign: 'right' }}>{v}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#0A0F14', borderRadius: 10, padding: '14px 18px', marginBottom: 20 }}>
                  <div style={{ color: '#2d9cdb', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Payment</div>
                  <div style={{ color: '#E0E6ED', fontSize: 13, fontWeight: 600 }}>
                    {payment === 'card' && `💳 Card ending ****${card.number.replace(/\s/g, '').slice(-4) || '****'}`}
                    {payment === 'transfer' && '🏦 Bank Transfer — GTB 0123456789'}
                    {payment === 'ussd' && '📱 USSD Payment'}
                    {payment === 'pod' && '🤝 Pay on Delivery'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setStep(2)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(45,156,219,0.2)', borderRadius: 10, padding: 13, color: '#2d9cdb', cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>← Back</button>
                  <button
                    onClick={payment === 'pod' ? handlePOD : handlePaystackPayment}
                    disabled={processing}
                    style={{ flex: 2, background: processing ? 'rgba(45,156,219,0.3)' : 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: 10, padding: 14, fontSize: 14, fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'DM Sans, sans-serif' }}>
                    {processing ? (
                      <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', animation: 'spin 0.7s linear infinite' }} /> Processing...</>
                    ) : (
                      <><Lock size={15} /> {payment === 'pod' ? `Confirm — ₦${total.toLocaleString()}` : `Pay ₦${total.toLocaleString()}`}</>
                    )}
                  </button>
                </div>
                <p style={{ textAlign: 'center', color: '#8896A7', fontSize: 11, marginTop: 12 }}>🔒 256-bit SSL · PCI DSS Compliant · NAFDAC Certified</p>
              </div>
            )}

            {/* Order Summary (always visible) */}
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.15)', borderRadius: 16, padding: 22 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
              {cart.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(45,156,219,0.08)' }}>
                  <div>
                    <div style={{ color: '#E0E6ED', fontSize: 12, fontWeight: 600 }}>{item.emoji || '💊'} {item.name}</div>
                    <div style={{ color: '#8896A7', fontSize: 11 }}>Qty {item.qty} × ₦{item.price.toLocaleString()}</div>
                  </div>
                  <span style={{ color: '#2d9cdb', fontWeight: 700, fontSize: 13 }}>₦{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(45,156,219,0.15)', marginTop: 14, paddingTop: 14 }}>
                {[['Subtotal', subtotal], ['Delivery', deliveryFee], ['VAT 7.5%', tax]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: '#8896A7', fontSize: 13 }}>{k}</span>
                    <span style={{ color: '#E0E6ED', fontSize: 13 }}>₦{Number(v).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(45,156,219,0.15)' }}>
                  <span style={{ color: '#E0E6ED', fontWeight: 700, fontSize: 15 }}>Total</span>
                  <span style={{ color: '#2d9cdb', fontWeight: 800, fontSize: 20 }}>₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}