"use-client"
import Navbar from '@/components/Navbar'
import './globals.css'
import type { Metadata } from 'next'

import Footer from '@/components/Footer'
import Providers from '@/components/Providers'
import { Toaster } from '@/components/ui/toaster'


export const metadata: Metadata = {
  title: 'Challenger',
  description: 'Creer et gerer facilement vos tournois de football ou alors inscrivez vous',
}

export default function RootLayout({
  children,
  authModal
}: {
  children: React.ReactNode,
  authModal: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='relative min-h-screen pt-12 bg-slate-50 antialiased'>
        <Providers>
          <Navbar />
          {authModal}
          <div>
            {children}
          </div>
          <Footer />
        </Providers>
       
      </body>
    </html>
  )
}
