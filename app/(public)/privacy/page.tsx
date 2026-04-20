import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: `We collect information you provide directly to us, including:
      
- Personal identification information (name, email address, phone number, date of birth)
- Health information (prescriptions, medical history, allergies, medications)
- Payment information (processed securely through Paystack — we do not store card details)
- Delivery address and location data
- Device information and usage data when you use our platform
- Communications you send us`
    },
    {
      title: '2. How We Use Your Information',
      content: `We use the information we collect to:

- Process your medication orders and deliver them to you
- Verify and process your prescriptions through our licensed pharmacists
- Send you order confirmations, delivery updates, and medication reminders
- Provide customer support and respond to your inquiries
- Improve our services and develop new features
- Comply with legal obligations and regulatory requirements (NAFDAC, PCN, NDPR)
- Detect and prevent fraud or misuse of our platform`
    },
    {
      title: '3. Information Sharing',
      content: `We do not sell, trade, or rent your personal or health information to third parties. We may share your information only in these circumstances:

- With licensed pharmacists and healthcare providers to fulfill your prescriptions
- With delivery partners solely to deliver your orders
- With Paystack for secure payment processing
- With regulatory authorities (NAFDAC, PCN) as required by Nigerian law
- With your explicit consent for any other purpose
- To protect the rights, property, or safety of Vital Medicare, our users, or others`
    },
    {
      title: '4. Health Data Protection (NDPR Compliance)',
      content: `As a healthcare provider, we take extra precautions with your health data in compliance with the Nigerian Data Protection Regulation (NDPR):

- All health data is encrypted using AES-256 encryption both in transit and at rest
- Prescription images are stored in secured, access-controlled storage
- Access to health data is restricted to licensed pharmacists on a need-to-know basis
- We maintain audit logs of all access to patient health records
- You have the right to request access to, correction of, or deletion of your health data
- Health data is retained only as long as necessary for your care and legal compliance`
    },
    {
      title: '5. Data Security',
      content: `We implement comprehensive security measures including:

- SSL/TLS encryption for all data transmission
- AES-256 encryption for stored data
- Two-factor authentication for administrative access
- Regular security audits and penetration testing
- Role-based access control — staff only access what they need
- Automatic session timeouts
- Regular backups with encrypted storage

Despite these measures, no system is 100% secure. If you suspect unauthorized access to your account, contact us immediately at security@vitalmedicare.com`
    },
    {
      title: '6. Your Rights',
      content: `Under the NDPR, you have the following rights:

- Right of Access: Request a copy of all personal data we hold about you
- Right to Rectification: Request correction of inaccurate personal data
- Right to Erasure: Request deletion of your data (subject to legal retention requirements)
- Right to Portability: Receive your data in a structured, machine-readable format
- Right to Object: Object to processing of your data for certain purposes
- Right to Withdraw Consent: Withdraw consent at any time where processing is based on consent

To exercise any of these rights, contact our Data Protection Officer at: dpo@vitalmedicare.com`
    },
    {
      title: '7. Cookies and Tracking',
      content: `We use essential cookies to operate our platform (session management, security). We also use analytics cookies to understand how our platform is used and improve it.

You can control cookie settings through your browser settings. Disabling cookies may affect the functionality of our platform.

We do not use tracking cookies for advertising purposes or share data with advertising networks.`
    },
    {
      title: '8. Children\'s Privacy',
      content: `Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. For patients under 18, a parent or guardian must register and manage the account.

If you believe we have collected information from a child under 13, please contact us immediately and we will delete that information.`
    },
    {
      title: '9. Changes to This Policy',
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will:

- Notify you by email of significant changes
- Post the updated policy with the revision date on our website
- Provide a summary of key changes

Your continued use of our services after changes become effective constitutes acceptance of the updated policy.`
    },
    {
      title: '10. Contact Us',
      content: `If you have questions about this Privacy Policy or our privacy practices:

Data Protection Officer
Vital Medicare & Pharmaceuticals Ltd.
No.1 Railway Junction,Airport Road, Maiduguri,Borno, Nigeria.

Email: dpo@vitalmedicare.com
Phone: +234 814 904 5538
Working Hours: Monday–Saturday, 8AM–6PM WAT

You may also file a complaint with the National Information Technology Development Agency (NITDA) at ndpr@nitda.gov.ng`
    },
  ]

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '64px', background: '#0A0F14', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #141C24, #0A0F14)', padding: '72px 24px', textAlign: 'center', borderBottom: '1px solid rgba(45,156,219,0.12)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(45,156,219,0.1)', border: '1px solid rgba(45,156,219,0.25)', color: '#2d9cdb', padding: '5px 14px', borderRadius: '50px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '16px' }}>
            Legal
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '12px' }}>Privacy Policy</h1>
          <p style={{ color: '#8896A7', fontSize: '14px' }}>Last updated: April 15, 2026 · Effective: April 15, 2026</p>
        </div>

        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '56px 24px' }}>

          {/* Intro */}
          <div style={{ background: 'rgba(45,156,219,0.06)', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '14px', padding: '24px', marginBottom: '40px' }}>
            <p style={{ color: '#E0E6ED', fontSize: '15px', lineHeight: 1.8, marginBottom: '12px' }}>
              Vital Medicare & Pharmaceuticals Ltd. (&quot;Vital Medicare&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting and respecting your privacy.
            </p>
            <p style={{ color: '#8896A7', fontSize: '14px', lineHeight: 1.75 }}>
              This Privacy Policy explains how we collect, use, protect, and share your personal information when you use our website and services. As a healthcare provider, we are subject to the Nigerian Data Protection Regulation (NDPR) and maintain the highest standards of health data protection.
            </p>
          </div>

          {/* Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {sections.map((section, i) => (
              <div key={i} style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '14px', padding: '28px' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#2d9cdb', fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>{section.title}</h2>
                <div style={{ color: '#8896A7', fontSize: '14px', lineHeight: 1.85, whiteSpace: 'pre-line' }}>{section.content}</div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div style={{ marginTop: '40px', padding: '20px 24px', background: 'rgba(45,156,219,0.06)', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ color: '#8896A7', fontSize: '13px', lineHeight: 1.7 }}>
              By using Vital Medicare&apos;s services, you acknowledge that you have read and understood this Privacy Policy.
              For questions, contact us at{' '}
              <a href="mailto:dpo@vitalmedicare.com" style={{ color: '#2d9cdb', textDecoration: 'none' }}>dpo@vitalmedicare.com</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}