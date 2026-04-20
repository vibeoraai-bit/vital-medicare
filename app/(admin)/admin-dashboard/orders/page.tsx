'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Search, Eye, Package, BarChart3, ShoppingBag, Users, FileText, Settings } from 'lucide-react'

const orders = [
  { id:'VM-2024-048', patient:'Abdullahi Abdurrahman', phone:'+234 814 904 5538', items:'Amoxicillin 500mg × 2', total:'₦2,400', status:'Pending', payment:'Paid', date:'Apr 12, 2026 2:15 PM', delivery:'G.R.A, Maiduguri' },
  { id:'VM-2024-047', patient:'Dr. F,z Wasili', phone:'+234 802 345 6789', items:'Lisinopril 10mg × 1', total:'₦3,500', status:'Processing', payment:'Paid', date:'Apr 12, 2026 1:30 PM', delivery:'Barrack, Maiduguri' },
  { id:'VM-2024-046', patient:'Ezikiel, Musa', phone:'+234 803 456 7890', items:'Vitamin C × 2, Zinc × 1', total:'₦2,000', status:'Dispatched', payment:'Paid', date:'Apr 12, 2026 11:00 AM', delivery:'Polo, Highcourt' },
  { id:'VM-2024-045', patient:'Chidi Okeke', phone:'+234 804 567 8901', items:'Metformin 500mg × 1', total:'₦2,100', status:'Delivered', payment:'Paid', date:'Apr 11, 2026 3:45 PM', delivery:'Asokoro, Abuja' },
  { id:'VM-2024-044', patient:'Ngozi Adeyemi', phone:'+234 805 678 9012', items:'Paracetamol × 3', total:'₦1,050', status:'Delivered', payment:'Paid', date:'Apr 11, 2026 10:15 AM', delivery:'Gwarinpa, Abuja' },
  { id:'VM-2024-043', patient:'Yusuf Musa', phone:'+234 806 789 0123', items:'Omeprazole 20mg × 2', total:'₦3,600', status:'Cancelled', payment:'Refunded', date:'Apr 10, 2026 4:00 PM', delivery:'Kubwa, Abuja' },
]

const statusColor: Record<string,string> = { Pending:'#2d9cdb', Processing:'#1a7ab8', Dispatched:'#2d9cdb', Delivered:'#27ae60', Cancelled:'#C0392B' }
const statusBg: Record<string,string> = { Pending:'rgba(212,175,55,0.15)', Processing:'rgba(18,150,122,0.15)', Dispatched:'rgba(10,92,74,0.15)', Delivered:'rgba(39,174,96,0.15)', Cancelled:'rgba(192,57,43,0.15)' }

const adminLinks = [['Dashboard','/admin-dashboard','BarChart3'],['Orders','/admin-dashboard/orders','Package'],['Products','/admin-dashboard/products','ShoppingBag'],['Patients','/admin-dashboard/patients','Users'],['Prescriptions','/admin-dashboard/prescriptions','FileText'],['Settings','/admin-dashboard/settings','Settings']]

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const filtered = orders.filter(o => (filter === 'All' || o.status === filter) && (o.id.toLowerCase().includes(search.toLowerCase()) || o.patient.toLowerCase().includes(search.toLowerCase())))

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0F1923', fontFamily:'Inter, sans-serif' }}>
      <div style={{ width:'220px', background:'#0A1219', flexShrink:0, position:'sticky', top:0, height:'100vh', display:'flex', flexDirection:'column', borderRight:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ padding:'20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none"><rect x="12" y="4" width="8" height="24" rx="4" fill="#2d9cdb"/><rect x="4" y="12" width="24" height="8" rx="4" fill="#2d9cdb"/></svg>
            <div><div style={{ fontFamily:'Playfair Display, serif', color:'white', fontSize:'13px', fontWeight:700 }}>Vital Medicare</div><div style={{ color:'rgba(255,255,255,0.3)', fontSize:'9px' }}>ADMIN</div></div>
          </div>
        </div>
        <nav style={{ flex:1, padding:'10px 0' }}>
          {adminLinks.map(([label, href]) => (
            <Link key={label} href={href} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 18px', textDecoration:'none', background: label==='Orders' ? 'rgba(20,184,154,0.1)' : 'transparent', borderLeft: label==='Orders' ? '3px solid #2d9cdb' : '3px solid transparent', color: label==='Orders' ? '#2d9cdb' : 'rgba(255,255,255,0.4)', fontSize:'13px', fontWeight: label==='Orders' ? 600 : 400 }}>{label}</Link>
          ))}
        </nav>
        <div style={{ padding:'16px 18px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" style={{ color:'rgba(255,255,255,0.3)', fontSize:'12px', textDecoration:'none' }}>← Exit Admin</Link>
        </div>
      </div>

      <div style={{ flex:1, padding:'28px 32px', overflow:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <h1 style={{ fontFamily:'Playfair Display, serif', color:'white', fontSize:'1.6rem', fontWeight:700 }}>Order Management</h1>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px', marginTop:'3px' }}>{orders.length} total orders today</p>
          </div>
        </div>

        <div style={{ display:'flex', gap:'12px', marginBottom:'20px', flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', padding:'10px 14px', flex:1, minWidth:'200px', maxWidth:'280px' }}>
            <Search size={14} style={{ color:'rgba(255,255,255,0.35)' }}/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." style={{ border:'none', outline:'none', fontSize:'13px', background:'transparent', color:'white', flex:1 }}/>
          </div>
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
            {['All','Pending','Processing','Dispatched','Delivered','Cancelled'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding:'7px 14px', borderRadius:'50px', border:'1px solid', fontSize:'11px', fontWeight:500, cursor:'pointer', borderColor: filter===f ? '#2d9cdb' : 'rgba(255,255,255,0.12)', background: filter===f ? 'rgba(20,184,154,0.15)' : 'transparent', color: filter===f ? '#2d9cdb' : 'rgba(255,255,255,0.45)' }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'16px', overflow:'hidden' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 100px 100px 110px 80px', gap:'0', padding:'12px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)' }}>
            {['Order ID','Patient','Items','Total','Payment','Status','Action'].map(h => (
              <div key={h} style={{ color:'rgba(255,255,255,0.35)', fontSize:'11px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</div>
            ))}
          </div>
          {filtered.map((order, i) => (
            <div key={order.id} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 100px 100px 110px 80px', gap:'0', padding:'14px 20px', borderBottom: i < filtered.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems:'center' }}>
              <div>
                <div style={{ color:'white', fontSize:'12px', fontWeight:600 }}>{order.id}</div>
                <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'10px', marginTop:'2px' }}>{order.date}</div>
              </div>
              <div>
                <div style={{ color:'rgba(255,255,255,0.8)', fontSize:'12px', fontWeight:500 }}>{order.patient}</div>
                <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'10px' }}>{order.delivery}</div>
              </div>
              <div style={{ color:'rgba(255,255,255,0.55)', fontSize:'11px' }}>{order.items}</div>
              <div style={{ color:'white', fontSize:'13px', fontWeight:700 }}>{order.total}</div>
              <div style={{ color:'#2d9cdb', fontSize:'11px', fontWeight:500 }}>{order.payment}</div>
              <span style={{ padding:'4px 10px', borderRadius:'50px', fontSize:'10px', fontWeight:600, color: statusColor[order.status], background: statusBg[order.status], display:'inline-block' }}>{order.status}</span>
              <button style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'6px', padding:'5px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', color:'rgba(255,255,255,0.5)', fontSize:'11px' }}>
                <Eye size={11}/> View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
