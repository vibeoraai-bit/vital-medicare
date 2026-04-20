'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Upload, ShieldCheck, Clock, Star, Phone } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
  return (
    <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', background: '#0A0F14' }}>

      {/* Background image with overlay */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          src="/images/pharmacy.jpg"
          alt="Vital Medicare Pharmacy"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(10,15,20,0.97) 0%, rgba(10,15,20,0.92) 45%, rgba(10,15,20,0.7) 70%, rgba(10,15,20,0.4) 100%)' }}/>
        {/* Cyan accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #00D4FF, transparent)' }}/>
      </div>

      {/* Grid pattern */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }}/>

      {/* Glowing orbs */}
      <div style={{ position: 'absolute', top: '20%', left: '5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: '20%', right: '30%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)', pointerEvents: 'none' }}/>

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '100px 24px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gap: '60px', alignItems: 'center' }} className="hero-grid">

          {/* LEFT */}
          <div style={{ maxWidth: '640px' }}>

            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="badge" style={{ marginBottom: '24px' }}>
                <ShieldCheck size={12}/>
                NAFDAC & PCN Certified · ISO 9001:2015
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)', lineHeight: 1.08, marginBottom: '20px', fontWeight: 700 }}>
                <span style={{ color: '#E0E6ED', display: 'block' }}>Premium Healthcare,</span>
                <span style={{ color: '#00D4FF', fontStyle: 'italic', display: 'block', textShadow: '0 0 30px rgba(0,212,255,0.4)' }}>Delivered to You</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              style={{ color: '#8896A7', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '32px', maxWidth: '520px' }}>
              Nigeria&apos;s most trusted hospital-attached pharmacy. Expert pharmacist consultations, NAFDAC-verified medications, and same-day delivery — all in one place.
            </motion.p>

            {/* CTA */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
              style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '40px' }}>
              <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #00D4FF, #0099CC)', color: '#0A0F14', padding: '14px 30px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', boxShadow: '0 0 24px rgba(0,212,255,0.35)' }}>
                Shop Medications <ArrowRight size={18}/>
              </Link>
              <Link href="/booking" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,212,255,0.08)', color: '#00D4FF', padding: '14px 30px', borderRadius: '10px', fontWeight: 600, fontSize: '15px', textDecoration: 'none', border: '1px solid rgba(0,212,255,0.3)' }}>
                Book a Doctor
              </Link>
            </motion.div>

            {/* Quick actions */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }}
              style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
              {[
                { icon: Upload, label: 'Upload Prescription', href: '/prescriptions' },
                { icon: Clock, label: 'Same-day Delivery', href: '/shop' },
                { icon: Phone, label: '+234 814 904 5538', href: 'tel:+2348149045538' },
              ].map(({ icon: Icon, label, href }) => (
                <Link key={label} href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(20,28,36,0.8)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '8px', padding: '8px 14px', color: '#8896A7', fontSize: '12px', textDecoration: 'none', backdropFilter: 'blur(8px)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.4)'; (e.currentTarget as HTMLElement).style.color = '#00D4FF' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.15)'; (e.currentTarget as HTMLElement).style.color = '#8896A7' }}>
                  <Icon size={13}/> {label}
                </Link>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }}
              style={{ display: 'flex', flexWrap: 'wrap' }}>
              {[
                { number: '12,000+', label: 'Patients' },
                { number: '98.7%', label: 'Accuracy' },
                { number: '15 Yrs', label: 'Experience' },
                { number: '4.9★', label: 'Rating' },
              ].map((s, i) => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ padding: '0 18px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Playfair Display, serif', color: '#00D4FF', fontSize: '1.5rem', fontWeight: 700, textShadow: '0 0 16px rgba(0,212,255,0.3)' }}>{s.number}</div>
                    <div style={{ color: '#8896A7', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>{s.label}</div>
                  </div>
                  {i < 3 && <div style={{ width: '1px', height: '32px', background: 'rgba(0,212,255,0.15)' }}/>}
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Card */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            style={{ background: 'rgba(20,28,36,0.85)', backdropFilter: 'blur(24px)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '20px', padding: '28px', maxWidth: '360px', boxShadow: '0 0 40px rgba(0,212,255,0.08)' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06D6A0', animation: 'pulse-cyan 2s infinite' }}/>
              <span style={{ color: '#06D6A0', fontSize: '12px', fontWeight: 600 }}>Pharmacists Online Now</span>
            </div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.3rem', marginBottom: '20px' }}>Quick Services</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {[
                { icon: Upload, label: 'Upload Prescription', desc: 'Verified in 20 minutes', color: '#00D4FF', href: '/prescriptions' },
                { icon: Clock, label: 'Same-day Delivery', desc: 'Order before 8PM', color: '#F4A261', href: '/shop' },
                { icon: Star, label: 'Book Consultation', desc: '24/7 availability', color: '#06D6A0', href: '/booking' },
              ].map(({ icon: Icon, label, desc, color, href }) => (
                <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(10,15,20,0.6)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: '10px', padding: '12px 14px', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,255,0.05)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.1)'; (e.currentTarget as HTMLElement).style.background = 'rgba(10,15,20,0.6)' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} style={{ color }}/>
                  </div>
                  <div>
                    <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600 }}>{label}</div>
                    <div style={{ color: '#8896A7', fontSize: '11px', marginTop: '1px' }}>{desc}</div>
                  </div>
                  <ArrowRight size={13} style={{ color: '#8896A7', marginLeft: 'auto', flexShrink: 0 }}/>
                </Link>
              ))}
            </div>

            <a href="tel:+2348012345678" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '10px', padding: '12px', color: '#00D4FF', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
              <Phone size={15}/> +234 814 904 5538
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}
        style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', color: '#8896A7', fontSize: '11px', textAlign: 'center', zIndex: 1 }}>
        <div style={{ color: '#00D4FF', fontSize: '16px', marginBottom: '3px' }}>↓</div>
        Scroll to explore
      </motion.div>

      <style>{`
        @media(min-width: 900px) { .hero-grid { grid-template-columns: 55% 45% !important; } }
        @keyframes pulse-cyan { 0%,100%{box-shadow:0 0 0 0 rgba(6,214,160,0.4)} 50%{box-shadow:0 0 0 8px rgba(6,214,160,0)} }
      `}</style>
    </section>
  )
}