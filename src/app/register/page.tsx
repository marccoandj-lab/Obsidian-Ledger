import Link from 'next/link'
import RegisterForm from '@/components/RegisterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account | Obsidian Ledger',
  description: 'Begin your journey into editorial private banking.',
}

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[#0e0e0e]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(146,155,250,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,253,193,0.06) 0%, transparent 50%)',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0e0e0e 0%, rgba(14,14,14,0.2) 60%, transparent)' }} />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Glass card */}
        <div
          className="p-8 md:p-12 rounded-[2rem] border border-[#494847]/10"
          style={{
            background: 'rgba(14,14,14,0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
          }}
        >
          <header className="mb-10 text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <span
                className="material-symbols-outlined text-4xl mr-2"
                style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24", color: '#aaffdc' }}
              >
                account_balance_wallet
              </span>
              <h1
                className="text-2xl font-black text-white tracking-widest uppercase"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Obsidian Ledger
              </h1>
            </div>
            <h2
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              Create your account
            </h2>
            <p className="text-[#adaaaa] text-sm tracking-tight">
              Begin your journey into editorial private banking
            </p>
          </header>

          <RegisterForm />

          <footer className="mt-8 text-center">
            <p className="text-[#adaaaa] text-sm">
              Already have an account?
              <Link
                href="/login"
                className="text-[#aaffdc] font-semibold hover:text-[#00edb4] transition-colors ml-1"
              >
                Login
              </Link>
            </p>
          </footer>
        </div>

        {/* Security badges */}
        <div className="mt-8 flex justify-center space-x-6 text-[#adaaaa]/50">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>
              Military-Grade Encryption
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-sm">lock_person</span>
            <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>
              Privacy First
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
