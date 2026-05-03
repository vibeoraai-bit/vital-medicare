import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import MobileNav from '@/components/layout/MobileNav'

export const metadata: Metadata = {
  title: 'Vital Medicare & Pharmaceutical Ltd.',
  description: 'Nigeria\'s premier digital pharmacy. NAFDAC certified medications with same-day delivery in Abuja.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Vital Medicare' },
  openGraph: {
    title: 'Vital Medicare & Pharmaceutical Ltd.',
    description: 'Certified medications, same-day delivery in Abuja.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0F14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <Navbar />
        {/* Desktop gets padding-top for fixed navbar, mobile gets padding-bottom for bottom nav */}
        <div className="pt-16 md:pt-16 pb-20 md:pb-0">
          {children}
        </div>
        <MobileNav />
      </body>
    </html>
  )
}