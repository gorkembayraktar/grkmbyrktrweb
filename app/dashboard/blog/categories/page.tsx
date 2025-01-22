'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { FaPlus, FaEdit, FaTrash, FaTags, FaChevronRight, FaChevronDown } from 'react-icons/fa'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import DeleteConfirmModal from '@/app/components/modals/DeleteConfirmModal'
import React from 'react'

interface Category {
    id: string
    name: string
    slug: string
    description: string | null
    is_default: boolean
    parent_id: string | null
    created_at: string
    updated_at: string
    _count?: {
        posts: number
    }
    children?: Category[]
}

interface CategoryFormData {
    name: string
    description: string
    parent_id: string | null
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
    const [formData, setFormData] = useState<CategoryFormData>({
        name: '',
        description: '',
        parent_id: null
    })

    const supabase = createClient()

    const loadCategories = async () => {
        try {
            setLoading(true)

            // Tüm kategorileri ve post sayılarını al
            const { data, error } = await supabase
                .from('categories')
                .select(`
                    *,
                    _count: post_categories(count)
                `)
                .order('name', { ascending: true })

            if (error) throw error

            // Post sayılarını düzenle ve kategori ağacını oluştur
            const categoriesWithCount = data.map(category => ({
                ...category,
                _count: {
                    posts: category._count?.[0]?.count || 0
                }
            }))

            // Kategori ağacını oluştur
            const categoryTree = buildCategoryTree(categoriesWithCount)
            setCategories(categoryTree)
        } catch (error) {
            console.error('Error loading categories:', error)
            toast.error('Kategoriler yüklenirken bir hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    // Düz kategori listesinden ağaç yapısı oluştur
    const buildCategoryTree = (flatCategories: Category[]): Category[] => {
        const categoryMap = new Map<string, Category>()
        const rootCategories: Category[] = []

        // Önce tüm kategorileri map'e ekle
        flatCategories.forEach(category => {
            categoryMap.set(category.id, { ...category, children: [] })
        })

        // Sonra parent-child ilişkilerini kur
        flatCategories.forEach(category => {
            const categoryWithChildren = categoryMap.get(category.id)!
            if (category.parent_id) {
                const parent = categoryMap.get(category.parent_id)
                if (parent) {
                    parent.children = parent.children || []
                    parent.children.push(categoryWithChildren)
                }
            } else {
                rootCategories.push(categoryWithChildren)
            }
        })

        return rootCategories
    }

    useEffect(() => {
        loadCategories()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const slug = formData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')

            if (selectedCategory) {
                // Güncelleme işlemi
                const { error } = await supabase
                    .from('categories')
                    .update({
                        name: formData.name,
                        description: formData.description,
                        parent_id: formData.parent_id,
                        slug
                    })
                    .eq('id', selectedCategory.id)

                if (error) throw error
                toast.success('Kategori başarıyla güncellendi')
            } else {
                // Yeni kategori ekleme
                const { error } = await supabase
                    .from('categories')
                    .insert([{
                        name: formData.name,
                        description: formData.description,
                        parent_id: formData.parent_id,
                        slug
                    }])

                if (error) throw error
                toast.success('Kategori başarıyla eklendi')
            }

            // Modal'ı kapat ve formu sıfırla
            setShowModal(false)
            setSelectedCategory(null)
            setFormData({
                name: '',
                description: '',
                parent_id: null
            })

            // Kategorileri yeniden yükle
            await loadCategories()
        } catch (error: any) {
            console.error('Error saving category:', error)
            toast.error(error?.message || 'Kategori kaydedilirken bir hata oluştu')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteClick = (category: Category) => {
        if (category.is_default) {
            toast.error('Genel kategori silinemez')
            return
        }

        if (category._count?.posts && category._count.posts > 0) {
            toast.error('Bu kategoride yazılar bulunuyor. Önce yazıları başka kategorilere taşıyın.')
            return
        }

        if (category.children && category.children.length > 0) {
            toast.error('Bu kategorinin alt kategorileri var. Önce alt kategorileri silmelisiniz.')
            return
        }

        setSelectedCategory(category)
        setShowDeleteModal(true)
    }

    const handleDelete = async () => {
        if (!selectedCategory) return

        setIsSubmitting(true)
        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', selectedCategory.id)

            if (error) throw error

            toast.success('Kategori başarıyla silindi')
            setShowDeleteModal(false)
            setSelectedCategory(null)
            await loadCategories()
        } catch (error) {
            console.error('Error deleting category:', error)
            toast.error('Kategori silinirken bir hata oluştu')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = (category: Category) => {
        setSelectedCategory(category)
        setFormData({
            name: category.name,
            description: category.description || '',
            parent_id: category.parent_id
        })
        setShowModal(true)
    }

    const toggleExpand = (categoryId: string) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev)
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId)
            } else {
                newSet.add(categoryId)
            }
            return newSet
        })
    }

    // Bir kategorinin alt kategorilerini (ve onların alt kategorilerini) bulan yardımcı fonksiyon
    const getDescendantIds = (category: Category): Set<string> => {
        const descendants = new Set<string>()

        const addDescendants = (cat: Category) => {
            if (cat.children) {
                for (const child of cat.children) {
                    descendants.add(child.id)
                    addDescendants(child)
                }
            }
        }

        addDescendants(category)
        return descendants
    }

    // Kategori seçeneklerini oluşturan yardımcı fonksiyon
    const renderCategoryOptions = (categories: Category[], level = 0, disabledIds?: Set<string>): React.ReactElement[] => {
        return categories.map(category => {
            const isDisabled = disabledIds?.has(category.id) || selectedCategory?.id === category.id

            const options = [(
                <option
                    key={category.id}
                    value={category.id}
                    disabled={isDisabled}
                >
                    {'\u00A0'.repeat(level * 2)}{'─'.repeat(level > 0 ? 1 : 0)} {category.name}
                </option>
            )]

            if (category.children && category.children.length > 0) {
                options.push(...renderCategoryOptions(category.children, level + 1, disabledIds))
            }

            return options
        }).flat()
    }

    const renderCategoryRow = (category: Category, level = 0): React.ReactNode => {
        const hasChildren = category.children && category.children.length > 0
        const isExpanded = expandedCategories.has(category.id)

        return (
            <React.Fragment key={category.id}>
                <tr>
                    <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div>
                            <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                <div style={{ width: `${level * 24}px` }} />
                                {hasChildren && (
                                    <button
                                        onClick={() => toggleExpand(category.id)}
                                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        {isExpanded ? (
                                            <FaChevronDown className="h-4 w-4" />
                                        ) : (
                                            <FaChevronRight className="h-4 w-4" />
                                        )}
                                    </button>
                                )}
                                {!hasChildren && <div className="w-4" />}
                                <FaTags className="h-4 w-4 text-primary" />
                                {category.name}
                                {category.is_default && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                        Varsayılan
                                    </span>
                                )}
                            </div>
                            {category.description && (
                                <div className="mt-1 text-gray-500 dark:text-gray-400 ml-8">
                                    {category.description}
                                </div>
                            )}
                        </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {category._count?.posts || 0} yazı
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {format(new Date(category.created_at), 'dd MMM yyyy', { locale: tr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-3 justify-end">
                            <button
                                onClick={() => handleEdit(category)}
                                className="text-primary hover:text-primary/80 transition-colors"
                                title="Düzenle"
                            >
                                <FaEdit className="h-5 w-5" />
                            </button>
                            {!category.is_default && (
                                <button
                                    onClick={() => handleDeleteClick(category)}
                                    className="text-red-500 hover:text-red-600 transition-colors"
                                    title="Sil"
                                >
                                    <FaTrash className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </td>
                </tr>
                {hasChildren && isExpanded && category.children?.map(child => renderCategoryRow(child, level + 1))}
            </React.Fragment>
        )
    }

    return (
        <div className="py-6">
            <div className="px-4 sm:px-6 md:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Kategoriler</h1>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            Blog yazılarının kategorilerini yönetin
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            onClick={() => {
                                setSelectedCategory(null)
                                setFormData({
                                    name: '',
                                    description: '',
                                    parent_id: null
                                })
                                setShowModal(true)
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                            Yeni Kategori
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex flex-col">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle">
                            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 dark:ring-white/10 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                                                Kategori
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                Yazı Sayısı
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                Oluşturulma
                                            </th>
                                            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">İşlemler</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                                        {categories.map(category => renderCategoryRow(category))}
                                    </tbody>
                                </table>

                                {categories.length === 0 && !loading && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">Henüz kategori eklenmemiş</p>
                                    </div>
                                )}

                                {loading && (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Kategori Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity"
                            onClick={() => setShowModal(false)}
                        >
                            <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
                        </div>

                        <div className="inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all">
                            <form onSubmit={handleSubmit}>
                                <div className="px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        {selectedCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
                                    </h3>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Kategori Adı
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                                         bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-primary 
                                                         focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Açıklama
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                rows={3}
                                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                                         bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-primary 
                                                         focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Üst Kategori
                                            </label>
                                            <select
                                                value={formData.parent_id || ''}
                                                onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || null })}
                                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                                         bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-primary 
                                                         focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                                            >
                                                <option value="">Ana Kategori</option>
                                                {renderCategoryOptions(
                                                    categories,
                                                    0,
                                                    selectedCategory ? getDescendantIds(selectedCategory) : undefined
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex flex-row-reverse gap-3">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Kaydediliyor...
                                            </>
                                        ) : (
                                            selectedCategory ? 'Güncelle' : 'Ekle'
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    >
                                        İptal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                title="Kategoriyi Sil"
                message={`"${selectedCategory?.name}" kategorisini silmek istediğinizden emin misiniz?`}
                isLoading={isSubmitting}
                onConfirm={handleDelete}
                onCancel={() => {
                    setShowDeleteModal(false)
                    setSelectedCategory(null)
                }}
            />
        </div>
    )
} 