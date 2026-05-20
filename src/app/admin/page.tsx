'use client'

import { useState, useEffect, useCallback } from 'react'

const kantone = [
  'Aargau','Appenzell Ausserrhoden','Appenzell Innerrhoden','Basel-Landschaft','Basel-Stadt',
  'Bern','Fribourg','Genf','Glarus','Graubünden','Jura','Luzern','Neuenburg','Nidwalden',
  'Obwalden','Schaffhausen','Schwyz','Solothurn','St. Gallen','Tessin','Thurgau','Uri',
  'Waadt','Wallis','Zug','Zürich',
]

type Entry = {
  id: string
  name: string | null
  email: string
  kanton: string | null
  gemeinde: string | null
  role: string
  created_at: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function exportCsv(data: Entry[]) {
  const header = 'Name,E-Mail,Kanton,Gemeinde,Rolle,Datum'
  const rows = data.map(e =>
    [e.name ?? '', e.email, e.kanton ?? '', e.gemeinde ?? '', e.role, formatDate(e.created_at)]
      .map(v => `"${v.replace(/"/g, '""')}"`)
      .join(',')
  )
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [data, setData] = useState<Entry[]>([])
  const [loading, setLoading] = useState(false)
  const [filterKanton, setFilterKanton] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [adminKey, setAdminKey] = useState('')

  const fetchData = useCallback(async (key: string, kanton: string, role: string) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (kanton) params.set('kanton', kanton)
    if (role) params.set('role', role)
    const res = await fetch(`/api/admin/waitlist?${params}`, {
      headers: { 'x-admin-key': key },
    })
    setLoading(false)
    if (!res.ok) return
    const json = await res.json()
    setData(json.data ?? [])
  }, [])

  const handleLogin = async () => {
    setAuthError('')
    const res = await fetch('/api/admin/waitlist', {
      headers: { 'x-admin-key': password },
    })
    if (res.status === 401) {
      setAuthError('Falsches Passwort.')
      return
    }
    const json = await res.json()
    setAdminKey(password)
    setData(json.data ?? [])
    setAuthed(true)
  }

  useEffect(() => {
    if (authed) fetchData(adminKey, filterKanton, filterRole)
  }, [authed, adminKey, filterKanton, filterRole, fetchData])

  if (!authed) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="font-syne font-extrabold text-white text-3xl mb-2">Nearby</div>
          <p className="text-white/40 text-sm mb-8">Admin · Waitlist</p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Passwort"
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-green/50 mb-3"
          />
          {authError && <p className="text-red-400 text-xs mb-3">{authError}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-green text-white py-3.5 rounded-2xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Anmelden →
          </button>
        </div>
      </div>
    )
  }

  const roleCounts = {
    total: data.length,
    kunde: data.filter(e => e.role === 'kunde').length,
    verkäufer: data.filter(e => e.role === 'verkäufer').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <span className="font-syne font-extrabold text-ink text-xl">Nearby</span>
          <span className="text-gray-400 text-sm ml-2">· Waitlist Admin</span>
        </div>
        <button
          onClick={() => exportCsv(data)}
          className="text-xs text-green border border-green/30 px-4 py-2 rounded-xl hover:bg-green/5 transition-colors"
        >
          CSV exportieren
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: roleCounts.total },
            { label: 'Kunden', value: roleCounts.kunde },
            { label: 'Verkäufer', value: roleCounts.verkäufer },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-6 py-5">
              <div className="text-3xl font-syne font-extrabold text-ink">{s.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <select
            value={filterKanton}
            onChange={e => setFilterKanton(e.target.value)}
            className="bg-white border border-gray-200 text-ink rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green/40 cursor-pointer"
          >
            <option value="">Alle Kantone</option>
            {kantone.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="bg-white border border-gray-200 text-ink rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green/40 cursor-pointer"
          >
            <option value="">Alle Rollen</option>
            <option value="kunde">Kunden</option>
            <option value="verkäufer">Verkäufer</option>
          </select>
          {(filterKanton || filterRole) && (
            <button
              onClick={() => { setFilterKanton(''); setFilterRole('') }}
              className="text-xs text-gray-400 hover:text-ink transition-colors px-3"
            >
              Filter zurücksetzen
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="text-center text-gray-400 text-sm py-12">Laden…</div>
          ) : data.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-12">Keine Einträge gefunden.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Name', 'E-Mail', 'Kanton', 'Gemeinde', 'Rolle', 'Datum'].map(h => (
                    <th key={h} className="text-left text-xs uppercase tracking-widest text-gray-400 px-5 py-3.5 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((e, i) => (
                  <tr key={e.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-5 py-3.5 text-ink font-medium">{e.name ?? '—'}</td>
                    <td className="px-5 py-3.5 text-gray-600">{e.email}</td>
                    <td className="px-5 py-3.5 text-gray-600">{e.kanton ?? '—'}</td>
                    <td className="px-5 py-3.5 text-gray-500">{e.gemeinde ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        e.role === 'verkäufer'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-green-50 text-green-600'
                      }`}>
                        {e.role === 'verkäufer' ? 'Verkäufer' : 'Kunde'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDate(e.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
