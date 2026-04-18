import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nearby — Lokales Einkaufen, neu gedacht.',
  description: 'Entdecke Produkte aus lokalen Geschäften direkt in deiner Nähe. Nearby verbindet dich mit deiner Nachbarschaft — frisch, nachhaltig, ohne Liefergebühren.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
