'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { adminLogin, saveSession, getToken } from '@/lib/admin-api'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    if (getToken()) router.replace('/admin')
  }, [router])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await adminLogin({ username: username.trim(), password })
      saveSession(res.token, res.username)
      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-950/40 shadow-[0_0_20px_rgba(124,58,237,0.4)]">
            <img src="/logo_ecell.png" alt="E-Cell Logo" className="h-10 w-10 drop-shadow-[0_0_8px_rgba(124,58,237,0.7)]" />
          </div>
          <div className="text-center">
            <h1 className="font-heading text-xl font-extrabold text-white flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-5 w-5 text-[#00f0ff]" /> Admin Portal
            </h1>
            <p className="text-xs text-violet-300 tracking-widest uppercase mt-1 font-semibold">EntreVerse 2026</p>
          </div>
        </div>

        <div
          className="glass rounded-2xl p-8 shadow-2xl backdrop-blur-2xl border border-violet-500/30"
          style={{ boxShadow: '0 0 40px rgba(124,58,237,0.2), 0 24px 48px -8px rgba(0,0,0,0.8)' }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent rounded-t-2xl" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="admin"
                  className="w-full rounded-xl border border-violet-500/25 bg-black/40 pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-[#00f0ff] focus:bg-violet-950/30 focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-violet-500/25 bg-black/40 pl-10 pr-12 py-3 text-sm text-white placeholder:text-slate-500 focus:border-[#00f0ff] focus:bg-violet-950/30 focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4 text-[#00f0ff]" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl btn-continuum px-4 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Restricted to authorized E-Cell IIT Kanpur personnel only.
        </p>
      </div>
    </div>
  )
}
