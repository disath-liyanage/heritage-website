'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Incorrect email or password.')
      setLoading(false)
      return
    }

    router.push('/admin/menu')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-xs uppercase tracking-[0.25em] text-[#6A5A43] mb-2">
          Heritage Family Restaurant
        </p>
        <h1 className="font-display text-4xl text-[#1F2D21] mb-8">Admin</h1>

        <div className="rounded-2xl border border-[#D8CCB8] bg-[#FFF9F0] p-6 shadow-sm space-y-4">
          {error && (
            <p className="text-red-700 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div>
            <label className="text-sm text-[#6A5A43] block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              autoFocus
              className="w-full px-3 py-2 bg-white text-[#1F2D21] rounded-lg border border-[#D8CCB8] focus:outline-none focus:border-[#4A7C59] transition text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-[#6A5A43] block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full px-3 py-2 bg-white text-[#1F2D21] rounded-lg border border-[#D8CCB8] focus:outline-none focus:border-[#4A7C59] transition text-sm"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-2.5 bg-[#2A3A2D] hover:bg-[#1F2D21] text-white font-semibold rounded-lg transition text-sm disabled:opacity-50 mt-2"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </div>
      </div>
    </main>
  )
}