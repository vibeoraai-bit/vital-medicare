'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Search, User, Phone, Mail, Calendar } from 'lucide-react'

const patients = [
  { id:'PH-847291', name:'Shareef Ahmed', email:'shareef@email.com', phone:'+234 814 904 5538', joined:'Jan 15, 2026', orders:12, points:840, status:'Active' },
  { id:'PH-847292', name:'Abdullahi Abdurrahman', email:'amaka@email.com', phone:'+234 802 345 6789', joined:'Feb 3, 2026', orders:8, points:620, status:'Active' },
  { id:'PH-847293', name:'Dr. F,z Wasili', email:'emeka@email.com', phone:'+234 803 456 7890', joined:'Mar 1, 2026', orders:5, points:380, status:'Active' },
  { id:'PH-847294', name:'Ezikiel, Musa', email:'fatima@email.com', phone:'+234 804 567 8901', joined:'Mar 15, 2026', orders:3, points:210, status:'Active' },
  { id:'PH-847295', name:'Chidi Okeke', email:'chidi@email.com', phone:'+234 805 678 9012', joined:'Apr 1, 2026', orders:2, points:140, status:'Active' },
  { id:'PH-847296', name:'Ngozi Adeyemi', email:'ngozi@email.com', phone:'+234 806 789 0123', joined:'Apr 5, 2026', orders:1, points:70, status:'Inactive' },
]

const adminLinks = [
  ['Dashboard', '/admin-dashboard'],
  ['Orders', '/admin-dashboard/orders'],
  ['Products', '/admin-dashboard/products'],
  ['Patients', '/admin-dashboard/patients'],
  ['Prescriptions', '/rx-review'],
  ['Settings', '/admin-dashboard/settings'],
]

export default function AdminPatientsPage() {
  const [search, setSearch] = useState('')
  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0F1923', fontFamily:'Inter, sans-serif' }}>
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
              style={{ display:'block', padding:'11px 18px', textDecoration:'none', background: label==='Patients' ? 'rgba(20,184,154,0.1)' : 'transparent', borderLeft: label==='Patients' ? '3px solid #2d9cdb' : '3px solid transparent', color: label==='Patients' ? '#2d9cdb' : 'rgba(255,255,255,0.4)', fontSize:'13px', fontWeight: label==='Patients' ? 600 : 400 }}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ padding:'16px 18px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" style={{ color:'rgba(255,255,255,0.3)', fontSize:'12px', textDecoration:'none' }}>← Exit Admin</Link>
        </div>
      </div>

      <div style={{ flex:1, padding:'28px 32px', overflow:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <h1 style={{ fontFamily:'Playfair Display, serif', color:'white', fontSize:'1.6rem', fontWeight:700 }}>Patient Management</h1>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px', marginTop:'3px' }}>{patients.length} registered patients</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:'16px', marginBottom:'24px' }}>
          {[
            { label:'Total Patients', value:'12,847', color:'#2d9cdb' },
            { label:'Active This Month', value:'1,203', color:'#2d9cdb' },
            { label:'New This Week', value:'47', color:'#1a7ab8' },
            { label:'Premium Members', value:'234', color:'#2d9cdb' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px', padding:'18px' }}>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px', marginBottom:'6px' }}>{label}</div>
              <div style={{ fontFamily:'Playfair Display, serif', color, fontSize:'1.6rem', fontWeight:700 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', padding:'10px 14px', maxWidth:'320px', marginBottom:'20px' }}>
          <Search size={14} style={{ color:'rgba(255,255,255,0.35)' }}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..." style={{ border:'none', outline:'none', fontSize:'13px', background:'transparent', color:'white', flex:1 }}/>
        </div>

        {/* Patients Table */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'16px', overflow:'hidden' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1.5fr 1fr 80px 80px 70px 70px', gap:'0', padding:'12px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)' }}>
            {['Patient','Contact','Joined','Orders','Points','Status','Action'].map(h => (
              <div key={h} style={{ color:'rgba(255,255,255,0.35)', fontSize:'10px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</div>
            ))}
          </div>
          {filtered.map((p, i) => (
            <div key={p.id} style={{ display:'grid', gridTemplateColumns:'1.5fr 1.5fr 1fr 80px 80px 70px 70px', gap:'0', padding:'14px 20px', borderBottom: i < filtered.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'linear-gradient(135deg, #2d9cdb, #1a7ab8)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <User size={14} style={{ color:'white' }}/>
                </div>
                <div>
                  <div style={{ color:'white', fontSize:'12px', fontWeight:600 }}>{p.name}</div>
                  <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'10px' }}>{p.id}</div>
                </div>
              </div>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'5px', color:'rgba(255,255,255,0.55)', fontSize:'11px', marginBottom:'3px' }}>
                  <Mail size={10}/> {p.email}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'5px', color:'rgba(255,255,255,0.4)', fontSize:'10px' }}>
                  <Phone size={10}/> {p.phone}
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'5px', color:'rgba(255,255,255,0.4)', fontSize:'11px' }}>
                <Calendar size={10}/> {p.joined}
              </div>
              <div style={{ color:'#2d9cdb', fontSize:'13px', fontWeight:600 }}>{p.orders}</div>
              <div style={{ color:'#2d9cdb', fontSize:'12px', fontWeight:500 }}>{p.points} pts</div>
              <span style={{ padding:'3px 8px', borderRadius:'50px', fontSize:'9px', fontWeight:600, color: p.status==='Active' ? '#2d9cdb' : '#8896A7', background: p.status==='Active' ? 'rgba(45,156,219,0.1)' : 'rgba(92,122,114,0.1)' }}>{p.status}</span>
              <button style={{ background:'rgba(20,184,154,0.1)', border:'1px solid rgba(20,184,154,0.2)', borderRadius:'6px', padding:'5px 10px', cursor:'pointer', color:'#2d9cdb', fontSize:'10px', fontWeight:500 }}>View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
