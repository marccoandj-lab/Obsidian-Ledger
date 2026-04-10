'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  icon: string
  label: string
}

const navItems: NavItem[] = [
  { href: '/dashboard', icon: 'dashboard', label: 'Main' },
  { href: '/goals', icon: 'target', label: 'Goals' },
  { href: '/transactions', icon: 'receipt_long', label: 'History' },
  { href: '/settings', icon: 'settings', label: 'Settings' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 w-full h-20 flex justify-around items-center px-8 pb-4 z-50 rounded-t-[2rem] shadow-[0_-24px_48px_rgba(0,0,0,0.4)]"
      style={{ background: 'rgba(14,14,14,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            id={`nav-${item.label.toLowerCase()}`}
            className={`flex flex-col items-center justify-center transition-all duration-300 active:scale-90 relative ${
              isActive ? 'text-[#aaffdc]' : 'text-gray-500 hover:text-white'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : {}}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              {item.label}
            </span>
            {isActive && (
              <span className="absolute -bottom-2 w-1 h-1 bg-[#aaffdc] rounded-full shadow-[0_0_8px_#aaffdc]" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
