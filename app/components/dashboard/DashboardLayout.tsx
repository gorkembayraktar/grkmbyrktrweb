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
                        {/* Dashboard Card Container */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {/* İstatistik Kartları */}
                            <div className="bg-white dark:bg-dark-light rounded-lg shadow-sm border border-light-darker/10 dark:border-dark-light/10 p-6">
                                <h3 className="text-lg font-semibold mb-2">Toplam Yazı</h3>
                                <p className="text-3xl font-bold text-primary">150</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Son 30 günde +12 yazı</p>
                            </div>
                            <div className="bg-white dark:bg-dark-light rounded-lg shadow-sm border border-light-darker/10 dark:border-dark-light/10 p-6">
                                <h3 className="text-lg font-semibold mb-2">Toplam Görüntülenme</h3>
                                <p className="text-3xl font-bold text-primary">25.4K</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Son 30 günde +2.1K görüntülenme</p>
                            </div>
                            <div className="bg-white dark:bg-dark-light rounded-lg shadow-sm border border-light-darker/10 dark:border-dark-light/10 p-6">
                                <h3 className="text-lg font-semibold mb-2">Aktif Kullanıcı</h3>
                                <p className="text-3xl font-bold text-primary">1.2K</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Son 30 günde +180 kullanıcı</p>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="bg-white dark:bg-dark-light rounded-lg shadow-sm border border-light-darker/10 dark:border-dark-light/10 p-6">
                            {children}
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    )
} 