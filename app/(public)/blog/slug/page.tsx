import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

const articles: Record<string, { title: string; author: string; date: string; readTime: string; category: string; content: string }> = {
  'managing-diabetes-nigeria': {
    title: 'Managing Diabetes in Nigeria: A Complete Guide',
    author: 'Dr. F,z Wasili', date: 'Apr 10, 2026', readTime: '8 min read', category: 'Health Tips',
    content: `Diabetes is one of the fastest-growing health challenges in Nigeria, affecting over 11 million adults. Yet with the right knowledge, medications, and lifestyle changes, it is entirely manageable.

## Understanding Diabetes

Type 2 diabetes develops when your body becomes resistant to insulin or doesn't produce enough of it. This leads to elevated blood sugar levels that, if unmanaged, can damage your kidneys, eyes, nerves, and cardiovascular system.

## Medications Available at Vital Medicare

**Metformin** remains the first-line treatment for Type 2 diabetes. It is safe, effective, and available at Vital Medicare from ₦2,100 per pack.

**Glibenclamide** stimulates the pancreas to produce more insulin. Available from ₦1,200.

**Insulin** is required for Type 1 diabetes and some advanced Type 2 cases. We stock Novo Nordisk insulin pens.

## Lifestyle Management

- Monitor blood sugar daily using a glucometer (available at Vital Medicare from ₦18,000)
- Follow a low-glycemic diet — reduce white rice, white bread, and sugary drinks
- Exercise for at least 30 minutes five days a week
- Attend regular check-ups with your doctor every 3 months

## When to Seek Urgent Help

If you experience extreme thirst, frequent urination, blurred vision, or dizziness, seek medical attention immediately.

Our pharmacists at Vital Medicare are always available to answer your diabetes medication questions.`
  },
  'understanding-prescriptions': {
    title: 'Understanding Your Prescription: What Every Patient Should Know',
    author: 'Pharmacist Aisha', date: 'Apr 8, 2026', readTime: '5 min read', category: 'Pharmacy Guide',
    content: `When your doctor hands you a prescription, it can look like a foreign language. Understanding what it says helps you take your medications safely and correctly.

## What Every Prescription Contains

**Patient name and date** — Always verify these are correct before leaving the pharmacy.

**Drug name** — This can be the brand name (e.g., Augmentin) or generic name (Amoxicillin/Clavulanate). At Vital Medicare, we always stock both.

**Dosage** — The strength of the medication (e.g., 500mg). Taking the wrong dose can be dangerous.

**Frequency** — How often to take it: OD (once daily), BD (twice daily), TDS (three times daily), QID (four times daily).

**Duration** — How long to take the medication. Always complete your antibiotic course even if you feel better.

**Route** — Oral (by mouth), topical (on skin), etc.

## Common Abbreviations

- Rx — Prescription
- PRN — As needed
- AC — Before meals
- PC — After meals
- HS — At bedtime
- NR — No refill

## What to Tell Your Pharmacist

Always inform our pharmacists about: all other medications you are taking, allergies, pregnancy or breastfeeding, and any chronic conditions.

If you are ever unsure about your prescription, our 24/7 pharmacist chat is always available.`
  },
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const article = articles[params.slug]

  if (!article) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: '64px', background: '#0A0F14', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '2rem', marginBottom: '12px' }}>Article Coming Soon</h1>
            <p style={{ color: '#8896A7', marginBottom: '24px' }}>This article is being prepared by our pharmacists.</p>
            <Link href="/blog" style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>← Back to Blog</Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '64px', background: '#0A0F14', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ background: 'linear-gradient(135deg, #141C24, #0A0F14)', padding: '64px 24px', borderBottom: '1px solid rgba(45,156,219,0.12)' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <Link href="/blog" style={{ color: '#8896A7', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '20px' }}>
              ← Back to Blog
            </Link>
            <div style={{ display: 'inline-block', background: 'rgba(45,156,219,0.1)', border: '1px solid rgba(45,156,219,0.25)', color: '#2d9cdb', padding: '4px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 600, marginBottom: '16px' }}>{article.category}</div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '20px' }}>{article.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '14px' }}>
                  {article.author.charAt(0)}
                </div>
                <div>
                  <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600 }}>{article.author}</div>
                  <div style={{ color: '#8896A7', fontSize: '11px' }}>{article.date} · {article.readTime}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '16px', padding: '36px' }}>
            {article.content.split('\n\n').map((para, i) => (
              <div key={i} style={{ marginBottom: '20px' }}>
                {para.startsWith('## ') ? (
                  <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#2d9cdb', fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>{para.replace('## ', '')}</h2>
                ) : para.startsWith('**') && para.endsWith('**') ? (
                  <p style={{ color: '#E0E6ED', fontSize: '15px', lineHeight: 1.8, fontWeight: 600 }}>{para.replace(/\*\*/g, '')}</p>
                ) : (
                  <p style={{ color: '#8896A7', fontSize: '15px', lineHeight: 1.85 }}>{para}</p>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '32px', background: 'rgba(45,156,219,0.06)', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '14px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ color: '#E0E6ED', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Have questions about this article?</div>
              <div style={{ color: '#8896A7', fontSize: '13px' }}>Chat with our licensed pharmacists 24/7</div>
            </div>
            <Link href="/booking" style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', padding: '10px 22px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '13px', boxShadow: '0 0 16px rgba(45,156,219,0.2)' }}>
              Ask a Pharmacist →
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}