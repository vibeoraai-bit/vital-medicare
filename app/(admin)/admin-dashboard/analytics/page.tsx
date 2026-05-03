'use client'
import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { TrendingUp, Package, Users, ShoppingBag, BarChart3 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AnalyticsPage() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, patients: 0, avgOrder: 0 })
  const [orders, setOrders] = useState<Array<{ total: number; created_at: string; status: string }>>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30 Days')

  useEffect(() => {
    const load = async () => {
      const [ordersRes, patientsRes] = await Promise.all([
        supabase.from('orders').select('total, created_at, status').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'patient'),
      ])

      const allOrders = ordersRes.data || []
      const totalRevenue = allOrders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (o.total || 0), 0)
      const avgOrder = allOrders.length > 0 ? Math.round(totalRevenue / allOrders.length) : 0

      setOrders(allOrders)
      setStats({
        revenue: totalRevenue,
        orders: allOrders.length,
        patients: patientsRes.count || 0,
        avgOrder,
      })
      setLoading(false)
    }
    load()
  }, [])

  // Group orders by month for chart
  const monthlyData = orders.reduce((acc, order) => {
    const month = new Date(order.created_at).toLocaleString('en-US', { month: 'short', year: '2-digit' })
    if (!acc[month]) acc[month] = 0
    if (order.status !== 'Cancelled') acc[month] += order.total || 0
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(monthlyData).slice(-7)
  const maxVal = Math.max(...chartData.map(([, v]) => v), 1)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F14', fontFamily: 'Inter, sans-serif' }}>
      <AdminSidebar active="Analytics" />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: '#141C24', padding: '16px 32px', borderBottom: '1px solid rgba(45,156,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.4rem', fontWeight: 700 }}>Analytics Dashboard</h1>
            <p style={{ color: '#8896A7', fontSize: '12px', marginTop: '2px' }}>Real business performance — live data from your Supabase database</p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['30 Days', '90 Days', '1 Year', 'All Time'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid', fontSize: '11px', cursor: 'pointer', borderColor: period === p ? '#2d9cdb' : 'rgba(45,156,219,0.2)', background: period === p ? 'rgba(45,156,219,0.12)' : 'transparent', color: period === p ? '#2d9cdb' : '#8896A7' }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '24px 32px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#8896A7' }}>Loading analytics...</div>
          ) : (
            <>
              {/* KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                {[
                  { label: 'Total Revenue', value: `₦${stats.revenue.toLocaleString()}`, sub: 'All confirmed orders', icon: TrendingUp, color: '#2d9cdb', change: stats.orders > 0 ? '+Growing' : 'No sales yet' },
                  { label: 'Total Orders', value: stats.orders.toString(), sub: 'All channels', icon: Package, color: '#F4A261', change: stats.orders > 0 ? `${stats.orders} orders` : 'No orders yet' },
                  { label: 'Registered Patients', value: stats.patients.toString(), sub: 'Active accounts', icon: Users, color: '#06D6A0', change: stats.patients > 0 ? `${stats.patients} patients` : 'No patients yet' },
                  { label: 'Avg Order Value', value: stats.avgOrder > 0 ? `₦${stats.avgOrder.toLocaleString()}` : '₦0', sub: 'Per transaction', icon: ShoppingBag, color: '#4db8f0', change: stats.avgOrder > 0 ? 'Per order' : 'No data yet' },
                ].map(({ label, value, sub, icon: Icon, color, change }) => (
                  <div key={label} style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '14px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={18} style={{ color }} />
                      </div>
                      <span style={{ background: 'rgba(6,214,160,0.1)', color: '#06D6A0', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '50px' }}>{change}</span>
                    </div>
                    <div style={{ fontFamily: 'Playfair Display, serif', color, fontSize: '1.6rem', fontWeight: 700, lineHeight: 1, marginBottom: '4px' }}>{value}</div>
                    <div style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 500 }}>{label}</div>
                    <div style={{ color: '#8896A7', fontSize: '10px', marginTop: '2px' }}>{sub}</div>
                  </div>
                ))}
              </div>

              {/* Revenue Chart */}
              <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.1rem', fontWeight: 700 }}>Revenue Overview</h3>
                    <p style={{ color: '#8896A7', fontSize: '12px', marginTop: '3px' }}>Monthly revenue from your actual orders</p>
                  </div>
                  <BarChart3 size={18} style={{ color: '#2d9cdb' }} />
                </div>

                {chartData.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px', borderRadius: '12px', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.08)' }}>
                    <BarChart3 size={40} style={{ color: 'rgba(45,156,219,0.2)', marginBottom: '14px' }} />
                    <h4 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1rem', marginBottom: '8px' }}>No revenue data yet</h4>
                    <p style={{ color: '#8896A7', fontSize: '13px', lineHeight: 1.7 }}>
                      Revenue charts will appear here once patients start placing orders.<br />
                      Share your website to start receiving orders!
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Chart bars */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px', padding: '0 8px' }}>
                      {chartData.map(([month, value]) => (
                        <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                          <div style={{ color: '#2d9cdb', fontSize: '10px', fontWeight: 600, textAlign: 'center', whiteSpace: 'nowrap' }}>
                            {value >= 1000 ? `₦${(value / 1000).toFixed(0)}k` : `₦${value}`}
                          </div>
                          <div style={{ width: '100%', background: 'linear-gradient(180deg, #2d9cdb, #1a7ab8)', borderRadius: '6px 6px 0 0', height: `${Math.max((value / maxVal) * 160, 8)}px`, transition: 'height 0.5s ease', boxShadow: '0 0 12px rgba(45,156,219,0.3)' }} />
                          <div style={{ color: '#8896A7', fontSize: '10px', textAlign: 'center', whiteSpace: 'nowrap' }}>{month}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* No data message */}
              {stats.orders === 0 && (
                <div style={{ background: 'rgba(45,156,219,0.05)', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '14px', padding: '24px', textAlign: 'center' }}>
                  <h4 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.1rem', marginBottom: '8px' }}>
                    🚀 Ready to Launch!
                  </h4>
                  <p style={{ color: '#8896A7', fontSize: '13px', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto' }}>
                    Your Vital Medicare pharmacy is set up and ready. Deploy your website and share the link with patients in Abuja to start receiving orders. All data will automatically appear here in real-time.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}