'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import PortalSidebar from '@/components/portal/PortalSidebar'
import { Gift, Star, ShoppingBag, Award, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface LoyaltyRecord {
  id: string
  description: string
  points: number
  type: 'earned' | 'redeemed'
  created_at: string
}

const rewards = [
  { title: '₦500 Discount', points: 500, icon: '🎟️' },
  { title: '₦1,000 Discount', points: 1000, icon: '🎁' },
  { title: 'Free Delivery × 3', points: 300, icon: '🚚' },
  { title: 'Free Consultation', points: 800, icon: '👨‍⚕️' },
]

export default function LoyaltyPage() {
  const [history, setHistory] = useState<LoyaltyRecord[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const [profileRes, historyRes] = await Promise.all([
        supabase.from('profiles').select('loyalty_points').eq('id', user.id).single(),
        supabase.from('loyalty_history').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      ])
      setTotalPoints(profileRes.data?.loyalty_points || 0)
      setHistory(historyRes.data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F14', fontFamily: 'Inter, sans-serif' }}>
      <PortalSidebar active="Loyalty Points" />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: '#141C24', padding: '20px 32px', borderBottom: '1px solid rgba(45,156,219,0.1)' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.5rem', fontWeight: 700 }}>Loyalty Points</h1>
          <p style={{ color: '#8896A7', fontSize: '13px', marginTop: '3px' }}>Earn points on every purchase and redeem for rewards</p>
        </div>

        <div style={{ padding: '28px 32px' }}>
          {/* Points Card */}
          <div style={{ background: 'linear-gradient(135deg, #0f2a3f, #1a4a6e, #0f2a3f)', border: '1px solid rgba(45,156,219,0.3)', borderRadius: '20px', padding: '36px', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(45,156,219,0.08)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Gift size={16} style={{ color: '#2d9cdb' }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Your Balance</span>
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', color: '#2d9cdb', fontSize: '4rem', fontWeight: 700, lineHeight: 1, marginBottom: '6px', textShadow: '0 0 30px rgba(45,156,219,0.4)' }}>
                {totalPoints.toLocaleString()}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '24px' }}>
                points — worth ₦{totalPoints.toLocaleString()}
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  [history.filter(h => h.type === 'earned').reduce((s, h) => s + h.points, 0).toString(), 'Total earned'],
                  [history.filter(h => h.type === 'redeemed').length.toString(), 'Times redeemed'],
                  [totalPoints >= 1000 ? 'Gold' : totalPoints >= 500 ? 'Silver' : 'Bronze', 'Member tier'],
                ].map(([val, lbl]) => (
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
                <Award size={16} style={{ color: '#2d9cdb' }} /> Redeem Rewards
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {rewards.map(r => (
                  <div key={r.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.08)', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{r.icon}</span>
                      <div>
                        <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600 }}>{r.title}</div>
                        <div style={{ color: '#8896A7', fontSize: '11px' }}>{r.points} points</div>
                      </div>
                    </div>
                    <button disabled={totalPoints < r.points}
                      style={{ background: totalPoints >= r.points ? 'linear-gradient(135deg, #2d9cdb, #1a7ab8)' : 'rgba(255,255,255,0.05)', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: totalPoints >= r.points ? 'pointer' : 'not-allowed', fontSize: '12px', fontWeight: 600, opacity: totalPoints < r.points ? 0.5 : 1 }}>
                      {totalPoints >= r.points ? 'Redeem' : 'Need more'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* History or empty state */}
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.1rem', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} style={{ color: '#2d9cdb' }} /> Points History
              </h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#8896A7', fontSize: '13px' }}>Loading...</div>
              ) : history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 16px' }}>
                  <Gift size={36} style={{ color: 'rgba(45,156,219,0.2)', marginBottom: '12px' }} />
                  <p style={{ color: '#8896A7', fontSize: '13px', lineHeight: 1.6 }}>
                    No points yet. Start shopping to earn points!<br />
                    <strong style={{ color: '#2d9cdb' }}>1 point per ₦100 spent.</strong>
                  </p>
                  <Link href="/shop" style={{ display: 'inline-block', marginTop: '12px', color: '#2d9cdb', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                    Shop now to earn points →
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {history.map((item, i) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < history.length - 1 ? '1px solid rgba(45,156,219,0.08)' : 'none' }}>
                      <div>
                        <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 500 }}>{item.description}</div>
                        <div style={{ color: '#8896A7', fontSize: '11px', marginTop: '2px' }}>{new Date(item.created_at).toLocaleDateString('en-NG')}</div>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: item.type === 'earned' ? '#2d9cdb' : '#EF233C' }}>
                        {item.type === 'earned' ? '+' : ''}{item.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* How to earn */}
          <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '14px', padding: '22px', marginTop: '20px' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={14} style={{ color: '#2d9cdb' }} /> How to Earn Points
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {[
                [ShoppingBag, '1 point per ₦100 spent', '#2d9cdb'],
                [Star, '50 bonus on birthday', '#F4A261'],
                [Gift, '100 points for referrals', '#06D6A0'],
                [Award, 'Double points weekends', '#4db8f0'],
              ].map(([Icon, label, color], i) => (
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