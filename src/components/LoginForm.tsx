'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase/config'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleGoogleSignIn() {
    try {
      setLoading(true)
      setError(null)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      // Ensure Google users have a profile in Firestore (creation if first time)
      if (result.user) {
        const userRef = doc(db, 'profiles', result.user.uid)
        const userSnap = await getDoc(userRef)
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            id: result.user.uid,
            full_name: result.user.displayName || 'Google User',
            avatar_url: result.user.photoURL || '',
            current_balance: 100000,
            currency: 'USD',
            wins: 0,
            games_played: 0,
            total_capital: 100000,
            character_usage: {},
            created_at: new Date().toISOString()
          })
        }
      }
      
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

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
    <div className="space-y-6">
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

      {/* Divider */}
      <div className="flex items-center gap-4 py-2 opacity-60">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#494847] to-transparent" />
        <span className="text-[10px] uppercase tracking-widest text-[#adaaaa] font-bold">
          Or continue with
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#494847] to-transparent" />
      </div>

      {/* Google Login Button */}
      <div className="grid grid-cols-1 gap-4">
        <button
          id="login-google"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex items-center justify-center gap-3 bg-white/5 border border-[#494847]/30 hover:border-[#aaffdc]/40 hover:bg-[#aaffdc]/10 hover:-translate-y-0.5 rounded-xl py-3.5 transition-all duration-300 group disabled:opacity-50"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold tracking-wide text-white">Continue with Google</span>
        </button>
      </div>
    </div>
  )
}
