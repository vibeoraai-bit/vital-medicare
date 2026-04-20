'use client'
import { motion } from 'framer-motion'
import { UserPlus, Upload, Package, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const steps = [
  { Icon: UserPlus, number: '01', title: 'Create Account', desc: 'Register in 2 minutes with your name, phone, and email address.', href: '/register' },
  { Icon: Upload, number: '02', title: 'Upload Prescription', desc: 'Photo or PDF — our system reads any format including handwriting.', href: '/prescriptions' },
  { Icon: Package, number: '03', title: 'We Prepare Your Order', desc: 'Licensed pharmacist verifies and carefully packs your medications.', href: '/shop' },
  { Icon: CheckCircle, number: '04', title: 'Delivered to Your Door', desc: 'Same-day delivery across Abuja. Track your order in real-time.', href: '/track-order' },
]

export default function HowItWorks() {
  return (
    <section style={{ background: '#141C24', padding: '80px 24px', borderTop: '1px solid rgba(45,156,219,0.08)', borderBottom: '1px solid rgba(45,156,219,0.08)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="badge" style={{ marginBottom: '14px' }}>How It Works</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#E0E6ED', marginBottom: '14px', fontWeight: 700 }}>
            Getting Your Medications Has Never Been Easier
          </h2>
          <p style={{ color: '#8896A7', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Four simple steps from registration to delivery at your doorstep.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
          {steps.map(({ Icon, number, title, desc, href }, i) => (
            <motion.div key={title}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
              style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '4.5rem', fontWeight: 700, color: 'rgba(45,156,219,0.08)', lineHeight: 1, marginBottom: '-16px', userSelect: 'none' }}>
                {number}
              </div>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(45,156,219,0.1)', border: '1px solid rgba(45,156,219,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 0 20px rgba(45,156,219,0.1)' }}>
                <Icon size={26} style={{ color: '#2d9cdb' }} />
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.1rem', marginBottom: '10px', fontWeight: 600 }}>{title}</h3>
              <p style={{ color: '#8896A7', fontSize: '14px', lineHeight: 1.65, maxWidth: '220px', margin: '0 auto 14px' }}>{desc}</p>
              <Link href={href} style={{ color: '#2d9cdb', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                Read more →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}