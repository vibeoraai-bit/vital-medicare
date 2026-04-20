'use client'
import { useState } from 'react'
import Link from 'next/link'
import PortalSidebar from '@/components/portal/PortalSidebar'
import { Package, Clock, Search, X, RefreshCw, Download } from 'lucide-react'

const orders = [
  { id: 'VM-2024-048', items: 'Amoxicillin 500mg × 2, Vitamin C × 1', date: 'Apr 11, 2026', total: '₦3,200', status: 'Delivered' },
  { id: 'VM-2024-047', items: 'Omeprazole 20mg × 1', date: 'Apr 8, 2026', total: '₦1,800', status: 'Processing' },
  { id: 'VM-2024-046', items: 'Paracetamol 500mg × 3, Ibuprofen × 2', date: 'Apr 5, 2026', total: '₦2,050', status: 'Dispatched' },
  { id: 'VM-2024-045', items: 'Metformin 500mg × 1', date: 'Apr 1, 2026', total: '₦2,100', status: 'Delivered' },
  { id: 'VM-2024-044', items: 'Vitamin D3 5000IU × 2', date: 'Mar 28, 2026', total: '₦4,800', status: 'Delivered' },
  { id: 'VM-2024-043', items: 'Lisinopril 10mg × 1', date: 'Mar 22, 2026', total: '₦3,500', status: 'Cancelled' },
]

const sColor: Record<string, string> = { Delivered: '#06D6A0', Processing: '#F4A261', Dispatched: '#2d9cdb', Cancelled: '#EF233C' }
const sBg: Record<string, string> = { Delivered: 'rgba(6,214,160,0.1)', Processing: 'rgba(244,162,97,0.1)', Dispatched: 'rgba(45,156,219,0.1)', Cancelled: 'rgba(239,35,60,0.1)' }

export default function OrdersPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const filtered = orders.filter(o =>
    (filter === 'All' || o.status === filter) &&
    (o.id.toLowerCase().includes(search.toLowerCase()) || o.items.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F14', fontFamily: 'Inter, sans-serif' }}>
      <PortalSidebar active="My Orders" />
      <div style={{ flex: 1, overflow: 'auto' }}>

        {/* Header */}
        <div style={{ background: '#141C24', padding: '20px 32px', borderBottom: '1px solid rgba(45,156,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.5rem', fontWeight: 700 }}>My Orders</h1>
            <p style={{ color: '#8896A7', fontSize: '13px', marginTop: '3px' }}>{orders.length} total orders</p>
          </div>
          <Link href="/shop" style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, boxShadow: '0 0 14px rgba(45,156,219,0.25)' }}>
            + New Order
          </Link>
        </div>

        <div style={{ padding: '28px 32px' }}>

          {/* Search and Filter */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#141C24', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '10px', padding: '10px 14px', flex: 1, minWidth: '200px', maxWidth: '320px' }}>
              <Search size={15} style={{ color: '#8896A7' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..."
                style={{ border: 'none', outline: 'none', fontSize: '13px', background: 'transparent', flex: 1, color: '#E0E6ED', fontFamily: 'Inter, sans-serif' }} />
              {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={13} style={{ color: '#8896A7' }} /></button>}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['All', 'Delivered', 'Processing', 'Dispatched', 'Cancelled'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding: '8px 16px', borderRadius: '50px', border: '1px solid', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s', borderColor: filter === f ? '#2d9cdb' : 'rgba(45,156,219,0.2)', background: filter === f ? 'rgba(45,156,219,0.15)' : 'transparent', color: filter === f ? '#2d9cdb' : '#8896A7' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map(o => (
              <div key={o.id}
                style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '12px', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,156,219,0.3)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,156,219,0.1)'}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(45,156,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Package size={18} style={{ color: '#2d9cdb' }} />
                </div>
                <div style={{ flex: 1, minWidth: '140px' }}>
                  <div style={{ color: '#2d9cdb', fontSize: '13px', fontWeight: 700 }}>{o.id}</div>
                  <div style={{ color: '#8896A7', fontSize: '11px', marginTop: '2px' }}>{o.items}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8896A7', fontSize: '12px' }}>
                  <Clock size={11} />{o.date}
                </div>
                <div style={{ color: '#E0E6ED', fontSize: '14px', fontWeight: 700 }}>{o.total}</div>
                <span style={{ padding: '4px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 600, color: sColor[o.status], background: sBg[o.status] }}>
                  {o.status}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '7px', padding: '6px 10px', cursor: 'pointer', color: '#2d9cdb', fontSize: '11px' }}>
                    <RefreshCw size={11} /> Reorder
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '7px', padding: '6px 10px', cursor: 'pointer', color: '#8896A7', fontSize: '11px' }}>
                    <Download size={11} /> Receipt
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px', color: '#8896A7' }}>
                <Package size={40} style={{ color: 'rgba(45,156,219,0.2)', marginBottom: '12px' }} />
                <p>No orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}