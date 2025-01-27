'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { format, formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { FaSearch, FaEnvelope, FaEnvelopeOpen, FaPhone, FaUser, FaFilter, FaTimes, FaTrash, FaEdit } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useDebounce } from 'use-debounce'

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

export default function ContactsPage() {
    const [allContacts, setAllContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
    const [filters, setFilters] = useState({
        readStatus: 'all' // 'all', 'read', 'unread'
    })
    const contactsPerPage = 10
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [contactToDelete, setContactToDelete] = useState<Contact | null>(null)

    const supabase = createClient()
    const router = useRouter()

    // İlk yüklemede tüm mesajları getir
    const loadAllContacts = useCallback(async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setAllContacts(data || [])
        } catch (error) {
            console.error('Error loading contacts:', error)
            toast.error('Mesajlar yüklenirken bir hata oluştu')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadAllContacts()
    }, [])

    // Filtreleme ve arama işlemlerini client-side yap
    const filteredContacts = useMemo(() => {
        return allContacts.filter(contact => {
            // Arama filtresi
            if (debouncedSearchTerm) {
                const searchLower = debouncedSearchTerm.toLowerCase()
                const matchesSearch =
                    (contact.fullname || '').toLowerCase().includes(searchLower) ||
                    (contact.email || '').toLowerCase().includes(searchLower) ||
                    (contact.phone || '').toLowerCase().includes(searchLower) ||
                    (contact.message || '').toLowerCase().includes(searchLower)

                if (!matchesSearch) return false
            }

            // Okunma durumu filtresi
            if (filters.readStatus !== 'all') {
                if (filters.readStatus === 'read' && !contact.is_read) return false
                if (filters.readStatus === 'unread' && contact.is_read) return false
            }

            return true
        })
    }, [allContacts, debouncedSearchTerm, filters.readStatus])

    // Sayfalama
    const paginatedContacts = useMemo(() => {
        const startIndex = (currentPage - 1) * contactsPerPage
        const endIndex = startIndex + contactsPerPage
        return filteredContacts.slice(startIndex, endIndex)
    }, [filteredContacts, currentPage])

    const totalCount = filteredContacts.length
    const totalPages = Math.ceil(totalCount / contactsPerPage)

    // Sayfa değiştiğinde scroll'u yukarı al
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [currentPage])

    const handleMarkAsRead = async (contact: Contact) => {
        try {
            const { error } = await supabase
                .from('contacts')
                .update({
                    is_read: !contact.is_read,
                    read_date: !contact.is_read ? new Date().toISOString() : null
                })
                .eq('id', contact.id)

            if (error) throw error

            // Sadece ilgili mesajı güncelle
            setAllContacts(prev => prev.map(c =>
                c.id === contact.id
                    ? { ...c, is_read: !c.is_read, read_date: !c.is_read ? new Date().toISOString() : null }
                    : c
            ))

            toast.success(contact.is_read ? 'Mesaj okunmadı olarak işaretlendi' : 'Mesaj okundu olarak işaretlendi')
        } catch (error) {
            console.error('Error updating contact:', error)
            toast.error('Mesaj durumu güncellenirken bir hata oluştu')
        }
    }

    const handleDelete = async () => {
        if (!contactToDelete) return

        try {
            const { error } = await supabase
                .from('contacts')
                .delete()
                .eq('id', contactToDelete.id)

            if (error) throw error

            setAllContacts(prev => prev.filter(c => c.id !== contactToDelete.id))
            toast.success('Mesaj başarıyla silindi')
            setDeleteModalOpen(false)
            setContactToDelete(null)
        } catch (error) {
            console.error('Error deleting contact:', error)
            toast.error('Mesaj silinirken bir hata oluştu')
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

    return (
        <div className="py-6">
            <div className="px-4 sm:px-6 md:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <FaEnvelope className="h-6 w-6 text-primary" />
                            Gelen Kutusu
                        </h1>
                        <div className="mt-1 flex items-center gap-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Toplam {totalCount} mesaj
                            </span>
                            <span className="text-sm">
                                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    {allContacts.filter(c => !c.is_read).length} Okunmamış
                                </span>
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/dashboard/contacts/template')}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                    >
                        <FaEdit className="mr-2 h-4 w-4" />
                        Mail Şablonu Düzenle
                    </button>
                </div>

                {/* Filtreler */}
                <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Arama */}
                        <div className="col-span-1 sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Arama
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="İsim, e-posta, telefon veya mesaj içinde ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                                />
                                {searchTerm && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                        >
                                            <FaTimes className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Durum Filtresi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Durum
                            </label>
                            <select
                                value={filters.readStatus}
                                onChange={(e) => setFilters(prev => ({ ...prev, readStatus: e.target.value }))}
                                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                            >
                                <option value="all">Tüm Mesajlar</option>
                                <option value="unread">Okunmamış</option>
                                <option value="read">Okunmuş</option>
                            </select>
                        </div>

                        {/* İstatistikler */}
                        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Hızlı İstatistikler
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-md text-center">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {allContacts.filter(c => c.is_read).length}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Okunmuş
                                    </div>
                                </div>
                                <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-md text-center">
                                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                        {allContacts.filter(c => !c.is_read).length}
                                    </div>
                                    <div className="text-xs text-blue-600 dark:text-blue-300">
                                        Okunmamış
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="">
                    {/* Tablo */}
                    <div className="mt-6 p-4">
                        <div className="-mx-4 -my-2 overflow-x-auto">
                            <div className="inline-block min-w-full py-2 align-middle">
                                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 dark:ring-white/10 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                                                    Durum
                                                </th>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Ad Soyad
                                                </th>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    E-posta
                                                </th>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Telefon
                                                </th>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Tarih
                                                </th>
                                                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">İşlemler</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                                            {paginatedContacts.map((contact) => (
                                                <tr
                                                    key={contact.id}
                                                    onDoubleClick={() => router.push(`/dashboard/contacts/${contact.id}`)}
                                                    className={`${!contact.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''} hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer`}
                                                >
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                        {contact.is_read ? (
                                                            <FaEnvelopeOpen className="h-5 w-5 text-gray-400" />
                                                        ) : (
                                                            <FaEnvelope className="h-5 w-5 text-blue-500" />
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                        <div className="flex items-center">
                                                            <FaUser className="h-4 w-4 text-gray-400 mr-2" />
                                                            <span className="font-medium text-gray-900 dark:text-white">
                                                                {contact.fullname}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                        <div className="flex items-center">
                                                            <FaEnvelope className="h-4 w-4 text-gray-400 mr-2" />
                                                            <a
                                                                href={`mailto:${contact.email}`}
                                                                className="text-primary hover:text-primary/80"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {contact.email}
                                                            </a>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                        <div className="flex items-center">
                                                            {
                                                                contact.phone ? (<>
                                                                    <FaPhone className="h-4 w-4 text-gray-400 mr-2" />
                                                                    <a
                                                                        href={`tel:${contact.phone}`}
                                                                        className="text-primary hover:text-primary/80"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        {contact.phone}
                                                                    </a>
                                                                </>
                                                                ) : <span className="text-gray-400">Telefon yok</span>
                                                            }

                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                        <div
                                                            className="cursor-help"
                                                            title={format(new Date(contact.created_at), 'dd MMMM yyyy HH:mm', { locale: tr })}
                                                        >
                                                            {formatDistanceToNow(new Date(contact.created_at), {
                                                                addSuffix: true,
                                                                locale: tr
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleMarkAsRead(contact)
                                                                }}
                                                                className="text-primary hover:text-primary/80"
                                                            >
                                                                {contact.is_read ? 'Okunmadı Yap' : 'Okundu Yap'}
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setContactToDelete(contact)
                                                                    setDeleteModalOpen(true)
                                                                }}
                                                                className="text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                                                            >
                                                                <FaTrash className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {paginatedContacts.length === 0 && (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 dark:text-gray-400">Henüz mesaj yok</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sayfalama */}
                    {totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    Önceki
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    Sonraki
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Toplam <span className="font-medium">{totalCount}</span> mesajdan{' '}
                                        <span className="font-medium">{Math.max(1, (currentPage - 1) * contactsPerPage)}</span>-
                                        <span className="font-medium">{Math.min(currentPage * contactsPerPage, totalCount)}</span> arası gösteriliyor
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => setCurrentPage(index + 1)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1
                                                    ? 'z-10 bg-primary border-primary text-white'
                                                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
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
                                    onClick={() => {
                                        setDeleteModalOpen(false)
                                        setContactToDelete(null)
                                    }}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
                                >
                                    İptal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    )
}
