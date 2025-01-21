'use client'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import type { NextFont } from 'next/dist/compiled/@next/font'

interface ClientLayoutProps {
    children: ReactNode
    inter: NextFont
}

export default function ClientLayout({ children, inter }: ClientLayoutProps) {
    useEffect(() => {
        // Client tarafında theme kontrolü
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme === 'light') {
            document.documentElement.classList.remove('dark')
        } else {
            document.documentElement.classList.add('dark')
        }
    }, [])

    return (
        <html lang="tr" className="scroll-smooth" suppressHydrationWarning>
            <body className={inter.className}>{children}</body>
        </html>
    )
} 