'use client'
import Link from 'next/link'
import PortalSidebar from '@/components/portal/PortalSidebar'
import { Heart, AlertCircle, RefreshCw, Bell } from 'lucide-react'

const medications = [
  { name: 'Metformin 500mg', generic: 'Metformin Hydrochloride', dose: '1 tablet twice daily', timing: 'Morning & Evening with food', prescribedBy: 'Dr. F,z Wasili', stock: 5, total: 30, refillDue: 'Apr 17, 2026', color: '#EF233C', critical: true },
  { name: 'Lisinopril 10mg', generic: 'Lisinopril Dihydrate', dose: '1 tablet once daily', timing: 'Morning', prescribedBy: 'Dr. Fatima Hassan', stock: 18, total: 30, refillDue: 'Apr 29, 2026', color: '#2d9cdb', critical: false },
  { name: 'Vitamin D3 5000IU', generic: 'Cholecalciferol', dose: '1 capsule daily', timing: 'With any meal', prescribedBy: 'Self-prescribed', stock: 24, total: 30, refillDue: 'May 5, 2026', color: '#06D6A0', critical: false },
  { name: 'Atorvastatin 20mg', generic: 'Atorvastatin Calcium', dose: '1 tablet at night', timing: 'Before bedtime', prescribedBy: 'Dr. Chidi Okeke', stock: 12, total: 30, refillDue: 'Apr 22, 2026', color: '#4db8f0', critical: false },
]

export default function MedicationsPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F14', fontFamily: 'Inter, sans-serif' }}>
      <PortalSidebar active="Medications" />
      <div style={{ flex: 1, overflow: 'auto' }}>

        {/* Header */}
        <div style={{ background: '#141C24', padding: '20px 32px', borderBottom: '1px solid rgba(45,156,219,0.1)' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.5rem', fontWeight: 700 }}>My Medications</h1>
          <p style={{ color: '#8896A7', fontSize: '13px', marginTop: '3px' }}>Track your medication schedule and refill reminders</p>
        </div>

        <div style={{ padding: '28px 32px' }}>

          {/* Alert */}
          <div style={{ background: 'rgba(239,35,60,0.08)', border: '1px solid rgba(239,35,60,0.2)', borderRadius: '12px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={16} style={{ color: '#EF233C', flexShrink: 0 }} />
            <div>
              <span style={{ color: '#E0E6ED', fontSize: '14px', fontWeight: 600 }}>Low Stock: </span>
              <span style={{ color: '#8896A7', fontSize: '14px' }}>Metformin 500mg — only 5 days left. </span>
              <Link href="/shop" style={{ color: '#EF233C', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>Order now →</Link>
            </div>
          </div>

          {/* Medications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {medications.map(med => (
              <div key={med.name}
                style={{ background: '#141C24', border: `1px solid ${med.critical ? 'rgba(239,35,60,0.2)' : 'rgba(45,156,219,0.1)'}`, borderRadius: '14px', padding: '22px', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = med.color + '50'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = med.critical ? 'rgba(239,35,60,0.2)' : 'rgba(45,156,219,0.1)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${med.color}15`, border: `1px solid ${med.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Heart size={20} style={{ color: med.color }} />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1rem', fontWeight: 700, marginBottom: '3px' }}>{med.name}</h3>
                      <p style={{ color: '#8896A7', fontSize: '12px', marginBottom: '2px' }}>{med.generic}</p>
                      <p style={{ color: '#8896A7', fontSize: '11px' }}>{med.dose} · {med.timing}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '8px', padding: '7px 12px', cursor: 'pointer', color: '#2d9cdb', fontSize: '12px', fontWeight: 500 }}>
                      <Bell size={12} /> Reminder
                    </button>
                    <Link href="/shop" style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', borderRadius: '8px', padding: '7px 12px', textDecoration: 'none', fontSize: '12px', fontWeight: 600 }}>
                      <RefreshCw size={12} /> Refill
                    </Link>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginBottom: '14px' }}>
                  {[['Refill Due', med.refillDue], ['Days Left', `${med.stock} days`], ['Prescribed By', med.prescribedBy]].map(([label, value]) => (
                    <div key={label} style={{ background: '#0A0F14', border: '1px solid rgba(45,156,219,0.08)', borderRadius: '8px', padding: '10px 12px' }}>
                      <div style={{ color: '#8896A7', fontSize: '10px', marginBottom: '4px' }}>{label}</div>
                      <div style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 600 }}>{value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(med.stock / med.total) * 100}%`, background: med.color, borderRadius: '3px', transition: 'width 0.8s ease', boxShadow: `0 0 8px ${med.color}60` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}