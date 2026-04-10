'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    })
    return () => unsub()
  }, [router])

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
      <span className="material-symbols-outlined text-[#aaffdc] animate-spin text-4xl">refresh</span>
    </div>
  )
}
