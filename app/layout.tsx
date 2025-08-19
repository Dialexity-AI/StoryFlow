import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import ProgressBar from '@/components/ProgressBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StoryFlow - Read and Rate AI-Generated Stories',
  description: 'Discover, read, and rate amazing AI-generated stories across all genres',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProgressBar />
        <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
