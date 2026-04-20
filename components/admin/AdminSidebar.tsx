'use client'
import Link from 'next/link'

const adminLinks = [
  { label: 'Dashboard', href: '/admin-dashboard' },
  { label: 'Orders', href: '/admin-dashboard/orders' },
  { label: 'Products', href: '/admin-dashboard/products' },
  { label: 'Patients', href: '/admin-dashboard/patients' },
  { label: 'Prescriptions', href: '/rx-review' },
  { label: 'Analytics', href: '/admin-dashboard/analytics' },
  { label: 'Settings', href: '/admin-dashboard/settings' },
]

export default function AdminSidebar({ active }: { active: string }) {
  return (
    <div style={{ width: '220px', background: '#0A0F14', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(45,156,219,0.1)' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(45,156,219,0.08)' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(45,156,219,0.3)' }}>
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none"><rect x="12" y="4" width="8" height="24" rx="4" fill="white"/><rect x="4" y="12" width="24" height="8" rx="4" fill="white"/></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '13px', fontWeight: 700 }}>Vital Medicare</div>
            <div style={{ color: '#2d9cdb', fontSize: '9px', letterSpacing: '0.1em' }}>ADMIN PORTAL</div>
          </div>
        </Link>
      </div>

      <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
        {adminLinks.map(({ label, href }) => (
          <Link key={label} href={href}
            style={{ display: 'block', padding: '11px 18px', textDecoration: 'none', background: active === label ? 'rgba(45,156,219,0.1)' : 'transparent', borderLeft: active === label ? '3px solid #2d9cdb' : '3px solid transparent', color: active === label ? '#2d9cdb' : '#8896A7', fontSize: '13px', fontWeight: active === label ? 600 : 400, transition: 'all 0.2s' }}
            onMouseEnter={e => { if (active !== label) { (e.currentTarget as HTMLElement).style.color = '#E0E6ED'; (e.currentTarget as HTMLElement).style.background = 'rgba(45,156,219,0.05)' }}}
            onMouseLeave={e => { if (active !== label) { (e.currentTarget as HTMLElement).style.color = '#8896A7'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}}>
            {label}
          </Link>
        ))}
      </nav>

      <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(45,156,219,0.08)' }}>
        <Link href="/" style={{ color: '#8896A7', fontSize: '12px', textDecoration: 'none' }}>← Exit Admin</Link>
      </div>
    </div>
  )
}