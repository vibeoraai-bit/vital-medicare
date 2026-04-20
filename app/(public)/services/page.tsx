'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { ShoppingBag, FileText, MessageCircle, TestTube, Truck, Video, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    id: 'pharmacy', Icon: ShoppingBag, title: 'Online Pharmacy', price: 'Free',
    desc: 'Browse 500+ NAFDAC-approved medications with real-time stock updates, price comparisons, and alternative suggestions.',
    features: ['500+ medications', 'Real-time stock', 'NAFDAC verified', 'Alternatives suggested']
  },
  {
    id: 'prescription', Icon: FileText, title: 'Prescription Upload', price: 'Free',
    desc: 'Upload any prescription — our OCR technology reads handwriting and digital documents. Verified by licensed pharmacists within 20 minutes.',
    features: ['Reads handwriting', 'JPG, PNG, PDF', 'Verified in 20 mins', 'Expiry tracking']
  },
  {
    id: 'chat', Icon: MessageCircle, title: 'Pharmacist Chat', price: 'Free',
    desc: 'Chat live with licensed pharmacists available 24/7 for medication guidance, drug interaction checks, and general health advice.',
    features: ['24/7 availability', 'Licensed pharmacists', 'Drug interaction check', 'Private & secure']
  },
  {
    id: 'lab', Icon: TestTube, title: 'Lab Test Booking', price: 'From ₦5,000',
    desc: 'Book home sample collection for 200+ diagnostic tests. Certified results delivered to your app within 24 hours.',
    features: ['200+ tests', 'Home collection', 'Results in 24hrs', 'Doctor interpretation']
  },
  {
    id: 'delivery', Icon: Truck, title: 'Same-day Delivery', price: '₦500 flat fee',
    desc: 'Order before 8PM and receive your medications anywhere in Maiduguri the same day. Real-time GPS tracking included.',
    features: ['Same-day delivery', 'GPS tracking', 'Maiduguri coverage', 'Contactless option']
  },
  {
    id: 'video', Icon: Video, title: 'Video Consultations', price: 'From ₦3,000',
    desc: 'Face-to-face video calls with certified doctors and specialist pharmacists for comprehensive health consultations.',
    features: ['HD video calls', 'Certified doctors', 'E-prescription', 'Follow-up included']
  },
]

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '64px', fontFamily: 'Inter, sans-serif', background: '#0A0F14' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #141C24, #0A0F14)', padding: '80px 24px', textAlign: 'center', borderBottom: '1px solid rgba(45,156,219,0.12)' }}>
          <div className="badge" style={{ marginBottom: '16px' }}>Our Services</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, marginBottom: '16px' }}>
            Complete Healthcare Solutions
          </h1>
          <p style={{ color: '#8896A7', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.75 }}>
            From prescription uploads to doorstep delivery — everything you need for your health in one trusted platform.
          </p>
        </div>

        {/* Services Grid */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {services.map(({ Icon, title, desc, price, features }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ background: '#141C24', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(45,156,219,0.12)', transition: 'all 0.3s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(45,156,219,0.4)'; el.style.boxShadow = '0 0 32px rgba(45,156,219,0.1)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(45,156,219,0.12)'; el.style.boxShadow = 'none' }}>

                {/* Card top */}
                <div style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', padding: '28px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <Icon size={26} style={{ color: 'white' }}/>
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>{title}</h3>
                  <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50px', padding: '4px 14px', display: 'inline-block', color: 'white', fontSize: '12px', fontWeight: 600 }}>{price}</div>
                </div>

                {/* Card bottom */}
                <div style={{ padding: '24px' }}>
                  <p style={{ color: '#8896A7', fontSize: '14px', lineHeight: 1.75, marginBottom: '20px' }}>{desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
                    {features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={14} style={{ color: '#2d9cdb', flexShrink: 0 }}/>
                        <span style={{ color: '#E0E6ED', fontSize: '13px' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/booking" style={{ display: 'block', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', boxShadow: '0 0 16px rgba(45,156,219,0.2)' }}>
                    Get Started →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}