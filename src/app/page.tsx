'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

function EmailSignup({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!email || !email.includes('@')) return
    setSubmitted(true)
  }

  const isDark = variant === 'dark'

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280 }}
        className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-medium shadow-lg ${
          isDark
            ? 'bg-white/20 text-white border border-white/30 backdrop-blur-md'
            : 'bg-green-light text-green'
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Merci — wir melden uns!
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2.5 max-w-md w-full">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="deine@email.ch"
        className={`flex-1 border rounded-full px-6 py-3.5 text-sm outline-none focus:ring-2 shadow-sm ${
          isDark
            ? 'bg-white/20 backdrop-blur-md border-white/30 text-white placeholder-white/50 focus:ring-white/40'
            : 'bg-white border-gray-200 text-ink placeholder-gray-400 focus:ring-green/30'
        }`}
      />
      <motion.button
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        className={`px-7 py-3.5 rounded-full text-sm font-medium font-dm shadow-lg transition-opacity whitespace-nowrap ${
          isDark ? 'bg-ink text-white hover:opacity-90' : 'bg-green text-white hover:opacity-90'
        }`}
      >
        Benachrichtigen →
      </motion.button>
    </div>
  )
}

const features = [
  {
    emoji: '📍',
    title: 'Produkte in der Nähe finden',
    desc: 'Gib ein was du suchst — Nearby zeigt dir sofort wo es in deiner Umgebung erhältlich ist, mit Distanz und Öffnungszeiten.',
  },
  {
    emoji: '🛍️',
    title: 'Lokale Geschäfte entdecken',
    desc: 'Finde Bäckereien, Metzgereien, Boutiquen und mehr in deiner Nachbarschaft. Mit Profil, Bewertungen und Live-Sortiment.',
  },
  {
    emoji: '💳',
    title: 'Digitale Wallet',
    desc: 'Alle Treuekarten, Cumulus-Punkte und Gutscheine an einem Ort. Bezahle per QR-Code und spare automatisch.',
  },
  {
    emoji: '🌱',
    title: 'Nachhaltig einkaufen',
    desc: 'Jeder Einkauf über Nearby spart durchschnittlich 2,4 kg CO₂ gegenüber Online-Shopping. Kurze Wege, weniger Verpackung.',
  },
]

const bizFeatures = [
  'Produkte wie Social-Media-Posts hochladen',
  'Eigenes Geschäftsprofil mit Standort & Öffnungszeiten',
  'Automatisch auf der Karte für Kunden sichtbar',
  'Digitale Gutscheine & Treuekarten anbieten',
  'Statistiken: Reichweite, Klicks & Heatmap',
  'Ab CHF 29 / Monat — ohne Einrichtungsgebühr',
]

const stats = [
  { value: '60+', label: 'Produktkategorien' },
  { value: '26', label: 'Kantone abgedeckt' },
  { value: '2,4 kg', label: 'CO₂ gespart pro Einkauf' },
  { value: '< 12 km', label: 'Ø Distanz zum Produkt' },
]

export default function ComingSoonPage() {
  return (
    <div className="bg-white">
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
        <div className="font-syne font-extrabold text-2xl text-ink tracking-tight">Nearby</div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
          Coming Soon
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section
        className="relative overflow-hidden min-h-screen flex items-center justify-center px-6"
        style={{
          background: 'linear-gradient(160deg, #4ade80 0%, #22c55e 40%, #16a34a 100%)',
        }}
      >
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 600,
            height: 600,
            left: '-15%',
            top: '-20%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ y: [0, -40, 0], x: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 500,
            height: 500,
            right: '-10%',
            bottom: '-15%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-8 tracking-wide backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Bald verfügbar in der Schweiz
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-syne font-extrabold text-ink tracking-tight leading-[0.92] mb-6"
            style={{ fontSize: 'clamp(4.5rem, 13vw, 10rem)' }}
          >
            Nearby.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="text-white/85 text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto mb-3"
          >
            Lokales Einkaufen, neu gedacht.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="text-white/65 text-base font-light leading-relaxed max-w-lg mx-auto mb-12"
          >
            Entdecke Produkte aus lokalen Geschäften direkt in deiner Nähe — frisch, nachhaltig,
            ohne Liefergebühren.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center"
          >
            <EmailSignup variant="dark" />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 1.5 },
            y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </section>

      {/* ─── WAS IST NEARBY ─── */}
      <section className="px-6 md:px-10 py-24 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Die Vision</p>
          <h2
            className="font-syne font-extrabold text-ink tracking-tight leading-tight mb-8"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Warum Nearby?
          </h2>

          <div className="space-y-5 text-gray-600 font-light leading-relaxed text-base md:text-lg max-w-3xl">
            <p>
              Täglich bestellen Millionen Menschen in der Schweiz Produkte online — oft von grossen,
              internationalen Plattformen. Dabei liegt das gleiche Produkt häufig nur wenige hundert
              Meter entfernt, in einem lokalen Geschäft. Frischer, günstiger und ohne tagelange
              Lieferzeit.
            </p>
            <p>
              <strong className="text-ink font-medium">Nearby</strong> verbindet Konsumenten mit
              lokalen Geschäften in ihrer Umgebung. Statt bei grossen Online-Händlern zu bestellen,
              findest du Produkte direkt um die Ecke — mit Echtzeit-Verfügbarkeit, Distanzanzeige
              und Öffnungszeiten.
            </p>
            <p>
              Für lokale Geschäfte ist Nearby eine einfache Möglichkeit, ihr Sortiment digital
              sichtbar zu machen — ohne eigene Website, ohne technisches Know-how. Produkte hochladen
              wie einen Social-Media-Post, und sofort für Kunden in der Nähe sichtbar sein.
            </p>
            <p>
              Unser Ziel:{' '}
              <strong className="text-ink font-medium">
                lokales Einkaufen so einfach machen wie Online-Shopping
              </strong>{' '}
              — aber nachhaltiger, persönlicher und mit echtem Mehrwert für die Nachbarschaft.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ─── STATS ─── */}
      <section className="border-y border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 max-w-5xl mx-auto">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="p-8 md:p-12 border-r border-gray-100 last:border-r-0 [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r text-center"
            >
              <div className="font-syne font-extrabold text-4xl md:text-5xl tracking-tight text-green mb-2">
                {s.value}
              </div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES FÜR KÄUFER ─── */}
      <section className="px-6 md:px-10 py-24 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Für Käufer</p>
          <h2
            className="font-syne font-extrabold text-ink tracking-tight leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Alles was du suchst —<br />
            <span className="text-gray-400 font-light font-dm">direkt um die Ecke.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-gray-50 rounded-2xl p-7 border border-gray-100"
            >
              <span className="text-3xl mb-4 block">{f.emoji}</span>
              <h3 className="font-syne font-bold text-ink text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── KARTEN-VORSCHAU ─── */}
      <section className="px-6 md:px-10 py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Vorschau</p>
            <h2
              className="font-syne font-extrabold text-ink tracking-tight leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Deine Nachbarschaft auf einen Blick.
            </h2>
            <p className="text-gray-500 font-light max-w-lg mx-auto">
              Die interaktive Karte zeigt dir alle teilnehmenden Geschäfte in deiner Umgebung — mit
              Sortiment, Distanz und Öffnungszeiten.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg relative"
            style={{ height: '420px' }}
          >
            <img
              src="https://static-maps.yandex.ru/v1?ll=8.2275,46.8182&spn=4.5,2.2&size=1200,420&l=map&lang=en_US"
              alt="Karte der Schweiz"
              className="w-full h-full object-cover"
              style={{ filter: 'saturate(0.9) brightness(1.02)' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-light via-white to-green-light -z-10" />

            <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl px-8 py-5 shadow-lg border border-gray-100 text-center">
                <div className="font-syne font-bold text-ink text-lg mb-1">Interaktive Karte</div>
                <div className="text-sm text-gray-500 font-light">Verfügbar beim Launch</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FÜR UNTERNEHMEN ─── */}
      <section className="px-6 md:px-10 py-24 bg-ink">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs uppercase tracking-widest text-green mb-4">Für Unternehmen</p>
            <h2
              className="font-syne font-extrabold text-white tracking-tight leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Zeig der Welt,
              <br />
              was du anbietest.
            </h2>

            <p className="text-white/70 font-light leading-relaxed max-w-xl mb-10">
              Nearby gibt lokalen Geschäften eine digitale Bühne. Präsentiere dein Sortiment deinen
              Kundinnen und Kunden direkt in der Umgebung — einfach, schnell und ohne technische
              Hürden.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {bizFeatures.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white/85"
                >
                  {feature}
                </motion.div>
              ))}
            </div>

            <div className="mt-12 flex justify-start">
              <EmailSignup variant="light" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA / FOOTER ─── */}
      <section className="px-6 md:px-10 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Launch</p>
            <h2
              className="font-syne font-extrabold text-ink tracking-tight leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Sei beim Start dabei.
            </h2>
            <p className="text-gray-500 font-light leading-relaxed max-w-xl mx-auto mb-10">
              Trag dich ein und erfahre als Erstes, wann Nearby in deiner Region live geht.
            </p>

            <div className="flex justify-center">
              <EmailSignup variant="light" />
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="px-6 md:px-10 py-8 border-t border-gray-100 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Nearby. Alle Rechte vorbehalten.
      </footer>
    </div>
  )
}
