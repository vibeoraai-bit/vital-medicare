'use client'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  { name: 'Abdullahi Abdurrahman', city: 'G.R.A, Maiduguri', initials: 'AA', rating: 5, text: 'Vital Medicare saved me during a late-night emergency. My prescription was verified in 20 minutes and medications delivered before midnight. Absolutely incredible service!', service: 'Emergency Delivery' },
  { name: 'Dr. F,z Wasili', city: 'Barrack, Maiduguri', initials: 'FZ', rating: 5, text: 'As a doctor, I recommend Vital Medicare to all my patients. Their pharmacists are knowledgeable, stock is always fresh, and prescription verification is thorough.', service: 'Pharmacist Consultation' },
  { name: 'Ezikiel, Musa', city: 'Polo, Highcourt', initials: 'EM', rating: 5, text: 'The subscription plan for my monthly medications is a game changer. I never run out of my blood pressure medications anymore. The reminders are so helpful!', service: 'Subscription Plan' },
]

export default function Testimonials() {
  return (
    <section style={{ background: '#141C24', padding: '80px 24px', borderTop: '1px solid rgba(45,156,219,0.08)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="badge" style={{ marginBottom: '14px' }}>Testimonials</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#E0E6ED', fontWeight: 700 }}>What Our Patients Say</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {testimonials.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
              style={{ background: '#0A0F14', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '20px', padding: '28px', transition: 'all 0.3s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(45,156,219,0.3)'; el.style.boxShadow = '0 0 24px rgba(45,156,219,0.1)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(45,156,219,0.12)'; el.style.boxShadow = 'none' }}>
              <div style={{ display: 'flex', gap: '3px', marginBottom: '16px' }}>
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} style={{ color: '#F4A261', fill: '#F4A261' }}/>)}
              </div>
              <p style={{ color: '#8896A7', fontSize: '14px', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '22px' }}>&ldquo;{t.text}&rdquo;</p>
              <div style={{ borderTop: '1px solid rgba(45,156,219,0.1)', paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '14px' }}>{t.initials}</div>
                  <div>
                    <div style={{ color: '#E0E6ED', fontWeight: 600, fontSize: '13px' }}>{t.name}</div>
                    <div style={{ color: '#8896A7', fontSize: '11px' }}>{t.city}</div>
                  </div>
                </div>
                <span style={{ background: 'rgba(45,156,219,0.1)', border: '1px solid rgba(45,156,219,0.2)', color: '#2d9cdb', padding: '4px 10px', borderRadius: '50px', fontSize: '10px', fontWeight: 600 }}>{t.service}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}