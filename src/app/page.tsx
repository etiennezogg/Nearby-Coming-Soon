'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const GREEN = '#1a9e74'

// ─── Email Signup ──────────────────────────────────────────────────────────────

function EmailSignup({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) return
    setLoading(true)
    setError('')
    const { error } = await supabase.from('waitlist').insert({ email })
    setLoading(false)
    if (error && error.code === '23505') setSubmitted(true)
    else if (error) setError('Etwas ist schiefgelaufen. Bitte versuch es nochmals.')
    else setSubmitted(true)
  }

  const isDark = variant === 'dark'

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280 }}
        className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-medium shadow-lg ${
          isDark ? 'bg-white/15 text-white border border-white/20 backdrop-blur-md' : 'bg-[#e0f5ee] text-[#1a9e74]'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Merci — wir melden uns!
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2.5 max-w-md w-full">
      <input
        type="email" value={email} onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder="deine@email.ch"
        className={`flex-1 border rounded-full px-6 py-3.5 text-sm outline-none transition-all ${
          isDark
            ? 'bg-white/10 backdrop-blur-md border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:bg-white/15'
            : 'bg-white border-gray-200 text-[#0d0d0d] placeholder-gray-400 focus:border-[#1a9e74]/40 focus:ring-2 focus:ring-[#1a9e74]/10'
        }`}
      />
      <motion.button
        whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
        onClick={handleSubmit} disabled={loading}
        className={`px-7 py-3.5 rounded-full text-sm font-medium shadow-lg transition-opacity whitespace-nowrap disabled:opacity-60 ${
          isDark ? 'bg-white text-[#0d0d0d] hover:opacity-90' : 'bg-[#1a9e74] text-white hover:opacity-90'
        }`}
        style={{ boxShadow: isDark ? 'none' : '0 4px 20px rgba(26,158,116,0.35)' }}
      >
        {loading ? 'Laden...' : 'Benachrichtigen →'}
      </motion.button>
      {error && <p className="text-red-400 text-xs mt-1 w-full">{error}</p>}
    </div>
  )
}

// ─── Map Showcase ──────────────────────────────────────────────────────────────

function MapShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 1], [20, 0]), { stiffness: 60, damping: 20 })
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [0.92, 1]), { stiffness: 60, damping: 20 })
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  return (
    <div ref={ref} style={{ perspective: '1200px' }} className="w-full">
      <motion.div
        style={{ rotateX, scale, opacity }}
        className="relative w-full rounded-[28px] overflow-hidden border border-black/10"
        css-note="map card"
        {...{} as any}
      >
        {/* Glass frame overlay */}
        <div className="absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/30 pointer-events-none z-10" />
        {/* Shadow */}
        <div className="absolute -inset-1 rounded-[32px] -z-10"
          style={{ boxShadow: '0 40px 80px -20px rgba(0,0,0,0.3), 0 20px 40px -10px rgba(0,0,0,0.15)' }} />
        {/* Map placeholder */}
        <div className="w-full bg-gradient-to-br from-[#e8f5f0] via-[#f0faf6] to-[#e0f0ea]" style={{ height: '420px' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Decorative map pins */}
            {[
              { top: '30%', left: '35%', delay: 0.2 },
              { top: '55%', left: '60%', delay: 0.4 },
              { top: '40%', left: '70%', delay: 0.6 },
              { top: '65%', left: '40%', delay: 0.8 },
            ].map((pin, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10, scale: 0 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: pin.delay + 0.5, type: 'spring', stiffness: 300 }}
                className="absolute"
                style={{ top: pin.top, left: pin.left }}
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-white shadow-lg border border-[#1a9e74]/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#1a9e74]" />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-2 bg-[#1a9e74] rounded-full" />
                </div>
              </motion.div>
            ))}
            {/* Center badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: 'spring' }}
              className="bg-white/90 backdrop-blur-md rounded-2xl px-8 py-5 shadow-xl border border-black/5 text-center z-10"
            >
              <div className="font-semibold text-[#0d0d0d] text-lg mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Interaktive Karte</div>
              <div className="text-sm text-gray-400 font-light">Verfügbar beim Launch</div>
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a9e74] animate-pulse" />
                <span className="text-xs text-[#1a9e74] font-medium">Bald live</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  { emoji: '📍', title: 'Produkte in der Nähe finden', desc: 'Gib ein was du suchst — Nearby zeigt dir sofort wo es in deiner Umgebung erhältlich ist, mit Distanz und Öffnungszeiten.' },
  { emoji: '🛍️', title: 'Lokale Geschäfte entdecken', desc: 'Finde Bäckereien, Metzgereien, Boutiquen und mehr in deiner Nachbarschaft. Mit Profil, Bewertungen und Live-Sortiment.' },
  { emoji: '💳', title: 'Digitale Wallet', desc: 'Alle Treuekarten, Cumulus-Punkte und Gutscheine an einem Ort. Immer dabei, nie vergessen.' },
  { emoji: '⚡', title: 'Sofort verfügbar', desc: 'Kein Warten auf die Lieferung. Was du heute brauchst, holst du heute — direkt um die Ecke.' },
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
  { value: '6', label: 'Produktkategorien' },
  { value: 'CH', label: 'Ganze Schweiz abgedeckt' },
  { value: 'Ø 2 Tage', label: 'schneller als Online-Lieferung' },
  { value: '< 5 km', label: 'Ø Distanz zum Produkt' },
]

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ComingSoonPage() {
  return (
    <div className="bg-white overflow-x-hidden">

      {/* NAVBAR */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 bg-white/75 backdrop-blur-xl border-b border-gray-100/60"
        style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}
      >
        <div className="font-semibold text-2xl text-[#0d0d0d] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Nearby</div>
        <motion.div className="hidden sm:flex items-center gap-2 text-sm text-gray-400"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#1a9e74] animate-pulse" />
          Coming Soon
        </motion.div>
      </motion.nav>

      {/* HERO */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center px-6"
        style={{ background: 'linear-gradient(160deg, #2dbd8a 0%, #1a9e74 45%, #147a5a 100%)' }}>

        {/* Animated blobs */}
        <motion.div className="absolute pointer-events-none rounded-full"
          style={{ width: 700, height: 700, left: '-18%', top: '-22%', background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }}
          animate={{ y: [0, -50, 0], x: [0, 40, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute pointer-events-none rounded-full"
          style={{ width: 500, height: 500, right: '-12%', bottom: '-18%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }}
          animate={{ y: [0, 50, 0], x: [0, -40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute pointer-events-none rounded-full"
          style={{ width: 300, height: 300, right: '20%', top: '15%', background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ y: [0, -30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />

        <motion.div className="relative z-10 text-center max-w-3xl w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-8 tracking-wide backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Bald verfügbar in der Schweiz
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-semibold text-[#0d0d0d] tracking-tight leading-[0.9] mb-6"
            style={{ fontSize: 'clamp(5rem, 14vw, 11rem)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Nearby.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-white/90 text-xl md:text-2xl font-light leading-relaxed max-w-xl mx-auto mb-3"
            style={{ letterSpacing: '-0.01em' }}>
            Lokales Einkaufen, neu gedacht.
          </motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
            className="text-white/60 text-base font-light leading-relaxed max-w-lg mx-auto mb-12">
            Entdecke Produkte aus lokalen Geschäften direkt in deiner Nähe — frisch, sofort verfügbar, ohne Liefergebühren.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }} className="flex justify-center">
            <EmailSignup variant="dark" />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ opacity: { delay: 1.8 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </section>

      {/* WARUM NEARBY */}
      <section className="px-6 md:px-12 py-28 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-5 font-medium">Die Vision</p>
          <h2 className="font-semibold text-[#0d0d0d] tracking-tight leading-tight mb-10"
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Warum Nearby?
          </h2>
          <div className="space-y-6 max-w-3xl">
            <p className="text-2xl md:text-3xl font-medium text-[#0d0d0d] leading-snug" style={{ letterSpacing: '-0.02em' }}>
              Das Produkt das du suchst liegt oft nur 500 Meter entfernt. Du weisst es bloss nicht.
            </p>
            <p className="text-gray-500 font-light leading-relaxed text-lg">
              89% der Schweizer:innen kaufen lieber lokal als online — aber sie finden die lokalen Angebote nicht. Also wird online bestellt — oft im Ausland. Dabei wäre das gleiche Produkt direkt um die Ecke verfügbar.
            </p>
            <p className="text-gray-500 font-light leading-relaxed text-lg">
              Über <strong className="text-[#0d0d0d] font-medium">600'000 Läden, Hofläden und Bäckereien</strong> in der Schweiz haben kein digitales Schaufenster. Nearby gibt ihnen eines — und dir die Möglichkeit, ihr Angebot in Sekunden zu finden.
            </p>
            <p className="text-gray-500 font-light leading-relaxed text-lg">
              Kein Warten. Keine Liefergebühren. Einfach suchen, hingehen, kaufen.
            </p>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="border-y border-gray-100/80" style={{ background: '#fafaf8' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 max-w-5xl mx-auto">
          {stats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
              className="p-10 md:p-14 border-r border-gray-100 last:border-r-0 [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r text-center group">
              <div className="font-bold text-4xl md:text-5xl tracking-tight mb-2 transition-colors duration-300 group-hover:text-[#1a9e74]"
                style={{ color: '#1a9e74', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{s.value}</div>
              <div className="text-sm text-gray-400 font-light leading-snug">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 md:px-12 py-28 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-5 font-medium">Für Käufer</p>
          <h2 className="font-semibold text-[#0d0d0d] tracking-tight leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Alles was du suchst —<br />
            <span className="text-gray-300 font-light" style={{ fontFamily: 'DM Sans, sans-serif' }}>direkt um die Ecke.</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-2xl p-7 border border-gray-100 transition-shadow duration-300"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <span className="text-3xl mb-5 block">{f.emoji}</span>
              <h3 className="font-semibold text-[#0d0d0d] text-lg mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MAP SHOWCASE */}
      <section className="px-6 md:px-12 py-28" style={{ background: '#fafaf8' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-5 font-medium">Vorschau</p>
            <h2 className="font-semibold text-[#0d0d0d] tracking-tight leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Deine Nachbarschaft auf einen Blick.
            </h2>
            <p className="text-gray-400 font-light max-w-md mx-auto text-base">
              Die interaktive Karte zeigt dir alle Geschäfte in deiner Umgebung — mit Sortiment, Distanz und Öffnungszeiten.
            </p>
          </motion.div>
          <MapShowcase />
        </div>
      </section>

      {/* FÜR UNTERNEHMEN */}
      <section className="px-6 md:px-12 py-28" style={{ background: '#0d0d0d' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-xs uppercase tracking-[0.15em] text-[#1a9e74] mb-5 font-medium">Für Unternehmen</p>
            <h2 className="font-semibold text-white tracking-tight leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Zeig der Welt,<br />was du anbietest.
            </h2>
            <p className="text-white/50 font-light leading-relaxed max-w-xl mb-12 text-lg">
              Nearby gibt lokalen Geschäften eine digitale Bühne — einfach, schnell und ohne technische Hürden.
            </p>
            <div className="grid md:grid-cols-2 gap-3 mb-14">
              {bizFeatures.map((feature, i) => (
                <motion.div key={feature}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-5 py-4 transition-colors hover:bg-white/8">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1a9e74] flex-shrink-0" />
                  <span className="text-white/80 text-sm font-light">{feature}</span>
                </motion.div>
              ))}
            </div>
            <EmailSignup variant="dark" />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-28">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-5 font-medium">Launch</p>
            <h2 className="font-semibold text-[#0d0d0d] tracking-tight leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Sei beim Start dabei.
            </h2>
            <p className="text-gray-400 font-light leading-relaxed max-w-sm mx-auto mb-10">
              Erfahre als Erstes, wann Nearby in deiner Region live geht.
            </p>
            <div className="flex justify-center">
              <EmailSignup variant="light" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 px-6 md:px-12 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="font-semibold text-xl text-[#0d0d0d] tracking-tight mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Nearby</div>
            <p className="text-xs text-gray-400">© 2025 Nearby · Zug, Schweiz</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-xs uppercase tracking-[0.12em] text-gray-400 font-medium">Kontakt</p>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-[#0d0d0d] font-medium">Etienne Zogg</p>
                <p className="text-sm text-gray-400 font-light">Gründer & Entwickler</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#1a9e74]/10 flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a9e74" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>
            <a href="mailto:etienne.zogg@yahoo.com"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#1a9e74] transition-colors group">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors">
                <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              etienne.zogg@yahoo.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
