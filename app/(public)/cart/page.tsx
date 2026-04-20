'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react'
import { useRouter } from 'next/navigation'

const initialCart = [
  { id:1, name:'Amoxicillin 500mg', generic:'Amoxicillin Trihydrate', price:1200, qty:2, requiresPrescription:true },
  { id:2, name:'Vitamin C 1000mg', generic:'Ascorbic Acid', price:800, qty:1, requiresPrescription:false },
  { id:3, name:'Paracetamol 500mg', generic:'Acetaminophen', price:350, qty:3, requiresPrescription:false },
]

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState(initialCart)
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
  }
  const remove = (id: number) => setCart(prev => prev.filter(item => item.id !== id))

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const delivery = 500
  const discount = promoApplied ? Math.floor(subtotal * 0.1) : 0
  const total = subtotal + delivery - discount

  return (
    <>
      <Navbar />
      <div style={{ background: '#0A0F14', minHeight: '100vh', paddingTop: '64px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ background: 'linear-gradient(135deg, #0A0F14, #141C24)', borderBottom: '1px solid rgba(0,212,255,0.1)', padding: '40px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShoppingCart size={28} style={{ color: '#00D4FF' }}/> My Cart
            </h1>
            <p style={{ color: '#8896A7', marginTop: '6px' }}>{cart.length} items in your cart</p>
          </div>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <ShoppingCart size={64} style={{ color: 'rgba(0,212,255,0.2)', marginBottom: '20px' }}/>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.5rem', marginBottom: '10px' }}>Your cart is empty</h3>
              <p style={{ color: '#8896A7', marginBottom: '24px' }}>Browse our medications and add items to your cart</p>
              <Link href="/shop" style={{ background: 'linear-gradient(135deg, #00D4FF, #0099CC)', color: '#0A0F14', padding: '12px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>Browse Shop</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>

              {/* Cart Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cart.map(item => (
                  <div key={item.id} style={{ background: '#141C24', border: '1px solid rgba(0,212,255,0.1)', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'linear-gradient(135deg, #141C24, #0A0F14)', border: '1px solid rgba(0,212,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="28" height="28" viewBox="0 0 60 60" fill="none">
                        <ellipse cx="30" cy="30" rx="26" ry="16" fill="rgba(0,212,255,0.15)"/>
                        <ellipse cx="30" cy="30" rx="16" ry="10" fill="rgba(0,212,255,0.1)"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: '140px' }}>
                      <div style={{ color: '#E0E6ED', fontSize: '14px', fontWeight: 600, marginBottom: '3px' }}>{item.name}</div>
                      <div style={{ color: '#8896A7', fontSize: '11px', marginBottom: '4px' }}>{item.generic}</div>
                      {item.requiresPrescription && (
                        <span style={{ background: 'rgba(239,35,60,0.15)', border: '1px solid rgba(239,35,60,0.3)', color: '#EF233C', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>Rx Required</span>
                      )}
                    </div>
                    <div style={{ color: '#00D4FF', fontSize: '15px', fontWeight: 700 }}>₦{item.price.toLocaleString()}</div>
                    {/* Qty Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0A0F14', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '8px', padding: '4px 8px' }}>
                      <button onClick={() => updateQty(item.id, -1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#8896A7', display: 'flex', alignItems: 'center', padding: '2px' }}>
                        <Minus size={14}/>
                      </button>
                      <span style={{ color: '#E0E6ED', fontSize: '14px', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#00D4FF', display: 'flex', alignItems: 'center', padding: '2px' }}>
                        <Plus size={14}/>
                      </button>
                    </div>
                    <div style={{ color: '#E0E6ED', fontSize: '15px', fontWeight: 700, minWidth: '80px', textAlign: 'right' }}>₦{(item.price * item.qty).toLocaleString()}</div>
                    <button onClick={() => remove(item.id)} style={{ background: 'rgba(239,35,60,0.1)', border: '1px solid rgba(239,35,60,0.2)', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#EF233C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={15}/>
                    </button>
                  </div>
                ))}

                {/* Continue shopping */}
                <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#00D4FF', textDecoration: 'none', fontSize: '13px', fontWeight: 500, marginTop: '4px' }}>
                  ← Continue Shopping
                </Link>
              </div>

              {/* Summary */}
              <div style={{ background: '#141C24', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '16px', padding: '24px', position: 'sticky', top: '80px' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>Order Summary</h3>

                {/* Promo */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: '#0A0F14', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '8px', padding: '10px 12px' }}>
                    <Tag size={14} style={{ color: '#8896A7' }}/>
                    <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="Promo code" style={{ background: 'transparent', border: 'none', outline: 'none', color: '#E0E6ED', fontSize: '13px', flex: 1, fontFamily: 'Inter, sans-serif' }}/>
                  </div>
                  <button onClick={() => { if(promo === 'VITAL10') setPromoApplied(true) }}
                    style={{ background: promoApplied ? '#06D6A0' : 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', color: promoApplied ? '#0A0F14' : '#00D4FF', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {promoApplied ? '✓ Applied' : 'Apply'}
                  </button>
                </div>
                {promoApplied && <div style={{ color: '#06D6A0', fontSize: '12px', marginBottom: '12px', marginTop: '-12px' }}>✓ 10% discount applied! Code: VITAL10</div>}

                {/* Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {[
                    ['Subtotal', `₦${subtotal.toLocaleString()}`],
                    ['Delivery', `₦${delivery.toLocaleString()}`],
                    ...(promoApplied ? [['Discount (10%)', `-₦${discount.toLocaleString()}`]] : []),
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#8896A7', fontSize: '13px' }}>{k}</span>
                      <span style={{ color: k === 'Discount (10%)' ? '#06D6A0' : '#E0E6ED', fontSize: '13px', fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid rgba(0,212,255,0.15)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ color: '#E0E6ED', fontSize: '15px', fontWeight: 700 }}>Total</span>
                  <span style={{ color: '#00D4FF', fontSize: '18px', fontWeight: 800 }}>₦{total.toLocaleString()}</span>
                </div>

                <button onClick={() => router.push('/checkout')}
                  style={{ width: '100%', background: 'linear-gradient(135deg, #00D4FF, #0099CC)', color: '#0A0F14', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 0 20px rgba(0,212,255,0.25)' }}>
                  Proceed to Checkout <ArrowRight size={18}/>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', color: '#8896A7', fontSize: '11px' }}>
                  <ShieldCheck size={12} style={{ color: '#06D6A0' }}/> Secure checkout · SSL encrypted
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}