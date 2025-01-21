'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FaShieldAlt } from 'react-icons/fa'
import { createClient } from '@/app/utils/supabase/client'

export default function AuthUnauthorized() {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut()
            router.push('/login')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center relative">
            {/* Background Elements */}
            <div className="gradient-bg" />
            <div className="animated-background" />
            <div className="gradient-overlay" />

            <div className="container max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-dark-darker p-8 rounded-2xl border border-red-500/20 relative z-10 text-center"
                >
                    <FaShieldAlt className="text-6xl text-red-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold mb-4 text-red-500">Yetkisiz Erişim</h1>
                    <div className="space-y-4 mb-8">
                        <p className="text-gray-300">
                            Bu sayfaya erişim yetkiniz bulunmamaktadır.
                        </p>
                        <p className="text-gray-400 text-sm">
                            Yalnızca yetkili yöneticiler bu alana erişebilir. Farklı bir hesapla giriş yapmanız gerekmektedir.
                        </p>
                    </div>
                    <motion.button
                        onClick={handleSignOut}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors w-full flex items-center justify-center gap-2"
                    >
                        <span>Oturumu Kapat</span>
                    </motion.button>
                </motion.div>
            </div>
        </main>
    )
} 