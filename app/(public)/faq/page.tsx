'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  { q:'How do I upload a prescription?', a:'Go to the Shop page and click "Upload Prescription", or use the Upload button on our homepage. You can upload JPG, PNG, or PDF files. Our pharmacists verify all prescriptions within 20 minutes during business hours.' },
  { q:'Do you deliver to my location in Maiduguri?', a:'We currently deliver to all areas within Maiduguri including GRA, Bypass, Damboa road, Barrack, POLO, Bulumkutu, and surrounding areas. Same-day delivery is available for orders placed before 8PM.' },
  { q:'How long does delivery take?', a:'Same-day delivery: Order before 8PM for delivery same day. Next-day delivery: Order any time for delivery the following day. Express delivery: 1-2 hours for urgent needs (additional fee applies).' },
  { q:'Are all your medications NAFDAC approved?', a:'Yes. Every single medication we stock is NAFDAC-approved and sourced directly from certified manufacturers or authorized distributors. We never stock counterfeit or expired medications.' },
  { q:'Can I speak with a Doctor?', a:'Absolutely. You can chat with our licensed Doctors 24/7 through the Aria chat button on our website, or call us directly at +234 814 904 5538. Video consultations are also available by appointment.' },
  { q:'How do I track my order?', a:'Once your order is dispatched, you will receive an SMS and email with a tracking link. You can also track your order by going to Track Order page and entering your order number.' },
  { q:'What payment methods do you accept?', a:'We accept card payments (Visa, Mastercard), bank transfers, USSD payments, and Pay on Delivery for eligible orders within Maiduguri. All online payments are secured by Paystack.' },
  { q:'How does the loyalty points system work?', a:'You earn 1 point for every ₦100 spent. Points can be redeemed for discounts on future orders. 100 points = ₦100 discount. Points never expire as long as your account remains active.' },
  { q:'Can I get a refund?', a:'Yes. If you receive a wrong or damaged product, contact us within 24 hours and we will arrange a replacement or full refund. Prescription medications cannot be returned for safety reasons.' },
  { q:'Is my health data safe?', a:'We take your privacy extremely seriously. All health data is encrypted, stored securely, and never shared with third parties without your consent. We are fully NDPR compliant.' },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <>
      <Navbar />
      <div style={{ paddingTop:'80px', fontFamily:'Inter, sans-serif' }}>
        <div style={{ background:'linear-gradient(135deg, #2d9cdb, #0A0F14)', padding:'80px 24px', textAlign:'center' }}>
          <div style={{ display:'inline-block', background:'rgba(212,175,55,0.15)', border:'1px solid rgba(212,175,55,0.3)', borderRadius:'50px', padding:'6px 18px', color:'#2d9cdb', fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', marginBottom:'16px' }}>FAQ</div>
          <h1 style={{ fontFamily:'Playfair Display, serif', color:'white', fontSize:'clamp(2rem, 4vw, 3rem)', fontWeight:700, marginBottom:'16px' }}>Frequently Asked Questions</h1>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'1.05rem', maxWidth:'480px', margin:'0 auto' }}>Everything you need to know about Vital Medicare</p>
        </div>

        <div style={{ maxWidth:'800px', margin:'0 auto', padding:'64px 24px' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom:'1px solid rgba(45,156,219,0.1)', marginBottom:'0' }}>
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 0', background:'transparent', border:'none', cursor:'pointer', textAlign:'left', gap:'16px' }}>
                <span style={{ color:'#E0E6ED', fontSize:'15px', fontWeight:600, lineHeight:1.4 }}>{faq.q}</span>
                {openIndex === i ? <ChevronUp size={18} style={{ color:'#2d9cdb', flexShrink:0 }}/> : <ChevronDown size={18} style={{ color:'#8896A7', flexShrink:0 }}/>}
              </button>
              {openIndex === i && (
                <div style={{ paddingBottom:'20px', color:'#8896A7', fontSize:'14px', lineHeight:1.8 }}>{faq.a}</div>
              )}
            </div>
          ))}

          <div style={{ background:'rgba(45,156,219,0.1)', borderRadius:'16px', padding:'32px', textAlign:'center', marginTop:'48px' }}>
            <h3 style={{ fontFamily:'Playfair Display, serif', color:'#E0E6ED', fontSize:'1.3rem', fontWeight:700, marginBottom:'10px' }}>Still have questions?</h3>
            <p style={{ color:'#8896A7', fontSize:'14px', marginBottom:'20px' }}>Our team is here to help you 24/7</p>
            <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
              <Link href="/contact" style={{ background:'#2d9cdb', color:'white', padding:'12px 28px', borderRadius:'8px', textDecoration:'none', fontWeight:600, fontSize:'14px' }}>Contact Us</Link>
              <a href="tel:+2348012345678" style={{ background:'white', color:'#2d9cdb', padding:'12px 28px', borderRadius:'8px', textDecoration:'none', fontWeight:600, fontSize:'14px', border:'1px solid #C8DDD8' }}>Call Us Now</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
