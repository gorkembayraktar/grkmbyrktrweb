'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { FaEnvelope, FaServer, FaUser, FaKey, FaAt, FaUserCircle } from 'react-icons/fa'

interface MailSettings {
    smtp_host: string
    smtp_port: string
    smtp_user: string
    smtp_pass: string
    smtp_from: string
    smtp_from_name: string
}

export default function MailSettingsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState<MailSettings>({
        smtp_host: '',
        smtp_port: '',
        smtp_user: '',
        smtp_pass: '',
        smtp_from: '',
        smtp_from_name: ''
    })

    const supabase = createClient()

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('key, value')
                .in('key', ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from', 'smtp_from_name'])

            if (error) throw error

            const newSettings = { ...settings }
            data?.forEach(item => {
                newSettings[item.key as keyof MailSettings] = item.value || ''
            })
            setSettings(newSettings)
        } catch (error) {
            console.error('Error loading settings:', error)
            toast.error('Ayarlar yüklenirken bir hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const updates = Object.entries(settings).map(([key, value]) => ({
                key,
                value
            }))

            const { error } = await supabase
                .from('settings')
                .upsert(updates, { onConflict: 'key' })

            if (error) throw error

            toast.success('Mail ayarları başarıyla kaydedildi')
        } catch (error) {
            console.error('Error saving settings:', error)
            toast.error('Ayarlar kaydedilirken bir hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setSettings(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="p-6">
            <div className="max-w-3xl">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200/50 dark:border-gray-700">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Mail Ayarları</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Mail göndermek için SMTP sunucu bilgilerinizi yapılandırın
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    SMTP Sunucu
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaServer className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        name="smtp_host"
                                        value={settings.smtp_host}
                                        onChange={handleChange}
                                        placeholder="örn: smtp.gmail.com"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                                 dark:focus:ring-primary/30 dark:focus:border-primary dark:text-white
                                                 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    SMTP Port
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaServer className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        name="smtp_port"
                                        value={settings.smtp_port}
                                        onChange={handleChange}
                                        placeholder="örn: 587"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                                 dark:focus:ring-primary/30 dark:focus:border-primary dark:text-white
                                                 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    SMTP Kullanıcı Adı
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        name="smtp_user"
                                        value={settings.smtp_user}
                                        onChange={handleChange}
                                        placeholder="örn: user@gmail.com"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                                 dark:focus:ring-primary/30 dark:focus:border-primary dark:text-white
                                                 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    SMTP Şifre
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaKey className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="password"
                                        name="smtp_pass"
                                        value={settings.smtp_pass}
                                        onChange={handleChange}
                                        placeholder="SMTP şifrenizi girin"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                                 dark:focus:ring-primary/30 dark:focus:border-primary dark:text-white
                                                 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Gönderen E-posta
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaAt className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="email"
                                        name="smtp_from"
                                        value={settings.smtp_from}
                                        onChange={handleChange}
                                        placeholder="örn: info@example.com"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                                 dark:focus:ring-primary/30 dark:focus:border-primary dark:text-white
                                                 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Gönderen Adı
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUserCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        name="smtp_from_name"
                                        value={settings.smtp_from_name}
                                        onChange={handleChange}
                                        placeholder="örn: John Doe"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                                 dark:focus:ring-primary/30 dark:focus:border-primary dark:text-white
                                                 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm 
                                         text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 
                                         focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed
                                         transition-colors duration-200"
                            >
                                <FaEnvelope className={`mr-2 h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`} />
                                {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
} 