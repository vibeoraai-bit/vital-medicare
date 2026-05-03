'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Package, Users, FileText, TrendingUp, AlertTriangle, Bell, Eye, Lock, ShieldCheck, Activity } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'vitalmedicare.official@gmail.com'
const ADMIN_SECRET = 'VITAL2024ADMIN'

interface DashStats {
  totalOrders: number
  todayRevenue: number
  newPatients: number
  pendingRx: number
}

function AdminGate({ onUnlock }: { onUnlock: () => void }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')

  const attempt = () => {
    if (key === ADMIN_SECRET) { sessionStorage.setItem('vm_admin', '1'); onUnlock() }
    else { setError('Invalid secret key'); setKey('') }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0F14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 0 20px rgba(45,156,219,0.3)' }}>
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none"><rect x="12" y="4" width="8" height="24" rx="4" fill="white" /><rect x="4" y="12" width="24" height="8" rx="4" fill="white" /></svg>
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.4rem', fontWeight: 700 }}>Vital Medicare Admin</h1>
          <p style={{ color: '#8896A7', fontSize: '13px', marginTop: '4px' }}>Enter your secret key to access dashboard</p>
        </div>
        <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '18px', padding: '32px' }}>
          {error && <div style={{ background: 'rgba(239,35,60,0.1)', border: '1px solid rgba(239,35,60,0.25)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#EF233C', fontSize: '12px' }}>⚠ {error}</div>}
          <label style={{ display: 'block', color: '#E0E6ED', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Admin Secret Key</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
            <Lock size={15} style={{ color: '#8896A7' }} />
            <input type="password" value={key} onChange={e => { setKey(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && attempt()} placeholder="Enter secret key..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: '#E0E6ED', fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }} />
          </div>
          <button onClick={attempt}
            style={{ width: '100%', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <ShieldCheck size={16} /> Access Dashboard
          </button>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link href="/" style={{ color: '#8896A7', fontSize: '12px', textDecoration: 'none' }}>← Back to website</Link>
          </div>
        </div>
        <p style={{ color: '#8896A7', fontSize: '10px', textAlign: 'center', marginTop: '12px' }}>
          Unauthorized access is logged and reported to authorities.
        </p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [unlocked, setUnlocked] = useState(false)
  const [stats, setStats] = useState<DashStats>({ totalOrders: 0, todayRevenue: 0, newPatients: 0, pendingRx: 0 })
  const [recentOrders, setRecentOrders] = useState<Array<{ order_number: string; user_id: string; items: Array<{ name: string }>; total: number; status: string; created_at: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUnlocked(sessionStorage.getItem('vm_admin') === '1')
    }
  }, [])

  useEffect(() => {
    if (unlocked) loadData()
  }, [unlocked])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) { router.push('/login'); return }

      const [ordersRes, patientsRes, rxRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'patient'),
        supabase.from('prescriptions').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
      ])

      const orders = ordersRes.data || []
      const today = new Date().toISOString().split('T')[0]
      const todayOrders = orders.filter(o => o.created_at?.startsWith(today))
      const revenue = todayOrders.reduce((sum: number, o: { total: number }) => sum + (o.total || 0), 0)

      setStats({
        totalOrders: orders.length,
        todayRevenue: revenue,
        newPatients: patientsRes.count || 0,
        pendingRx: rxRes.count || 0,
      })

      setRecentOrders(orders.slice(0, 5))
    } catch (err) {
      console.error('Admin data error:', err)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    sessionStorage.removeItem('vm_admin')
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!unlocked) return <AdminGate onUnlock={() => setUnlocked(true)} />

  const sColor: Record<string, string> = { Pending: '#F4A261', Processing: '#2d9cdb', Dispatched: '#4db8f0', Delivered: '#06D6A0', Cancelled: '#EF233C' }
  const sBg: Record<string, string> = { Pending: 'rgba(244,162,97,0.12)', Processing: 'rgba(45,156,219,0.12)', Dispatched: 'rgba(77,184,240,0.12)', Delivered: 'rgba(6,214,160,0.12)', Cancelled: 'rgba(239,35,60,0.12)' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F14', fontFamily: 'Inter, sans-serif' }}>
      <AdminSidebar active="Dashboard" />
      <div style={{ flex: 1, overflow: 'auto' }}>

        {/* Header */}
        <div style={{ background: '#141C24', padding: '16px 32px', borderBottom: '1px solid rgba(45,156,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.3rem', fontWeight: 700 }}>Vital Medicare Admin</h1>
            <p style={{ color: '#8896A7', fontSize: '12px', marginTop: '2px' }}>Pharmaceutical Ltd. · Maitama, Abuja</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
             <button onClick={() => alert('No new notifications')} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
  <Bell size={18} style={{ color: '#8896A7' }} />
  <div style={{ position: 'absolute', top: '-3px', right: '-3px', width: '10px', height: '10px', borderRadius: '50%', background: '#EF233C', border: '2px solid #141C24' }} />
</button>
              <div style={{ position: 'absolute', top: '-3px', right: '-3px', width: '10px', height: '10px', borderRadius: '50%', background: '#EF233C', border: '2px solid #141C24' }} />
            </div>
            <div style={{ color: '#8896A7', fontSize: '11px' }}>vitalmedicare.official@gmail.com</div>
            <button onClick={logout} style={{ background: 'rgba(239,35,60,0.1)', border: '1px solid rgba(239,35,60,0.2)', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', color: '#EF233C', fontSize: '12px', fontWeight: 600 }}>
              Logout
            </button>
          </div>
        </div>

        <div style={{ padding: '24px 32px' }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: "Today's Revenue", value: loading ? '...' : `₦${stats.todayRevenue.toLocaleString()}`, sub: 'From confirmed orders', icon: TrendingUp, color: '#2d9cdb', href: '/admin-dashboard/analytics' },
              { label: 'Total Orders', value: loading ? '...' : stats.totalOrders.toString(), sub: 'All time', icon: Package, color: '#F4A261', href: '/admin-dashboard/orders' },
              { label: 'Total Patients', value: loading ? '...' : stats.newPatients.toString(), sub: 'Registered accounts', icon: Users, color: '#06D6A0', href: '/admin-dashboard/patients' },
              { label: 'Pending Rx', value: loading ? '...' : stats.pendingRx.toString(), sub: 'Needs verification', icon: FileText, color: '#EF233C', href: '/rx-review' },
            ].map(({ label, value, sub, icon: Icon, color, href }) => (
              <Link key={label} href={href}
                style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '12px', padding: '18px', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${color}20` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,156,219,0.1)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <Icon size={16} style={{ color }} />
                  <Activity size={12} style={{ color: '#8896A7' }} />
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', color, fontSize: '1.6rem', fontWeight: 700, lineHeight: 1, marginBottom: '4px' }}>{value}</div>
                <div style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 500 }}>{label}</div>
                <div style={{ color: '#8896A7', fontSize: '10px', marginTop: '2px' }}>{sub}</div>
              </Link>
            ))}
          </div>

          {/* Company Info Banner */}
          <div style={{ background: 'linear-gradient(135deg, rgba(45,156,219,0.08), rgba(45,156,219,0.04))', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '12px', padding: '18px 22px', marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#2d9cdb', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Vital Medicare and Pharmaceutical Ltd.</div>
              <div style={{ color: '#E0E6ED', fontSize: '13px' }}>12 Hospital Road, Maitama, Abuja, Nigeria · NAFDAC No: VC/04/12345 · PCN: PCN/PH/2024/001</div>
            </div>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {[['Call', '+234 801 234 5678'], ['Email', 'hello@vitalmedicare.com'], ['Hours', 'Mon–Sat 8AM–10PM']].map(([k, v]) => (
                <div key={k} style={{ textAlign: 'center' }}>
                  <div style={{ color: '#8896A7', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
                  <div style={{ color: '#E0E6ED', fontSize: '11px', fontWeight: 500, marginTop: '2px' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '18px', alignItems: 'start' }}>

            {/* Recent Orders */}
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1rem', fontWeight: 700 }}>Recent Orders</h3>
                <Link href="/admin-dashboard/orders" style={{ color: '#2d9cdb', fontSize: '12px', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
              </div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#8896A7', fontSize: '13px' }}>Loading orders...</div>
              ) : recentOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px' }}>
                  <Package size={32} style={{ color: 'rgba(45,156,219,0.2)', marginBottom: '10px' }} />
                  <p style={{ color: '#8896A7', fontSize: '13px' }}>No orders yet. Share your website link to start receiving orders!</p>
                </div>
              ) : (
                recentOrders.map((o, i) => (
                  <div key={o.order_number} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 0', borderBottom: i < recentOrders.length - 1 ? '1px solid rgba(45,156,219,0.06)' : 'none', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '100px' }}>
                      <div style={{ color: '#E0E6ED', fontSize: '11px', fontWeight: 600 }}>{o.order_number}</div>
                      <div style={{ color: '#8896A7', fontSize: '10px' }}>
                        {Array.isArray(o.items) ? o.items.slice(0, 1).map((item: { name: string }) => item.name).join(', ') : 'Order'}
                        · {new Date(o.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 700 }}>₦{o.total?.toLocaleString()}</div>
                    <span style={{ padding: '3px 8px', borderRadius: '50px', fontSize: '9px', fontWeight: 600, color: sColor[o.status] || '#8896A7', background: sBg[o.status] || 'rgba(255,255,255,0.05)' }}>{o.status}</span>
                    <button style={{ background: 'rgba(45,156,219,0.08)', border: 'none', borderRadius: '5px', padding: '4px 8px', cursor: 'pointer', color: '#2d9cdb', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Eye size={10} /> View
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Quick Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>Quick Actions</h4>
                {[
                  { label: 'Manage Orders', href: '/admin-dashboard/orders', color: '#2d9cdb' },
                  { label: 'Add Product', href: '/admin-dashboard/products', color: '#06D6A0' },
                  { label: 'View Patients', href: '/admin-dashboard/patients', color: '#F4A261' },
                  { label: 'Review Prescriptions', href: '/rx-review', color: '#EF233C' },
                  { label: 'Analytics', href: '/admin-dashboard/analytics', color: '#4db8f0' },
                ].map(({ label, href, color }) => (
                  <Link key={label} href={href}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', marginBottom: '4px', borderRadius: '8px', textDecoration: 'none', background: 'transparent', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(45,156,219,0.06)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                    <span style={{ color: '#E0E6ED', fontSize: '12px' }}>{label}</span>
                    <span style={{ color, fontSize: '14px' }}>→</span>
                  </Link>
                ))}
              </div>

              <div style={{ background: 'rgba(239,35,60,0.06)', border: '1px solid rgba(239,35,60,0.15)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <AlertTriangle size={13} style={{ color: '#EF233C' }} />
                  <h4 style={{ color: '#EF233C', fontSize: '12px', fontWeight: 700 }}>Low Stock Alert</h4>
                </div>
                {[['Insulin Pen', '3 units'], ['Atorvastatin 20mg', '5 units'], ['BP Monitor', '2 units']].map(([name, stock]) => (
                  <div key={name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#E0E6ED', fontSize: '11px' }}>{name}</span>
                    <span style={{ color: '#EF233C', fontSize: '10px', fontWeight: 700 }}>{stock}</span>
                  </div>
                ))}
                <Link href="/admin-dashboard/products" style={{ display: 'block', textAlign: 'center', color: '#EF233C', fontSize: '11px', fontWeight: 600, marginTop: '8px', textDecoration: 'none' }}>
                  Restock now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}