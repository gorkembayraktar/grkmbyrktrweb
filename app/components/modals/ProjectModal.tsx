import { FaTimes, FaImage, FaLink } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface ProjectFormData {
    title: string
    description: string
    image_url: string
    project_url: string
}

interface ProjectModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (e: React.FormEvent) => Promise<void>
    formData: ProjectFormData
    setFormData: (data: ProjectFormData) => void
    isSubmitting: boolean
    mode: 'create' | 'edit'
}

export default function ProjectModal({
    isOpen,
    onClose,
    onSubmit,
    formData,
    setFormData,
    isSubmitting,
    mode = 'create'
}: ProjectModalProps) {
    // ESC tuşu ile kapatma
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            window.addEventListener('keydown', handleEsc)
            // Scroll engelleme
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
                        {/* Backdrop - tıklanabilir */}
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

                        {/* Modal Panel - tıklamayı engelle */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="inline-block w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all relative"
                            onClick={(e) => e.stopPropagation()} // Modal içine tıklamayı engelle
                        >
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {mode === 'create' ? 'Yeni Proje Ekle' : 'Projeyi Düzenle'}
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                >
                                    <FaTimes className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={onSubmit}>
                                <div className="px-6 py-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Proje Başlığı
                                        </label>
                                        <div className="relative rounded-lg shadow-sm">
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                                         focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:ring-primary/30
                                                         placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                                                placeholder="Projenizin başlığını girin"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Açıklama
                                        </label>
                                        <div className="relative rounded-lg shadow-sm">
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                rows={4}
                                                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                                         focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:ring-primary/30
                                                         placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200 resize-none"
                                                placeholder="Projeniz hakkında detaylı bilgi verin"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Görsel URL
                                        </label>
                                        <div className="relative rounded-lg shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaImage className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="url"
                                                name="image_url"
                                                value={formData.image_url}
                                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                                className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                                         focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:ring-primary/30
                                                         placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Projenizin önizleme görseli için URL girin
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Proje URL
                                        </label>
                                        <div className="relative rounded-lg shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaLink className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="url"
                                                name="project_url"
                                                value={formData.project_url}
                                                onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                                                className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                                         focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:ring-primary/30
                                                         placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Projenizin canlı önizlemesi için URL girin
                                        </p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex flex-row-reverse gap-3">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm 
                                                 text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 
                                                 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed
                                                 transition-colors duration-200 min-w-[100px]"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {mode === 'create' ? 'Ekleniyor' : 'Güncelleniyor'}
                                            </>
                                        ) : (
                                            mode === 'create' ? 'Ekle' : 'Güncelle'
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
                            </form>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    )
} 