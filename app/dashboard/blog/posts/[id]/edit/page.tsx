'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { FaSave, FaImage, FaTimes, FaEye, FaCog, FaTags, FaChevronDown, FaChevronRight } from 'react-icons/fa'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import FontFamily from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'

interface Category {
    id: string
    name: string
    parent_id: string | null
    children?: Category[]
}

interface PostFormData {
    title: string
    slug: string
    content: string
    excerpt: string
    featured_image: string
    status: 'draft' | 'published'
    categories: string[]
    // SEO alanları
    meta_title: string
    meta_description: string
    meta_keywords: string
    is_indexable: boolean
    canonical_url: string
}

interface PageParams {
    id: string;
}

export default function EditPostPage({ params }: { params: Promise<PageParams> }) {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content')
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

    // Yazıyı yükle
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
            } catch (error: any) {
                console.error('Error loading post:', error)
                toast.error('Yazı yüklenirken bir hata oluştu')
            }
        }

        loadPost()
    }, [postId])

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary hover:text-primary/80 underline'
                }
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full'
                }
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse table-auto w-full'
                }
            }),
            TableRow,
            TableHeader,
            TableCell,
            TextStyle,
            Color,
            TextAlign.configure({
                types: ['heading', 'paragraph']
            }),
            FontFamily,
            Highlight.configure({
                multicolor: true
            }),
            Typography
        ],
        content: formData.content,
        onUpdate: ({ editor }) => {
            setFormData(prev => ({ ...prev, content: editor.getHTML() }))
        }
    })

    // Kategorileri yükle
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const { data, error } = await supabase
                    .from('categories')
                    .select('id, name, parent_id')
                    .order('name')

                if (error) throw error

                // Kategori ağacını oluştur
                const categoryTree = buildCategoryTree(data)
                setCategories(categoryTree)

                // Varsayılan kategoriyi seç
                const defaultCategory = data.find(c => c.name === 'Genel')
                if (defaultCategory) {
                    setFormData(prev => ({
                        ...prev,
                        categories: [defaultCategory.id]
                    }))
                }
            } catch (error) {
                console.error('Error loading categories:', error)
                toast.error('Kategoriler yüklenirken bir hata oluştu')
            }
        }

        loadCategories()
    }, [])

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
                        className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
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

            // Mevcut kategorileri sil
            const { error: deleteError } = await supabase
                .from('post_categories')
                .delete()
                .eq('post_id', postId)

            if (deleteError) throw deleteError

            // Yeni kategorileri ekle
            if (formData.categories.length > 0) {
                const { error: categoryError } = await supabase
                    .from('post_categories')
                    .insert(
                        formData.categories.map(categoryId => ({
                            post_id: postId,
                            category_id: categoryId
                        }))
                    )

                if (categoryError) throw categoryError
            }

            toast.success('Yazı başarıyla güncellendi')
            router.push('/dashboard/blog/posts')
        } catch (error: any) {
            console.error('Error updating post:', error)
            toast.error(error?.message || 'Yazı güncellenirken bir hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    // Fix heading level type
    const handleHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const level = parseInt(e.target.value)
        if (level === 0) {
            editor?.chain().focus().setParagraph().run()
        } else if (level >= 1 && level <= 6) {
            editor?.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()
        }
    }

    return (
        <div className="py-6">
            <div className="px-4 sm:px-6 md:px-8">
                <form onSubmit={handleSubmit}>
                    {/* Üst Bar */}
                    <div className="mb-6 flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Yazıyı Düzenle
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className={`px-2 py-1 rounded-full ${formData.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                    {formData.status === 'published' ? 'Yayında' : 'Taslak'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                İptal
                            </button>
                            <div className="relative">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Kaydediliyor...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave className="-ml-1 mr-2 h-4 w-4" />
                                            Kaydet
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Ana İçerik */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Sol Kolon - Ana Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Başlık */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Başlık yazın..."
                                    className="w-full text-3xl font-medium bg-transparent p-0 
                                             border-0 border-b-2 border-transparent 
                                             focus:border-0 focus:ring-0 
                                             transition-colors duration-200 ease-in-out
                                             dark:text-white placeholder-gray-400/60 dark:placeholder-gray-500/60
                                             hover:border-b-2 hover:border-gray-200 dark:hover:border-gray-700"
                                    required
                                />
                            </div>

                            {/* İçerik */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                                <div className="border-b border-gray-200 dark:border-gray-700 p-2">
                                    <div className="flex flex-wrap gap-2 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                                        <select
                                            onChange={handleHeadingChange}
                                            value={
                                                editor?.isActive('heading', { level: 1 }) ? '1' :
                                                    editor?.isActive('heading', { level: 2 }) ? '2' :
                                                        editor?.isActive('heading', { level: 3 }) ? '3' :
                                                            editor?.isActive('heading', { level: 4 }) ? '4' :
                                                                editor?.isActive('heading', { level: 5 }) ? '5' :
                                                                    editor?.isActive('heading', { level: 6 }) ? '6' : '0'
                                            }
                                            className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                                        >
                                            <option value="0">Normal</option>
                                            <option value="1">Başlık 1</option>
                                            <option value="2">Başlık 2</option>
                                            <option value="3">Başlık 3</option>
                                            <option value="4">Başlık 4</option>
                                            <option value="5">Başlık 5</option>
                                            <option value="6">Başlık 6</option>
                                        </select>

                                        <select
                                            onChange={(e) => editor?.chain().focus().setFontFamily(e.target.value).run()}
                                            value={editor?.getAttributes('textStyle').fontFamily}
                                            className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                                        >
                                            <option value="system-ui">Sistem Fontu</option>
                                            <option value="Arial">Arial</option>
                                            <option value="Georgia">Georgia</option>
                                            <option value="Times New Roman">Times New Roman</option>
                                            <option value="Courier New">Courier New</option>
                                        </select>

                                        <div className="flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-2">
                                            <input
                                                type="color"
                                                onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
                                                value={editor?.getAttributes('textStyle').color || '#000000'}
                                                className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => editor?.chain().focus().unsetColor().run()}
                                                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <FaTimes className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => editor?.chain().focus().toggleBold().run()}
                                            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor?.isActive('bold') ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                }`}
                                        >
                                            <strong>B</strong>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => editor?.chain().focus().toggleItalic().run()}
                                            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor?.isActive('italic') ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                }`}
                                        >
                                            <em>I</em>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => editor?.chain().focus().toggleUnderline().run()}
                                            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor?.isActive('underline') ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                }`}
                                        >
                                            <u>U</u>
                                        </button>

                                        <div className="border-l border-gray-200 dark:border-gray-700 pl-2 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                                                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor?.isActive({ textAlign: 'left' }) ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                    }`}
                                            >
                                                ←
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                                                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor?.isActive({ textAlign: 'center' }) ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                    }`}
                                            >
                                                ↔
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                                                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor?.isActive({ textAlign: 'right' }) ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                    }`}
                                            >
                                                →
                                            </button>
                                        </div>

                                        <div className="border-l border-gray-200 dark:border-gray-700 pl-2 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor?.isActive('bulletList') ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                    }`}
                                            >
                                                • Liste
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor?.isActive('orderedList') ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                    }`}
                                            >
                                                1. Liste
                                            </button>
                                        </div>

                                        <div className="border-l border-gray-200 dark:border-gray-700 pl-2 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const url = window.prompt('URL giriniz:')
                                                    if (url) {
                                                        editor?.chain().focus().setLink({ href: url }).run()
                                                    }
                                                }}
                                                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor?.isActive('link') ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                    }`}
                                            >
                                                Link
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const url = window.prompt('Görsel URL\'si giriniz:')
                                                    if (url) {
                                                        editor?.chain().focus().setImage({ src: url }).run()
                                                    }
                                                }}
                                                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                Görsel
                                            </button>
                                        </div>

                                        <div className="border-l border-gray-200 dark:border-gray-700 pl-2 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                                                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                Tablo
                                            </button>
                                            {editor?.isActive('table') && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => editor?.chain().focus().addColumnBefore().run()}
                                                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    >
                                                        +←
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => editor?.chain().focus().addColumnAfter().run()}
                                                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    >
                                                        →+
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => editor?.chain().focus().addRowBefore().run()}
                                                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    >
                                                        +↑
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => editor?.chain().focus().addRowAfter().run()}
                                                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    >
                                                        ↓+
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => editor?.chain().focus().deleteColumn().run()}
                                                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    >
                                                        -←
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => editor?.chain().focus().deleteRow().run()}
                                                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    >
                                                        -↑
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <style jsx global>{`
                                    .ProseMirror {
                                        padding: 1rem;
                                        min-height: 400px;
                                        outline: none;
                                    }
                                    .ProseMirror table {
                                        border-collapse: collapse;
                                        margin: 0;
                                        overflow: hidden;
                                        table-layout: fixed;
                                        width: 100%;
                                    }
                                    .ProseMirror table td,
                                    .ProseMirror table th {
                                        border: 2px solid #ced4da;
                                        box-sizing: border-box;
                                        min-width: 1em;
                                        padding: 3px 5px;
                                        position: relative;
                                        vertical-align: top;
                                    }
                                    .ProseMirror table th {
                                        background-color: #f8f9fa;
                                        font-weight: bold;
                                        text-align: left;
                                    }
                                    .ProseMirror table .selectedCell:after {
                                        background: rgba(200, 200, 255, 0.4);
                                        content: "";
                                        left: 0;
                                        right: 0;
                                        top: 0;
                                        bottom: 0;
                                        pointer-events: none;
                                        position: absolute;
                                        z-index: 2;
                                    }
                                    .ProseMirror table .column-resize-handle {
                                        background-color: #adf;
                                        bottom: -2px;
                                        position: absolute;
                                        right: -2px;
                                        pointer-events: none;
                                        top: 0;
                                        width: 4px;
                                    }
                                    .ProseMirror table p {
                                        margin: 0;
                                    }
                                `}</style>
                                <div className="p-4">
                                    <EditorContent
                                        editor={editor}
                                        className="prose prose-sm max-w-none dark:prose-invert focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sağ Kolon - Ayarlar */}
                        <div className="space-y-6">
                            {/* Durum ve Görünürlük */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Durum ve Görünürlük
                                    </h2>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-4">
                                        {/* Durum */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Durum
                                            </label>
                                            <div className="space-y-2">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        value="draft"
                                                        checked={formData.status === 'draft'}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                                                        className="border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                                                    />
                                                    <span className="ml-2 text-gray-700 dark:text-gray-300">Taslak</span>
                                                </label>
                                                <br />
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        value="published"
                                                        checked={formData.status === 'published'}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                                                        className="border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                                                    />
                                                    <span className="ml-2 text-gray-700 dark:text-gray-300">Yayında</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* URL */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                URL
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={formData.slug}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                                    placeholder="url-adresi"
                                                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                                            bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-primary 
                                                            focus:outline-none focus:ring-1 focus:ring-primary dark:text-white text-sm font-mono"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newSlug = formData.title
                                                            .toLowerCase()
                                                            .replace(/[^a-z0-9]+/g, '-')
                                                            .replace(/(^-|-$)/g, '')
                                                        setFormData(prev => ({ ...prev, slug: newSlug }))
                                                    }}
                                                    className="flex-shrink-0 inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 
                                                            shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 
                                                            hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                                            focus:ring-primary transition-colors"
                                                >
                                                    Başlıktan Oluştur
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Kategoriler */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <FaTags className="h-5 w-5 text-gray-400" />
                                        Kategoriler
                                    </h2>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {renderCategoryTree(categories)}
                                    </div>
                                </div>
                            </div>

                            {/* Öne Çıkan Görsel */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <FaImage className="h-5 w-5 text-gray-400" />
                                        Öne Çıkan Görsel
                                    </h2>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                value={formData.featured_image}
                                                onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                                                placeholder="Görsel URL'si"
                                                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                                         bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-primary 
                                                         focus:outline-none focus:ring-1 focus:ring-primary dark:text-white text-sm"
                                            />
                                            {formData.featured_image && (
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                                                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                                >
                                                    <FaTimes className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                        {formData.featured_image && (
                                            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                <img
                                                    src={formData.featured_image}
                                                    alt="Öne çıkan görsel önizleme"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Özet */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Özet
                                    </h2>
                                </div>
                                <div className="p-4">
                                    <textarea
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                        rows={3}
                                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                                                 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-primary 
                                                 focus:outline-none focus:ring-1 focus:ring-primary dark:text-white text-sm"
                                        placeholder="Yazının kısa bir özeti..."
                                    />
                                </div>
                            </div>

                            {/* SEO Ayarları */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <FaCog className="h-5 w-5 text-gray-400" />
                                        SEO Ayarları
                                    </h2>
                                </div>
                                <div className="p-4 space-y-4">
                                    {/* Meta Başlık */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Meta Başlık
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.meta_title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                                                     bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-primary 
                                                     focus:outline-none focus:ring-1 focus:ring-primary dark:text-white text-sm"
                                        />
                                    </div>

                                    {/* Meta Açıklama */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Meta Açıklama
                                        </label>
                                        <textarea
                                            value={formData.meta_description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                                            rows={2}
                                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                                                     bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-primary 
                                                     focus:outline-none focus:ring-1 focus:ring-primary dark:text-white text-sm"
                                        />
                                    </div>

                                    {/* Meta Anahtar Kelimeler */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Meta Anahtar Kelimeler
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.meta_keywords}
                                            onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                                                     bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-primary 
                                                     focus:outline-none focus:ring-1 focus:ring-primary dark:text-white text-sm"
                                            placeholder="Virgülle ayırarak yazın"
                                        />
                                    </div>

                                    {/* Canonical URL */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Canonical URL
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.canonical_url}
                                            onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))}
                                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                                                     bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-primary 
                                                     focus:outline-none focus:ring-1 focus:ring-primary dark:text-white text-sm"
                                        />
                                    </div>

                                    {/* İndekslenebilir */}
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_indexable}
                                            onChange={(e) => setFormData(prev => ({ ...prev, is_indexable: e.target.checked }))}
                                            className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                                        />
                                        <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                            Arama motorlarında indekslenebilir
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
} 