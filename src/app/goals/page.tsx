'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, db } from '@/lib/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import GoalCard from '@/components/GoalCard'
import { Profile, Goal, formatAmount } from '@/lib/types'

export default function GoalsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [goals, setGoals] = useState<Goal[]>([])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login')
        return
      }

      try {
        const profDoc = await getDoc(doc(db, 'profiles', user.uid))
        if(profDoc.exists()) setProfile({ id: profDoc.id, ...profDoc.data() } as Profile)

        const goalsQuery = query(
          collection(db, 'goals'),
          where('user_id', '==', user.uid),
          orderBy('created_at')
        )
        const goalsSnap = await getDocs(goalsQuery)
        const goalsData = goalsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Goal))
        setGoals(goalsData)

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
  const balanceChange = 12.4

  const primaryGoal = goals[0]
  const otherGoals = goals.slice(1)

  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen pb-24">
      <TopBar avatarUrl={profile?.avatar_url} />

      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
        {/* Hero Summary */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <p
                className="text-[10px] font-medium uppercase tracking-widest text-[#adaaaa] mb-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Total Wealth Reserve
              </p>
              <h1
                className="font-extrabold text-5xl md:text-7xl tracking-tighter text-white"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                {formatAmount(balance).split('.')[0]}
                <span className="text-[#00edb4]">.{formatAmount(balance).split('.')[1] ?? '00'}</span>
              </h1>
            </div>
            <div className="flex flex-col items-end">
              <p
                className="text-[10px] font-medium uppercase tracking-widest text-[#aaffdc] mb-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Net Progression
              </p>
              <div className="bg-[#131313] px-4 py-2 rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[#aaffdc] text-sm">trending_up</span>
                <span
                  className="font-bold text-xl text-[#aaffdc]"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  +{balanceChange}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Goals Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* New Goal CTA */}
          <div className="md:col-span-4 group relative overflow-hidden bg-[#262626] rounded-xl p-8 flex flex-col justify-between aspect-square md:aspect-auto min-h-[280px]">
            <div className="relative z-10">
              <h3
                className="font-bold text-2xl mb-4 text-white"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Forge a New<br />Financial Target
              </h3>
              <p className="text-[#adaaaa] text-sm max-w-[200px]">
                Define your next milestone and watch your capital transform.
              </p>
            </div>
            <Link
              href="/goals/new"
              id="goals-new-cta"
              className="relative z-10 w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 group-hover:scale-[1.02] transition-transform text-[#004734]"
              style={{ background: 'linear-gradient(135deg, #aaffdc, #00fdc1)' }}
            >
              <span className="material-symbols-outlined font-bold">add</span>
              New Goal
            </Link>
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined" style={{ fontSize: '12rem' }}>flag</span>
            </div>
          </div>

          {/* Primary Goal */}
          {primaryGoal ? (
            <div className="md:col-span-8">
              <GoalCard goal={primaryGoal} size="large" />
            </div>
          ) : (
            <div className="md:col-span-8 bg-[#131313] rounded-xl p-8 flex items-center justify-center min-h-[280px]">
              <div className="text-center text-[#adaaaa]">
                <span className="material-symbols-outlined text-5xl mb-3 block">target</span>
                <p>Set your first goal to start tracking progress</p>
              </div>
            </div>
          )}

          {/* Other Goals */}
          {otherGoals.map(goal => (
            <div key={goal.id} className="md:col-span-6">
              <GoalCard goal={goal} size="medium" />
            </div>
          ))}

          {/* Achievement Banner */}
          <div className="md:col-span-12 relative h-48 rounded-xl overflow-hidden group">
            <div
              className="w-full h-full"
              style={{ background: 'linear-gradient(135deg, #131313 0%, #1a1919 50%, #201f1f 100%)' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, #0e0e0e 0%, transparent 60%)' }}
            />
            <div className="absolute inset-0 p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="material-symbols-outlined text-[#aaffdc] text-lg"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
                >
                  stars
                </span>
                <p
                  className="text-[#aaffdc] font-bold text-xs uppercase tracking-widest"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Recent Achievement
                </p>
              </div>
              <h4
                className="font-extrabold text-3xl mb-1 text-white"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Emergency Fund Complete
              </h4>
              <p className="text-[#adaaaa] text-sm">
                3 months of expenses secured. Your financial safety net is ready.
              </p>
            </div>
            {/* Decorative glow orbs */}
            <div className="absolute right-10 top-8 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: 'rgba(170,255,220,0.08)', filter: 'blur(40px)' }} />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
