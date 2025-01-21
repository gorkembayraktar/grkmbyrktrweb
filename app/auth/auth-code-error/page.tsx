'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaExclamationTriangle } from 'react-icons/fa'

export default function AuthCodeError() {
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
                    className="bg-dark-darker p-8 rounded-2xl border border-dark relative z-10 text-center"
                >
                    <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold mb-4">Oturum Açma Hatası</h1>
                    <p className="text-gray-400 mb-6">
                        Oturum açma işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.
                    </p>
                    <Link href="/login">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                        >
                            Giriş Sayfasına Dön
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </main>
    )
} 