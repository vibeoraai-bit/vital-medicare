'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Save, Bell, Shield, Store, Truck, CreditCard } from 'lucide-react'

const adminLinks = [
  ['Dashboard', '/admin-dashboard'],
  ['Orders', '/admin-dashboard/orders'],
  ['Products', '/admin-dashboard/products'],
  ['Patients', '/admin-dashboard/patients'],
  ['Prescriptions', '/rx-review'],
  ['Settings', '/admin-dashboard/settings'],
]

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    pharmacyName: 'Vital Medicare & Pharmaceuticals Ltd.',
    email: 'vitalmedicare.official@gmail.com',
    phone: '+234 814 904 5538',
    address: 'No.1 Railway Junction,Airport Road, Maiduguri,Borno, Nigeria.',
    nafdac: 'VC/04/12345',
    pcn: 'PCN/PH/2024/001',
    deliveryFee: '500',
    freeDeliveryThreshold: '10000',
    sameDayCutoff: '16:00',
    paystackKey: 'pk_live_••••••••••••',
    lowStockThreshold: '10',
    orderNotifications: true,
    prescriptionNotifications: true,
    lowStockNotifications: true,
    weeklyReports: true,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

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
              style={{ display:'block', padding:'11px 18px', textDecoration:'none', background: label==='Settings' ? 'rgba(20,184,154,0.1)' : 'transparent', borderLeft: label==='Settings' ? '3px solid #2d9cdb' : '3px solid transparent', color: label==='Settings' ? '#2d9cdb' : 'rgba(255,255,255,0.4)', fontSize:'13px', fontWeight: label==='Settings' ? 600 : 400 }}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ padding:'16px 18px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" style={{ color:'rgba(255,255,255,0.3)', fontSize:'12px', textDecoration:'none' }}>← Exit Admin</Link>
        </div>
      </div>

      <div style={{ flex:1, padding:'28px 32px', overflow:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px' }}>
          <div>
            <h1 style={{ fontFamily:'Playfair Display, serif', color:'white', fontSize:'1.6rem', fontWeight:700 }}>Settings</h1>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px', marginTop:'3px' }}>Manage your pharmacy platform settings</p>
          </div>
          <button onClick={handleSave}
            style={{ display:'flex', alignItems:'center', gap:'6px', background: saved ? '#2d9cdb' : '#2d9cdb', color:'white', border:'none', borderRadius:'8px', padding:'10px 22px', cursor:'pointer', fontWeight:600, fontSize:'13px', transition:'background 0.3s' }}>
            <Save size={15}/> {saved ? 'Saved ✓' : 'Save Changes'}
          </button>
        </div>

        <div style={{ display:'grid', gap:'20px' }}>

          {/* Pharmacy Info */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'24px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px' }}>
              <Store size={16} style={{ color:'#2d9cdb' }}/>
              <h3 style={{ color:'white', fontSize:'14px', fontWeight:600 }}>Pharmacy Information</h3>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'16px' }}>
              {[
                { label:'Pharmacy Name', key:'pharmacyName' },
                { label:'Email Address', key:'email' },
                { label:'Phone Number', key:'phone' },
                { label:'NAFDAC Number', key:'nafdac' },
                { label:'PCN Number', key:'pcn' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label style={{ display:'block', color:'rgba(255,255,255,0.4)', fontSize:'11px', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</label>
                  <input value={form[key as keyof typeof form] as string} onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', padding:'10px 14px', color:'white', fontSize:'13px', outline:'none', boxSizing:'border-box' }}/>
                </div>
              ))}
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'block', color:'rgba(255,255,255,0.4)', fontSize:'11px', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.05em' }}>Address</label>
                <input value={form.address} onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                  style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', padding:'10px 14px', color:'white', fontSize:'13px', outline:'none', boxSizing:'border-box' }}/>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'24px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px' }}>
              <Truck size={16} style={{ color:'#2d9cdb' }}/>
              <h3 style={{ color:'white', fontSize:'14px', fontWeight:600 }}>Delivery Settings</h3>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'16px' }}>
              {[
                { label:'Delivery Fee (₦)', key:'deliveryFee' },
                { label:'Free Delivery Above (₦)', key:'freeDeliveryThreshold' },
                { label:'Same-day Order Cutoff', key:'sameDayCutoff' },
                { label:'Low Stock Alert Threshold', key:'lowStockThreshold' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label style={{ display:'block', color:'rgba(255,255,255,0.4)', fontSize:'11px', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</label>
                  <input value={form[key as keyof typeof form] as string} onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', padding:'10px 14px', color:'white', fontSize:'13px', outline:'none', boxSizing:'border-box' }}/>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'24px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px' }}>
              <Bell size={16} style={{ color:'#1a7ab8' }}/>
              <h3 style={{ color:'white', fontSize:'14px', fontWeight:600 }}>Notifications</h3>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              {[
                { label:'New order notifications', key:'orderNotifications' },
                { label:'New prescription notifications', key:'prescriptionNotifications' },
                { label:'Low stock alerts', key:'lowStockNotifications' },
                { label:'Weekly sales reports', key:'weeklyReports' },
              ].map(({ label, key }) => (
                <div key={key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'rgba(255,255,255,0.03)', borderRadius:'8px' }}>
                  <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'13px' }}>{label}</span>
                  <button onClick={() => setForm(prev => ({ ...prev, [key]: !prev[key as keyof typeof form] }))}
                    style={{ width:'44px', height:'24px', borderRadius:'12px', border:'none', cursor:'pointer', transition:'background 0.2s', background: form[key as keyof typeof form] ? '#2d9cdb' : 'rgba(255,255,255,0.15)', position:'relative' }}>
                    <div style={{ width:'18px', height:'18px', borderRadius:'50%', background:'white', position:'absolute', top:'3px', transition:'left 0.2s', left: form[key as keyof typeof form] ? '23px' : '3px' }}/>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'24px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px' }}>
              <Shield size={16} style={{ color:'#e74c3c' }}/>
              <h3 style={{ color:'white', fontSize:'14px', fontWeight:600 }}>Security</h3>
            </div>
            <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
              <button style={{ background:'rgba(192,57,43,0.15)', border:'1px solid rgba(192,57,43,0.3)', borderRadius:'8px', padding:'10px 20px', cursor:'pointer', color:'#e74c3c', fontSize:'13px', fontWeight:500 }}>Change Admin Password</button>
              <button style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', padding:'10px 20px', cursor:'pointer', color:'rgba(255,255,255,0.6)', fontSize:'13px', fontWeight:500 }}>View Audit Logs</button>
              <button style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', padding:'10px 20px', cursor:'pointer', color:'rgba(255,255,255,0.6)', fontSize:'13px', fontWeight:500 }}>Export Patient Data</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
