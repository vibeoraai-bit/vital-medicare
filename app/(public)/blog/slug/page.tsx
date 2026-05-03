export const dynamic = 'force-dynamic'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params

  const post = {
    title: 'Health Tips from Vital Medicare',
    date: 'April 21, 2026',
    author: 'Vital Medicare Pharmacist Team',
    readTime: '5 min read',
    content: `
      Welcome to Vital Medicare's health blog. We share expert advice on medications, 
      wellness, and healthcare in Nigeria.
      
      Our licensed pharmacists and doctors provide evidence-based health information 
      to help you make informed decisions about your health.
      
      For personalized advice, book a consultation with our team at:
      📞 +234 801 234 5678
      📧 hello@vitalmedicare.com
      📍 12 Hospital Road, Maitama, Abuja
    `,
    tags: ['Health', 'Medications', 'Wellness', 'Nigeria'],
    slug,
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '64px', background: '#0A0F14', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #141C24, #0A0F14)', borderBottom: '1px solid rgba(45,156,219,0.12)', padding: '60px 24px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Link href="/blog" style={{ color: '#2d9cdb', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '20px' }}>
              ← Back to Blog
            </Link>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {post.tags.map(tag => (
                <span key={tag} style={{ background: 'rgba(45,156,219,0.12)', color: '#2d9cdb', padding: '4px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 600 }}>{tag}</span>
              ))}
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, lineHeight: 1.3, marginBottom: '20px' }}>
              {post.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 700 }}>V</div>
                <div>
                  <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600 }}>{post.author}</div>
                  <div style={{ color: '#8896A7', fontSize: '11px' }}>{post.date} · {post.readTime}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '40px' }}>
            {post.content.trim().split('\n\n').map((paragraph, i) => (
              <p key={i} style={{ color: '#8896A7', fontSize: '15px', lineHeight: 1.85, marginBottom: '20px' }}>
                {paragraph.trim()}
              </p>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background: 'linear-gradient(135deg, rgba(45,156,219,0.1), rgba(45,156,219,0.05))', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '16px', padding: '32px', marginTop: '32px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>
              Have Health Questions?
            </h3>
            <p style={{ color: '#8896A7', fontSize: '14px', marginBottom: '20px', lineHeight: 1.7 }}>
              Our licensed pharmacists at Vital Medicare are available 7 days a week to answer your questions.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/booking" style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', boxShadow: '0 0 14px rgba(45,156,219,0.25)' }}>
                Book Consultation
              </Link>
              <Link href="/shop" style={{ background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.2)', color: '#2d9cdb', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                Browse Medications
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}