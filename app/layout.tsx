import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createClient } from '@/utils/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Doozy - Find Events Near You',
  description: 'Discover and join exciting events happening in your area',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },

}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header user={user} />
          <div className="flex-1 bg-gradient-to-b from-background to-background/50">
            {children}
            <SpeedInsights />
            <Analytics />
          </div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
