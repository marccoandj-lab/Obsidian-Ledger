'use client'

import Link from 'next/link'

interface TopBarProps {
  avatarUrl?: string | null
  title?: string
  showBack?: boolean
  backHref?: string
  rightAction?: React.ReactNode
}

export default function TopBar({ avatarUrl, title = 'Obsidian Ledger', showBack, backHref = '/', rightAction }: TopBarProps) {
  return (
    <header
      className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16"
      style={{ background: 'rgba(14,14,14,0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <div className="flex items-center gap-3">
        {showBack ? (
          <Link
            href={backHref}
            id="top-bar-back"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#262626] transition-colors"
          >
            <span className="material-symbols-outlined text-white">close</span>
          </Link>
        ) : (
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#aaffdc]/20 flex-shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#262626] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#aaffdc] text-sm">person</span>
              </div>
            )}
          </div>
        )}
        <h1
          className="text-xl font-black tracking-tight"
          style={{
            fontFamily: 'Manrope, sans-serif',
            background: 'linear-gradient(135deg, #aaffdc, #00fdc1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {rightAction ?? (
          <button
            id="top-bar-notifications"
            className="text-gray-500 hover:text-[#aaffdc] transition-colors scale-95 active:duration-200"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
        )}
      </div>
    </header>
  )
}
