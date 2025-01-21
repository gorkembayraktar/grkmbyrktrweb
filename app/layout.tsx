import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import ClientLayout from './components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Görkem Bayraktar - Web Yazılım Çözümleri',
  description: 'Next.js, React Native ve modern teknolojilerle web ve mobil çözümler',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClientLayout inter={inter}>
      {children}
    </ClientLayout>
  )
}
