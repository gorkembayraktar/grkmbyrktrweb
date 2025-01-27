'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FaBell, FaEnvelope, FaTimes, FaCircle } from 'react-icons/fa'
import { createClient } from '@/app/utils/supabase/client'
import { format, formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { toast, Toast } from 'react-hot-toast'

interface Contact {
    id: string
    fullname: string
    message: string
    created_at: string
    is_read: boolean
}

export default function Notification() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // Audio nesnesini oluştur
        audioRef.current = new Audio('/sounds/notification.mp3')
        audioRef.current.volume = 1 // Ses seviyesini ayarla

        loadNotifications()

        // Realtime subscription
        const channel = supabase
            .channel('contacts_channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'contacts'
                },
                (payload) => {
                    const newContact = payload.new as Contact
                    if (!newContact.is_read) {
                        setNotifications(prev => [newContact, ...prev].slice(0, 5))
                        // Bildirim sesi çal
                        audioRef.current?.play().catch(error => {
                            console.error('Error playing notification sound:', error)
                        })
                        toast.custom((t: Toast) => (
                            <div
                                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                                    } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                            >
                                <div className="flex-1 w-0 p-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 pt-0.5">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                                                <FaEnvelope className="h-5 w-5 text-primary" />
                                            </div>
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                Yeni Mesaj
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                                {newContact.fullname} tarafından yeni bir mesaj gönderildi
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex border-l border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => {
                                            toast.dismiss(t.id)
                                            router.push(`/dashboard/contacts/${newContact.id}`)
                                        }}
                                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary hover:text-primary/80 focus:outline-none"
                                    >
                                        Görüntüle
                                    </button>
                                </div>
                            </div>
                        ), {
                            duration: 5000,
                            position: 'top-right',
                        })
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const loadNotifications = async () => {
        try {
            // Okunmamış mesajları al
            const { data: unreadData, error: unreadError } = await supabase
                .from('contacts')
                .select('id, fullname, message, created_at, is_read')
                .eq('is_read', false)
                .order('created_at', { ascending: false })
                .limit(5)

            if (unreadError) throw unreadError

            // Son okunan 3 mesajı al
            const { data: readData, error: readError } = await supabase
                .from('contacts')
                .select('id, fullname, message, created_at, is_read')
                .eq('is_read', true)
                .order('created_at', { ascending: false })
                .limit(3)

            if (readError) throw readError

            // Okunmamış ve okunmuş mesajları birleştir
            setNotifications([...(unreadData || []), ...(readData || [])])
        } catch (error) {
            console.error('Error loading notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleNotificationClick = async (id: string) => {
        try {
            // Mesajı okundu olarak işaretle
            const { error } = await supabase
                .from('contacts')
                .update({ is_read: true, read_date: new Date().toISOString() })
                .eq('id', id)

            if (error) throw error

            // Bildirimi listeden kaldır
            setNotifications(prev => prev.filter(notification => notification.id !== id))

            // Sayfaya yönlendir
            setIsOpen(false)
            router.push(`/dashboard/contacts/${id}`)
        } catch (error) {
            console.error('Error marking notification as read:', error)
            toast.error('Bildirim durumu güncellenirken bir hata oluştu')
        }
    }

    // Toast bildirimi için de aynı işlemi yapalım
    const handleToastNotificationClick = async (id: string, toastId: string) => {
        try {
            // Mesajı okundu olarak işaretle
            const { error } = await supabase
                .from('contacts')
                .update({ is_read: true, read_date: new Date().toISOString() })
                .eq('id', id)

            if (error) throw error

            // Bildirimi listeden kaldır
            setNotifications(prev => prev.filter(notification => notification.id !== id))

            // Toast'ı kapat ve sayfaya yönlendir
            toast.dismiss(toastId)
            router.push(`/dashboard/contacts/${id}`)
        } catch (error) {
            console.error('Error marking notification as read:', error)
            toast.error('Bildirim durumu güncellenirken bir hata oluştu')
        }
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative transition-colors"
            >
                <FaBell className="text-gray-600 dark:text-gray-400 h-5 w-5" />
                {notifications.filter(n => !n.is_read).length > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium text-white bg-red-500 rounded-full">
                        {notifications.filter(n => !n.is_read).length}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-40">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Bildirimler
                                </h3>
                                {notifications.filter(n => !n.is_read).length > 0 && (
                                    <span className="text-xs font-medium text-red-500">
                                        {notifications.filter(n => !n.is_read).length} okunmamış
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="px-4 py-3">
                                    <div className="animate-pulse space-y-3">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="flex space-x-3">
                                                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : notifications.length > 0 ? (
                                <>
                                    {/* Okunmamış mesajlar */}
                                    {notifications.filter(n => !n.is_read).length > 0 && (
                                        <div className="py-2">
                                            <div className="px-4 py-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                    Okunmamış
                                                </p>
                                            </div>
                                            {notifications
                                                .filter(n => !n.is_read)
                                                .map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        onClick={() => handleNotificationClick(notification.id)}
                                                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex-shrink-0">
                                                                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                                                                    <FaEnvelope className="h-5 w-5 text-primary" />
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                    {notification.fullname}
                                                                </p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                                                    {notification.message}
                                                                </p>
                                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                                    {formatDistanceToNow(new Date(notification.created_at), {
                                                                        addSuffix: true,
                                                                        locale: tr
                                                                    })}
                                                                </p>
                                                            </div>
                                                            <FaCircle className="h-2 w-2 text-primary mt-2" />
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}

                                    {/* Okunmuş mesajlar */}
                                    {notifications.filter(n => n.is_read).length > 0 && (
                                        <div className="py-2">
                                            <div className="px-4 py-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                    Son Okunanlar
                                                </p>
                                            </div>
                                            {notifications
                                                .filter(n => n.is_read)
                                                .map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        onClick={() => router.push(`/dashboard/contacts/${notification.id}`)}
                                                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors opacity-75"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex-shrink-0">
                                                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                                                    {notification.fullname}
                                                                </p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                                                    {notification.message}
                                                                </p>
                                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                                    {formatDistanceToNow(new Date(notification.created_at), {
                                                                        addSuffix: true,
                                                                        locale: tr
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="px-4 py-6 text-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Bildirim yok
                                    </p>
                                </div>
                            )}
                        </div>

                        {notifications.filter(n => !n.is_read).length > 0 && (
                            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        router.push('/dashboard/contacts')
                                        setIsOpen(false)
                                    }}
                                    className="text-sm text-primary hover:text-primary/80 font-medium w-full text-center"
                                >
                                    Tüm mesajları görüntüle
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
