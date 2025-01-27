'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { FaUser } from 'react-icons/fa'
import useUserStore from '@/app/store/userStore'
import { User } from '@supabase/supabase-js'

interface Profile {
    id: string
    full_name: string
    updated_at: string
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const supabase = createClient()
    const { user, updateUser } = useUserStore()

    useEffect(() => {
        loadProfile()
    }, [user])

    const loadProfile = async () => {
        if (user) {
            setProfile({
                id: user.id,
                full_name: user.user_metadata.name || '',
                updated_at: new Date().toISOString()
            })
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!profile) return

        setSaving(true)
        try {
            // Update auth metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: { name: profile.full_name }
            })

            if (authError) throw authError

            toast.success('Profil başarıyla güncellendi')

            updateUser({ ...user, user_metadata: { ...user?.user_metadata, name: profile.full_name } } as User)

        } catch (error) {
            console.error('Error saving profile:', error)
            toast.error('Profil kaydedilirken bir hata oluştu')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="py-6">
            <div className="px-4 sm:px-6 md:px-8">
                <div className="max-w-2xl">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Profil</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Kişisel bilgilerinizi buradan güncelleyebilirsiniz
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Ad Soyad
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="full_name"
                                    id="full_name"
                                    value={profile?.full_name || ''}
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, full_name: e.target.value } : null)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
                                    placeholder="Adınız ve Soyadınız"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Kaydediliyor...
                                    </>
                                ) : 'Kaydet'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
} 