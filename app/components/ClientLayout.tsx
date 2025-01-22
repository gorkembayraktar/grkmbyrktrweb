'use client'
import { ReactNode } from 'react'
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

        // Tema değişikliklerini dinle
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDark = document.documentElement.classList.contains('dark')
                    localStorage.setItem('theme', isDark ? 'dark' : 'light')
                }
            })
        })

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        })

        return () => observer.disconnect()
    }, [])

    return (
        <div className={inter.className}>
            {children}
        </div>
    )
} 