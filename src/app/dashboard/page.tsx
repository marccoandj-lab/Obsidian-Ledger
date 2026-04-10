'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, db } from '@/lib/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import TransactionCard from '@/components/TransactionCard'
import { Transaction, Profile, formatAmount } from '@/lib/types'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [monthlyExpense, setMonthlyExpense] = useState(0)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login')
        return
      }

      try {
        const profDoc = await getDoc(doc(db, 'profiles', user.uid))
        if(profDoc.exists()) setProfile({ id: profDoc.id, ...profDoc.data() } as Profile)

        const txsQuery = query(
          collection(db, 'transactions'),
          where('user_id', '==', user.uid),
          orderBy('date', 'desc'),
          limit(5)
        )
        const txsSnap = await getDocs(txsQuery)
        const txsData = txsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction))
        setTransactions(txsData)

        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        const monthlyQuery = query(
          collection(db, 'transactions'),
          where('user_id', '==', user.uid),
          where('date', '>=', startOfMonth)
        )
        const monthlySnap = await getDocs(monthlyQuery)
        let inc = 0, exp = 0
        monthlySnap.forEach(d => {
          const t = d.data() as Transaction
          if (t.type === 'income') inc += Number(t.amount)
          else exp += Number(t.amount)
        })
        setMonthlyIncome(inc)
        setMonthlyExpense(exp)

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    })
    return () => unsub()
  }, [router])

  if (loading) {
    return <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center text-[#aaffdc]">Loading...</div>
  }

  const balance = profile?.current_balance ?? 0
  const displayName = profile?.full_name ?? auth.currentUser?.email?.split('@')[0] ?? 'User'

  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen pb-24">
      <TopBar avatarUrl={profile?.avatar_url} />

      <main className="pt-24 px-6 max-w-5xl mx-auto space-y-12">
        {/* Hero Balance */}
        <section className="flex flex-col items-center text-center space-y-3">
          <span
            className="text-[#adaaaa] text-sm uppercase tracking-[0.2em]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Total Liquidity
          </span>
          <h1
            className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            {formatAmount(balance).split('.')[0]}
            <span className="text-[#00edb4]">.{formatAmount(balance).split('.')[1] ?? '00'}</span>
          </h1>
          <div
            className="flex items-center gap-2 font-medium px-3 py-1 rounded-full text-sm"
            style={{ color: '#aaffdc', background: 'rgba(170,255,220,0.1)' }}
          >
            <span className="material-symbols-outlined text-xs">trending_up</span>
            <span>+{monthlyIncome > 0 ? ((monthlyIncome / (balance || 1)) * 100).toFixed(1) : '0.0'}% this month</span>
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-[#131313] rounded-xl p-5">
            <p className="text-[#adaaaa] text-xs uppercase tracking-widest mb-2">Monthly Income</p>
            <p className="text-[#aaffdc] text-2xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>
              +{formatAmount(monthlyIncome)}
            </p>
          </div>
          <div className="bg-[#131313] rounded-xl p-5">
            <p className="text-[#adaaaa] text-xs uppercase tracking-widest mb-2">Monthly Expenses</p>
            <p className="text-[#ff716c] text-2xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>
              -{formatAmount(monthlyExpense)}
            </p>
          </div>
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Monthly Analytics Chart */}
          <div className="md:col-span-7 bg-[#131313] p-8 rounded-xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>Monthly Analytics</h3>
              <p className="text-[#adaaaa] text-sm mb-8">Detailed expenditure breakdown</p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-around gap-8">
              {/* SVG Donut Chart */}
              <div className="relative w-48 h-48 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle className="stroke-current text-[#262626]" cx="50" cy="50" fill="transparent" r="40" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" fill="transparent" r="40" strokeWidth="8"
                    stroke="#aaffdc" strokeDasharray="251.2" strokeDashoffset="75" strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 4px #aaffdc)' }}
                  />
                  <circle
                    cx="50" cy="50" fill="transparent" r="40" strokeWidth="8"
                    stroke="#929bfa" strokeDasharray="251.2" strokeDashoffset="180" strokeLinecap="round"
                  />
                  <circle
                    cx="50" cy="50" fill="transparent" r="40" strokeWidth="8"
                    stroke="#7ae6ff" strokeDasharray="251.2" strokeDashoffset="230" strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[#adaaaa] text-[10px] uppercase tracking-widest">Spent</span>
                  <span className="text-2xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {formatAmount(monthlyExpense).replace('$', '$')}
                  </span>
                </div>
              </div>
              {/* Legend */}
              <div className="space-y-4 w-full md:w-auto">
                {[
                  { color: '#aaffdc', label: 'Investments', percent: '45%' },
                  { color: '#929bfa', label: 'Living Expenses', percent: '30%' },
                  { color: '#7ae6ff', label: 'Luxury & Travel', percent: '15%' },
                  { color: '#262626', label: 'Others', percent: '10%' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="ml-auto text-[#adaaaa] text-xs">{item.percent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions + Black Card */}
          <div className="md:col-span-5 grid grid-cols-1 gap-6">
            <div className="bg-[#262626] p-6 rounded-xl border border-[#494847]/10">
              <h3 className="text-lg font-bold mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>Quick Actions</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: 'north_east', label: 'Send', color: '#aaffdc', hoverBg: '#aaffdc' },
                  { icon: 'south_west', label: 'Receive', color: '#929bfa', hoverBg: '#929bfa' },
                  { icon: 'payments', label: 'Pay', color: '#7ae6ff', hoverBg: '#7ae6ff' },
                ].map(action => (
                  <Link
                    key={action.label}
                    href="/transactions/add"
                    id={`quick-${action.label.toLowerCase()}`}
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div
                      className="w-full aspect-square bg-[#2c2c2c] rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
                      style={{ color: action.color }}
                    >
                      <span className="material-symbols-outlined text-2xl">{action.icon}</span>
                    </div>
                    <span
                      className="text-xs font-medium uppercase tracking-widest text-[#adaaaa] group-hover:text-white transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {action.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Black Card Widget */}
            <div
              className="p-6 rounded-xl flex flex-col justify-between min-h-[160px]"
              style={{
                background: 'linear-gradient(135deg, #00fdc1, #aaffdc)',
                boxShadow: '0 20px 40px rgba(0,253,193,0.15)',
              }}
            >
              <div className="flex justify-between items-start">
                <span
                  className="material-symbols-outlined text-3xl text-[#004734]"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
                >
                  diamond
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#004734]/70">
                  Obsidian Black Card
                </span>
              </div>
              <div>
                <p className="text-xs text-[#004734]/80 mb-1">Active Balance</p>
                <h4
                  className="text-2xl font-bold tracking-tight text-[#004734]"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  {formatAmount(balance)}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>Recent Transactions</h2>
            <Link
              href="/transactions"
              id="dashboard-see-all"
              className="text-[#929bfa] text-sm font-medium hover:underline transition-all"
            >
              See All History
            </Link>
          </div>
          <div className="bg-[#131313] rounded-xl overflow-hidden">
            {transactions && transactions.length > 0 ? (
              transactions.map(tx => (
                <TransactionCard key={tx.id} transaction={tx} />
              ))
            ) : (
              <div className="p-12 text-center text-[#adaaaa]">
                <span className="material-symbols-outlined text-4xl mb-3 block">receipt_long</span>
                <p>No transactions yet.</p>
                <Link href="/transactions/add" className="text-[#aaffdc] text-sm mt-2 inline-block hover:underline">
                  Add your first transaction →
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FAB */}
      <Link
        href="/transactions/add"
        id="dashboard-fab"
        className="fixed right-6 bottom-24 w-14 h-14 rounded-2xl flex items-center justify-center text-[#004734] active:scale-95 transition-transform z-40"
        style={{
          background: 'linear-gradient(135deg, #aaffdc, #00fdc1)',
          boxShadow: '0 12px 24px rgba(0,253,193,0.3)',
        }}
      >
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'wght' 600" }}>add</span>
      </Link>

      <BottomNav />
    </div>
  )
}
