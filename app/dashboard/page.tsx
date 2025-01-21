'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { FC } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '../utils/supabase/client'

const supabase = createClient();

const DashboardPage: FC = () => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push('/login')
                    return
                }
                setUser(user)
            } catch (error) {
                console.error('Error checking auth:', error)
                router.push('/login')
            } finally {
                setLoading(false)
            }
        }

        checkUser()
    }, [router])

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut()
            router.push('/login')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-dark">
            {/* Background Elements */}
            <div className="gradient-bg" />
            <div className="animated-background" />
            <div className="gradient-overlay" />

            {/* Dashboard Content */}
            <div className="relative z-10">
                {/* Header */}
                <header className="bg-dark-darker border-b border-dark-light">
                    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-xl font-bold bg-accent-gradient text-transparent bg-clip-text"
                        >
                            Dashboard
                        </motion.h1>

                        <div className="flex items-center gap-4">
                            {user && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="text-right">
                                        <p className="font-medium">{user.email}</p>
                                        <p className="text-sm text-gray-400">Admin</p>
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        className="px-4 py-2 rounded-lg bg-dark border border-dark-light hover:border-primary transition-all"
                                    >
                                        Çıkış Yap
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Stats Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-dark-darker p-6 rounded-2xl border border-dark-light"
                        >
                            <h3 className="text-gray-400 mb-2">Toplam Proje</h3>
                            <p className="text-3xl font-bold">12</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-dark-darker p-6 rounded-2xl border border-dark-light"
                        >
                            <h3 className="text-gray-400 mb-2">Aktif Müşteriler</h3>
                            <p className="text-3xl font-bold">8</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-dark-darker p-6 rounded-2xl border border-dark-light"
                        >
                            <h3 className="text-gray-400 mb-2">Bekleyen Görevler</h3>
                            <p className="text-3xl font-bold">5</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-dark-darker p-6 rounded-2xl border border-dark-light"
                        >
                            <h3 className="text-gray-400 mb-2">Tamamlanan Görevler</h3>
                            <p className="text-3xl font-bold">24</p>
                        </motion.div>
                    </div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 bg-dark-darker p-6 rounded-2xl border border-dark-light"
                    >
                        <h2 className="text-xl font-bold mb-4">Son Aktiviteler</h2>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-3 border-b border-dark-light last:border-0"
                                >
                                    <div>
                                        <h4 className="font-medium">Yeni proje eklendi</h4>
                                        <p className="text-sm text-gray-400">Speed Test Uygulaması</p>
                                    </div>
                                    <span className="text-sm text-gray-400">2 saat önce</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}

export default DashboardPage 