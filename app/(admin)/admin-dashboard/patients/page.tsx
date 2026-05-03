'use client'
import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Search, User, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Patient {
  id: string
  full_name: string
  email: string
  phone: string
  patient_id: string
  role: string
  loyalty_points: number
  created_at: string
}

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'patient')
        .order('created_at', { ascending: false })
      setPatients(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = patients.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.patient_id?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F14', fontFamily: 'Inter, sans-serif' }}>
      <AdminSidebar active="Patients" />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: '#141C24', padding: '16px 32px', borderBottom: '1px solid rgba(45,156,219,0.1)' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.4rem', fontWeight: 700 }}>Patient Management</h1>
          <p style={{ color: '#8896A7', fontSize: '12px', marginTop: '2px' }}>{patients.length} registered patients</p>
        </div>

        <div style={{ padding: '24px 32px' }}>
          {/* Real stats from DB */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Total Patients', value: patients.length.toString(), color: '#2d9cdb' },
              { label: 'Active This Month', value: patients.filter(p => new Date(p.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length.toString(), color: '#06D6A0' },
              { label: 'New This Week', value: patients.filter(p => new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length.toString(), color: '#F4A261' },
              { label: 'Total Points Given', value: patients.reduce((s, p) => s + (p.loyalty_points || 0), 0).toLocaleString(), color: '#4db8f0' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '12px', padding: '18px' }}>
                <div style={{ color: '#8896A7', fontSize: '11px', marginBottom: '6px' }}>{label}</div>
                <div style={{ fontFamily: 'Playfair Display, serif', color, fontSize: '1.6rem', fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#141C24', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '10px', padding: '10px 14px', maxWidth: '300px', marginBottom: '20px' }}>
            <Search size={14} style={{ color: '#8896A7' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..."
              style={{ border: 'none', outline: 'none', fontSize: '13px', background: 'transparent', color: '#E0E6ED', fontFamily: 'Inter, sans-serif', flex: 1 }} />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#8896A7' }}>Loading patients...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', background: '#141C24', borderRadius: '16px', border: '1px solid rgba(45,156,219,0.1)' }}>
              <Users size={48} style={{ color: 'rgba(45,156,219,0.2)', marginBottom: '16px' }} />
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.2rem', marginBottom: '8px' }}>
                {search ? 'No patients match your search' : 'No patients registered yet'}
              </h3>
              <p style={{ color: '#8896A7', fontSize: '14px', lineHeight: 1.7 }}>
                Patients will appear here once they create accounts on your website.
              </p>
            </div>
          ) : (
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 80px 80px', padding: '12px 20px', background: 'rgba(45,156,219,0.05)', borderBottom: '1px solid rgba(45,156,219,0.1)' }}>
                {['Patient', 'Contact', 'Joined', 'Points', 'Status'].map(h => (
                  <div key={h} style={{ color: '#8896A7', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
                ))}
              </div>
              {filtered.map((p, i) => (
                <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 80px 80px', padding: '14px 20px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(45,156,219,0.06)' : 'none', alignItems: 'center' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(45,156,219,0.04)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <User size={14} style={{ color: 'white' }} />
                    </div>
                    <div>
                      <div style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 600 }}>{p.full_name || 'Patient'}</div>
                      <div style={{ color: '#8896A7', fontSize: '10px' }}>{p.patient_id}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#8896A7', fontSize: '11px' }}>{p.email}</div>
                    <div style={{ color: '#8896A7', fontSize: '10px', marginTop: '2px' }}>{p.phone}</div>
                  </div>
                  <div style={{ color: '#8896A7', fontSize: '11px' }}>{new Date(p.created_at).toLocaleDateString('en-NG')}</div>
                  <div style={{ color: '#2d9cdb', fontSize: '12px', fontWeight: 600 }}>{(p.loyalty_points || 0)} pts</div>
                  <span style={{ padding: '3px 8px', borderRadius: '50px', fontSize: '9px', fontWeight: 600, background: 'rgba(6,214,160,0.1)', color: '#06D6A0' }}>Active</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}