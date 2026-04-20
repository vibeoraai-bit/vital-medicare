'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Search, Plus, Edit, Trash2, TrendingUp, Star, Package, Trophy } from 'lucide-react'

const products = [
  { id:1, name:'Amoxicillin 500mg', category:'Prescription', price:1200, stock:150, sold:847, rating:4.8, revenue:1016400, trending:true, badge:'🏆 Top Seller' },
  { id:2, name:'Paracetamol 500mg', category:'OTC', price:350, stock:500, sold:1203, rating:4.7, revenue:421050, trending:true, badge:'🔥 Fast Moving' },
  { id:3, name:'Vitamin C 1000mg', category:'Vitamins', price:800, stock:300, sold:689, rating:4.9, revenue:551200, trending:true, badge:'⭐ Highest Rated' },
  { id:4, name:'Omeprazole 20mg', category:'Prescription', price:1800, stock:120, sold:423, rating:4.6, revenue:761400, trending:false, badge:null },
  { id:5, name:'Metformin 500mg', category:'Prescription', price:2100, stock:80, sold:312, rating:4.7, revenue:655200, trending:false, badge:null },
  { id:6, name:'Vitamin D3 5000IU', category:'Vitamins', price:2400, stock:200, sold:287, rating:4.8, revenue:688800, trending:true, badge:'📈 Rising' },
  { id:7, name:'Ibuprofen 400mg', category:'OTC', price:450, stock:400, sold:534, rating:4.5, revenue:240300, trending:false, badge:null },
  { id:8, name:'Lisinopril 10mg', category:'Prescription', price:3500, stock:45, sold:198, rating:4.6, revenue:693000, trending:false, badge:null },
]

const winningProducts = products.sort((a,b) => b.sold - a.sold).slice(0,4)

export default function AdminProductsPage() {
  const [search, setSearch] = useState('')
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

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
          {[['Dashboard','/admin-dashboard'],['Orders','/admin-dashboard/orders'],['Products','/admin-dashboard/products'],['Patients','/admin-dashboard/patients'],['Prescriptions','/admin-dashboard/prescriptions'],['Settings','/admin-dashboard/settings']].map(([label, href]) => (
            <Link key={label} href={href} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 18px', textDecoration:'none', background: label==='Products' ? 'rgba(20,184,154,0.1)' : 'transparent', borderLeft: label==='Products' ? '3px solid #2d9cdb' : '3px solid transparent', color: label==='Products' ? '#2d9cdb' : 'rgba(255,255,255,0.4)', fontSize:'13px', fontWeight: label==='Products' ? 600 : 400 }}>{label}</Link>
          ))}
        </nav>
        <div style={{ padding:'16px 18px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" style={{ color:'rgba(255,255,255,0.3)', fontSize:'12px', textDecoration:'none' }}>← Exit Admin</Link>
        </div>
      </div>

      <div style={{ flex:1, padding:'28px 32px', overflow:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <h1 style={{ fontFamily:'Playfair Display, serif', color:'white', fontSize:'1.6rem', fontWeight:700 }}>Product Management</h1>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px', marginTop:'3px' }}>{products.length} products in inventory</p>
          </div>
          <button style={{ display:'flex', alignItems:'center', gap:'6px', background:'#2d9cdb', color:'white', border:'none', borderRadius:'8px', padding:'10px 20px', cursor:'pointer', fontWeight:600, fontSize:'13px' }}>
            <Plus size={15}/> Add Product
          </button>
        </div>

        {/* 🏆 WINNING PRODUCTS SECTION */}
        <div style={{ background:'rgba(212,175,55,0.06)', border:'1px solid rgba(212,175,55,0.2)', borderRadius:'16px', padding:'24px', marginBottom:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
            <Trophy size={20} style={{ color:'#2d9cdb' }}/>
            <h2 style={{ fontFamily:'Playfair Display, serif', color:'#2d9cdb', fontSize:'1.2rem', fontWeight:700 }}>Winning Products — Restock These Now</h2>
          </div>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px', marginBottom:'20px' }}>These are your fastest-selling medications. Keep them well-stocked to maximize revenue.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'16px' }}>
            {winningProducts.map((p, i) => (
              <div key={p.id} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,175,55,0.15)', borderRadius:'12px', padding:'18px', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:'10px', right:'10px', fontSize:'18px' }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅'}
                </div>
                <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'10px', fontWeight:600, letterSpacing:'0.05em', marginBottom:'6px' }}>#{i+1} BEST SELLER</div>
                <div style={{ color:'white', fontSize:'14px', fontWeight:700, marginBottom:'4px' }}>{p.name}</div>
                <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px', marginBottom:'14px' }}>{p.category}</div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                  <div>
                    <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'10px' }}>Units Sold</div>
                    <div style={{ color:'#2d9cdb', fontSize:'1.3rem', fontWeight:700 }}>{p.sold.toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'10px' }}>Revenue</div>
                    <div style={{ color:'#2d9cdb', fontSize:'1rem', fontWeight:700 }}>₦{(p.revenue/1000).toFixed(0)}k</div>
                  </div>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                    <div style={{ height:'4px', width:'60px', background:'rgba(255,255,255,0.08)', borderRadius:'2px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${Math.min((p.stock/200)*100, 100)}%`, background: p.stock < 50 ? '#C0392B' : '#2d9cdb', borderRadius:'2px' }}/>
                    </div>
                    <span style={{ color: p.stock < 50 ? '#e74c3c' : 'rgba(255,255,255,0.4)', fontSize:'10px' }}>{p.stock} left</span>
                  </div>
                  <button style={{ background:'rgba(212,175,55,0.2)', border:'1px solid rgba(212,175,55,0.3)', borderRadius:'6px', padding:'4px 10px', cursor:'pointer', color:'#2d9cdb', fontSize:'10px', fontWeight:600 }}>Restock →</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', padding:'10px 14px', maxWidth:'300px', marginBottom:'20px' }}>
          <Search size={14} style={{ color:'rgba(255,255,255,0.35)' }}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ border:'none', outline:'none', fontSize:'13px', background:'transparent', color:'white', flex:1 }}/>
        </div>

        {/* Products Table */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'16px', overflow:'hidden' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 80px 80px 100px 100px 80px 80px', gap:'0', padding:'12px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)' }}>
            {['Product','Category','Price','Stock','Sold','Revenue','Rating','Action'].map(h => (
              <div key={h} style={{ color:'rgba(255,255,255,0.35)', fontSize:'10px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</div>
            ))}
          </div>
          {filtered.map((p, i) => (
            <div key={p.id} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 80px 80px 100px 100px 80px 80px', gap:'0', padding:'14px 20px', borderBottom: i < filtered.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <div style={{ color:'white', fontSize:'13px', fontWeight:600 }}>{p.name}</div>
                {p.trending && <TrendingUp size={12} style={{ color:'#2d9cdb' }}/>}
              </div>
              <span style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.5)', padding:'3px 8px', borderRadius:'4px', fontSize:'10px' }}>{p.category}</span>
              <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'12px' }}>₦{p.price.toLocaleString()}</div>
              <div style={{ color: p.stock < 50 ? '#e74c3c' : 'rgba(255,255,255,0.7)', fontSize:'12px', fontWeight: p.stock < 50 ? 700 : 400 }}>{p.stock}</div>
              <div style={{ color:'#2d9cdb', fontSize:'12px', fontWeight:600 }}>{p.sold.toLocaleString()}</div>
              <div style={{ color:'#2d9cdb', fontSize:'12px', fontWeight:600 }}>₦{(p.revenue/1000).toFixed(0)}k</div>
              <div style={{ display:'flex', alignItems:'center', gap:'3px', color:'rgba(255,255,255,0.6)', fontSize:'11px' }}>
                <Star size={10} style={{ fill:'#2d9cdb', color:'#2d9cdb' }}/> {p.rating}
              </div>
              <div style={{ display:'flex', gap:'4px' }}>
                <button style={{ background:'rgba(20,184,154,0.1)', border:'1px solid rgba(20,184,154,0.2)', borderRadius:'6px', padding:'4px 8px', cursor:'pointer', color:'#2d9cdb' }}><Edit size={11}/></button>
                <button style={{ background:'rgba(192,57,43,0.1)', border:'1px solid rgba(192,57,43,0.2)', borderRadius:'6px', padding:'4px 8px', cursor:'pointer', color:'#e74c3c' }}><Trash2 size={11}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
