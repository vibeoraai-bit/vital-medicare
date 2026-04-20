'use client'
import Link from 'next/link'
import PortalSidebar from '@/components/portal/PortalSidebar'
import { Gift, Star, ShoppingBag, Award, TrendingUp } from 'lucide-react'

const history = [
  { desc: 'Order VM-2024-048', points: 32, type: 'earned', date: 'Apr 11, 2026' },
  { desc: 'Order VM-2024-047', points: 18, type: 'earned', date: 'Apr 8, 2026' },
  { desc: 'Redeemed for discount', points: -100, type: 'redeemed', date: 'Apr 5, 2026' },
  { desc: 'Order VM-2024-046', points: 21, type: 'earned', date: 'Apr 5, 2026' },
  { desc: 'Birthday bonus', points: 50, type: 'earned', date: 'Mar 15, 2026' },
]

const rewards = [
  { title: '₦500 Discount', points: 500, icon: '🎟️' },
  { title: '₦1,000 Discount', points: 1000, icon: '🎁' },
  { title: 'Free Delivery × 3', points: 300, icon: '🚚' },
  { title: 'Free Consultation', points: 800, icon: '👨‍⚕️' },
]

const totalPoints = 840

export default function LoyaltyPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F14', fontFamily: 'Inter, sans-serif' }}>
      <PortalSidebar active="Loyalty Points" />
      <div style={{ flex: 1, overflow: 'auto' }}>

        {/* Header */}
        <div style={{ background: '#141C24', padding: '20px 32px', borderBottom: '1px solid rgba(45,156,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.5rem', fontWeight: 700 }}>Loyalty Points</h1>
            <p style={{ color: '#8896A7', fontSize: '13px', marginTop: '3px' }}>Earn points on every purchase and redeem for rewards</p>
          </div>
        </div>

        <div style={{ padding: '28px 32px' }}>

          {/* Balance Card */}
          <div style={{ background: 'linear-gradient(135deg, #0f2a3f, #1a4a6e, #0f2a3f)', border: '1px solid rgba(45,156,219,0.3)', borderRadius: '20px', padding: '36px', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(45,156,219,0.1)' }}/>
            <div style={{ position: 'absolute', bottom: '-30px', left: '30%', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(45,156,219,0.06)' }}/>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Gift size={16} style={{ color: '#2d9cdb' }}/>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Your Balance</span>
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', color: '#2d9cdb', fontSize: '4rem', fontWeight: 700, lineHeight: 1, marginBottom: '6px', textShadow: '0 0 30px rgba(45,156,219,0.4)' }}>{totalPoints.toLocaleString()}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '24px' }}>points — worth ₦{totalPoints.toLocaleString()}</div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[['142', 'Points earned'], ['3', 'Orders this month'], ['Gold', 'Member tier']].map(([val, lbl]) => (
                  <div key={lbl} style={{ background: 'rgba(45,156,219,0.15)', border: '1px solid rgba(45,156,219,0.25)', borderRadius: '10px', padding: '10px 18px', textAlign: 'center' }}>
                    <div style={{ color: '#2d9cdb', fontSize: '1.1rem', fontWeight: 700 }}>{val}</div>
                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px', marginTop: '2px' }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

            {/* Rewards */}
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.1rem', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={16} style={{ color: '#2d9cdb' }}/> Redeem Rewards
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {rewards.map(r => (
                  <div key={r.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{r.icon}</span>
                      <div>
                        <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600 }}>{r.title}</div>
                        <div style={{ color: '#8896A7', fontSize: '11px' }}>{r.points} points</div>
                      </div>
                    </div>
                    <button disabled={totalPoints < r.points}
                      style={{ background: totalPoints >= r.points ? 'linear-gradient(135deg, #2d9cdb, #1a7ab8)' : 'rgba(255,255,255,0.06)', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: totalPoints >= r.points ? 'pointer' : 'not-allowed', fontSize: '12px', fontWeight: 600, opacity: totalPoints < r.points ? 0.5 : 1 }}>
                      {totalPoints >= r.points ? 'Redeem' : 'Need more'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* History */}
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.1rem', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} style={{ color: '#2d9cdb' }}/> Points History
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {history.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < history.length - 1 ? '1px solid rgba(45,156,219,0.08)' : 'none' }}>
                    <div>
                      <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 500 }}>{item.desc}</div>
                      <div style={{ color: '#8896A7', fontSize: '11px', marginTop: '2px' }}>{item.date}</div>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: item.type === 'earned' ? '#2d9cdb' : '#EF233C' }}>
                      {item.type === 'earned' ? '+' : ''}{item.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* How to earn */}
          <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '14px', padding: '22px', marginTop: '20px' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={14} style={{ color: '#2d9cdb' }}/> How to Earn Points
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {[[ShoppingBag, '1 point per ₦100 spent', '#2d9cdb'], [Star, '50 bonus on birthday', '#F4A261'], [Gift, '100 points for referrals', '#06D6A0'], [Award, 'Double points weekends', '#4db8f0']].map(([Icon, label, color], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#0A0F14', borderRadius: '10px', border: '1px solid rgba(45,156,219,0.08)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={15} style={{ color }} />
                  </div>
                  <span style={{ color: '#E0E6ED', fontSize: '12px' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}