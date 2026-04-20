'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import PortalSidebar from '@/components/portal/PortalSidebar'
import { Calendar, Clock, Video, Phone, MapPin, Plus, CalendarDays } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Appointment {
  id: string
  service_type: string
  doctor_name: string
  appointment_date: string
  appointment_time: string
  status: string
  price: number
  created_at: string
}

const sColor: Record<string, string> = { Confirmed: '#2d9cdb', Completed: '#06D6A0', Cancelled: '#EF233C' }
const sBg: Record<string, string> = { Confirmed: 'rgba(45,156,219,0.12)', Completed: 'rgba(6,214,160,0.1)', Cancelled: 'rgba(239,35,60,0.1)' }

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('appointments').select('*').eq('user_id', user.id).order('appointment_date', { ascending: false })
      setAppointments(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F14', fontFamily: 'Inter, sans-serif' }}>
      <PortalSidebar active="Appointments" />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: '#141C24', padding: '20px 32px', borderBottom: '1px solid rgba(45,156,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.5rem', fontWeight: 700 }}>My Appointments</h1>
            <p style={{ color: '#8896A7', fontSize: '13px', marginTop: '3px' }}>Schedule and manage your consultations</p>
          </div>
          <Link href="/booking" style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 0 12px rgba(45,156,219,0.25)' }}>
            <Plus size={14} /> Book Appointment
          </Link>
        </div>

        <div style={{ padding: '28px 32px' }}>
          {/* Service options */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '28px' }}>
            {[
              { Icon: Video, label: 'Video Consultation', price: 'From ₦3,000', color: '#2d9cdb', href: '/booking' },
              { Icon: Phone, label: 'Phone Consultation', price: 'From ₦1,500', color: '#06D6A0', href: '/booking' },
              { Icon: MapPin, label: 'In-Person Visit', price: 'From ₦5,000', color: '#F4A261', href: '/booking' },
            ].map(({ Icon, label, price, color, href }) => (
              <Link key={label} href={href} style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '12px', padding: '18px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 14px ${color}20` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,156,219,0.1)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600 }}>{label}</div>
                  <div style={{ color, fontSize: '12px', marginTop: '2px' }}>{price}</div>
                </div>
              </Link>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#8896A7' }}>Loading...</div>
          ) : appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', background: '#141C24', borderRadius: '16px', border: '1px solid rgba(45,156,219,0.1)' }}>
              <CalendarDays size={48} style={{ color: 'rgba(45,156,219,0.2)', marginBottom: '16px' }} />
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.2rem', marginBottom: '8px' }}>No appointments yet</h3>
              <p style={{ color: '#8896A7', fontSize: '14px', marginBottom: '20px', lineHeight: 1.6 }}>
                Book a consultation with our licensed pharmacists and doctors.<br />
                Available 7 days a week, including weekends.
              </p>
              <Link href="/booking" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
                Book First Appointment →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {appointments.map(apt => (
                <div key={apt.id} style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '12px', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(45,156,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Calendar size={18} style={{ color: '#2d9cdb' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: '140px' }}>
                    <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 700 }}>{apt.service_type}</div>
                    <div style={{ color: '#8896A7', fontSize: '11px' }}>{apt.doctor_name || 'Vital Medicare Pharmacist'}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8896A7', fontSize: '12px' }}>
                    <Clock size={11} /> {apt.appointment_date} at {apt.appointment_time}
                  </div>
                  <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 700 }}>₦{apt.price?.toLocaleString()}</div>
                  <span style={{ padding: '4px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 600, color: sColor[apt.status] || '#8896A7', background: sBg[apt.status] || 'rgba(255,255,255,0.05)' }}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}