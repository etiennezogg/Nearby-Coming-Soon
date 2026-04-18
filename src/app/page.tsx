'use client'

import { motion } from 'framer-motion'

const features = [
  {
    emoji: '📍',
    title: 'Produkte in der Nähe finden',
    desc: 'Gib ein was du suchst — Nearby zeigt dir sofort wo es in deiner Umgebung erhältlich ist.',
  },
  {
    emoji: '🛍️',
    title: 'Lokale Geschäfte entdecken',
    desc: 'Finde Bäckereien, Boutiquen und mehr in deiner Nachbarschaft.',
  },
  {
    emoji: '💳',
    title: 'Digitale Wallet',
    desc: 'Alle Treuekarten und Gutscheine an einem Ort.',
  },
  {
    emoji: '🌱',
    title: 'Nachhaltig einkaufen',
    desc: 'Kurze Wege, weniger Verpackung und lokale Wertschöpfung.',
  },
]

const bizFeatures = [
  'Produkte einfach hochladen',
  'Eigenes Geschäftsprofil',
  'Auf Karte sichtbar',
  'Digitale Gutscheine',
  'Statistiken & Insights',
  'Ab CHF 29 / Monat',
]

const stats = [
  { value: '60+', label: 'Produktkategorien' },
  { value: '26', label: 'Kantone' },
  { value: '2,4 kg', label: 'CO₂ pro Einkauf' },
  { value: '< 12 km', label: 'Ø Distanz' },
]

export default function ComingSoonPage() {
  return (
    <div className="bg-white">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between px-6 py-4 bg-white/70 backdrop-blur border-b">
        <div className="font-bold text-xl">Nearby</div>
        <div className="text-sm text-gray-500">Coming Soon</div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center text-center px-6 bg-gradient-to-br from-green-400 to-green-600 text-white">
        <div>
          <h1 className="text-6xl font-bold mb-6">Nearby</h1>
          <p className="text-lg mb-2">Lokales Einkaufen, neu gedacht.</p>
          <p className="text-sm opacity-80">
            Produkte in deiner Nähe finden — schnell, nachhaltig, lokal.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-2 md:grid-cols-4 text-center border-y">
        {stats.map((s) => (
          <div key={s.label} className="p-8">
            <div className="text-3xl font-bold text-green-600">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Alles was du suchst — direkt um die Ecke
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="p-6 border rounded-xl">
              <div className="text-2xl mb-2">{f.emoji}</div>
              <h3 className="font-bold">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BUSINESS */}
      <section className="px-6 py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Für Unternehmen
          </h2>

          <p className="text-gray-300 mb-10">
            Präsentiere dein Sortiment digital und werde lokal sichtbar.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {bizFeatures.map((f) => (
              <div key={f} className="border border-white/20 p-4 rounded-lg">
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KONTAKT */}
      <section className="px-6 py-20 text-center bg-gray-50">
        <h2 className="text-3xl font-bold mb-4">
          Interesse an Nearby?
        </h2>

        <p className="text-gray-500 mb-8">
          Für Fragen, Partnerschaften oder frühen Zugang — melde dich direkt.
        </p>

        <div className="inline-block bg-white border rounded-xl p-6 shadow">
          <div className="text-sm text-gray-400">Kontaktperson</div>
          <div className="font-bold text-lg mb-2">Etienne Zogg</div>

          <a
            href="mailto:etienne.zogg@yahoo.com"
            className="text-green-600 hover:underline"
          >
            etienne.zogg@yahoo.com
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-400 py-8 border-t">
        © {new Date().getFullYear()} Nearby · Kontakt:{' '}
        <a href="mailto:etienne.zogg@yahoo.com" className="underline">
          etienne.zogg@yahoo.com
        </a>
      </footer>

    </div>
  )
}
