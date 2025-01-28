'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { FaSave, FaChevronRight, FaArrowLeft } from 'react-icons/fa'
import React from 'react'
import { Editor } from '../../components/Editor'
import { PostFormData, Category } from '../../types'
import { loadCategories, updatePostCategories } from '../../utils/categories'
import { PostSettings } from '../../components/settings/PostSettings'

interface PageParams {
    id: string;
}

export default function EditPostPage({ params }: { params: Promise<PageParams> }) {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const resolvedParams = React.use(params)
    const postId = resolvedParams.id
    const [formData, setFormData] = useState<PostFormData>({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        featured_image: '',
        status: 'draft',
        categories: [],
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        is_indexable: true,
        canonical_url: ''
    })

    const supabase = createClient()

    // Post verisini yükle
    useEffect(() => {
        const loadPost = async () => {
            try {
                const { data: post, error } = await supabase
                    .from('posts')
                    .select(`
                        *,
                        categories:post_categories(
                            category:categories(id)
                        )
                    `)
                    .eq('id', postId)
                    .single()

                if (error) throw error

                if (post) {
                    setFormData({
                        title: post.title,
                        slug: post.slug,
                        content: post.content,
                        excerpt: post.excerpt || '',
                        featured_image: post.featured_image || '',
                        status: post.status as 'draft' | 'published',
                        categories: post.categories?.map((c: any) => c.category.id) || [],
                        meta_title: post.meta_title || '',
                        meta_description: post.meta_description || '',
                        meta_keywords: post.meta_keywords || '',
                        is_indexable: post.is_indexable ?? true,
                        canonical_url: post.canonical_url || ''
                    })
                }
            } catch (error) {
                console.error('Error loading post:', error)
                toast.error('Yazı yüklenirken bir hata oluştu')
            }
        }

        loadPost()
    }, [postId])

    // Kategorileri yükle
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { categories, defaultCategory } = await loadCategories()
                setCategories(categories)

                // Varsayılan kategoriyi seç
                if (defaultCategory && formData.categories.length === 0) {
                    setFormData(prev => ({
                        ...prev,
                        categories: [defaultCategory.id]
                    }))
                }
            } catch (error) {
                toast.error('Kategoriler yüklenirken bir hata oluştu')
            }
        }

        fetchCategories()
    }, [])

    // Başlıktan otomatik slug oluştur
    useEffect(() => {
        if (formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')

            setFormData(prev => ({ ...prev, slug }))
        }
    }, [formData.title])

    // Başlıktan otomatik meta title oluştur
    useEffect(() => {
        if (formData.title && !formData.meta_title) {
            setFormData(prev => ({ ...prev, meta_title: formData.title }))
        }
    }, [formData.title])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Yazıyı güncelle
            const { error: postError } = await supabase
                .from('posts')
                .update({
                    title: formData.title,
                    slug: formData.slug,
                    content: formData.content,
                    excerpt: formData.excerpt,
                    featured_image: formData.featured_image,
                    status: formData.status,
                    meta_title: formData.meta_title,
                    meta_description: formData.meta_description,
                    meta_keywords: formData.meta_keywords,
                    is_indexable: formData.is_indexable,
                    canonical_url: formData.canonical_url,
                    updated_at: new Date().toISOString(),
                    published_at: formData.status === 'published' ? new Date().toISOString() : null
                })
                .eq('id', postId)

            if (postError) throw postError

            // Kategorileri güncelle
            await updatePostCategories(postId, formData.categories)

            toast.success('Yazı başarıyla güncellendi')
            router.push('/dashboard/blog/posts')
        } catch (error) {
            console.error('Error updating post:', error)
            toast.error('Yazı güncellenirken bir hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    // Kategori ağacını render et
    const renderCategoryTree = (categories: Category[], level = 0) => {
        return categories.map(category => (
            <React.Fragment key={category.id}>
                <label className="flex items-center">
                    <div style={{ width: `${level * 20}px` }} />
                    <input
                        type="checkbox"
                        checked={formData.categories.includes(category.id)}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setFormData(prev => ({
                                    ...prev,
                                    categories: [...prev.categories, category.id]
                                }))
                            } else {
                                if (formData.categories.length > 1) {
                                    setFormData(prev => ({
                                        ...prev,
                                        categories: prev.categories.filter(id => id !== category.id)
                                    }))
                                }
                            }
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
                    />
                    <div className="ml-2 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        {category.children && category.children.length > 0 && (
                            <FaChevronRight className="h-3 w-3 text-gray-400" />
                        )}
                        <span>{category.name}</span>
                    </div>
                </label>
                {category.children && category.children.length > 0 && (
                    <div className="ml-2">
                        {renderCategoryTree(category.children, level + 1)}
                    </div>
                )}
            </React.Fragment>
        ))
    }

    const handleFieldChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Üst Bar */}
            <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-1 items-center gap-4">
                            <button
                                onClick={() => router.push('/dashboard/blog/posts')}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <FaArrowLeft size={20} />
                            </button>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleFieldChange('title', e.target.value)}
                                placeholder="Yazı başlığı..."
                                className="w-fulltext-xl font-medium bg-transparent border-0 outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={formData.status}
                                onChange={(e) => handleFieldChange('status', e.target.value)}
                                className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                            >
                                <option value="draft">Taslak</option>
                                <option value="published">Yayınla</option>
                            </select>
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Kaydediliyor</span>
                                    </>
                                ) : (
                                    <>
                                        <FaSave size={16} />
                                        <span>Kaydet</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ana İçerik */}
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sol Panel - Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        <Editor
                            content={formData.content}
                            onChange={(content) => handleFieldChange('content', content)}
                        />
                    </div>

                    {/* Sağ Panel - Ayarlar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <PostSettings
                                formData={formData}
                                categories={categories}
                                onChange={handleFieldChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 