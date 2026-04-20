'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, User } from 'lucide-react'

const posts = [
  { slug: 'managing-diabetes-nigeria', title: 'Managing Diabetes in Nigeria: A Complete Guide', excerpt: 'Diabetes affects over 11 million Nigerians. Learn how to manage your blood sugar effectively with medication, diet, and lifestyle changes.', category: 'Health Tips', author: 'Dr. F,z Wasili', date: 'Apr 10, 2026', readTime: '8 min read' },
  { slug: 'understanding-prescriptions', title: 'Understanding Your Prescription: What Every Patient Should Know', excerpt: 'Prescription labels can be confusing. Our pharmacists explain what each part means and why following instructions exactly matters.', category: 'Pharmacy Guide', author: 'Pharmacist Aisha', date: 'Apr 8, 2026', readTime: '5 min read' },
  { slug: 'nafdac-approved-medications', title: 'How to Verify Your Medications are NAFDAC Approved', excerpt: 'Counterfeit drugs are a serious problem in Nigeria. Here is exactly how to check if your medication is genuine and safe.', category: 'Safety', author: 'Vital Medicare Team', date: 'Apr 5, 2026', readTime: '6 min read' },
  { slug: 'blood-pressure-management', title: 'High Blood Pressure: Medications, Lifestyle & What to Eat', excerpt: 'Hypertension is called the silent killer for a reason. Learn the best medications, foods, and habits to keep your blood pressure in check.', category: 'Health Tips', author: 'Dr. Fatima Hassan', date: 'Apr 2, 2026', readTime: '10 min read' },
  { slug: 'vitamins-supplements-guide', title: 'Which Vitamins Do Nigerians Actually Need?', excerpt: 'With dozens of supplements on the market, it is hard to know what you actually need. Our pharmacists break down the essential ones.', category: 'Nutrition', author: 'Pharmacist Chidi', date: 'Mar 28, 2026', readTime: '7 min read' },
  { slug: 'same-day-delivery-guide', title: 'How Our Same-Day Delivery System Works', excerpt: 'From the moment you place your order to the moment it arrives at your door — a behind-the-scenes look at how we fulfil orders in hours.', category: 'About Us', author: 'Vital Medicare Team', date: 'Mar 25, 2026', readTime: '4 min read' },
]

const categories = ['All', 'Health Tips', 'Pharmacy Guide', 'Safety', 'Nutrition', 'About Us']
const catColors: Record<string, string> = { 'Health Tips': '#2d9cdb', 'Pharmacy Guide': '#06D6A0', 'Safety': '#F4A261', 'Nutrition': '#4db8f0', 'About Us': '#1a7ab8' }

export default function BlogPage() {
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? posts : posts.filter(p => p.category === active)

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '64px', background: '#0A0F14', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #141C24, #0A0F14)', padding: '80px 24px', textAlign: 'center', borderBottom: '1px solid rgba(45,156,219,0.12)' }}>
          <div className="badge" style={{ marginBottom: '16px' }}>Health Blog</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '12px' }}>
            Health Tips & Pharmacy Insights
          </h1>
          <p style={{ color: '#8896A7', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto' }}>
            Expert advice from our licensed pharmacists and healthcare professionals
          </p>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>

          {/* Category filters */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px', justifyContent: 'center' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                style={{ padding: '8px 20px', borderRadius: '50px', border: '1px solid', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', borderColor: active === cat ? '#2d9cdb' : 'rgba(45,156,219,0.2)', background: active === cat ? 'rgba(45,156,219,0.15)' : 'transparent', color: active === cat ? '#2d9cdb' : '#8896A7' }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Featured post */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', borderRadius: '20px', padding: '48px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }}/>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50px', padding: '4px 14px', color: 'white', fontSize: '11px', fontWeight: 600, marginBottom: '16px' }}>Featured</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, marginBottom: '12px', maxWidth: '600px' }}>
              {filtered[0]?.title}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', lineHeight: 1.7, maxWidth: '560px', marginBottom: '24px' }}>{filtered[0]?.excerpt}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}><User size={13}/>{filtered[0]?.author}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}><Clock size={13}/>{filtered[0]?.readTime}</div>
              <Link href={`/blog/${filtered[0]?.slug}`} style={{ marginLeft: 'auto', background: '#141C24', color: '#2d9cdb', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}>Read Article →</Link>
            </div>
          </motion.div>

          {/* Posts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filtered.slice(1).map((post, i) => (
              <motion.div key={post.slug}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ background: '#141C24', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(45,156,219,0.12)', transition: 'all 0.3s', cursor: 'pointer' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-6px)'; el.style.borderColor = 'rgba(45,156,219,0.35)'; el.style.boxShadow = '0 16px 40px rgba(45,156,219,0.12)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.borderColor = 'rgba(45,156,219,0.12)'; el.style.boxShadow = 'none' }}>
                <div style={{ height: '4px', background: catColors[post.category] || '#2d9cdb' }}/>
                <div style={{ padding: '22px' }}>
                  <div style={{ display: 'inline-block', background: `${catColors[post.category] || '#2d9cdb'}18`, color: catColors[post.category] || '#2d9cdb', padding: '3px 10px', borderRadius: '50px', fontSize: '10px', fontWeight: 600, marginBottom: '12px', border: `1px solid ${catColors[post.category] || '#2d9cdb'}30` }}>
                    {post.category}
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px', lineHeight: 1.4 }}>{post.title}</h3>
                  <p style={{ color: '#8896A7', fontSize: '13px', lineHeight: 1.65, marginBottom: '18px' }}>{post.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8896A7', fontSize: '11px' }}><User size={11}/>{post.author}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8896A7', fontSize: '11px' }}><Clock size={11}/>{post.readTime}</div>
                    </div>
                    <Link href={`/blog/${post.slug}`} style={{ color: '#2d9cdb', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Read →</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#8896A7' }}>No posts in this category yet.</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}