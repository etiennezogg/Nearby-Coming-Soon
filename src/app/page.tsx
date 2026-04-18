'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function ComingSoonPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!email || !email.includes('@')) return
    setSubmitted(true)
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center px-6"
      style={{
        background: 'linear-gradient(160deg, #4ade80 0%, #22c55e 40%, #16a34a 100%)',
      }}
    >
      {/* Floating orbs */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 600, height: 600,
          left: '-15%', top: '-20%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ y: [0, -40, 0], x: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 500, height: 500,
          right: '-10%', bottom: '-15%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 300, height: 300,
          left: '50%', top: '60%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(0,0,0,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl w-full"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-8 tracking-wide backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Coming Soon
        </motion.div>

        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-syne font-extrabold text-ink tracking-tight leading-[0.92] mb-6"
          style={{ fontSize: 'clamp(5rem, 14vw, 11rem)' }}
        >
          Nearby.
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="text-white/85 text-lg md:text-xl font-light leading-relaxed max-w-lg mx-auto mb-4"
        >
          Lokales Einkaufen, neu gedacht.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="text-white/65 text-base font-light leading-relaxed max-w-md mx-auto mb-12"
        >
          Entdecke Produkte aus lokalen Geschäften direkt in deiner Nähe — frisch, nachhaltig, ohne Liefergebühren.
        </motion.p>

        {/* Email signup */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="max-w-md mx-auto mb-16"
        >
          {!submitted ? (
            <div>
              <p className="text-white/70 text-sm mb-4">
                Erfahre als Erstes wenn Nearby live geht.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="deine@email.ch"
                  className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-white/40 placeholder-white/50 shadow-lg"
                />
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  className="bg-ink text-white px-7 py-3.5 rounded-full text-sm font-medium font-dm shadow-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  Benachrichtigen →
                </motion.button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 280 }}
              className="inline-flex items-center gap-2.5 bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3.5 rounded-full text-sm font-medium shadow-lg"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Merci — wir melden uns!
            </motion.div>
          )}
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="flex flex-wrap gap-2.5 justify-center mb-16"
        >
          {[
            'Produkte in der Nähe finden',
            'Lokale Geschäfte entdecken',
            'Digitale Wallet',
            'Nachhaltig einkaufen',
          ].map((pill, i) => (
            <motion.span
              key={pill}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 + i * 0.08, type: 'spring', stiffness: 280 }}
              className="bg-white/12 border border-white/20 text-white/80 text-xs px-4 py-2 rounded-full backdrop-blur-sm"
            >
              {pill}
            </motion.span>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-white/40 text-xs"
        >
          © 2025 Nearby AG · Zürich, Schweiz
        </motion.div>
      </motion.div>
    </div>
  )
}
