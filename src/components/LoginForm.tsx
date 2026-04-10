'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-[#9f0519]/20 border border-[#ff716c]/30 rounded-xl px-4 py-3 text-[#ff716c] text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2 group">
        <label className="text-xs uppercase tracking-widest text-[#adaaaa] group-focus-within:text-[#aaffdc] transition-colors"
          style={{ fontFamily: 'Inter, sans-serif' }}>
          Email Address
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="name@domain.com"
          className="w-full bg-[#201f1f] border-none rounded-xl px-4 py-4 text-white placeholder:text-[#494847] focus:ring-1 focus:ring-[#aaffdc] transition-all duration-300 outline-none"
        />
      </div>

      <div className="space-y-2 group">
        <div className="flex justify-between items-end">
          <label className="text-xs uppercase tracking-widest text-[#adaaaa] group-focus-within:text-[#aaffdc] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            Password
          </label>
          <a href="#" className="text-xs font-medium text-[#929bfa] hover:text-white transition-colors duration-400">
            Forgot Password?
          </a>
        </div>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="w-full bg-[#201f1f] border-none rounded-xl px-4 py-4 text-white placeholder:text-[#494847] focus:ring-1 focus:ring-[#aaffdc] transition-all duration-300 outline-none"
        />
      </div>

      <button
        id="login-submit"
        type="submit"
        disabled={loading}
        className="w-full relative group overflow-hidden rounded-xl py-4 transition-all duration-400 active:scale-[0.98] disabled:opacity-60"
        style={{
          background: 'linear-gradient(135deg, #929bfa, #343d96)',
          boxShadow: '0 8px 24px rgba(146,155,250,0.2)',
        }}
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="relative font-bold tracking-wide text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {loading ? 'Signing in…' : 'Sign In to Ledger'}
        </span>
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#aaffdc] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
      </button>
    </form>
  )
}
