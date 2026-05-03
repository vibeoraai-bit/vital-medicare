'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Search, Eye, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Order {
  id: string
  order_number: string
  user_id: string
  items: Array<{ name: string; qty: number; price: number }>
  total: number
  status: string
  payment_status: string
  delivery_address: string
  created_at: string
  profiles?: { full_name: string; email: string; phone: string }
}

const sColor: Record<string, string> = { Pending: '#F4A261', Processing: '#2d9cdb', Dispatched: '#4db8f0', Delivered: '#06D6A0', Cancelled: '#EF233C' }
const sBg: Record<string, string> = { Pending: 'rgba(244,162,97,0.15)', Processing: 'rgba(45,156,219,0.15)', Dispatched: 'rgba(77,184,240,0.15)', Delivered: 'rgba(6,214,160,0.15)', Cancelled: 'rgba(239,35,60,0.15)' }

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`*, profiles(full_name, email, phone)`)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) console.error('Orders error:', error)
      setOrders(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = orders.filter(o =>
    (filter === 'All' || o.status === filter) &&
    (o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.delivery_address?.toLowerCase().includes(search.toLowerCase()))
  )

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F14', fontFamily: 'Inter, sans-serif' }}>
      <AdminSidebar active="Orders" />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: '#141C24', padding: '16px 32px', borderBottom: '1px solid rgba(45,156,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.4rem', fontWeight: 700 }}>Order Management</h1>
            <p style={{ color: '#8896A7', fontSize: '12px', marginTop: '2px' }}>{orders.length} total orders</p>
          </div>
        </div>

        <div style={{ padding: '24px 32px' }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#141C24', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '10px', padding: '10px 14px', flex: 1, minWidth: '200px', maxWidth: '280px' }}>
              <Search size={14} style={{ color: '#8896A7' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..."
                style={{ border: 'none', outline: 'none', fontSize: '13px', background: 'transparent', flex: 1, color: '#E0E6ED', fontFamily: 'Inter, sans-serif' }} />
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['All', 'Pending', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding: '7px 14px', borderRadius: '50px', border: '1px solid', fontSize: '11px', cursor: 'pointer', borderColor: filter === f ? '#2d9cdb' : 'rgba(45,156,219,0.2)', background: filter === f ? 'rgba(45,156,219,0.12)' : 'transparent', color: filter === f ? '#2d9cdb' : '#8896A7' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#8896A7' }}>Loading orders...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', background: '#141C24', borderRadius: '16px', border: '1px solid rgba(45,156,219,0.1)' }}>
              <Package size={48} style={{ color: 'rgba(45,156,219,0.2)', marginBottom: '16px' }} />
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.2rem', marginBottom: '8px' }}>No orders yet</h3>
              <p style={{ color: '#8896A7', fontSize: '14px', lineHeight: 1.7 }}>
                Orders from patients will appear here once they start purchasing.<br />
                Share your website link to start receiving orders.
              </p>
              <div style={{ marginTop: '20px', padding: '14px 18px', background: '#0A0F14', borderRadius: '10px', display: 'inline-block' }}>
                <div style={{ color: '#8896A7', fontSize: '12px', marginBottom: '4px' }}>Your live website:</div>
                <div style={{ color: '#2d9cdb', fontSize: '13px', fontWeight: 600 }}>vibeora-pharmacy.vercel.app</div>
              </div>
            </div>
          ) : (
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 2fr 100px 100px 120px 80px', padding: '12px 20px', background: 'rgba(45,156,219,0.05)', borderBottom: '1px solid rgba(45,156,219,0.1)' }}>
                {['Order ID', 'Patient', 'Items', 'Total', 'Payment', 'Status', 'Action'].map(h => (
                  <div key={h} style={{ color: '#8896A7', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
                ))}
              </div>
              {filtered.map((o, i) => (
                <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 2fr 100px 100px 120px 80px', padding: '14px 20px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(45,156,219,0.06)' : 'none', alignItems: 'center' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(45,156,219,0.04)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                  <div>
                    <div style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 600 }}>{o.order_number}</div>
                    <div style={{ color: '#8896A7', fontSize: '10px', marginTop: '2px' }}>{new Date(o.created_at).toLocaleString('en-NG', { dateStyle: 'short', timeStyle: 'short' })}</div>
                  </div>
                  <div>
                    <div style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 500 }}>{o.profiles?.full_name || 'Customer'}</div>
                    <div style={{ color: '#8896A7', fontSize: '10px' }}>{o.delivery_address?.split(',')[0] || 'Abuja'}</div>
                  </div>
                  <div style={{ color: '#8896A7', fontSize: '11px' }}>
                    {Array.isArray(o.items) ? o.items.slice(0, 2).map((item: { name: string; qty: number }) => `${item.name} ×${item.qty}`).join(', ') : 'Items'}
                    {Array.isArray(o.items) && o.items.length > 2 && ` +${o.items.length - 2} more`}
                  </div>
                  <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 700 }}>₦{o.total?.toLocaleString()}</div>
                  <div style={{ color: o.payment_status === 'Paid' ? '#06D6A0' : '#F4A261', fontSize: '11px', fontWeight: 600 }}>{o.payment_status || 'Pending'}</div>
                  <div>
                    <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                      style={{ background: sBg[o.status] || 'rgba(255,255,255,0.05)', color: sColor[o.status] || '#8896A7', border: `1px solid ${sColor[o.status] || '#8896A7'}40`, borderRadius: '6px', padding: '4px 8px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', outline: 'none' }}>
                      {['Pending', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'].map(s => (
                        <option key={s} value={s} style={{ background: '#141C24', color: '#E0E6ED' }}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <button style={{ background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', color: '#2d9cdb', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Eye size={11} /> View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}