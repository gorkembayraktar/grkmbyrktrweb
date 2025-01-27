'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { FaSave, FaEye, FaArrowLeft, FaPlus } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

interface MailTemplate {
    subject: string
    body: string
}

export default function MailTemplatePage() {
    const [isLoading, setIsLoading] = useState(false)
    const [template, setTemplate] = useState<MailTemplate>({
        subject: '',
        body: ''
    })
    const [previewData, setPreviewData] = useState({
        fullname: 'John Doe',
        email: 'ornek@email.com',
        phone: '+90 555 123 4567',
        message: 'Örnek mesaj içeriği buraya gelecek.'
    })

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        loadTemplate()
    }, [])

    const loadTemplate = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('key, value')
                .in('key', ['mail_template_subject', 'mail_template_body'])

            if (error) throw error

            const newTemplate = { ...template }
            data?.forEach(item => {
                if (item.key === 'mail_template_subject') newTemplate.subject = item.value || ''
                if (item.key === 'mail_template_body') newTemplate.body = item.value || ''
            })
            setTemplate(newTemplate)
        } catch (error) {
            console.error('Error loading template:', error)
            toast.error('Şablon yüklenirken bir hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const updates = [
                { key: 'mail_template_subject', value: template.subject },
                { key: 'mail_template_body', value: template.body }
            ]

            const { error } = await supabase
                .from('settings')
                .upsert(updates, { onConflict: 'key' })

            if (error) throw error

            toast.success('Mail şablonu başarıyla kaydedildi')
        } catch (error) {
            console.error('Error saving template:', error)
            toast.error('Şablon kaydedilirken bir hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setTemplate(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const getPreviewContent = (text: string) => {
        return text
            .replace('{fullname}', previewData.fullname)
            .replace('{email}', previewData.email)
            .replace('{phone}', previewData.phone)
            .replace('{message}', previewData.message)
    }

    const insertVariable = (variable: string, field: 'subject' | 'body') => {
        const input = field === 'body' ? document.querySelector('textarea[name="body"]') : document.querySelector('input[name="subject"]')
        if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
            const start = input.selectionStart || 0
            const end = input.selectionEnd || 0
            const newValue = input.value.substring(0, start) + variable + input.value.substring(end)
            setTemplate(prev => ({
                ...prev,
                [field]: newValue
            }))
            // Set cursor position after the inserted variable
            setTimeout(() => {
                input.focus()
                input.setSelectionRange(start + variable.length, start + variable.length)
            }, 0)
        }
    }

    const VariableButton = ({ variable }: { variable: string }) => (
        <button
            type="button"
            onClick={() => insertVariable(`{${variable}}`, activeField)}
            className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                     hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600
                     focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
            <span className="flex items-center gap-1">
                <FaPlus className="h-3 w-3" />
                {variable}
            </span>
        </button>
    )

    const [activeField, setActiveField] = useState<'subject' | 'body'>('subject')

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            <FaArrowLeft className="mr-2 h-4 w-4" />
                            Geri Dön
                        </button>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Mail Şablonu</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Şablon Düzenleme */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Şablon Düzenle</h2>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Mail şablonunu özelleştirin. Değişkenler için: {'{fullname}'}, {'{email}'}, {'{phone}'}, {'{message}'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Değişkenler
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    <VariableButton variable="fullname" />
                                    <VariableButton variable="email" />
                                    <VariableButton variable="phone" />
                                    <VariableButton variable="message" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Mail Konusu
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={template.subject}
                                    onChange={handleChange}
                                    onFocus={() => setActiveField('subject')}
                                    placeholder="İletişim Formu: {fullname}"
                                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                             focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                             placeholder-gray-400 dark:placeholder-gray-500"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Mail İçeriği
                                </label>
                                <textarea
                                    name="body"
                                    value={template.body}
                                    onChange={handleChange}
                                    onFocus={() => setActiveField('body')}
                                    placeholder={`Sayın Yetkili,\n\n{fullname} tarafından gönderilen mesaj:\n\n{message}\n\nİletişim Bilgileri:\nE-posta: {email}\nTelefon: {phone}`}
                                    rows={12}
                                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                             focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                             placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                                    required
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm 
                                             text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 
                                             focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaSave className={`mr-2 h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`} />
                                    {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Önizleme */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                <FaEye className="h-5 w-5 text-gray-400" />
                                Önizleme
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Mail şablonunun nasıl görüneceğini buradan kontrol edebilirsiniz
                            </p>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Konu</h3>
                                    <p className="mt-1 text-gray-900 dark:text-white">
                                        {getPreviewContent(template.subject)}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">İçerik</h3>
                                    <div className="mt-1 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <pre className="whitespace-pre-wrap text-gray-900 dark:text-white font-sans">
                                            {getPreviewContent(template.body)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 