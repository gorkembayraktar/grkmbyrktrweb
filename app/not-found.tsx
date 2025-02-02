'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-dark">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center px-4"
            >
                <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
                <h2 className="text-2xl font-bold text-white mb-6">Sayfa Bulunamadı</h2>
                <p className="text-gray-400 mb-8 max-w-md">
                    Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-primary text-dark px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                    <span>Ana Sayfaya Dön</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </motion.div>
        </div>
    )
} 