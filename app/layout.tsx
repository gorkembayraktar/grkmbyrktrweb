import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import type { FC, ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Görkem Bayraktar - Web & Mobil Yazılım Çözümleri',
  description: 'Next.js, React Native ve modern teknolojilerle web ve mobil çözümler',
}

interface RootLayoutProps {
  children: ReactNode
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

export default RootLayout
