'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase/config'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export default function RegisterForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (!agreed) {
      setError('Please accept the Terms of Service.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      await updateProfile(user, { displayName: fullName })
      
      await setDoc(doc(db, 'profiles', user.uid), {
        full_name: fullName,
        avatar_url: null,
        current_balance: 0,
        currency: 'USD',
        wins: 0,
        games_played: 0,
        total_capital: 0,
        character_usage: {},
        created_at: new Date().toISOString(),
      })

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const inputCls = "w-full bg-[#201f1f] border-none rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-[#494847] focus:ring-2 focus:ring-[#aaffdc]/50 transition-all outline-none"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-[#9f0519]/20 border border-[#ff716c]/30 rounded-xl px-4 py-3 text-[#ff716c] text-sm">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-widest text-[#adaaaa] ml-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          Full Name
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#adaaaa] text-xl">person</span>
          <input id="register-name" type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
            placeholder="Julian Obsidian" className={inputCls} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-widest text-[#adaaaa] ml-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          Email Address
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#adaaaa] text-xl">mail</span>
          <input id="register-email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="julian@obsidian.com" className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest text-[#adaaaa] ml-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Password
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#adaaaa] text-xl">lock</span>
            <input id="register-password" type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" className={inputCls} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest text-[#adaaaa] ml-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Confirm
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#adaaaa] text-xl">shield</span>
            <input id="register-confirm" type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••" className={inputCls} />
          </div>
        </div>
      </div>

      <div className="flex items-start space-x-3 py-2">
        <input
          id="register-terms"
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          className="w-5 h-5 rounded border-[#494847]/20 bg-[#262626] text-[#aaffdc] focus:ring-[#aaffdc]/30 mt-0.5"
        />
        <label htmlFor="register-terms" className="text-sm text-[#adaaaa] leading-tight">
          I accept the{' '}
          <a href="#" className="text-[#929bfa] hover:underline transition-all">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-[#929bfa] hover:underline transition-all">Privacy Policy</a>
        </label>
      </div>

      <button
        id="register-submit"
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl text-white font-bold text-lg mt-4 hover:scale-[1.02] active:scale-[0.98] transition-all duration-400 disabled:opacity-60"
        style={{
          fontFamily: 'Manrope, sans-serif',
          background: 'linear-gradient(135deg, #929bfa 0%, #343d96 100%)',
          boxShadow: '0 8px 20px rgba(146,155,250,0.3)',
        }}
      >
        {loading ? 'Creating Vault…' : 'Initialize Vault'}
      </button>
    </form>
  )
}
