'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PortalSidebar from '@/components/portal/PortalSidebar'
import { Package, FileText, Calendar, Gift, Bell, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Profile {
  id: string
  full_name: string
  email: string
  phone: string
  patient_id: string
  loyalty_points: number
}

interface Order {
  id: string
  order_number: string
  items: Array<{ name: string }>
  total: number
  status: string
  created_at: string
}

export default function PatientDashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [prescriptionCount, setPrescriptionCount] = useState(0)
  const [appointmentCount, setAppointmentCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) setProfile(profileData)

      // Load recent orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

      if (ordersData) setOrders(ordersData)

      // Count prescriptions
      const { count: rxCount } = await supabase
        .from('prescriptions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      setPrescriptionCount(rxCount || 0)

      // Count appointments
      const { count: aptCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      setAppointmentCount(aptCount || 0)
    } catch (err) {
      console.error('Dashboard load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const sColor: Record<string, string> = { Delivered: '#06D6A0', Processing: '#F4A261', Dispatched: '#2d9cdb', Pending: '#F4A261', Cancelled: '#EF233C' }
  const sBg: Record<string, string> = { Delivered: 'rgba(6,214,160,0.1)', Processing: 'rgba(244,162,97,0.1)', Dispatched: 'rgba(45,156,219,0.1)', Pending: 'rgba(244,162,97,0.1)', Cancelled: 'rgba(239,35,60,0.1)' }

  const firstName = profile?.full_name?.split(' ')[0] || 'Patient'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F14', fontFamily: 'Inter, sans-serif' }}>
        <PortalSidebar active="Dashboard" />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(45,156,219,0.2)', borderTopColor: '#2d9cdb', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: '#8896A7', fontSize: '14px' }}>Loading your dashboard...</p>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F14', fontFamily: 'Inter, sans-serif' }}>
      <PortalSidebar active="Dashboard" />
      <div style={{ flex: 1, overflow: 'auto' }}>

        {/* Header */}
        <div style={{ background: '#141C24', padding: '20px 32px', borderBottom: '1px solid rgba(45,156,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.5rem', fontWeight: 700 }}>
              {greeting}, {firstName} 👋
            </h1>
            <p style={{ color: '#8896A7', fontSize: '13px', marginTop: '3px' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => alert('No new notifications')}>
  <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => alert('No new notifications')}>
  <Bell size={19} style={{ color: '#8896A7' }} />
</div>
</div>
            </div>
            <Link href="/shop" style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, boxShadow: '0 0 12px rgba(45,156,219,0.25)' }}>
              + New Order
            </Link>
            <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(239,35,60,0.3)', color: '#EF233C', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>
              Logout
            </button>
          </div>
        </div>

        <div style={{ padding: '28px 32px' }}>

          {/* Alert */}
          <div style={{ background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '12px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={16} style={{ color: '#2d9cdb', flexShrink: 0 }} />
            <div>
              <span style={{ color: '#E0E6ED', fontSize: '14px', fontWeight: 600 }}>Welcome to Vital Medicare! </span>
              <span style={{ color: '#8896A7', fontSize: '14px' }}>Patient ID: </span>
              <span style={{ color: '#2d9cdb', fontSize: '14px', fontWeight: 600 }}>{profile?.patient_id || 'Generating...'}</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            {[
              { label: 'Total Orders', value: orders.length.toString(), icon: Package, color: '#2d9cdb', href: '/orders' },
              { label: 'Prescriptions', value: prescriptionCount.toString(), icon: FileText, color: '#F4A261', href: '/prescriptions' },
              { label: 'Appointments', value: appointmentCount.toString(), icon: Calendar, color: '#06D6A0', href: '/appointments' },
              { label: 'Loyalty Points', value: (profile?.loyalty_points || 0).toString(), icon: Gift, color: '#2d9cdb', href: '/loyalty' },
            ].map(({ label, value, icon: Icon, color, href }) => (
              <Link key={label} href={href} style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${color}20` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,156,219,0.12)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.7rem', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
                  <div style={{ color: '#8896A7', fontSize: '12px', marginTop: '4px' }}>{label}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Orders */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.05rem', fontWeight: 700 }}>Recent Orders</h3>
                <Link href="/orders" style={{ color: '#2d9cdb', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
              </div>

              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <Package size={36} style={{ color: 'rgba(45,156,219,0.2)', marginBottom: '12px' }} />
                  <p style={{ color: '#8896A7', fontSize: '13px', marginBottom: '14px' }}>No orders yet</p>
                  <Link href="/shop" style={{ background: 'rgba(45,156,219,0.1)', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '8px', padding: '8px 18px', textDecoration: 'none', color: '#2d9cdb', fontSize: '12px', fontWeight: 600 }}>
                    Browse Shop
                  </Link>
                </div>
              ) : (
                orders.map((order, i) => (
                  <div key={order.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < orders.length - 1 ? '1px solid rgba(45,156,219,0.08)' : 'none' }}>
                    <Package size={16} style={{ color: '#2d9cdb', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600 }}>{order.order_number}</div>
                      <div style={{ color: '#8896A7', fontSize: '11px' }}>
                        {Array.isArray(order.items) ? order.items.slice(0, 2).map((item: { name: string }) => item.name).join(', ') : 'Order items'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#2d9cdb', fontSize: '13px', fontWeight: 700 }}>₦{order.total?.toLocaleString()}</div>
                      <span style={{ padding: '2px 8px', borderRadius: '50px', fontSize: '9px', fontWeight: 600, color: sColor[order.status] || '#8896A7', background: sBg[order.status] || 'rgba(255,255,255,0.05)' }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Actions */}
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.05rem', fontWeight: 700, marginBottom: '20px' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Upload Prescription', desc: 'Get verified in 20 mins', href: '/prescriptions', color: '#2d9cdb' },
                  { label: 'Book Appointment', desc: 'Video, phone or in-person', href: '/booking', color: '#06D6A0' },
                  { label: 'Track My Order', desc: 'Real-time GPS tracking', href: '/track-order', color: '#F4A261' },
                  { label: 'Browse Medications', desc: '100+ products available', href: '/shop', color: '#4db8f0' },
                ].map(({ label, desc, href, color }) => (
                  <Link key={label} href={href}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.08)', borderRadius: '10px', padding: '12px 14px', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.background = `${color}08` }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,156,219,0.08)'; (e.currentTarget as HTMLElement).style.background = '#0A0F14' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600 }}>{label}</div>
                      <div style={{ color: '#8896A7', fontSize: '11px', marginTop: '2px' }}>{desc}</div>
                    </div>
                    <span style={{ color: color, fontSize: '16px' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}