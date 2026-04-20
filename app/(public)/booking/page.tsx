'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Video, Phone, MapPin, Clock, CheckCircle, ArrowRight, Calendar, User } from 'lucide-react'

const services = [
  { id: 'video', icon: Video, title: 'Video Consultation', desc: 'Face-to-face with a licensed doctor or pharmacist', price: '₦3,000', duration: '30 minutes', color: '#2d9cdb' },
  { id: 'phone', icon: Phone, title: 'Phone Consultation', desc: 'Quick advice from our pharmacist team', price: '₦1,500', duration: '15 minutes', color: '#06D6A0' },
  { id: 'inperson', icon: MapPin, title: 'In-Person Visit', desc: 'Visit our pharmacy in G.R.A, Maiduguri', price: '₦5,000', duration: '45 minutes', color: '#F4A261' },
]

const timeSlots = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM']

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })
  const [confirmed, setConfirmed] = useState(false)

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const inputStyle = {
    width: '100%', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.15)',
    borderRadius: '10px', padding: '11px 14px', fontSize: '14px', color: '#E0E6ED',
    outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' as const,
  }

  if (confirmed) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: '64px', background: '#0A0F14', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '80px 24px' }}>
          <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '24px', padding: '52px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 0 48px rgba(45,156,219,0.1)' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(6,214,160,0.15)', border: '1px solid #06D6A0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={34} style={{ color: '#06D6A0' }}/>
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px' }}>Booking Confirmed! 🎉</h2>
            <p style={{ color: '#8896A7', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>Your consultation has been scheduled. You&apos;ll receive a confirmation via email and SMS.</p>
            <div style={{ background: '#0A0F14', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '12px', padding: '18px', marginBottom: '24px', textAlign: 'left' }}>
              {[
                ['Service', services.find(s => s.id === selected)?.title || selected],
                ['Date', date],
                ['Time', time],
                ['Name', form.name],
                ['Reference', 'BK-' + Date.now().toString().slice(-6)],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#8896A7', fontSize: '12px' }}>{k}</span>
                  <span style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { setStep(1); setSelected(''); setDate(''); setTime(''); setConfirmed(false) }}
              style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 32px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>
              Book Another
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '64px', background: '#0A0F14', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #141C24, #0A0F14)', padding: '56px 24px', textAlign: 'center', borderBottom: '1px solid rgba(45,156,219,0.12)' }}>
          <div className="badge" style={{ marginBottom: '14px' }}>Book Consultation</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '10px' }}>Schedule Your Appointment</h1>
          <p style={{ color: '#8896A7', fontSize: '15px', maxWidth: '440px', margin: '0 auto' }}>Licensed pharmacists and doctors available 7 days a week</p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '36px' }}>
            {['Choose Service', 'Date & Time', 'Your Details', 'Confirm'].map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, transition: 'all 0.3s', background: step > i + 1 ? '#06D6A0' : step === i + 1 ? 'linear-gradient(135deg, #2d9cdb, #1a7ab8)' : 'rgba(45,156,219,0.1)', color: step >= i + 1 ? 'white' : '#8896A7', border: step === i + 1 ? 'none' : '1px solid rgba(45,156,219,0.2)' }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span style={{ color: step === i + 1 ? '#2d9cdb' : '#8896A7', fontSize: '10px', fontWeight: step === i + 1 ? 600 : 400, whiteSpace: 'nowrap' }}>{label}</span>
                </div>
                {i < 3 && <div style={{ width: '50px', height: '1px', background: step > i + 1 ? '#06D6A0' : 'rgba(45,156,219,0.15)', marginBottom: '18px', flexShrink: 0 }}/>}
              </div>
            ))}
          </div>

          {/* Step 1 — Choose Service */}
          {step === 1 && (
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '20px', padding: '32px' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px' }}>Choose a Service</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {services.map(({ id, icon: Icon, title, desc, price, duration, color }) => (
                  <label key={id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', border: `2px solid ${selected === id ? color : 'rgba(45,156,219,0.12)'}`, borderRadius: '12px', cursor: 'pointer', background: selected === id ? `${color}08` : '#0A0F14', transition: 'all 0.2s' }}>
                    <input type="radio" name="service" value={id} checked={selected === id} onChange={() => setSelected(id)} style={{ accentColor: color }}/>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} style={{ color }}/>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#E0E6ED', fontSize: '14px', fontWeight: 600, marginBottom: '3px' }}>{title}</div>
                      <div style={{ color: '#8896A7', fontSize: '12px' }}>{desc}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ color, fontSize: '15px', fontWeight: 700 }}>{price}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#8896A7', fontSize: '11px', justifyContent: 'flex-end' }}><Clock size={10}/>{duration}</div>
                    </div>
                  </label>
                ))}
              </div>
              <button onClick={() => selected && setStep(2)} disabled={!selected}
                style={{ width: '100%', background: selected ? 'linear-gradient(135deg, #2d9cdb, #1a7ab8)' : 'rgba(45,156,219,0.2)', color: 'white', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '14px', fontWeight: 700, cursor: selected ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: selected ? '0 0 16px rgba(45,156,219,0.25)' : 'none' }}>
                Continue to Date & Time <ArrowRight size={16}/>
              </button>
            </div>
          )}

          {/* Step 2 — Date & Time */}
          {step === 2 && (
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '20px', padding: '32px' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px' }}>
                <Calendar size={18} style={{ color: '#2d9cdb', marginRight: '8px', verticalAlign: 'middle' }}/>
                Select Date & Time
              </h2>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#E0E6ED', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Select Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                  style={{ ...inputStyle, colorScheme: 'dark' }}/>
              </div>
              {date && (
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', color: '#E0E6ED', fontSize: '12px', fontWeight: 600, marginBottom: '12px' }}>Available Times</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
                    {timeSlots.map(slot => (
                      <button key={slot} onClick={() => setTime(slot)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid', cursor: 'pointer', fontSize: '12px', fontWeight: 500, transition: 'all 0.2s', borderColor: time === slot ? '#2d9cdb' : 'rgba(45,156,219,0.15)', background: time === slot ? 'rgba(45,156,219,0.15)' : 'transparent', color: time === slot ? '#2d9cdb' : '#8896A7' }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '10px', padding: '13px', color: '#2d9cdb', cursor: 'pointer', fontWeight: 500, fontSize: '14px' }}>← Back</button>
                <button onClick={() => date && time && setStep(3)} disabled={!date || !time}
                  style={{ flex: 2, background: date && time ? 'linear-gradient(135deg, #2d9cdb, #1a7ab8)' : 'rgba(45,156,219,0.2)', color: 'white', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 700, cursor: date && time ? 'pointer' : 'not-allowed' }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Details */}
          {step === 3 && (
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '20px', padding: '32px' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px' }}>
                <User size={18} style={{ color: '#2d9cdb', marginRight: '8px', verticalAlign: 'middle' }}/>
                Your Details
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                {[['Full Name', 'name', 'text', 'John Doe'], ['Email', 'email', 'email', 'your@email.com']].map(([label, key, type, ph]) => (
                  <div key={key}>
                    <label style={{ display: 'block', color: '#E0E6ED', fontSize: '12px', fontWeight: 600, marginBottom: '7px' }}>{label}</label>
                    <input type={type} value={form[key as keyof typeof form]} onChange={e => update(key, e.target.value)} placeholder={ph} style={inputStyle}/>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', color: '#E0E6ED', fontSize: '12px', fontWeight: 600, marginBottom: '7px' }}>Phone Number</label>
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+234 814 904 5538" style={inputStyle}/>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#E0E6ED', fontSize: '12px', fontWeight: 600, marginBottom: '7px' }}>Reason / Notes <span style={{ color: '#8896A7', fontWeight: 400 }}>(optional)</span></label>
                <textarea value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Brief description of your concern..." rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}/>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '10px', padding: '13px', color: '#2d9cdb', cursor: 'pointer', fontWeight: 500, fontSize: '14px' }}>← Back</button>
                <button onClick={() => form.name && form.email && form.phone && setStep(4)} disabled={!form.name || !form.email || !form.phone}
                  style={{ flex: 2, background: form.name && form.email && form.phone ? 'linear-gradient(135deg, #2d9cdb, #1a7ab8)' : 'rgba(45,156,219,0.2)', color: 'white', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 700, cursor: form.name && form.email && form.phone ? 'pointer' : 'not-allowed' }}>
                  Review Booking →
                </button>
              </div>
            </div>
          )}

          {/* Step 4 — Confirm */}
          {step === 4 && (
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '20px', padding: '32px' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px' }}>Confirm Your Booking</h2>
              <div style={{ background: '#0A0F14', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                {[
                  ['Service', services.find(s => s.id === selected)?.title || ''],
                  ['Price', services.find(s => s.id === selected)?.price || ''],
                  ['Date', date],
                  ['Time', time],
                  ['Name', form.name],
                  ['Email', form.email],
                  ['Phone', form.phone],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid rgba(45,156,219,0.06)' }}>
                    <span style={{ color: '#8896A7', fontSize: '13px' }}>{k}</span>
                    <span style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setStep(3)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '10px', padding: '13px', color: '#2d9cdb', cursor: 'pointer', fontSize: '14px' }}>← Back</button>
                <button onClick={() => setConfirmed(true)}
                  style={{ flex: 2, background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 16px rgba(45,156,219,0.25)' }}>
                  ✓ Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}