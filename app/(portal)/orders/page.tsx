'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import PortalSidebar from '@/components/portal/PortalSidebar'
import { Package, Clock, Search, X, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Order {
  id: string
  order_number: string
  items: Array<{ name: string; qty: number; price: number }>
  total: number
  status: string
  delivery_address: string
  created_at: string
}

const sColor: Record<string, string> = { Delivered: '#06D6A0', Processing: '#F4A261', Dispatched: '#2d9cdb', Pending: '#F4A261', Cancelled: '#EF233C' }
const sBg: Record<string, string> = { Delivered: 'rgba(6,214,160,0.1)', Processing: 'rgba(244,162,97,0.1)', Dispatched: 'rgba(45,156,219,0.1)', Pending: 'rgba(244,162,97,0.1)', Cancelled: 'rgba(239,35,60,0.1)' }

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setOrders(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = orders.filter(o =>
    (filter === 'All' || o.status === filter) &&
    (o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      JSON.stringify(o.items)?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F14', fontFamily: 'Inter, sans-serif' }}>
      <PortalSidebar active="My Orders" />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: '#141C24', padding: '20px 32px', borderBottom: '1px solid rgba(45,156,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.5rem', fontWeight: 700 }}>My Orders</h1>
            <p style={{ color: '#8896A7', fontSize: '13px', marginTop: '3px' }}>{orders.length} total orders</p>
          </div>
          <Link href="/shop" style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, boxShadow: '0 0 12px rgba(45,156,219,0.25)' }}>
            + New Order
          </Link>
        </div>

        <div style={{ padding: '28px 32px' }}>
          {/* Search and Filter */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#141C24', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '10px', padding: '10px 14px', flex: 1, minWidth: '200px', maxWidth: '300px' }}>
              <Search size={14} style={{ color: '#8896A7' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." style={{ border: 'none', outline: 'none', fontSize: '13px', background: 'transparent', flex: 1, color: '#E0E6ED', fontFamily: 'Inter, sans-serif' }} />
              {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={12} style={{ color: '#8896A7' }} /></button>}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['All', 'Pending', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: '50px', border: '1px solid', fontSize: '12px', cursor: 'pointer', borderColor: filter === f ? '#2d9cdb' : 'rgba(45,156,219,0.2)', background: filter === f ? 'rgba(45,156,219,0.12)' : 'transparent', color: filter === f ? '#2d9cdb' : '#8896A7' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#8896A7' }}>Loading your orders...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', background: '#141C24', borderRadius: '16px', border: '1px solid rgba(45,156,219,0.1)' }}>
              <ShoppingBag size={48} style={{ color: 'rgba(45,156,219,0.2)', marginBottom: '16px' }} />
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.2rem', marginBottom: '8px' }}>No orders yet</h3>
              <p style={{ color: '#8896A7', fontSize: '14px', marginBottom: '20px', lineHeight: 1.6 }}>
                Start shopping from Nigeria&apos;s most trusted digital pharmacy.<br />
                500+ NAFDAC-approved medications available.
              </p>
              <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', boxShadow: '0 0 14px rgba(45,156,219,0.25)' }}>
                Browse Medications →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map(o => (
                <div key={o.id} style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '12px', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,156,219,0.3)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,156,219,0.1)'}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(45,156,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Package size={18} style={{ color: '#2d9cdb' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: '140px' }}>
                    <div style={{ color: '#2d9cdb', fontSize: '13px', fontWeight: 700 }}>{o.order_number}</div>
                    <div style={{ color: '#8896A7', fontSize: '11px' }}>
                      {Array.isArray(o.items) ? o.items.slice(0, 2).map((i: { name: string }) => i.name).join(', ') : 'Items'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8896A7', fontSize: '11px' }}>
                    <Clock size={10} /> {new Date(o.created_at).toLocaleDateString('en-NG')}
                  </div>
                  <div style={{ color: '#E0E6ED', fontSize: '14px', fontWeight: 700 }}>₦{o.total?.toLocaleString()}</div>
                  <span style={{ padding: '4px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 600, color: sColor[o.status] || '#8896A7', background: sBg[o.status] || 'rgba(255,255,255,0.05)' }}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}