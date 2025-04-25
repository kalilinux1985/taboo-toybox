// app/layout.tsx
import '@/app/globals.css'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/auth/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Taboo Toybox',
  description: 'OnlyFans-style marketplace with messaging & media sharing.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
