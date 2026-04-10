import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Obsidian Ledger | Private Financial Intelligence',
  description: 'Premium personal finance management — track transactions, set goals, and grow your wealth with Obsidian Ledger.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0e0e0e] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
