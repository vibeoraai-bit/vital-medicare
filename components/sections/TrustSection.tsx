'use client'
import { motion } from 'framer-motion'
import { Shield, Award, Users, Star } from 'lucide-react'

const stats = [
  { Icon: Users, number: '12,000+', label: 'Patients Served', sublabel: 'And growing every day' },
  { Icon: Shield, number: '98.7%', label: 'Prescription Accuracy', sublabel: 'Verified by PCN' },
  { Icon: Award, number: '15 Yrs', label: 'In Business', sublabel: 'Trusted since 2010' },
  { Icon: Star, number: '4.9/5', label: 'Customer Rating', sublabel: 'From 3,200+ reviews' },
]

export default function TrustSection() {
  return (
    <section style={{ background: '#0A0F14', padding: '80px 24px', borderTop: '1px solid rgba(45,156,219,0.08)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="badge" style={{ marginBottom: '14px' }}>Trusted by Nigerians</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#E0E6ED', fontWeight: 700 }}>Numbers That Speak for Themselves</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {stats.map(({ Icon, number, label, sublabel }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '28px', textAlign: 'center', transition: 'all 0.3s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(45,156,219,0.35)'; el.style.boxShadow = '0 0 24px rgba(45,156,219,0.12)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(45,156,219,0.12)'; el.style.boxShadow = 'none' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(45,156,219,0.1)', border: '1px solid rgba(45,156,219,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Icon size={22} style={{ color: '#2d9cdb' }}/>
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', fontWeight: 700, color: '#2d9cdb', lineHeight: 1, marginBottom: '8px', textShadow: '0 0 20px rgba(45,156,219,0.3)' }}>{number}</div>
              <div style={{ color: '#E0E6ED', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{label}</div>
              <div style={{ color: '#8896A7', fontSize: '12px' }}>{sublabel}</div>
            </motion.div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(45,156,219,0.1)', paddingTop: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span style={{ color: '#8896A7', fontSize: '12px', letterSpacing: '0.05em' }}>CERTIFIED & REGULATED BY:</span>
          {['NAFDAC', 'PCN', 'ISO 9001'].map(cert => (
            <span key={cert} style={{ background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.18)', color: '#2d9cdb', padding: '6px 18px', borderRadius: '50px', fontSize: '12px', fontWeight: 600 }}>{cert}</span>
          ))}
        </div>
      </div>
    </section>
  )
}