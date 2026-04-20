'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Search, Package, CheckCircle, Truck, Clock, MapPin } from 'lucide-react'

export default function TrackOrderPage() {
  const [orderNum, setOrderNum] = useState('')
  const [tracked, setTracked] = useState(false)

  const mockOrder = {
    id: 'VM-2024-048',
    items: 'Amoxicillin 500mg × 2, Vitamin C 1000mg × 1',
    total: '₦3,200',
    customer: 'Shareef',
    address: 'Maiduguri, Borno',
    estimatedDelivery: 'Today, by 6:00 PM',
    steps: [
      { label:'Order Placed', desc:'Your order was received and confirmed', time:'2:15 PM', done:true, Icon: CheckCircle },
      { label:'Prescription Verified', desc:'Our doctor verified your prescription', time:'2:35 PM', done:true, Icon: CheckCircle },
      { label:'Order Prepared', desc:'Your medications are being packaged', time:'3:00 PM', done:true, Icon: Package },
      { label:'Out for Delivery', desc:'Your order is on its way to you', time:'3:45 PM', done:true, Icon: Truck },
      { label:'Delivered', desc:'Estimated delivery by 6:00 PM', time:'~6:00 PM', done:false, Icon: MapPin },
    ]
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop:'80px', fontFamily:'Inter, sans-serif', minHeight:'100vh', background:'#0A0F14' }}>
        <div style={{ background:'linear-gradient(135deg, #2d9cdb, #0A0F14)', padding:'80px 24px', textAlign:'center' }}>
          <div style={{ display:'inline-block', background:'rgba(212,175,55,0.15)', border:'1px solid rgba(212,175,55,0.3)', borderRadius:'50px', padding:'6px 18px', color:'#2d9cdb', fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', marginBottom:'16px' }}>ORDER TRACKING</div>
          <h1 style={{ fontFamily:'Playfair Display, serif', color:'white', fontSize:'clamp(2rem, 4vw, 3rem)', fontWeight:700, marginBottom:'32px' }}>Track Your Order</h1>
          
          <div style={{ display:'flex', maxWidth:'500px', margin:'0 auto', background:'white', borderRadius:'12px', overflow:'hidden', boxShadow:'0 8px 32px rgba(0,0,0,0.2)' }}>
            <input value={orderNum} onChange={e => setOrderNum(e.target.value)} placeholder="Enter order number e.g. VM-2024-048"
              style={{ flex:1, padding:'16px 20px', border:'none', outline:'none', fontSize:'14px', color:'#E0E6ED' }}/>
            <button onClick={() => setTracked(true)}
              style={{ background:'#2d9cdb', color:'white', border:'none', padding:'16px 28px', cursor:'pointer', fontWeight:600, fontSize:'14px', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'8px' }}>
              <Search size={16}/> Track
            </button>
          </div>
        </div>

        <div style={{ maxWidth:'700px', margin:'0 auto', padding:'48px 24px' }}>
          {tracked ? (
            <div style={{ background:'white', borderRadius:'20px', padding:'36px', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'32px', flexWrap:'wrap', gap:'16px' }}>
                <div>
                  <div style={{ color:'#8896A7', fontSize:'13px', marginBottom:'4px' }}>Order Number</div>
                  <div style={{ fontFamily:'Playfair Display, serif', color:'#E0E6ED', fontSize:'1.3rem', fontWeight:700 }}>{mockOrder.id}</div>
                </div>
                <div style={{ background:'rgba(20,184,154,0.1)', border:'1px solid rgba(20,184,154,0.3)', borderRadius:'50px', padding:'6px 16px', color:'#2d9cdb', fontSize:'12px', fontWeight:600 }}>Out for Delivery</div>
              </div>

              <div style={{ background:'rgba(45,156,219,0.1)', borderRadius:'12px', padding:'16px 20px', marginBottom:'32px', display:'flex', alignItems:'center', gap:'10px' }}>
                <Clock size={16} style={{ color:'#2d9cdb', flexShrink:0 }}/>
                <span style={{ color:'#E0E6ED', fontSize:'14px', fontWeight:500 }}>Estimated delivery: <strong>{mockOrder.estimatedDelivery}</strong></span>
              </div>

              <div style={{ marginBottom:'32px' }}>
                {mockOrder.steps.map(({ label, desc, time, done, Icon }, i) => (
                  <div key={label} style={{ display:'flex', gap:'16px', marginBottom: i < mockOrder.steps.length-1 ? '0' : '0' }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                      <div style={{ width:'36px', height:'36px', borderRadius:'50%', background: done ? '#2d9cdb' : 'rgba(45,156,219,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <Icon size={16} style={{ color: done ? 'white' : '#8896A7' }}/>
                      </div>
                      {i < mockOrder.steps.length-1 && <div style={{ width:'2px', height:'40px', background: done ? '#2d9cdb' : 'rgba(45,156,219,0.1)', margin:'4px 0' }}/>}
                    </div>
                    <div style={{ paddingBottom: i < mockOrder.steps.length-1 ? '8px' : '0', paddingTop:'6px' }}>
                      <div style={{ color: done ? '#E0E6ED' : '#8896A7', fontSize:'14px', fontWeight: done ? 600 : 400 }}>{label}</div>
                      <div style={{ color:'#8896A7', fontSize:'12px', marginTop:'2px' }}>{desc}</div>
                      <div style={{ color:'#2d9cdb', fontSize:'11px', fontWeight:500, marginTop:'3px' }}>{time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background:'#0A0F14', borderRadius:'12px', padding:'16px 20px' }}>
                <div style={{ color:'#8896A7', fontSize:'12px', marginBottom:'8px' }}>Delivering to</div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <MapPin size={14} style={{ color:'#2d9cdb' }}/>
                  <span style={{ color:'#E0E6ED', fontSize:'13px', fontWeight:500 }}>{mockOrder.address}</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'60px 24px', color:'#8896A7' }}>
              <Package size={64} style={{ color:'#C8DDD8', marginBottom:'20px' }}/>
              <h3 style={{ fontFamily:'Playfair Display, serif', color:'#E0E6ED', fontSize:'1.3rem', marginBottom:'8px' }}>Enter your order number above</h3>
              <p style={{ fontSize:'14px' }}>You can find your order number in your confirmation email or SMS</p>
              <p style={{ fontSize:'13px', marginTop:'12px', color:'#2d9cdb', fontWeight:500 }}>Try: VM-2024-048 (demo)</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
