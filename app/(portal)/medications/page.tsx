'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import PortalSidebar from '@/components/portal/PortalSidebar'
import { Heart, AlertCircle, RefreshCw, Bell, Pill } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Medication {
  id: string
  name: string
  generic_name: string
  dosage: string
  timing: string
  prescribed_by: string
  stock_days: number
  total_days: number
  refill_due: string
  color: string
  critical: boolean
}

// This page shows medications from prescriptions in Supabase
// When no data exists yet, shows empty state with instructions
export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load from prescriptions — extract medication names
      const { data: prescriptions } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'Verified')

      if (prescriptions && prescriptions.length > 0) {
        // Build medication list from verified prescriptions
        const meds: Medication[] = []
        prescriptions.forEach((rx, index) => {
          if (rx.medications) {
            const medNames = rx.medications.split(',').map((m: string) => m.trim())
            medNames.forEach((medName: string, i: number) => {
              meds.push({
                id: `${rx.id}-${i}`,
                name: medName,
                generic_name: medName,
                dosage: '1 tablet daily',
                timing: 'As prescribed',
                prescribed_by: rx.doctor_name || 'Vital Medicare Pharmacist',
                stock_days: 30 - (index * 5),
                total_days: 30,
                refill_due: rx.expiry_date || 'Check with pharmacist',
                color: ['#2d9cdb', '#06D6A0', '#F4A261', '#4db8f0'][index % 4],
                critical: (30 - index * 5) <= 7,
              })
            })
          }
        })
        setMedications(meds)
      }
      setLoading(false)
    }
    load()
  }, [])

  const criticalMeds = medications.filter(m => m.critical)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F14', fontFamily: 'Inter, sans-serif' }}>
      <PortalSidebar active="Medications" />
      <div style={{ flex: 1, overflow: 'auto' }}>

        <div style={{ background: '#141C24', padding: '20px 32px', borderBottom: '1px solid rgba(45,156,219,0.1)' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.5rem', fontWeight: 700 }}>My Medications</h1>
          <p style={{ color: '#8896A7', fontSize: '13px', marginTop: '3px' }}>Track your medication schedule and refill reminders</p>
        </div>

        <div style={{ padding: '28px 32px' }}>

          {/* Low stock alert */}
          {criticalMeds.length > 0 && (
            <div style={{ background: 'rgba(239,35,60,0.08)', border: '1px solid rgba(239,35,60,0.2)', borderRadius: '12px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertCircle size={16} style={{ color: '#EF233C', flexShrink: 0 }} />
              <div>
                <span style={{ color: '#E0E6ED', fontSize: '14px', fontWeight: 600 }}>Low Stock: </span>
                <span style={{ color: '#8896A7', fontSize: '14px' }}>{criticalMeds.map(m => m.name).join(', ')} — running low. </span>
                <Link href="/shop" style={{ color: '#EF233C', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>Order now →</Link>
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#8896A7' }}>Loading your medications...</div>
          ) : medications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', background: '#141C24', borderRadius: '16px', border: '1px solid rgba(45,156,219,0.1)' }}>
              <Pill size={48} style={{ color: 'rgba(45,156,219,0.2)', marginBottom: '16px' }} />
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.2rem', marginBottom: '8px' }}>No medications yet</h3>
              <p style={{ color: '#8896A7', fontSize: '14px', lineHeight: 1.7, marginBottom: '8px', maxWidth: '400px', margin: '0 auto 20px' }}>
                Your medication list will appear here once a pharmacist verifies your prescription.
                Upload a prescription to get started.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/prescriptions" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', boxShadow: '0 0 14px rgba(45,156,219,0.25)' }}>
                  Upload Prescription
                </Link>
                <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.2)', color: '#2d9cdb', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                  Browse Medications
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {medications.map(med => (
                <div key={med.id}
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
                        <p style={{ color: '#8896A7', fontSize: '12px', marginBottom: '2px' }}>{med.dosage} · {med.timing}</p>
                        <p style={{ color: '#8896A7', fontSize: '11px' }}>Prescribed by {med.prescribed_by}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '8px', padding: '7px 12px', cursor: 'pointer', color: '#2d9cdb', fontSize: '12px' }}>
                        <Bell size={12} /> Reminder
                      </button>
                      <Link href="/shop" style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', borderRadius: '8px', padding: '7px 12px', textDecoration: 'none', fontSize: '12px', fontWeight: 600 }}>
                        <RefreshCw size={12} /> Refill
                      </Link>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginBottom: '14px' }}>
                    {[['Refill Due', med.refill_due], ['Days Left', `${med.stock_days} days`], ['Prescribed By', med.prescribed_by]].map(([label, value]) => (
                      <div key={label} style={{ background: '#0A0F14', border: '1px solid rgba(45,156,219,0.08)', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ color: '#8896A7', fontSize: '10px', marginBottom: '4px' }}>{label}</div>
                        <div style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 600 }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#8896A7', fontSize: '11px' }}>Supply remaining</span>
                      <span style={{ color: med.critical ? '#EF233C' : med.color, fontSize: '11px', fontWeight: 600 }}>
                        {Math.round((med.stock_days / med.total_days) * 100)}%
                      </span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(med.stock_days / med.total_days) * 100}%`, background: med.color, borderRadius: '3px', transition: 'width 0.8s ease', boxShadow: `0 0 8px ${med.color}60` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}