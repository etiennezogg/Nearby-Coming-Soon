import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// In-memory rate limiter: ip -> list of submission timestamps
const rateLimitMap = new Map<string, number[]>()
const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_PER_WINDOW = 3

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (rateLimitMap.get(ip) ?? []).filter(t => now - t < WINDOW_MS)
  if (timestamps.length >= MAX_PER_WINDOW) return true
  rateLimitMap.set(ip, [...timestamps, now])
  return false
}

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'rate_limit' }, { status: 429 })
  }

  const body = await req.json()

  // Honeypot: bots fill this field, real users don't
  if (body.website) {
    return NextResponse.json({ ok: true })
  }

  const { name, email, kanton, gemeinde, role } = body

  if (!name?.trim() || !email?.includes('@') || !kanton) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  const { error } = await supabase.from('waitlist').insert({
    name: name.trim(),
    email,
    kanton,
    gemeinde: gemeinde || null,
    role,
  })

  if (error?.code === '23505') {
    return NextResponse.json({ ok: true }) // already registered
  }
  if (error) {
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
