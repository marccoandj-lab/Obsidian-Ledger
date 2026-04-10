'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import LogoutButton from '@/components/LogoutButton'
import { Profile } from '@/lib/types'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login')
        return
      }
      try {
        const profDoc = await getDoc(doc(db, 'profiles', user.uid))
        if(profDoc.exists()) setProfile({ id: profDoc.id, ...profDoc.data() } as Profile)
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

  const displayName = profile?.full_name ?? auth.currentUser?.email?.split('@')[0] ?? 'User'
  const email = auth.currentUser?.email ?? ''

  const settingsCards = [
    {
      icon: 'security',
      label: 'Security',
      desc: 'Biometrics, 2FA, and Hardware Keys',
      color: '#aaffdc',
      bg: 'rgba(170,255,220,0.1)',
    },
    {
      icon: 'notifications_active',
      label: 'Notifications',
      desc: 'Transaction alerts and daily briefs',
      color: '#7ae6ff',
      bg: 'rgba(122,230,255,0.1)',
    },
    {
      icon: 'payments',
      label: 'Currency',
      desc: 'Global display and conversion rates',
      color: '#929bfa',
      bg: 'rgba(146,155,250,0.1)',
      badge: profile?.currency ?? 'USD',
    },
    {
      icon: 'help_center',
      label: 'Help',
      desc: 'Concierge support and documentation',
      color: '#777575',
      bg: 'rgba(119,117,117,0.1)',
    },
  ]

  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen pb-24">
      <TopBar avatarUrl={profile?.avatar_url} />

      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-10">
        {/* Profile Hero */}
        <section className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#262626] shadow-2xl">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #262626, #1a1919)' }}
                >
                  <span className="material-symbols-outlined text-5xl text-[#aaffdc]">person</span>
                </div>
              )}
            </div>
            <button
              id="settings-edit-avatar"
              className="absolute bottom-1 right-1 p-2 rounded-full shadow-lg scale-90 hover:scale-100 transition-transform text-[#004734]"
              style={{ background: '#aaffdc' }}
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <div>
            <h2
              className="text-3xl font-extrabold tracking-tight text-white"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              {displayName}
            </h2>
            <p className="text-[#adaaaa] text-sm uppercase tracking-widest mt-1">
              {email}
            </p>
            <p className="text-[#adaaaa] text-xs uppercase tracking-widest mt-1">
              Private Client • Tier III
            </p>
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-3 gap-3">
          {[
            { label: 'Balance', value: `$${((profile?.current_balance ?? 0) / 1000).toFixed(0)}k` },
            { label: 'Wins', value: profile?.wins ?? 0 },
            { label: 'Games', value: profile?.games_played ?? 0 },
          ].map(stat => (
            <div key={stat.label} className="bg-[#131313] rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {stat.value}
              </p>
              <p className="text-[10px] text-[#adaaaa] uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Preferences Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Preferences
            </h3>
            <span className="text-[#929bfa] text-xs font-semibold uppercase tracking-widest">
              Last synced: just now
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settingsCards.map(card => (
              <button
                key={card.label}
                id={`settings-${card.label.toLowerCase()}`}
                className="bg-[#131313] p-6 rounded-xl hover:bg-[#262626] transition-all duration-300 group cursor-pointer border border-transparent hover:border-[#494847]/10 text-left"
              >
                <div className="flex items-start justify-between mb-8">
                  <div
                    className="p-3 rounded-xl"
                    style={{ background: card.bg, color: card.color }}
                  >
                    <span className="material-symbols-outlined">{card.icon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {card.badge && (
                      <span className="text-xs font-bold" style={{ color: card.color }}>{card.badge}</span>
                    )}
                    <span className="material-symbols-outlined text-[#adaaaa] group-hover:translate-x-1 transition-transform">
                      chevron_right
                    </span>
                  </div>
                </div>
                <h4 className="font-bold text-lg text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {card.label}
                </h4>
                <p className="text-[#adaaaa] text-sm mt-1">{card.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="pt-6 border-t border-[#494847]/10">
          <LogoutButton />
          <p
            className="text-center text-[#adaaaa] text-[10px] mt-6 opacity-50 uppercase tracking-[0.2em]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Version 1.0.0 • Obsidian Systems Inc.
          </p>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
