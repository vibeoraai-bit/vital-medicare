import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vital Medicare & Pharmaceutical Ltd. | Premium Healthcare',
  description: 'Nigeria\'s premier digital pharmacy. Order medications, upload prescriptions, book consultations, and get same-day delivery.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
