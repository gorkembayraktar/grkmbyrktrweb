'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-dark p-4">
            <div className="container">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Sol Taraf - İçerik */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:w-1/2 text-center lg:text-left"
                    >
                        <h1 className="text-8xl lg:text-9xl font-bold text-primary mb-4">404</h1>
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                            Aradığınız Sayfa Bulunamadı
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-md">
                            Üzgünüz, aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-primary text-dark px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-colors"
                        >
                            <span>Ana Sayfaya Dön</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </motion.div>

                    {/* Sağ Taraf - SVG Animasyon */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:w-1/2"
                    >
                        <svg
                            className="w-full max-w-lg mx-auto"
                            viewBox="0 0 500 500"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <motion.circle
                                cx="250"
                                cy="250"
                                r="200"
                                stroke="currentColor"
                                strokeWidth="20"
                                className="text-primary/20"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />
                            <motion.path
                                d="M196 155L304 345M304 155L196 345"
                                stroke="currentColor"
                                strokeWidth="20"
                                strokeLinecap="round"
                                className="text-primary"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                            />
                        </svg>
                    </motion.div>
                </div>
            </div>
        </div>
    )
} 