import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const key = req.headers.get('x-admin-key')
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { searchParams } = new URL(req.url)
  const kanton = searchParams.get('kanton')
  const role = searchParams.get('role')

  let query = supabase.from('waitlist').select('*').order('created_at', { ascending: false })
  if (kanton) query = query.eq('kanton', kanton)
  if (role) query = query.eq('role', role)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: 'db_error' }, { status: 500 })

  return NextResponse.json({ data })
}
