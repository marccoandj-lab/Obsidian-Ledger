'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase/config'
import { collection, addDoc } from 'firebase/firestore'
import TopBar from '@/components/TopBar'

const icons = [
  { key: 'directions_car', label: 'Car' },
  { key: 'beach_access', label: 'Vacation' },
  { key: 'account_balance', label: 'Investment' },
  { key: 'home', label: 'Home' },
  { key: 'school', label: 'Education' },
  { key: 'diamond', label: 'Luxury' },
  { key: 'health_and_safety', label: 'Health' },
  { key: 'rocket_launch', label: 'Business' },
  { key: 'savings', label: 'Savings' },
  { key: 'flag', label: 'Custom' },
]

const colorOptions = [
  { key: 'primary', label: 'Emerald', hex: '#aaffdc' },
  { key: 'secondary', label: 'Violet', hex: '#929bfa' },
  { key: 'tertiary', label: 'Cyan', hex: '#7ae6ff' },
] as const

export default function NewGoalPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [icon, setIcon] = useState('flag')
  const [color, setColor] = useState<'primary' | 'secondary' | 'tertiary'>('primary')
  const [targetAmount, setTargetAmount] = useState('')
  const [currentAmount, setCurrentAmount] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !targetAmount) {
      setError('Title and target amount are required.')
      return
    }
    setSaving(true)
    setError(null)

    const user = auth.currentUser
    if (!user) { router.push('/login'); return }

    try {
      await addDoc(collection(db, 'goals'), {
        user_id: user.uid,
        title,
        subtitle: subtitle || null,
        icon,
        color,
        target_amount: parseFloat(targetAmount),
        current_amount: parseFloat(currentAmount || '0'),
        target_date: targetDate || null,
        created_at: new Date().toISOString()
      })
      router.push('/goals')
    } catch(err: any) {
      setError(err.message)
      setSaving(false)
    }
  }

  const selectedColor = colorOptions.find(c => c.key === color)!

  const inputCls = "w-full bg-[#201f1f] border-none rounded-xl py-4 px-5 text-white placeholder:text-[#494847] font-medium focus:ring-1 focus:ring-[#aaffdc] outline-none"

  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen">
      <TopBar title="New Goal" showBack backHref="/goals" />

      <main className="pt-20 pb-32 max-w-lg mx-auto px-6">
        <div className="mb-8 pt-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Forge a Target
          </h2>
          <p className="text-[#adaaaa] mt-1">Define your next financial milestone.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-[#9f0519]/20 border border-[#ff716c]/30 rounded-xl px-4 py-3 text-[#ff716c] text-sm">
              {error}
            </div>
          )}

          {/* Icon Picker */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest">Icon</label>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {icons.map(i => (
                <button
                  key={i.key}
                  type="button"
                  id={`icon-${i.key}`}
                  onClick={() => setIcon(i.key)}
                  className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    icon === i.key
                      ? 'border-2 scale-110'
                      : 'bg-[#262626] hover:bg-[#2c2c2c]'
                  }`}
                  style={icon === i.key ? {
                    borderColor: selectedColor.hex,
                    background: `${selectedColor.hex}15`,
                    color: selectedColor.hex,
                  } : {}}
                >
                  <span className="material-symbols-outlined text-2xl">{i.key}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest">Color Theme</label>
            <div className="flex gap-3">
              {colorOptions.map(c => (
                <button
                  key={c.key}
                  type="button"
                  id={`color-${c.key}`}
                  onClick={() => setColor(c.key)}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                    color === c.key ? 'scale-105' : 'opacity-60 hover:opacity-80'
                  }`}
                  style={{
                    background: `${c.hex}20`,
                    color: c.hex,
                    border: color === c.key ? `2px solid ${c.hex}` : '2px solid transparent',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest px-1">Goal Name</label>
            <input
              id="goal-title"
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="New Car, Vacation Fund…"
              className={inputCls}
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest px-1">Subtitle (optional)</label>
            <input
              id="goal-subtitle"
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="Porsche Taycan Fund, Amalfi Coast…"
              className={inputCls}
            />
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest px-1">Target Amount ($)</label>
              <input
                id="goal-target"
                type="number"
                min="1"
                step="0.01"
                required
                value={targetAmount}
                onChange={e => setTargetAmount(e.target.value)}
                placeholder="120,000"
                className={inputCls}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest px-1">Current Amount ($)</label>
              <input
                id="goal-current"
                type="number"
                min="0"
                step="0.01"
                value={currentAmount}
                onChange={e => setCurrentAmount(e.target.value)}
                placeholder="0"
                className={inputCls}
              />
            </div>
          </div>

          {/* Target Date */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest px-1">Target Date (optional)</label>
            <input
              id="goal-date"
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Preview */}
          {title && targetAmount && (
            <div
              className="p-5 rounded-xl border relative overflow-hidden"
              style={{ borderColor: `${selectedColor.hex}30`, background: `${selectedColor.hex}08` }}
            >
              <p className="text-xs text-[#adaaaa] uppercase tracking-widest mb-3">Preview</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${selectedColor.hex}20`, color: selectedColor.hex }}
                >
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div>
                  <p className="font-bold text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>{title}</p>
                  {subtitle && <p className="text-xs text-[#adaaaa]">{subtitle}</p>}
                </div>
                <div className="ml-auto text-right">
                  <p className="font-bold" style={{ color: selectedColor.hex, fontFamily: 'Manrope, sans-serif' }}>
                    ${parseFloat(currentAmount || '0').toLocaleString()}
                  </p>
                  <p className="text-xs text-[#adaaaa]">of ${parseFloat(targetAmount).toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4 h-2 w-full bg-[#262626] rounded-full">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(((parseFloat(currentAmount || '0') / parseFloat(targetAmount)) * 100), 100)}%`,
                    background: selectedColor.hex,
                  }}
                />
              </div>
            </div>
          )}
        </form>
      </main>

      {/* Save Footer */}
      <footer className="fixed bottom-0 left-0 w-full p-6 z-50"
        style={{ background: 'linear-gradient(to top, #0e0e0e, rgba(14,14,14,0.9), transparent)' }}>
        <button
          id="goal-save"
          onClick={handleSubmit as any}
          disabled={saving}
          className="w-full h-16 rounded-2xl text-[#004734] font-extrabold text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
          style={{
            fontFamily: 'Manrope, sans-serif',
            background: 'linear-gradient(90deg, #aaffdc, #00fdc1)',
            boxShadow: '0 12px 24px rgba(0,253,193,0.3)',
          }}
        >
          {saving ? 'Creating…' : 'Create Goal'}
        </button>
      </footer>
    </div>
  )
}
