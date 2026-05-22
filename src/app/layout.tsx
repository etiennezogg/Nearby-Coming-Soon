import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nearby — Lokales Einkaufen, neu gedacht.',
  description: 'Entdecke Produkte aus lokalen Geschäften direkt in deiner Nähe. Nearby verbindet dich mit deiner Nachbarschaft — frisch, nachhaltig, ohne Liefergebühren.',
  openGraph: {
    title: 'Nearby — Lokales Einkaufen, neu gedacht.',
    description: 'Entdecke Produkte aus lokalen Geschäften direkt in deiner Nähe. Frisch, nachhaltig, ohne Liefergebühren.',
    url: 'https://nearby-switzerland.ch',
    siteName: 'Nearby',
    images: [
      {
        url: 'https://nearby-switzerland.ch/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nearby — Lokales Einkaufen, neu gedacht.',
      },
    ],
    locale: 'de_CH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nearby — Lokales Einkaufen, neu gedacht.',
    description: 'Entdecke Produkte aus lokalen Geschäften direkt in deiner Nähe.',
    images: ['https://nearby-switzerland.ch/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
