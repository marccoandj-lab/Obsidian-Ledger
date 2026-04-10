'use client'

import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase/config'
import { signOut } from 'firebase/auth'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await signOut(auth)
    router.push('/login')
  }

  return (
    <button
      id="settings-logout"
      onClick={handleLogout}
      className="w-full py-4 rounded-xl flex items-center justify-center gap-3 border font-bold uppercase tracking-widest text-sm transition-colors hover:bg-[#ff716c]/5"
      style={{
        color: '#ff716c',
        borderColor: 'rgba(255, 113, 108, 0.2)',
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      <span className="material-symbols-outlined">logout</span>
      Log Out
    </button>
  )
}
