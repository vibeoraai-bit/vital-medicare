'use client'
import Link from 'next/link'
import PortalSidebar from '@/components/portal/PortalSidebar'
import { Calendar, Clock, Video, Phone, MapPin, Plus, CheckCircle } from 'lucide-react'

const appointments = [
  { id: 'APT-001', service: 'Video Consultation', doctor: 'Dr. F,z Wasili', date: 'Apr 15, 2026', time: '10:00 AM', status: 'Confirmed', price: '₦3,000' },
  { id: 'APT-002', service: 'Pharmacist Chat', doctor: 'Pharmacist Aisha Bello', date: 'Apr 20, 2026', time: '2:30 PM', status: 'Confirmed', price: 'Free' },
  { id: 'APT-003', service: 'Lab Test Consultation', doctor: 'Dr. Fatima Hassan', date: 'Mar 30, 2026', time: '9:00 AM', status: 'Completed', price: '₦3,000' },
]

const sColor: Record<string, string> = { Confirmed: '#2d9cdb', Completed: '#06D6A0', Cancelled: '#EF233C' }
const sBg: Record<string, string> = { Confirmed: 'rgba(45,156,219,0.12)', Completed: 'rgba(6,214,160,0.1)', Cancelled: 'rgba(239,35,60,0.1)' }

export default function AppointmentsPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F14', fontFamily: 'Inter, sans-serif' }}>
      <PortalSidebar active="Appointments" />
      <div style={{ flex: 1, overflow: 'auto' }}>

        {/* Header */}
        <div style={{ background: '#141C24', padding: '20px 32px', borderBottom: '1px solid rgba(45,156,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.5rem', fontWeight: 700 }}>My Appointments</h1>
            <p style={{ color: '#8896A7', fontSize: '13px', marginTop: '3px' }}>Schedule and manage your consultations</p>
          </div>
          <Link href="/booking" style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 0 14px rgba(45,156,219,0.25)' }}>
            <Plus size={14} /> Book Appointment
          </Link>
        </div>

        <div style={{ padding: '28px 32px' }}>

          {/* Service Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '28px' }}>
            {[
              { Icon: Video, label: 'Video Consultation', price: 'From ₦3,000', color: '#2d9cdb' },
              { Icon: Phone, label: 'Phone Consultation', price: 'From ₦1,500', color: '#06D6A0' },
              { Icon: MapPin, label: 'In-Person Visit', price: 'From ₦5,000', color: '#F4A261' },
            ].map(({ Icon, label, price, color }) => (
              <Link key={label} href="/booking"
                style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '12px', padding: '18px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${color}20` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,156,219,0.12)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
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

          <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>Your Appointments</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {appointments.map(apt => (
              <div key={apt.id}
                style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '12px', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,156,219,0.3)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,156,219,0.1)'}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(45,156,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={18} style={{ color: '#2d9cdb' }} />
                </div>
                <div style={{ flex: 1, minWidth: '140px' }}>
                  <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 700 }}>{apt.service}</div>
                  <div style={{ color: '#8896A7', fontSize: '11px' }}>{apt.doctor}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8896A7', fontSize: '12px' }}>
                  <Clock size={11} />{apt.date} at {apt.time}
                </div>
                <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 700 }}>{apt.price}</div>
                <span style={{ padding: '4px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 600, color: sColor[apt.status], background: sBg[apt.status] }}>
                  {apt.status}
                </span>
                {apt.status === 'Confirmed' && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '7px', padding: '7px 14px', cursor: 'pointer', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={11} /> Join
                    </button>
                    <button style={{ background: 'transparent', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '7px', padding: '7px 12px', cursor: 'pointer', fontSize: '11px', color: '#8896A7' }}>
                      Reschedule
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}