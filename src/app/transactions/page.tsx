'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, db } from '@/lib/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import TransactionCard from '@/components/TransactionCard'
import { Transaction, formatDate } from '@/lib/types'

export default function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>
}) {
  const router = useRouter()
  // React 19 / Next 15 hook for unwrapping searchParams
  const params = use(searchParams)
  const filter = params.filter ?? 'all'
  const qStr = params.q ?? ''

  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login')
        return
      }

      try {
        let qRef = query(
          collection(db, 'transactions'),
          where('user_id', '==', user.uid),
          orderBy('date', 'desc')
        )

        const snap = await getDocs(qRef)
        let txsData = snap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction))

        // Client side filtering for complex queries (Firestore lacks native unindexed ilike)
        if (filter === 'income') txsData = txsData.filter(t => t.type === 'income')
        if (filter === 'expense') txsData = txsData.filter(t => t.type === 'expense')
        if (qStr) {
          const lowerQ = qStr.toLowerCase()
          txsData = txsData.filter(t => t.note?.toLowerCase().includes(lowerQ) || t.category.toLowerCase().includes(lowerQ))
        }

        setTransactions(txsData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    })
    return () => unsub()
  }, [router, filter, qStr])

  if (loading) {
    return <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center text-[#aaffdc]">Loading...</div>
  }

  // Group by date label
  const grouped: Record<string, typeof transactions> = {}
  for (const tx of transactions) {
    const label = formatDate(tx.date)
    if (!grouped[label]) grouped[label] = []
    grouped[label]!.push(tx)
  }

  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen pb-24">
      <TopBar />

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        {/* Search + Filter */}
        <section className="mb-8 space-y-6">
          <form method="GET" action="/transactions" className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#adaaaa]">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              id="transactions-search"
              name="q"
              defaultValue={qStr}
              type="text"
              placeholder="Search transactions..."
              className="w-full bg-[#201f1f] border-none rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-[#adaaaa] focus:ring-1 focus:ring-[#aaffdc] transition-all duration-300 outline-none"
            />
            {filter !== 'all' && <input type="hidden" name="filter" value={filter} />}
          </form>

          {/* Tab filter */}
          <div className="flex p-1 bg-[#131313] rounded-xl">
            {[
              { key: 'all', label: 'All' },
              { key: 'income', label: 'Income' },
              { key: 'expense', label: 'Expenses' },
            ].map(tab => (
              <Link
                key={tab.key}
                href={`/transactions?filter=${tab.key}${qStr ? `&q=${qStr}` : ''}`}
                id={`tab-${tab.key}`}
                className={`flex-1 py-2 text-sm font-semibold rounded-xl text-center transition-colors ${
                  filter === tab.key
                    ? 'bg-[#262626] text-[#aaffdc] shadow-sm'
                    : 'text-[#adaaaa] hover:text-white'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Transaction Groups */}
        <div className="space-y-10">
          {Object.keys(grouped).length === 0 ? (
            <div className="py-20 text-center text-[#adaaaa]">
              <span className="material-symbols-outlined text-5xl mb-4 block">receipt_long</span>
              <p className="text-lg font-medium">No transactions found</p>
              <Link href="/transactions/add" className="text-[#aaffdc] text-sm mt-2 inline-block hover:underline">
                Add your first transaction →
              </Link>
            </div>
          ) : (
            Object.entries(grouped).map(([dateLabel, txs]) => (
              <section key={dateLabel}>
                <div className="flex justify-between items-end mb-4 border-b border-[#494847]/10 pb-2">
                  <h2
                    className="font-bold text-[#adaaaa] uppercase tracking-[0.2em] text-[10px]"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    {dateLabel}
                  </h2>
                  <span className="text-[10px] font-medium text-[#adaaaa]">
                    {txs && txs.length > 0 ? new Date(txs[0].date).toLocaleDateString('en-US', { weekday: 'long' }) : ''}
                  </span>
                </div>
                <div className="space-y-2">
                  {txs?.map(tx => (
                    <TransactionCard key={tx.id} transaction={tx} />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        {/* Ambient glow */}
        <div
          className="fixed bottom-32 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'rgba(170,255,220,0.05)', filter: 'blur(120px)' }}
        />
      </main>

      {/* FAB */}
      <Link
        href="/transactions/add"
        id="transactions-fab"
        className="fixed right-6 bottom-24 w-14 h-14 rounded-2xl flex items-center justify-center text-[#004734] active:scale-95 transition-transform z-40"
        style={{
          background: 'linear-gradient(135deg, #aaffdc, #00fdc1)',
          boxShadow: '0 12px 24px rgba(0,253,193,0.3)',
        }}
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </Link>

      <BottomNav />
    </div>
  )
}
