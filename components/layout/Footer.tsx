'use client'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: '#0A0F14', borderTop: '1px solid rgba(0,212,255,0.1)', fontFamily: 'Inter, sans-serif' }}>

      {/* Newsletter */}
      <div style={{ background: 'linear-gradient(135deg, #141C24, #0A0F14)', borderBottom: '1px solid rgba(0,212,255,0.08)', padding: '40px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.3rem', marginBottom: '4px' }}>Stay Updated on Health Tips & Offers</h3>
            <p style={{ color: '#8896A7', fontSize: '14px' }}>Join 12,000+ patients getting weekly health insights</p>
          </div>
          <div style={{ display: 'flex', gap: '0', borderRadius: '10px', overflow: 'hidden', minWidth: '300px', border: '1px solid rgba(0,212,255,0.2)' }}>
            <input type="email" placeholder="Enter your email address" style={{ flex: 1, padding: '13px 16px', border: 'none', outline: 'none', fontSize: '13px', background: '#141C24', color: '#E0E6ED', fontFamily: 'Inter, sans-serif' }}/>
            <button style={{ padding: '13px 20px', background: 'linear-gradient(135deg, #00D4FF, #0099CC)', color: '#0A0F14', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Subscribe <ArrowRight size={14}/>
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 24px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #00D4FF, #0099CC)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><rect x="12" y="4" width="8" height="24" rx="4" fill="white"/><rect x="4" y="12" width="24" height="8" rx="4" fill="white"/></svg>
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.1rem', fontWeight: 700 }}>Vital Medicare</span>
          </div>
          <p style={{ color: '#00D4FF', fontSize: '10px', letterSpacing: '0.1em', marginBottom: '14px' }}>PHARMACEUTICALS LTD.</p>
          <p style={{ color: '#8896A7', fontSize: '13px', lineHeight: 1.7, marginBottom: '20px' }}>
            Nigeria&apos;s premier digital pharmacy delivering quality healthcare to your doorstep since 2020.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['f', 't', 'in', 'ig'].map(s => (
              <div key={s} style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8896A7', fontSize: '11px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>{s}</div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 700, marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid rgba(0,212,255,0.15)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[['Home','/'],['Shop','/shop'],['Services','/services'],['About','/about'],['Blog','/blog'],['Contact','/contact'],['FAQ','/faq'],['Track Order','/track-order'],['Privacy Policy','/privacy'],].map(([name, href]) => (
              <Link key={href} href={href} style={{ color: '#8896A7', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#00D4FF'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#8896A7'}>
                <ArrowRight size={11}/> {name}
              </Link>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 700, marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid rgba(0,212,255,0.15)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Services</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Prescription Upload','Pharmacist Chat','Lab Test Booking','Same-day Delivery','Health Consultations','Medication Refills'].map(s => (
              <Link key={s} href="/services" style={{ color: '#8896A7', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#00D4FF'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#8896A7'}>
                <ArrowRight size={11}/> {s}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 700, marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid rgba(0,212,255,0.15)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Contact Us</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { Icon: MapPin, text: 'No.1 Railway Junction Airport Road, Maiduguri, Borno', color: '#00D4FF' },
              { Icon: Phone, text: '+234 814 904 5538', color: '#06D6A0' },
              { Icon: Mail, text: 'vitalmedicare.official@gmail.com', color: '#F4A261' },
              { Icon: Clock, text: 'Mon–Sun: 24/7 ', color: '#8896A7' },
            ].map(({ Icon, text, color }) => (
              <div key={text} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Icon size={14} style={{ color, marginTop: '2px', flexShrink: 0 }}/>
                <span style={{ color: '#8896A7', fontSize: '13px', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px', borderTop: '1px solid rgba(0,212,255,0.08)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <p style={{ color: '#8896A7', fontSize: '12px' }}>© 2025 Vital Medicare & Pharmaceuticals Ltd. All rights reserved.</p>
        <p style={{ color: '#8896A7', fontSize: '12px' }}>NAFDAC Reg: VC/04/12345 | PCN Reg: PCN/PH/2024/001</p>
      </div>
    </footer>
  )
}