'use client'
import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { TrendingUp, Users, Package, ShoppingCart, DollarSign, Activity } from 'lucide-react'

const monthlyRevenue = [
  { month: 'Oct', revenue: 285000, orders: 142, patients: 89 },
  { month: 'Nov', revenue: 312000, orders: 168, patients: 104 },
  { month: 'Dec', revenue: 398000, orders: 215, patients: 142 },
  { month: 'Jan', revenue: 342000, orders: 187, patients: 118 },
  { month: 'Feb', revenue: 421000, orders: 234, patients: 156 },
  { month: 'Mar', revenue: 387000, orders: 198, patients: 132 },
  { month: 'Apr', revenue: 456000, orders: 267, patients: 178 },
]

const topProducts = [
  { name: 'Amoxicillin 500mg', sold: 847, revenue: 1016400, color: '#2d9cdb' },
  { name: 'Paracetamol 500mg', sold: 1203, revenue: 421050, color: '#06D6A0' },
  { name: 'Vitamin C 1000mg', sold: 689, revenue: 551200, color: '#F4A261' },
  { name: 'Omeprazole 20mg', sold: 423, revenue: 761400, color: '#4db8f0' },
  { name: 'Metformin 500mg', sold: 312, revenue: 655200, color: '#1a7ab8' },
]

const serviceStats = [
  { label: 'Online Orders', value: 1847, change: '+23%', icon: ShoppingCart, color: '#2d9cdb' },
  { label: 'Prescriptions', value: 634, change: '+18%', icon: Package, color: '#06D6A0' },
  { label: 'Consultations', value: 289, change: '+31%', icon: Users, color: '#F4A261' },
  { label: 'Lab Tests', value: 156, change: '+12%', icon: Activity, color: '#4db8f0' },
]

const maxRevenue = Math.max(...monthlyRevenue.map(d => d.revenue))

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('7months')
  const [metric, setMetric] = useState<'revenue' | 'orders' | 'patients'>('revenue')

  const metricColors: Record<string, string> = {
    revenue: '#2d9cdb',
    orders: '#06D6A0',
    patients: '#F4A261',
  }

  const metricMax = {
    revenue: Math.max(...monthlyRevenue.map(d => d.revenue)),
    orders: Math.max(...monthlyRevenue.map(d => d.orders)),
    patients: Math.max(...monthlyRevenue.map(d => d.patients)),
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F14', fontFamily: 'Inter, sans-serif' }}>
      <AdminSidebar active="Analytics" />

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Top Bar */}
        <div style={{ background: '#141C24', padding: '16px 32px', borderBottom: '1px solid rgba(45,156,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.4rem', fontWeight: 700 }}>Analytics Dashboard</h1>
            <p style={{ color: '#8896A7', fontSize: '12px', marginTop: '2px' }}>Business performance overview</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['7months', '30days', '90days', '1year'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid', fontSize: '11px', fontWeight: 500, cursor: 'pointer', borderColor: period === p ? '#2d9cdb' : 'rgba(45,156,219,0.15)', background: period === p ? 'rgba(45,156,219,0.15)' : 'transparent', color: period === p ? '#2d9cdb' : '#8896A7' }}>
                {p === '7months' ? '7 Months' : p === '30days' ? '30 Days' : p === '90days' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '24px 32px' }}>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Revenue', value: '₦2.6M', change: '+23%', icon: DollarSign, color: '#2d9cdb', sub: 'This period' },
              { label: 'Total Orders', value: '1,411', change: '+19%', icon: ShoppingCart, color: '#06D6A0', sub: 'All channels' },
              { label: 'New Patients', value: '919', change: '+28%', icon: Users, color: '#F4A261', sub: 'Registered' },
              { label: 'Avg Order Value', value: '₦1,843', change: '+4%', icon: TrendingUp, color: '#4db8f0', sub: 'Per transaction' },
            ].map(({ label, value, change, icon: Icon, color, sub }) => (
              <div key={label} style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '14px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} style={{ color }}/>
                  </div>
                  <span style={{ background: 'rgba(6,214,160,0.1)', color: '#06D6A0', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '50px' }}>{change}</span>
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', color, fontSize: '1.7rem', fontWeight: 700, lineHeight: 1, marginBottom: '4px' }}>{value}</div>
                <div style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 500, marginBottom: '2px' }}>{label}</div>
                <div style={{ color: '#8896A7', fontSize: '11px' }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Main Bar Chart */}
          <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Performance Overview</h3>
                <p style={{ color: '#8896A7', fontSize: '12px' }}>Monthly breakdown by metric</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['revenue', 'orders', 'patients'] as const).map(m => (
                  <button key={m} onClick={() => setMetric(m)}
                    style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid', fontSize: '11px', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', borderColor: metric === m ? metricColors[m] : 'rgba(45,156,219,0.15)', background: metric === m ? `${metricColors[m]}18` : 'transparent', color: metric === m ? metricColors[m] : '#8896A7' }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '220px', padding: '0 8px' }}>
              {monthlyRevenue.map((d, i) => {
                const val = d[metric]
                const max = metricMax[metric]
                const heightPct = (val / max) * 100
                const color = metricColors[metric]
                return (
                  <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '6px' }}>
                    <div style={{ color: '#8896A7', fontSize: '10px', fontWeight: 500 }}>
                      {metric === 'revenue' ? `₦${Math.round(val/1000)}k` : val}
                    </div>
                    <div
                      style={{ width: '100%', borderRadius: '6px 6px 0 0', transition: 'height 0.5s ease', background: `linear-gradient(180deg, ${color}, ${color}88)`, boxShadow: `0 0 12px ${color}30`, height: `${heightPct}%`, minHeight: '4px', cursor: 'pointer', position: 'relative' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.8' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}>
                    </div>
                    <div style={{ color: '#8896A7', fontSize: '11px', fontWeight: 500 }}>{d.month}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

            {/* Top Products */}
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '22px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.05rem', fontWeight: 700, marginBottom: '20px' }}>🏆 Top Selling Products</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {topProducts.map((p, i) => (
                  <div key={p.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: p.color, fontSize: '12px', fontWeight: 700, minWidth: '18px' }}>#{i + 1}</span>
                        <span style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 500 }}>{p.name}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: p.color, fontSize: '12px', fontWeight: 700 }}>{p.sold.toLocaleString()} sold</div>
                        <div style={{ color: '#8896A7', fontSize: '10px' }}>₦{(p.revenue / 1000).toFixed(0)}k</div>
                      </div>
                    </div>
                    <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(p.sold / 1203) * 100}%`, background: p.color, borderRadius: '3px', transition: 'width 0.8s ease' }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Breakdown */}
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '22px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.05rem', fontWeight: 700, marginBottom: '20px' }}>📊 Service Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {serviceStats.map(({ label, value, change, icon: Icon, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: '#0A0F14', borderRadius: '10px', border: '1px solid rgba(45,156,219,0.08)' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} style={{ color }}/>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600 }}>{label}</div>
                      <div style={{ color: '#8896A7', fontSize: '11px' }}>This period</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Playfair Display, serif', color, fontSize: '1.2rem', fontWeight: 700 }}>{value.toLocaleString()}</div>
                      <div style={{ color: '#06D6A0', fontSize: '10px', fontWeight: 600 }}>{change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Patients vs Orders comparison */}
          <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '22px' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.05rem', fontWeight: 700, marginBottom: '20px' }}>📈 Patients vs Orders (Monthly)</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', height: '160px' }}>
              {monthlyRevenue.map(d => (
                <div key={d.month} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100%' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '4px' }}>
                    <div style={{ width: '100%', background: 'linear-gradient(180deg, #2d9cdb, #1a7ab8)', borderRadius: '4px 4px 0 0', height: `${(d.orders / 267) * 100}%`, minHeight: '4px' }}/>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '4px' }}>
                    <div style={{ width: '100%', background: 'linear-gradient(180deg, #F4A261, #e08040)', borderRadius: '4px 4px 0 0', height: `${(d.patients / 178) * 100}%`, minHeight: '4px' }}/>
                  </div>
                  <div style={{ position: 'absolute', marginTop: '8px' }}/>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              {monthlyRevenue.map(d => (
                <div key={d.month} style={{ flex: 1, textAlign: 'center', color: '#8896A7', fontSize: '10px' }}>{d.month}</div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#2d9cdb' }}/>
                <span style={{ color: '#8896A7', fontSize: '11px' }}>Orders</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#F4A261' }}/>
                <span style={{ color: '#8896A7', fontSize: '11px' }}>Patients</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}