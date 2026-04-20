'use client'
import Link from 'next/link'

const portalLinks = [
  { label: 'Dashboard', href: '/patient-dashboard' },
  { label: 'My Orders', href: '/orders' },
  { label: 'Prescriptions', href: '/prescriptions' },
  { label: 'Appointments', href: '/appointments' },
  { label: 'Medications', href: '/medications' },
  { label: 'Loyalty Points', href: '/loyalty' },
  { label: 'Settings', href: '/settings' },
]

export default function PortalSidebar({ active }: { active: string }) {
  return (
    <div style={{ width: '240px', background: '#0A0F14', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(45,156,219,0.1)' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(45,156,219,0.08)' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(45,156,219,0.3)' }}>
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none"><rect x="12" y="4" width="8" height="24" rx="4" fill="white"/><rect x="4" y="12" width="24" height="8" rx="4" fill="white"/></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '13px', fontWeight: 700 }}>Vital Medicare</div>
            <div style={{ color: '#2d9cdb', fontSize: '9px', letterSpacing: '0.08em' }}>PATIENT PORTAL</div>
          </div>
        </Link>
      </div>

      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(45,156,219,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '15px', boxShadow: '0 0 12px rgba(45,156,219,0.3)' }}>S</div>
          <div>
            <div style={{ color: '#E0E6ED', fontWeight: 600, fontSize: '13px' }}>Shareef</div>
            <div style={{ color: '#8896A7', fontSize: '10px' }}>PH-847291</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(6,214,160,0.1)', border: '1px solid rgba(6,214,160,0.2)', borderRadius: '50px', padding: '2px 7px', marginTop: '3px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#06D6A0' }}/>
              <span style={{ color: '#06D6A0', fontSize: '9px', fontWeight: 500 }}>Active Patient</span>
            </div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
        {portalLinks.map(({ label, href }) => (
          <Link key={label} href={href}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 20px', textDecoration: 'none', background: active === label ? 'rgba(45,156,219,0.1)' : 'transparent', borderLeft: active === label ? '3px solid #2d9cdb' : '3px solid transparent', color: active === label ? '#2d9cdb' : '#8896A7', fontSize: '13px', fontWeight: active === label ? 600 : 400, transition: 'all 0.2s' }}
            onMouseEnter={e => { if (active !== label) { (e.currentTarget as HTMLElement).style.color = '#E0E6ED'; (e.currentTarget as HTMLElement).style.background = 'rgba(45,156,219,0.05)' }}}
            onMouseLeave={e => { if (active !== label) { (e.currentTarget as HTMLElement).style.color = '#8896A7'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}}>
            {label}
          </Link>
        ))}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(45,156,219,0.08)' }}>
        <Link href="/" style={{ color: '#8896A7', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#2d9cdb'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#8896A7'}>
          ← Back to Website
        </Link>
      </div>
    </div>
  )
}