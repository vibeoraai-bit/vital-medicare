'use client'
import { motion } from 'framer-motion'
import { ShoppingBag, FileText, MessageCircle, TestTube, Truck, Video } from 'lucide-react'
import Link from 'next/link'

const services = [
  { Icon: ShoppingBag, title: 'Online Pharmacy', desc: 'Browse 500+ NAFDAC-approved medications with real-time stock updates and price comparisons.', href: '/shop' },
  { Icon: FileText, title: 'Prescription Upload', desc: 'Upload any prescription — our system reads handwriting and digital documents instantly.', href: '/prescriptions' },
  { Icon: MessageCircle, title: 'Pharmacist Chat', desc: 'Chat live with licensed pharmacists available 24/7 for guidance and medication advice.', href: '/booking' },
  { Icon: TestTube, title: 'Lab Test Booking', desc: 'Book home sample collection for 200+ tests. Certified results in 24 hours.', href: '/booking' },
  { Icon: Truck, title: 'Same-day Delivery', desc: 'Order before 4PM and receive your medications anywhere in Abuja the same day.', href: '/shop' },
  { Icon: Video, title: 'Video Consultations', desc: 'Face-to-face video calls with certified doctors and specialist pharmacists.', href: '/booking' },
]

export default function Services() {
  return (
    <section style={{ background: '#0A0F14', padding: '80px 24px', borderTop: '1px solid rgba(45,156,219,0.08)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="badge" style={{ marginBottom: '14px' }}>Our Services</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#E0E6ED', marginBottom: '14px', fontWeight: 700 }}>
            Everything You Need for Better Health
          </h2>
          <p style={{ color: '#8896A7', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            From prescription uploads to doorstep delivery, we handle your healthcare needs end-to-end.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {services.map(({ Icon, title, desc, href }, i) => (
            <motion.div key={title}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '28px', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-6px)'; el.style.boxShadow = '0 0 28px rgba(45,156,219,0.15)'; el.style.borderColor = 'rgba(45,156,219,0.35)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = 'rgba(45,156,219,0.12)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(45,156,219,0.1)', border: '1px solid rgba(45,156,219,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Icon size={24} style={{ color: '#2d9cdb' }} />
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', color: '#E0E6ED', marginBottom: '10px', fontWeight: 600 }}>{title}</h3>
              <p style={{ color: '#8896A7', fontSize: '14px', lineHeight: 1.65, marginBottom: '18px' }}>{desc}</p>
              <Link href={href} style={{ color: '#2d9cdb', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', transition: 'gap 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.gap = '8px'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.gap = '4px'}>
                Learn more →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}