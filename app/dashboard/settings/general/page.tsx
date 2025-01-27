'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { FaHeading, FaAlignLeft, FaTags, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaSave } from 'react-icons/fa'

interface GeneralSettings {
    title: string
    description: string
    keywords: string
    contact_email: string
    contact_phone: string
    contact_address: string
    footer_copyright: string
}

export default function GeneralSettingsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState<GeneralSettings>({
        title: '',
        description: '',
        keywords: '',
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        footer_copyright: ''
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
                .in('key', [
                    'title', 'description', 'keywords',
                    'contact_email', 'contact_phone', 'contact_address',
                    'footer_copyright'
                ])

            if (error) throw error

            const newSettings = { ...settings }
            data?.forEach(item => {
                newSettings[item.key as keyof GeneralSettings] = item.value || ''
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

            toast.success('Genel ayarlar başarıyla kaydedildi')
        } catch (error) {
            console.error('Error saving settings:', error)
            toast.error('Ayarlar kaydedilirken bir hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Genel Ayarlar</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Web sitenizin genel ayarlarını buradan yapılandırabilirsiniz
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Genel Ayarlar*/}
                        <div className="space-y-6">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Genel Ayarları</h2>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Site Başlığı
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaHeading className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        name="title"
                                        value={settings.title}
                                        onChange={handleChange}
                                        placeholder="Sitenizin başlığını girin"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                                 dark:focus:ring-primary/30 dark:focus:border-primary dark:text-white
                                                 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                                        required
                                    />
                                </div>
                            </div>
                        </div>


                        {/* İletişim Bilgileri */}
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">İletişim Bilgileri</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        E-posta Adresi
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <input
                                            type="email"
                                            name="contact_email"
                                            value={settings.contact_email}
                                            onChange={handleChange}
                                            placeholder="ornek@domain.com"
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                     bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                                     dark:focus:ring-primary/30 dark:focus:border-primary dark:text-white
                                                     placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Telefon Numarası
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaPhone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="contact_phone"
                                            value={settings.contact_phone}
                                            onChange={handleChange}
                                            placeholder="+90 555 123 4567"
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                     bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                                     dark:focus:ring-primary/30 dark:focus:border-primary dark:text-white
                                                     placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Adres
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                            <FaMapMarkerAlt className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <textarea
                                            name="contact_address"
                                            value={settings.contact_address}
                                            onChange={handleChange}
                                            placeholder="Adres bilgilerinizi girin"
                                            rows={3}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                     bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                                     dark:focus:ring-primary/30 dark:focus:border-primary dark:text-white
                                                     placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Ayarları */}
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Footer Ayarları</h2>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Copyright Metni
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaHeading className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        name="footer_copyright"
                                        value={settings.footer_copyright}
                                        onChange={handleChange}
                                        placeholder="© 2024 Şirket Adı. Tüm hakları saklıdır."
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                                 dark:focus:ring-primary/30 dark:focus:border-primary dark:text-white
                                                 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Footer alanında görünecek telif hakkı metni
                                </p>
                            </div>
                        </div>

                        {/* SEO Ayarları */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">SEO Ayarları</h2>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Site Açıklaması
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                        <FaAlignLeft className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <textarea
                                        name="description"
                                        value={settings.description}
                                        onChange={handleChange}
                                        placeholder="Sitenizin açıklamasını girin"
                                        rows={4}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                                 dark:focus:ring-primary/30 dark:focus:border-primary dark:text-white
                                                 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200 resize-none"
                                        required
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Bu açıklama arama motorlarında görünecektir
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Anahtar Kelimeler
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaTags className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        name="keywords"
                                        value={settings.keywords}
                                        onChange={handleChange}
                                        placeholder="örn: web tasarım, yazılım, blog"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                                 dark:focus:ring-primary/30 dark:focus:border-primary dark:text-white
                                                 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                                        required
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Virgülle ayırarak birden fazla anahtar kelime girebilirsiniz
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm 
                                         text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 
                                         focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed
                                         transition-colors duration-200"
                            >
                                <FaSave className={`mr-2 h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`} />
                                {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
} 