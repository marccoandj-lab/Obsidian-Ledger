import Link from 'next/link'
import LoginForm from '@/components/LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | Obsidian Ledger',
  description: 'Access your private financial ledger.',
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 lg:px-12 py-12 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#0e0e0e]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(146,155,250,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,253,193,0.05) 0%, transparent 50%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, #0e0e0e 0%, transparent 60%)' }}
        />
      </div>

      {/* Ambient glows */}
      <div className="fixed bottom-12 -left-12 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'rgba(146,155,250,0.1)', filter: 'blur(100px)' }} />
      <div className="fixed -top-12 -right-12 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'rgba(170,255,220,0.05)', filter: 'blur(100px)' }} />

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full">
        {/* Brand */}
        <header className="mb-12 text-center">
          <h1
            className="text-2xl font-black text-white tracking-widest uppercase mb-2"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            Obsidian Ledger
          </h1>
          <div className="h-1 w-12 mx-auto rounded-full" style={{
            background: '#aaffdc',
            boxShadow: '0 0 8px rgba(170,255,220,0.5)',
          }} />
        </header>

        <div className="w-full max-w-md relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#aaffdc]/10 to-transparent blur-2xl rounded-full translate-y-12 opacity-50 pointer-events-none" />
          <div className="relative p-10 rounded-[2rem] border border-[#aaffdc]/10 bg-[#131313]/60 backdrop-blur-3xl shadow-2xl space-y-8">
            <div className="space-y-2 text-center">
              <h2
                className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-md"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Welcome back.
              </h2>
              <p className="text-[#adaaaa] text-lg">
                Enter your credentials to access your private ledger.
              </p>
            </div>

            <LoginForm />

            {/* Divider */}
            <div className="flex items-center gap-4 py-2 opacity-60">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#494847] to-transparent" />
              <span className="text-[10px] uppercase tracking-widest text-[#adaaaa] font-bold">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#494847] to-transparent" />
            </div>

            {/* Alt auth buttons */}
            <div className="grid grid-cols-1 gap-4">
              <button
                id="login-google"
                className="flex items-center justify-center gap-3 bg-white/5 border border-[#494847]/30 hover:border-[#aaffdc]/40 hover:bg-[#aaffdc]/10 hover:-translate-y-0.5 rounded-xl py-3.5 transition-all duration-300 group"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold tracking-wide text-white">Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pt-12 text-center">
        <p className="text-[#adaaaa] font-medium">
          New to Obsidian?
          <Link href="/register" className="text-[#aaffdc] hover:text-white transition-colors duration-400 ml-1">
            Apply for Membership
          </Link>
        </p>
      </footer>
    </div>
  )
}
