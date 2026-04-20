import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import HowItWorks from '@/components/sections/HowItWorks'
import TrustSection from '@/components/sections/TrustSection'
import Testimonials from '@/components/sections/Testimonials'
import AriaChat from '@/components/sections/AriaChat'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <FeaturedProducts />
        <HowItWorks />
        <TrustSection />
        <Testimonials />

        {/* CTA Section */}
        <section style={{ background: 'linear-gradient(135deg, #141C24, #0A0F14)', padding: '80px 24px', textAlign: 'center', borderTop: '1px solid rgba(45,156,219,0.1)' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(45,156,219,0.1)', border: '1px solid rgba(45,156,219,0.25)', color: '#2d9cdb', padding: '5px 14px', borderRadius: '50px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '20px' }}>
              Get Started Today
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '16px', lineHeight: 1.2 }}>
              Ready to Experience Premium Healthcare?
            </h2>
            <p style={{ color: '#8896A7', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '36px' }}>
              Join 12,000+ Nigerians who trust Vital Medicare for their health needs.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', padding: '14px 32px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', boxShadow: '0 0 24px rgba(45,156,219,0.3)' }}>
                Shop Now →
              </a>
              <a href="/booking" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(45,156,219,0.08)', color: '#2d9cdb', padding: '14px 32px', borderRadius: '10px', fontWeight: 600, fontSize: '15px', textDecoration: 'none', border: '1px solid rgba(45,156,219,0.3)' }}>
                Book Consultation
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AriaChat />
    </>
  )
}