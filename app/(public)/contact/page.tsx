'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '64px', fontFamily: 'Inter, sans-serif', background: '#0A0F14' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #141C24, #0A0F14)', padding: '80px 24px', textAlign: 'center', borderBottom: '1px solid rgba(45,156,219,0.12)' }}>
          <div className="badge" style={{ marginBottom: '16px' }}>Contact Us</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '12px' }}>Get In Touch</h1>
          <p style={{ color: '#8896A7', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto' }}>
            Our team is here to help with all your healthcare needs
          </p>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>

            {/* Contact Info */}
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.5rem', fontWeight: 700, marginBottom: '32px' }}>Contact Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { Icon: MapPin, title: 'Our Location', info: 'No.1 Railway Junction,Airport Road, Maiduguri,Borno, Nigeria.', color: '#2d9cdb' },
                  { Icon: Phone, title: 'Phone Number', info: '+234 814 904 5538', color: '#06D6A0' },
                  { Icon: Mail, title: 'Email Address', info: 'vitalmedicare.official@gmail.com', color: '#F4A261' },
                  { Icon: Clock, title: 'Working Hours', info: 'Mon–Sun: 24/7', color: '#4db8f0' },
                  { Icon: MessageCircle, title: 'WhatsApp', info: '+234 814 904 5538', color: '#25D366' },
                ].map(({ Icon, title, info, color }) => (
                  <div key={title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} style={{ color }}/>
                    </div>
                    <div>
                      <div style={{ color: '#E0E6ED', fontWeight: 600, fontSize: '14px', marginBottom: '3px' }}>{title}</div>
                      <div style={{ color: '#8896A7', fontSize: '14px', lineHeight: 1.5 }}>{info}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div style={{ background: '#141C24', borderRadius: '20px', padding: '36px', border: '1px solid rgba(45,156,219,0.15)', boxShadow: '0 0 32px rgba(45,156,219,0.06)' }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(6,214,160,0.15)', border: '1px solid #06D6A0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Send size={28} style={{ color: '#06D6A0' }}/>
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.3rem', marginBottom: '8px' }}>Message Sent!</h3>
                  <p style={{ color: '#8896A7', fontSize: '14px' }}>We&apos;ll get back to you within 2 hours.</p>
                  <button onClick={() => setSent(false)} style={{ marginTop: '20px', background: 'rgba(45,156,219,0.15)', border: '1px solid rgba(45,156,219,0.3)', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', color: '#2d9cdb', fontSize: '13px', fontWeight: 600 }}>Send Another</button>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px' }}>Send a Message</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    {[['Full Name', 'name', 'text', 'John Doe'], ['Email', 'email', 'email', 'your@email.com']].map(([label, field, type, ph]) => (
                      <div key={field}>
                        <label style={{ display: 'block', color: '#E0E6ED', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>{label}</label>
                        <input type={type} value={form[field as keyof typeof form]} onChange={e => update(field, e.target.value)} placeholder={ph}
                          style={{ width: '100%', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '8px', padding: '11px 14px', fontSize: '13px', outline: 'none', color: '#E0E6ED', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}/>
                      </div>
                    ))}
                  </div>
                  {[['Phone', 'phone', 'tel', '+234 801...'], ['Subject', 'subject', 'text', 'How can we help?']].map(([label, field, type, ph]) => (
                    <div key={field} style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', color: '#E0E6ED', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>{label}</label>
                      <input type={type} value={form[field as keyof typeof form]} onChange={e => update(field, e.target.value)} placeholder={ph}
                        style={{ width: '100%', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '8px', padding: '11px 14px', fontSize: '13px', outline: 'none', color: '#E0E6ED', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}/>
                    </div>
                  ))}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: '#E0E6ED', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Message</label>
                    <textarea value={form.message} onChange={e => update('message', e.target.value)} placeholder="Tell us how we can help..." rows={4}
                      style={{ width: '100%', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '8px', padding: '11px 14px', fontSize: '13px', outline: 'none', resize: 'vertical', color: '#E0E6ED', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}/>
                  </div>
                  <button onClick={() => setSent(true)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 0 20px rgba(45,156,219,0.25)' }}>
                    <Send size={16}/> Send Message
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}