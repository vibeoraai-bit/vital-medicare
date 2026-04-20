'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Eye, CheckCircle, XCircle, FileText } from 'lucide-react'

const prescriptions = [
  { id:'RX-2024-021', patient:'Abdullahi Abdurrahman', doctor:'Dr. F,z Wasili', medications:'Amoxicillin 500mg, Omeprazole 20mg', uploaded:'2 min ago', status:'Pending' },
  { id:'RX-2024-020', patient:'Chidi Okeke', doctor:'Dr. Fatima Hassan', medications:'Atorvastatin 20mg', uploaded:'25 min ago', status:'Pending' },
  { id:'RX-2024-019', patient:'Ngozi Adeyemi', doctor:'Dr. Chidi Nwosu', medications:'Lisinopril 10mg, Metformin 500mg', uploaded:'1 hr ago', status:'Verified' },
  { id:'RX-2024-018', patient:'Yusuf Musa', doctor:'Dr. Aisha Bello', medications:'Loratadine 10mg', uploaded:'3 hrs ago', status:'Rejected' },
  { id:'RX-2024-017', patient:'Fatima Hassan', doctor:'Dr. F,z Wasili', medications:'Vitamin D3, Folic Acid', uploaded:'5 hrs ago', status:'Verified' },
]

const statusColor: Record<string,string> = { Pending:'#2d9cdb', Verified:'#2d9cdb', Rejected:'#C0392B' }
const statusBg: Record<string,string> = { Pending:'rgba(212,175,55,0.12)', Verified:'rgba(45,156,219,0.1)', Rejected:'rgba(192,57,43,0.1)' }

const adminLinks = [
  ['Dashboard', '/admin-dashboard'],
  ['Orders', '/admin-dashboard/orders'],
  ['Products', '/admin-dashboard/products'],
  ['Patients', '/admin-dashboard/patients'],
  ['Prescriptions', '/rx-review'],
  ['Settings', '/admin-dashboard/settings'],
]

export default function AdminPrescriptionsPage() {
  const [selected, setSelected] = useState<string|null>(null)
  const [filter, setFilter] = useState('All')
  const [statuses, setStatuses] = useState<Record<string,string>>(
    Object.fromEntries(prescriptions.map(p => [p.id, p.status]))
  )

  const filtered = prescriptions.filter(p => filter === 'All' || statuses[p.id] === filter)
  const pending = Object.values(statuses).filter(s => s === 'Pending').length

  const approve = (id: string) => {
    setStatuses(prev => ({ ...prev, [id]: 'Verified' }))
    setSelected(null)
  }

  const reject = (id: string) => {
    setStatuses(prev => ({ ...prev, [id]: 'Rejected' }))
    setSelected(null)
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0F1923', fontFamily:'Inter, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width:'220px', background:'#0A1219', flexShrink:0, position:'sticky', top:0, height:'100vh', display:'flex', flexDirection:'column', borderRight:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ padding:'20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'8px' }}>
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <rect x="12" y="4" width="8" height="24" rx="4" fill="#2d9cdb"/>
              <rect x="4" y="12" width="24" height="8" rx="4" fill="#2d9cdb"/>
            </svg>
            <div>
              <div style={{ fontFamily:'Playfair Display, serif', color:'white', fontSize:'13px', fontWeight:700 }}>Vital Medicare</div>
              <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'9px' }}>ADMIN</div>
            </div>
          </Link>
        </div>
        <nav style={{ flex:1, padding:'10px 0' }}>
          {adminLinks.map(([label, href]) => (
            <Link key={label} href={href}
              style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 18px', textDecoration:'none', background: label==='Prescriptions' ? 'rgba(20,184,154,0.1)' : 'transparent', borderLeft: label==='Prescriptions' ? '3px solid #2d9cdb' : '3px solid transparent', color: label==='Prescriptions' ? '#2d9cdb' : 'rgba(255,255,255,0.4)', fontSize:'13px', fontWeight: label==='Prescriptions' ? 600 : 400 }}>
              <span>{label}</span>
              {label === 'Prescriptions' && pending > 0 && (
                <span style={{ background:'#C0392B', color:'white', borderRadius:'50%', width:'18px', height:'18px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:700 }}>{pending}</span>
              )}
            </Link>
          ))}
        </nav>
        <div style={{ padding:'16px 18px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" style={{ color:'rgba(255,255,255,0.3)', fontSize:'12px', textDecoration:'none' }}>← Exit Admin</Link>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, padding:'28px 32px', overflow:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <h1 style={{ fontFamily:'Playfair Display, serif', color:'white', fontSize:'1.6rem', fontWeight:700 }}>Prescription Review</h1>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px', marginTop:'3px' }}>
              <span style={{ color:'#e74c3c', fontWeight:600 }}>{pending} pending</span> prescriptions need review
            </p>
          </div>
          <div style={{ display:'flex', gap:'8px' }}>
            {['All','Pending','Verified','Rejected'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding:'7px 14px', borderRadius:'50px', border:'1px solid', fontSize:'11px', fontWeight:500, cursor:'pointer', borderColor: filter===f ? '#2d9cdb' : 'rgba(255,255,255,0.12)', background: filter===f ? 'rgba(20,184,154,0.15)' : 'transparent', color: filter===f ? '#2d9cdb' : 'rgba(255,255,255,0.45)' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {filtered.map(rx => (
            <div key={rx.id}
              onClick={() => setSelected(selected === rx.id ? null : rx.id)}
              style={{ background: selected===rx.id ? 'rgba(20,184,154,0.08)' : 'rgba(255,255,255,0.03)', border:`1px solid ${selected===rx.id ? '#2d9cdb' : 'rgba(255,255,255,0.06)'}`, borderRadius:'12px', padding:'16px 20px', cursor:'pointer', transition:'all 0.2s' }}>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px' }}>
                <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
                  <div style={{ width:'38px', height:'38px', borderRadius:'8px', background:'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <FileText size={16} style={{ color:'rgba(255,255,255,0.4)' }}/>
                  </div>
                  <div>
                    <div style={{ color:'white', fontSize:'13px', fontWeight:600 }}>{rx.id} — {rx.patient}</div>
                    <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px' }}>Dr. {rx.doctor} · {rx.uploaded}</div>
                    <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'11px', marginTop:'2px' }}>{rx.medications}</div>
                  </div>
                </div>
                <span style={{ padding:'4px 12px', borderRadius:'50px', fontSize:'10px', fontWeight:600, color: statusColor[statuses[rx.id]], background: statusBg[statuses[rx.id]] }}>
                  {statuses[rx.id]}
                </span>
              </div>

              {selected === rx.id && statuses[rx.id] === 'Pending' && (
                <div style={{ marginTop:'16px', paddingTop:'16px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:'10px', flexWrap:'wrap' }}>
                  <div style={{ flex:1, background:'rgba(255,255,255,0.04)', borderRadius:'10px', padding:'20px', minHeight:'80px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <div style={{ textAlign:'center' }}>
                      <FileText size={32} style={{ color:'rgba(255,255,255,0.2)', marginBottom:'8px' }}/>
                      <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'12px', marginBottom:'8px' }}>Prescription image</p>
                      <button style={{ background:'rgba(255,255,255,0.08)', border:'none', borderRadius:'6px', padding:'6px 14px', cursor:'pointer', color:'rgba(255,255,255,0.5)', fontSize:'11px', display:'inline-flex', alignItems:'center', gap:'5px' }}>
                        <Eye size={11}/> View Image
                      </button>
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'10px', minWidth:'160px' }}>
                    <button onClick={e => { e.stopPropagation(); approve(rx.id) }}
                      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', background:'rgba(10,92,74,0.3)', border:'1px solid #2d9cdb', borderRadius:'8px', padding:'12px 16px', cursor:'pointer', color:'#2d9cdb', fontWeight:600, fontSize:'13px' }}>
                      <CheckCircle size={15}/> Approve
                    </button>
                    <button onClick={e => { e.stopPropagation(); reject(rx.id) }}
                      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', background:'rgba(192,57,43,0.2)', border:'1px solid rgba(192,57,43,0.4)', borderRadius:'8px', padding:'12px 16px', cursor:'pointer', color:'#e74c3c', fontWeight:600, fontSize:'13px' }}>
                      <XCircle size={15}/> Reject
                    </button>
                    <textarea placeholder="Add notes for patient..."
                      onClick={e => e.stopPropagation()}
                      style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', padding:'8px 12px', color:'rgba(255,255,255,0.7)', fontSize:'12px', resize:'none', height:'80px', outline:'none', fontFamily:'Inter, sans-serif' }}/>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
