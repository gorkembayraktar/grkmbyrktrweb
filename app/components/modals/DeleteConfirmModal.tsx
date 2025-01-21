import { FaTimes, FaExclamationTriangle } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface DeleteConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => Promise<void>
    title: string
    isDeleting: boolean
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    isDeleting
}: DeleteConfirmModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            window.addEventListener('keydown', handleEsc)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            window.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 transition-opacity cursor-pointer"
                            onClick={onClose}
                            aria-hidden="true"
                        >
                            <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75 backdrop-blur-sm"></div>
                        </motion.div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="inline-block w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-red-100 dark:bg-red-900/20">
                                    <FaExclamationTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
                                </div>

                                <div className="mt-4 text-center">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Projeyi Sil
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">{title}</span> projesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                    </p>
                                </div>

                                <div className="mt-6 flex flex-row-reverse gap-3">
                                    <button
                                        type="button"
                                        disabled={isDeleting}
                                        onClick={onConfirm}
                                        className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm 
                                                 text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 
                                                 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed
                                                 transition-colors duration-200 min-w-[100px]"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Siliniyor
                                            </>
                                        ) : (
                                            'Sil'
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="inline-flex justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600
                                                 rounded-lg shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 
                                                 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 
                                                 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                                    >
                                        İptal
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    )
} 