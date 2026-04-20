'use client'
import { motion } from 'framer-motion'
import { ShoppingCart, Star, Zap, Heart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const products = [
  { id: 1, name: 'Amoxicillin 500mg', generic: 'Amoxicillin Trihydrate', manufacturer: 'Emzor Pharmaceuticals', price: 1200, originalPrice: 1500, nafdac: 'A4-1234', requiresPrescription: true, rating: 4.8, reviews: 124, inStock: true, badge: 'Best Seller' },
  { id: 2, name: 'Vitamin C 1000mg', generic: 'Ascorbic Acid', manufacturer: 'Sanofi Nigeria', price: 800, originalPrice: 0, nafdac: 'A4-4567', requiresPrescription: false, rating: 4.9, reviews: 89, inStock: true, badge: 'Popular' },
  { id: 3, name: 'Paracetamol 500mg', generic: 'Acetaminophen', manufacturer: 'May & Baker Nigeria', price: 350, originalPrice: 0, nafdac: 'A4-2345', requiresPrescription: false, rating: 4.7, reviews: 256, inStock: true, badge: null },
  { id: 4, name: 'Omeprazole 20mg', generic: 'Omeprazole BP', manufacturer: 'Roche Nigeria', price: 1800, originalPrice: 2200, nafdac: 'A4-6789', requiresPrescription: true, rating: 4.6, reviews: 67, inStock: false, badge: null },
]

export default function FeaturedProducts() {
  const router = useRouter()
  const [cart, setCart] = useState<number[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])

  const addToCart = (id: number) => setCart(prev => prev.includes(id) ? prev : [...prev, id])
  const toggleWishlist = (id: number) => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const buyNow = (id: number) => { addToCart(id); router.push('/checkout') }

  return (
    <section style={{ background: '#0A0F14', padding: '80px 24px', borderTop: '1px solid rgba(45,156,219,0.08)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="badge" style={{ marginBottom: '12px' }}>Featured Products</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#E0E6ED', fontWeight: 700 }}>Popular Medications</h2>
          </div>
          <Link href="/shop" style={{ color: '#2d9cdb', fontWeight: 600, textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid rgba(45,156,219,0.25)', padding: '8px 18px', borderRadius: '8px', transition: 'all 0.2s' }}>
            View All Products →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {products.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ background: '#141C24', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(45,156,219,0.12)', transition: 'all 0.3s ease', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(45,156,219,0.15)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,156,219,0.35)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,156,219,0.12)' }}>

              {/* Image */}
              <div style={{ background: 'linear-gradient(135deg, #141C24, #0A0F14)', height: '155px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(45,156,219,0.08)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(45,156,219,0.1)', border: '1px solid rgba(45,156,219,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 60 60" fill="none">
                    <ellipse cx="30" cy="30" rx="26" ry="16" fill="rgba(45,156,219,0.2)"/>
                    <ellipse cx="30" cy="30" rx="16" ry="10" fill="rgba(45,156,219,0.15)"/>
                  </svg>
                </div>
                {/* Badges */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(45,156,219,0.15)', color: '#2d9cdb', fontSize: '9px', padding: '3px 8px', borderRadius: '4px', fontWeight: 500 }}>{p.nafdac}</div>
                {p.requiresPrescription && <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239,35,60,0.2)', color: '#EF233C', fontSize: '9px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(239,35,60,0.3)' }}>Rx</div>}
                {p.badge && !p.requiresPrescription && <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(45,156,219,0.2)', color: '#2d9cdb', fontSize: '9px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>{p.badge}</div>}
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(10,15,20,0.8)', padding: '3px 8px', borderRadius: '50px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: p.inStock ? '#06D6A0' : '#EF233C' }}/>
                  <span style={{ color: '#E0E6ED', fontSize: '9px' }}>{p.inStock ? 'In Stock' : 'Low Stock'}</span>
                </div>
                {/* Wishlist */}
                <button onClick={() => toggleWishlist(p.id)}
                  style={{ position: 'absolute', top: '10px', right: p.requiresPrescription || p.badge ? '56px' : '10px', background: 'rgba(10,15,20,0.6)', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={12} style={{ color: wishlist.includes(p.id) ? '#EF233C' : '#8896A7', fill: wishlist.includes(p.id) ? '#EF233C' : 'none' }}/>
                </button>
              </div>

              {/* Info */}
              <div style={{ padding: '16px' }}>
                <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', color: '#E0E6ED', fontWeight: 700, marginBottom: '3px' }}>{p.name}</h4>
                <p style={{ color: '#2d9cdb', fontSize: '11px', marginBottom: '1px', opacity: 0.8 }}>{p.generic}</p>
                <p style={{ color: '#8896A7', fontSize: '10px', marginBottom: '10px' }}>{p.manufacturer}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '10px' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} style={{ color: '#F4A261', fill: '#F4A261' }}/>)}
                  <span style={{ color: '#2d9cdb', fontSize: '11px', fontWeight: 600, marginLeft: '4px' }}>{p.rating}</span>
                  <span style={{ color: '#8896A7', fontSize: '10px' }}>({p.reviews})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <span style={{ color: '#2d9cdb', fontSize: '17px', fontWeight: 800 }}>₦{p.price.toLocaleString()}</span>
                  {p.originalPrice > 0 && (
                    <>
                      <span style={{ color: '#8896A7', fontSize: '12px', textDecoration: 'line-through' }}>₦{p.originalPrice.toLocaleString()}</span>
                      <span style={{ background: 'rgba(244,162,97,0.15)', color: '#F4A261', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>SAVE ₦{(p.originalPrice - p.price).toLocaleString()}</span>
                    </>
                  )}
                </div>
                {/* TWO BUTTONS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button onClick={() => addToCart(p.id)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: cart.includes(p.id) ? 'rgba(6,214,160,0.15)' : 'rgba(45,156,219,0.12)', color: cart.includes(p.id) ? '#06D6A0' : '#2d9cdb', border: `1px solid ${cart.includes(p.id) ? 'rgba(6,214,160,0.3)' : 'rgba(45,156,219,0.25)'}`, borderRadius: '8px', padding: '9px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                    <ShoppingCart size={13}/> {cart.includes(p.id) ? '✓ Added' : 'Add to Cart'}
                  </button>
                  <button onClick={() => buyNow(p.id)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '8px', padding: '9px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 12px rgba(45,156,219,0.2)' }}>
                    <Zap size={13}/> Buy Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}