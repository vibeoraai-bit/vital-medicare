'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { Shield, Award, Users, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '64px', fontFamily: 'Inter, sans-serif', background: '#0A0F14' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #141C24, #0A0F14)', padding: '80px 24px', textAlign: 'center', borderBottom: '1px solid rgba(45,156,219,0.12)' }}>
          <div className="badge" style={{ marginBottom: '16px' }}>About Us</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, marginBottom: '16px' }}>
            Nigeria&apos;s Most Trusted<br/>Digital Pharmacy
          </h1>
          <p style={{ color: '#8896A7', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.75 }}>
            Since 2020, we have been delivering quality healthcare to thousands of Nigerian families with integrity, precision, and care.
          </p>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px' }}>

          {/* Story */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center', marginBottom: '80px' }}>
            <div>
              <div className="badge" style={{ marginBottom: '14px' }}>Our Story</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '20px' }}>
                Built on Trust, Powered by Technology
              </h2>
              <p style={{ color: '#8896A7', fontSize: '15px', lineHeight: 1.8, marginBottom: '16px' }}>
                Vital Medicare was founded in 2020 with a simple mission: make quality healthcare accessible to every Nigerian family. What started as a single pharmacy has grown into Nigeria&apos;s premier digital health platform.
              </p>
              <p style={{ color: '#8896A7', fontSize: '15px', lineHeight: 1.8 }}>
                Today we serve over 12,000 patients across Maiduguri, combining NAFDAC-certified medications with cutting-edge technology to deliver healthcare right to your doorstep.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {[
                { number: '12,000+', label: 'Patients Served' },
                { number: '15 Years', label: 'In Business' },
                { number: '500+', label: 'Medications' },
                { number: '4.9/5', label: 'Customer Rating' },
              ].map(({ number, label }) => (
                <div key={label} style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '14px', padding: '24px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', color: '#2d9cdb', fontSize: '2rem', fontWeight: 700 }}>{number}</div>
                  <div style={{ color: '#8896A7', fontSize: '13px', marginTop: '6px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="badge" style={{ marginBottom: '14px' }}>Core Values</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700 }}>Our Core Values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '64px' }}>
            {[
              { Icon: Shield, title: 'Safety First', desc: 'Every medication is NAFDAC-verified and stored under optimal conditions.', color: '#2d9cdb' },
              { Icon: Heart, title: 'Patient Care', desc: 'We treat every patient like family — with empathy and personal attention.', color: '#EF233C' },
              { Icon: Award, title: 'Excellence', desc: 'We hold ourselves to the highest standards in pharmaceutical practice.', color: '#F4A261' },
              { Icon: Users, title: 'Community', desc: 'Committed to improving healthcare access for all Nigerians.', color: '#06D6A0' },
            ].map(({ Icon, title, desc, color }) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '28px', textAlign: 'center', transition: 'all 0.3s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = color; el.style.boxShadow = `0 0 24px ${color}20` }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(45,156,219,0.12)'; el.style.boxShadow = 'none' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Icon size={24} style={{ color }}/>
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px' }}>{title}</h3>
                <p style={{ color: '#8896A7', fontSize: '14px', lineHeight: 1.65 }}>{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Certifications */}
          <div style={{ background: 'linear-gradient(135deg, #141C24, #0A0F14)', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '20px', padding: '48px', textAlign: 'center' }}>
            <div className="badge" style={{ marginBottom: '14px' }}>Certified</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px' }}>
              Fully Certified & Regulated
            </h2>
            <p style={{ color: '#8896A7', marginBottom: '32px', fontSize: '15px' }}>
              We operate under the full oversight of Nigeria&apos;s health regulatory bodies
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              {['NAFDAC Certified', 'PCN Licensed', 'ISO 9001:2015', 'SON Compliant'].map(cert => (
                <div key={cert} style={{ background: 'rgba(45,156,219,0.1)', border: '1px solid rgba(45,156,219,0.25)', borderRadius: '50px', padding: '10px 24px', color: '#2d9cdb', fontSize: '14px', fontWeight: 500 }}>{cert}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}