'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'

export default function UnauthorizedModal() {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (searchParams.get('error') === 'unauthorized') {
            setIsOpen(true)
        }
    }, [searchParams])

    const handleClose = () => {
        setIsOpen(false)
        // Remove error from URL
        const url = new URL(window.location.href)
        url.searchParams.delete('error')
        window.history.replaceState({}, '', url)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
                    >
                        <div className="bg-dark-darker p-6 rounded-2xl border border-dark-light shadow-xl">
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                <FaExclamationTriangle className="text-2xl text-red-500" />
                            </div>

                            {/* Content */}
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold mb-2">Yetkisiz Erişim</h3>
                                <p className="text-gray-400">
                                    Bu sayfaya erişim yetkiniz bulunmamaktadır. Lütfen yönetici ile iletişime geçin.
                                </p>
                            </div>

                            {/* Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleClose}
                                className="w-full py-3 rounded-lg bg-primary text-white font-medium"
                            >
                                Anladım
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
} 