'use client'
import { motion } from 'framer-motion'
import type { User } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface DashboardLayoutProps {
    user: User | null
    children: React.ReactNode
}

export default function DashboardLayout({ user, children }: DashboardLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true)
            }
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className="min-h-screen bg-light dark:bg-dark-darker text-gray-900 dark:text-gray-100">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className={`flex-1 transition-all duration-300
                ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}`}
            >
                <Header user={user} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                <main className="pt-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-6"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    )
} 