'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase/config'
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore'
import { CATEGORIES, TransactionType, TransactionCategory } from '@/lib/types'
import TopBar from '@/components/TopBar'

export default function AddTransactionPage() {
  const router = useRouter()

  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('0')
  const [category, setCategory] = useState<TransactionCategory>('food')
  const [wallet, setWallet] = useState('Personal Card')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleKeyPress = useCallback((key: string) => {
    setAmount(prev => {
      if (key === '⌫') {
        const next = prev.slice(0, -1) || '0'
        return next
      }
      if (key === '.' && prev.includes('.')) return prev
      if (prev === '0' && key !== '.') return key
      if (prev.includes('.') && prev.split('.')[1]!.length >= 2) return prev
      return prev + key
    })
  }, [])

  async function handleSave() {
    const numAmount = parseFloat(amount)
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount.')
      return
    }
    setSaving(true)
    setError(null)

    const user = auth.currentUser
    if (!user) { router.push('/login'); return }

    try {
      await addDoc(collection(db, 'transactions'), {
        user_id: user.uid,
        amount: numAmount,
        type,
        category,
        wallet,
        note: note || null,
        date,
        created_at: new Date().toISOString()
      })

      // Update balance
      const profRef = doc(db, 'profiles', user.uid)
      const profSnap = await getDoc(profRef)
      if (profSnap.exists()) {
        const data = profSnap.data()
        const currentBalance = data.current_balance ?? 0
        const newBalance = type === 'income' ? currentBalance + numAmount : currentBalance - numAmount
        await updateDoc(profRef, { current_balance: newBalance })
      }

      router.push('/transactions')
    } catch (err: any) {
      setError(err.message)
      setSaving(false)
    }
  }

  const displayAmount = parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: amount.includes('.') ? (amount.split('.')[1]?.length ?? 0) : 0,
    maximumFractionDigits: 2,
  })

  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen">
      <TopBar title="Add Transaction" showBack backHref="/transactions" />

      <main className="pt-20 pb-32 max-w-lg mx-auto px-6">
        {/* Header Card */}
        <section className="relative h-40 mb-8 rounded-2xl overflow-hidden">
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #131313 0%, #262626 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, #0e0e0e, transparent)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-6xl"
              style={{ color: '#aaffdc', fontVariationSettings: "'FILL' 1, 'wght' 200, 'GRAD' 0, 'opsz' 48", opacity: 0.3 }}
            >
              account_balance_wallet
            </span>
          </div>
          <div className="absolute bottom-4 left-6">
            <span className="text-[#929bfa] font-bold tracking-widest uppercase text-sm"
              style={{ fontFamily: 'Manrope, sans-serif' }}>
              Transaction Details
            </span>
          </div>
        </section>

        {/* Type + Amount */}
        <section className="mb-10 text-center">
          {/* Type Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#131313] p-1 rounded-xl flex items-center gap-1">
              {(['expense', 'income'] as TransactionType[]).map(t => (
                <button
                  key={t}
                  id={`type-${t}`}
                  onClick={() => setType(t)}
                  className={`px-8 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
                    type === t
                      ? 'bg-[#262626] text-[#aaffdc]'
                      : 'text-[#adaaaa] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Display Amount */}
          <div className="inline-flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[#adaaaa]" style={{ fontFamily: 'Manrope, sans-serif' }}>$</span>
            <div
              className="text-7xl font-extrabold tracking-tighter text-white"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              {displayAmount}
            </div>
          </div>
        </section>

        {/* Keypad */}
        <section className="grid grid-cols-4 gap-3 mb-10">
          {['1','2','3','⌫','4','5','6','+','7','8','9','-','.','0'].map(key => (
            <button
              key={key}
              id={`keypad-${key}`}
              onClick={() => handleKeyPress(key === '+' || key === '-' ? '' : key === '⌫' ? '⌫' : key)}
              className={`h-16 flex items-center justify-center rounded-2xl transition-colors font-bold ${
                key === '⌫' || key === '+' || key === '-'
                  ? 'text-[#aaffdc] hover:bg-[#131313] text-xl'
                  : 'text-white text-2xl hover:bg-[#2c2c2c]'
              }`}
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              {key === '⌫' ? <span className="material-symbols-outlined text-3xl">backspace</span> : key}
            </button>
          ))}
          {/* Confirm button spans 2 cols */}
          <button
            id="keypad-confirm"
            onClick={handleSave}
            disabled={saving}
            className="h-16 col-span-2 flex items-center justify-center rounded-2xl font-bold text-2xl text-white disabled:opacity-60 transition-all hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #7c3aed)',
              boxShadow: '0 0 20px rgba(139,92,246,0.3)',
              fontFamily: 'Manrope, sans-serif',
            }}
          >
            {saving ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              <span className="material-symbols-outlined">done_all</span>
            )}
          </button>
        </section>

        {/* Fields */}
        <section className="space-y-8">
          {/* Category */}
          <div>
            <h3 className="text-xs font-bold text-[#adaaaa] uppercase tracking-widest mb-4">
              Select Category
            </h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  id={`cat-${cat.key}`}
                  onClick={() => setCategory(cat.key)}
                  className="flex-shrink-0 flex flex-col items-center gap-2"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                      category === cat.key
                        ? `${cat.bgColor} border-2 border-current ${cat.color}`
                        : 'bg-[#262626] text-white hover:bg-[#2c2c2c]'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-3xl ${category === cat.key ? cat.color : ''}`}>
                      {cat.icon}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#adaaaa] uppercase">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date + Wallet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest px-1">Date</label>
              <div className="relative">
                <input
                  id="add-tx-date"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-[#201f1f] border-none rounded-xl py-4 px-5 text-white font-medium focus:ring-1 focus:ring-[#aaffdc] outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest px-1">Wallet</label>
              <div className="relative">
                <select
                  id="add-tx-wallet"
                  value={wallet}
                  onChange={e => setWallet(e.target.value)}
                  className="w-full bg-[#201f1f] border-none rounded-xl py-4 px-5 text-white font-medium focus:ring-1 focus:ring-[#aaffdc] outline-none appearance-none"
                >
                  <option>Personal Card</option>
                  <option>Business Account</option>
                  <option>Cash</option>
                  <option>Savings</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#adaaaa] pointer-events-none">
                  account_balance_wallet
                </span>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest px-1">Note</label>
            <textarea
              id="add-tx-note"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="What was this for?"
              rows={3}
              className="w-full bg-[#201f1f] border-none rounded-xl py-4 px-5 text-white placeholder:text-[#494847] font-medium focus:ring-1 focus:ring-[#aaffdc] outline-none resize-none"
            />
          </div>

          {error && (
            <div className="bg-[#9f0519]/20 border border-[#ff716c]/30 rounded-xl px-4 py-3 text-[#ff716c] text-sm">
              {error}
            </div>
          )}
        </section>
      </main>

      {/* Save Footer */}
      <footer className="fixed bottom-0 left-0 w-full p-6 z-50"
        style={{ background: 'linear-gradient(to top, #0e0e0e, rgba(14,14,14,0.9), transparent)' }}>
        <button
          id="add-tx-save"
          onClick={handleSave}
          disabled={saving}
          className="w-full h-16 rounded-2xl text-white font-extrabold text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
          style={{
            fontFamily: 'Manrope, sans-serif',
            background: 'linear-gradient(90deg, #8B5CF6, #7c3aed)',
            boxShadow: '0 12px 24px rgba(139,92,246,0.3)',
          }}
        >
          {saving ? 'Saving…' : 'Save Transaction'}
        </button>
      </footer>
    </div>
  )
}
