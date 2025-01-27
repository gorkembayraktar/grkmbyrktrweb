'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { format, formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
    FaEnvelope, FaPhone, FaUser, FaArrowLeft, FaClock, FaCalendar, FaCheck, FaReply,
    FaTrash, FaEye, FaEyeSlash, FaPrint, FaShareAlt
} from 'react-icons/fa'

interface Contact {
    id: string
    fullname: string
    email: string
    phone: string
    message: string
    is_read: boolean
    read_date: string | null
    created_at: string
}

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [contact, setContact] = useState<Contact | null>(null)
    const [loading, setLoading] = useState(true)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [shareModalOpen, setShareModalOpen] = useState(false)
    const resolvedParams = use(params)

    const supabase = createClient()

    const loadContact = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .eq('id', resolvedParams.id)
                .single()

            if (error) throw error

            // Mesajı okundu olarak işaretle
            if (data && !data.is_read) {
                const { error: updateError } = await supabase
                    .from('contacts')
                    .update({
                        is_read: true,
                        read_date: new Date().toISOString()
                    })
                    .eq('id', resolvedParams.id)

                if (updateError) throw updateError
            }

            setContact(data)
        } catch (error) {
            console.error('Error loading contact:', error)
            toast.error('Mesaj yüklenirken bir hata oluştu')
            router.push('/dashboard/contacts')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadContact()
    }, [resolvedParams.id])

    const handleDelete = async () => {
        if (!contact?.id) {
            toast.error('Mesaj ID\'si bulunamadı')
            return
        }

        try {
            console.log('Deleting contact with ID:', contact.id)

            const { error } = await supabase
                .from('contacts')
                .delete()
                .eq('id', contact.id)

            if (error) {
                console.error('Supabase error:', error)
                toast.error(`Silme hatası: ${error.message}`)
                return
            }

            console.log('Delete successful')
            toast.success('Mesaj başarıyla silindi')
            setDeleteModalOpen(false)
            router.push('/dashboard/contacts')
        } catch (error) {
            console.error('Unexpected error:', error)
            toast.error('Beklenmeyen bir hata oluştu')
        }
    }

    const handleReadStatus = async () => {
        if (!contact) return

        try {
            const { error } = await supabase
                .from('contacts')
                .update({
                    is_read: !contact.is_read,
                    read_date: !contact.is_read ? new Date().toISOString() : null
                })
                .eq('id', contact.id)

            if (error) throw error

            setContact(prev => prev ? {
                ...prev,
                is_read: !prev.is_read,
                read_date: !prev.is_read ? new Date().toISOString() : null
            } : null)

            toast.success(contact.is_read ? 'Mesaj okunmadı olarak işaretlendi' : 'Mesaj okundu olarak işaretlendi')
        } catch (error) {
            console.error('Error updating contact:', error)
            toast.error('Mesaj durumu güncellenirken bir hata oluştu')
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const handleShare = async () => {
        if (!contact) return

        try {
            await navigator.share({
                title: `İletişim Mesajı - ${contact.fullname}`,
                text: `${contact.fullname} tarafından gönderilen mesaj`,
                url: window.location.href
            })
        } catch (error) {
            console.error('Error sharing:', error)
            // Tarayıcı share API'sini desteklemiyorsa veya paylaşım iptal edildiyse
            // Modal'ı aç
            setShareModalOpen(true)
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        )
    }

    if (!contact) {
        return null
    }

    return (
        <div className="py-6">
            <div className="px-4 sm:px-6 md:px-8">
                {/* Üst Bar */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                        <FaArrowLeft className="mr-2 h-4 w-4" />
                        Geri Dön
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleReadStatus}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors"
                            title={contact?.is_read ? 'Okunmadı olarak işaretle' : 'Okundu olarak işaretle'}
                        >
                            {contact?.is_read ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                        </button>
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors"
                            title="Yazdır"
                        >
                            <FaPrint className="h-4 w-4" />
                        </button>
                        <button
                            onClick={handleShare}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors"
                            title="Paylaş"
                        >
                            <FaShareAlt className="h-4 w-4" />
                        </button>
                        <a
                            href={`mailto:${contact?.email}`}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                        >
                            <FaReply className="mr-2 h-4 w-4" />
                            Yanıtla
                        </a>
                        <button
                            onClick={() => setDeleteModalOpen(true)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            title="Sil"
                        >
                            <FaTrash className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Ana İçerik */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    {/* Başlık ve Meta Bilgiler */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FaUser className="h-6 w-6 text-primary" />
                                    {contact.fullname}
                                </h1>
                                <div className="mt-1 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <FaCalendar className="h-4 w-4" />
                                        <span title={format(new Date(contact.created_at), 'dd MMMM yyyy HH:mm', { locale: tr })}>
                                            {formatDistanceToNow(new Date(contact.created_at), { addSuffix: true, locale: tr })}
                                        </span>
                                    </div>
                                    {contact.read_date && (
                                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                            <FaCheck className="h-4 w-4" />
                                            <span title={format(new Date(contact.read_date), 'dd MMMM yyyy HH:mm', { locale: tr })}>
                                                Okundu
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* İletişim Bilgileri */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 dark:bg-gray-900/50">
                        <div>
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <FaEnvelope className="h-5 w-5 text-gray-400" />
                                <a href={`mailto:${contact.email}`} className="text-primary hover:text-primary/80">
                                    {contact.email}
                                </a>
                            </div>
                        </div>
                        <div>
                            {contact.phone && (
                                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <FaPhone className="h-5 w-5 text-gray-400" />
                                    <a href={`tel:${contact.phone}`} className="text-primary hover:text-primary/80">
                                        {contact.phone}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mesaj İçeriği */}
                    <div className="p-6">
                        <div className="prose prose-gray dark:prose-invert max-w-none">
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                                <p className="whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed">
                                    {contact.message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Silme Onay Modalı */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                                    <FaTrash className="h-6 w-6 text-red-600 dark:text-red-300" />
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                                        Mesajı Sil
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Bu mesajı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                >
                                    Sil
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
                                >
                                    İptal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Paylaşım Modalı */}
            {shareModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                    <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                                        Mesajı Paylaş
                                    </h3>
                                    <div className="mt-2">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <input
                                                type="text"
                                                readOnly
                                                value={window.location.href}
                                                className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                            />
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(window.location.href)
                                                    toast.success('Bağlantı kopyalandı')
                                                }}
                                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                                            >
                                                Kopyala
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={() => setShareModalOpen(false)}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
                                >
                                    Kapat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Yazdırma Stili */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .prose * {
                        visibility: visible;
                    }
                    .prose {
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                }
            `}</style>
        </div>
    )
} 