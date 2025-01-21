'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { FaUser, FaEnvelope, FaClock, FaCheck, FaTimes } from 'react-icons/fa'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface User extends SupabaseUser {
    provider?: string
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        try {
            const response = await fetch('/api/users')
            if (!response.ok) throw new Error('Failed to fetch users')

            const users = await response.json()
            setUsers(users)
        } catch (error) {
            console.error('Error loading users:', error)
            toast.error('Kullanıcılar yüklenirken bir hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (date: string | null | undefined) => {
        if (!date) return '-'
        return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: tr })
    }

    return (
        <div className="p-6">
            <div className="max-w-6xl">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200/50 dark:border-gray-700">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Kullanıcılar</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Sistemde kayıtlı olan tüm kullanıcıların listesi
                        </p>
                    </div>

                    <div className="p-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <FaUser className="h-4 w-4" />
                                                    Kullanıcı
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <FaEnvelope className="h-4 w-4" />
                                                    E-posta Durumu
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <FaClock className="h-4 w-4" />
                                                    Kayıt Tarihi
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <FaClock className="h-4 w-4" />
                                                    Son Giriş
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Provider
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                                                                <FaUser className="h-5 w-5 text-primary" />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {user.email}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                ID: {user.id.slice(0, 8)}...
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.email_confirmed_at ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                                            <FaCheck className="h-3 w-3" />
                                                            Onaylı
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                                                            <FaTimes className="h-3 w-3" />
                                                            Onaylanmamış
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                    {formatDate(user.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                    {formatDate(user.last_sign_in_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                                                        {user.provider || 'email'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {users.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">Henüz kayıtlı kullanıcı bulunmuyor</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 