'use client'

import { useState, useEffect, use, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { FaSave, FaImage, FaTimes, FaEye, FaCog, FaTags, FaChevronDown, FaChevronRight, FaArrowLeft, FaBold, FaItalic, FaUnderline, FaStrikethrough, FaListUl, FaListOl, FaQuoteRight, FaLink, FaUnlink, FaTable, FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify, FaCode, FaRedo, FaUndo, FaPalette, FaHeading, FaCheckCircle, FaExclamationTriangle, FaChartBar } from 'react-icons/fa'
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
import FontSize from '@tiptap/extension-font-size'
import { createPortal } from 'react-dom'

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

// Font seçenekleri
const FONT_FAMILIES = [
    { label: 'Varsayılan', value: 'Inter' },
    { label: 'Arial', value: 'Arial' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Courier New', value: 'Courier New' },
];

// Yazı boyutları
const FONT_SIZES = [
    { label: 'Varsayılan', value: '' },
    { label: '12px', value: '12px' },
    { label: '14px', value: '14px' },
    { label: '16px', value: '16px' },
    { label: '18px', value: '18px' },
    { label: '20px', value: '20px' },
    { label: '24px', value: '24px' },
    { label: '28px', value: '28px' },
    { label: '32px', value: '32px' },
    { label: '36px', value: '36px' },
    { label: '48px', value: '48px' },
    { label: 'Özel', value: 'custom' }
];

// Renk grupları
const TEXT_COLORS = {
    Temel: [
        { label: 'Siyah', value: '#000000' },
        { label: 'Beyaz', value: '#FFFFFF' },
        { label: 'Gri', value: '#718096' },
    ],
    Birincil: [
        { label: 'Kırmızı', value: '#E53E3E' },
        { label: 'Turuncu', value: '#ED8936' },
        { label: 'Sarı', value: '#ECC94B' },
        { label: 'Yeşil', value: '#48BB78' },
        { label: 'Mavi', value: '#4299E1' },
        { label: 'Mor', value: '#9F7AEA' },
        { label: 'Pembe', value: '#ED64A6' },
    ],
    Tonlar: [
        { label: 'Açık Kırmızı', value: '#FEB2B2' },
        { label: 'Açık Turuncu', value: '#FBD38D' },
        { label: 'Açık Sarı', value: '#FAF089' },
        { label: 'Açık Yeşil', value: '#9AE6B4' },
        { label: 'Açık Mavi', value: '#90CDF4' },
        { label: 'Açık Mor', value: '#D6BCFA' },
        { label: 'Açık Pembe', value: '#FBB6CE' },
    ],
};

// ColorPicker komponentini en üste taşıyalım (diğer komponentlerden önce)
function ColorPicker({
    isOpen,
    onClose,
    position,
    editor,
    onColorSelect
}: {
    isOpen: boolean;
    onClose: () => void;
    position: { top: number; left: number; buttonWidth: number; buttonHeight: number };
    editor: any;
    onColorSelect: (color: string) => void;
}) {
    if (!isOpen || typeof window === 'undefined') return null;

    const PICKER_WIDTH = 256; // w-64 = 256px
    const PICKER_HEIGHT = 400; // tahmini yükseklik
    const MARGIN = 8;

    // Ekran sınırlarını kontrol et
    const adjustedPosition = {
        top: position.top,
        left: position.left
    };

    // Sağa taşma kontrolü
    if (position.left + PICKER_WIDTH > window.innerWidth) {
        adjustedPosition.left = position.left - PICKER_WIDTH + position.buttonWidth;
    }

    // Alta taşma kontrolü
    if (position.top + PICKER_HEIGHT > window.innerHeight) {
        adjustedPosition.top = position.top - PICKER_HEIGHT - MARGIN;
    }

    // Sola taşma kontrolü
    if (adjustedPosition.left < MARGIN) {
        adjustedPosition.left = MARGIN;
    }

    // Üste taşma kontrolü
    if (adjustedPosition.top < MARGIN) {
        adjustedPosition.top = position.top + position.buttonHeight + MARGIN;
    }

    return createPortal(
        <div className="fixed inset-0 z-50" onClick={onClose}>
            <div
                className="absolute p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64"
                style={{
                    top: adjustedPosition.top,
                    left: adjustedPosition.left,
                    maxHeight: 'calc(100vh - 100px)',
                    overflowY: 'auto'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Hazır Renkler */}
                <div className="space-y-3">
                    {Object.entries(TEXT_COLORS).map(([group, colors]) => (
                        <div key={group}>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                                {group}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {colors.map(color => (
                                    <button
                                        key={color.value}
                                        onClick={() => onColorSelect(color.value)}
                                        className={`
                                            w-7 h-7 rounded-lg border hover:scale-110 transition-transform
                                            ${color.value === '#FFFFFF' ? 'border-gray-300' : 'border-transparent'}
                                            ${editor.getAttributes('textStyle').color === color.value ? 'ring-2 ring-primary ring-offset-2' : ''}
                                        `}
                                        style={{ backgroundColor: color.value }}
                                        title={color.label}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Özel Renk Seçici */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Özel Renk
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            onChange={(e) => onColorSelect(e.target.value)}
                            value={editor.getAttributes('textStyle').color || '#000000'}
                            className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                        />
                        <button
                            onClick={() => {
                                editor.chain().focus().unsetColor().run();
                                onClose();
                            }}
                            className="flex-1 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Rengi Temizle
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
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

    // Önce post verisini yükle
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

    // Editor ayarlarını güncelle
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
            TextStyle.configure({
                types: ['textStyle']
            }),
            Color.configure({
                types: ['textStyle']
            }),
            FontFamily.configure({
                types: ['textStyle']
            }),
            FontSize.configure({
                types: ['textStyle']
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph']
            }),
            Highlight.configure({
                multicolor: true
            }),
            Typography
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none dark:prose-invert focus:outline-none min-h-[500px]'
            }
        },
        autofocus: false,
        content: formData.content,
        onUpdate: ({ editor }) => {
            // Debounce ekleyelim
            const content = editor.getHTML();
            const timeoutId = setTimeout(() => {
                setFormData(prev => ({ ...prev, content }));
            }, 300); // 300ms bekle

            return () => clearTimeout(timeoutId);
        }
    })
    const debounceRef = useRef(false);
    useEffect(() => {
        if (debounceRef.current) return;
        if (editor && formData.content) {
            editor.commands.setContent(formData.content)
            debounceRef.current = true;
        }
    }, [editor, formData.content])

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
            //router.push('/dashboard/blog/posts')
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
            editor?.chain().setParagraph().run()
        } else if (level >= 1 && level <= 6) {
            editor?.chain().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()
        }
    }

    // SEO Analiz fonksiyonları
    const analyzeSEO = (content: string, formData: PostFormData) => {
        const results = {
            title: analyzeTitle(formData.meta_title || formData.title),
            description: analyzeDescription(formData.meta_description),
            content: analyzeContent(content),
            keywords: analyzeKeywords(content, formData.meta_keywords),
            headings: analyzeHeadings(content),
            score: 0
        };

        // Toplam skor hesapla (100 üzerinden)
        results.score = calculateScore(results);

        return results;
    };

    const analyzeTitle = (title: string) => ({
        length: title.length,
        isOptimal: title.length >= 30 && title.length <= 60,
        message: title.length < 30 ? 'Title çok kısa' :
            title.length > 60 ? 'Title çok uzun' :
                'Title uzunluğu ideal'
    });

    const analyzeDescription = (description: string) => ({
        length: description.length,
        isOptimal: description.length >= 120 && description.length <= 160,
        message: description.length < 120 ? 'Description çok kısa' :
            description.length > 160 ? 'Description çok uzun' :
                'Description uzunluğu ideal'
    });

    const analyzeContent = (content: string) => {
        const wordCount = content.split(/\s+/).length;
        return {
            wordCount,
            isOptimal: wordCount >= 300,
            message: wordCount < 300 ? 'İçerik çok kısa (min. 300 kelime önerilir)' :
                'İçerik uzunluğu yeterli'
        };
    };

    const analyzeKeywords = (content: string, keywords: string) => {
        if (!keywords) return {
            message: 'Anahtar kelimeler belirlenmemiş',
            isOptimal: false,
            density: []
        };

        const keywordList = keywords.split(',').map(k => k.trim().toLowerCase());
        const contentLower = content.toLowerCase();
        const wordCount = content.split(/\s+/).length;

        const density = keywordList.map(keyword => {
            const count = (contentLower.match(new RegExp(keyword, 'g')) || []).length;
            const percentage = (count / wordCount) * 100;
            return {
                keyword,
                count,
                percentage: percentage.toFixed(1),
                isOptimal: percentage >= 0.5 && percentage <= 2.5
            };
        });

        const isOptimal = density.some(d => d.isOptimal);

        return {
            density,
            isOptimal,
            message: isOptimal ? 'Anahtar kelime yoğunluğu uygun' : 'Anahtar kelime kullanımı yetersiz'
        };
    };

    const analyzeHeadings = (content: string) => {
        const h1Count = (content.match(/<h1/g) || []).length;
        const h2Count = (content.match(/<h2/g) || []).length;
        const h3Count = (content.match(/<h3/g) || []).length;

        return {
            h1: h1Count,
            h2: h2Count,
            h3: h3Count,
            isOptimal: h1Count === 1 && h2Count >= 2 && h3Count >= 1,
            message: h1Count !== 1 ? 'Sayfada bir adet H1 etiketi olmalı' :
                h2Count < 2 ? 'En az 2 adet H2 etiketi önerilir' :
                    h3Count < 1 ? 'En az 1 adet H3 etiketi önerilir' :
                        'Başlık hiyerarşisi uygun'
        };
    };

    const calculateScore = (results: any) => {
        let score = 0;

        // Title (20 puan)
        if (results.title.isOptimal) score += 20;

        // Description (20 puan)
        if (results.description.isOptimal) score += 20;

        // Content length (20 puan)
        if (results.content.isOptimal) score += 20;

        // Keywords (20 puan)
        if (results.keywords.isOptimal) score += 20;

        // Headings (20 puan)
        if (results.headings.isOptimal) score += 20;

        return score;
    };

    // SEO Analiz Komponenti
    function SEOAnalysis({ content, formData }: { content: string, formData: PostFormData }) {
        const analysis = analyzeSEO(content, formData);

        return (
            <div className="space-y-4">
                {/* SEO Skoru */}
                <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium">SEO Skoru</span>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium
                        ${analysis.score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            analysis.score >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                        {analysis.score}/100
                    </div>
                </div>

                {/* Detaylı Analiz */}
                <div className="space-y-3">
                    <AnalysisItem
                        title="Başlık"
                        message={`${analysis.title.length} karakter - ${analysis.title.message}`}
                        isOptimal={analysis.title.isOptimal}
                    />
                    <AnalysisItem
                        title="Açıklama"
                        message={`${analysis.description.length} karakter - ${analysis.description.message}`}
                        isOptimal={analysis.description.isOptimal}
                    />
                    <AnalysisItem
                        title="İçerik"
                        message={`${analysis.content.wordCount} kelime - ${analysis.content.message}`}
                        isOptimal={analysis.content.isOptimal}
                    />
                    <AnalysisItem
                        title="Başlık Etiketleri"
                        message={`H1: ${analysis.headings.h1}, H2: ${analysis.headings.h2}, H3: ${analysis.headings.h3} - ${analysis.headings.message}`}
                        isOptimal={analysis.headings.isOptimal}
                    />

                    {/* Anahtar Kelime Analizi */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Anahtar Kelimeler</span>
                            {analysis.keywords.isOptimal ? (
                                <FaCheckCircle className="text-green-500" size={14} />
                            ) : (
                                <FaExclamationTriangle className="text-yellow-500" size={14} />
                            )}
                        </div>
                        {analysis.keywords.density.map((kw: any) => (
                            <div key={kw.keyword} className="flex items-center justify-between text-sm">
                                <span>{kw.keyword}</span>
                                <span className={kw.isOptimal ? 'text-green-500' : 'text-yellow-500'}>
                                    {kw.count} kez (%{kw.percentage})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Analiz Öğesi Komponenti
    function AnalysisItem({ title, message, isOptimal }: { title: string, message: string, isOptimal: boolean }) {
        return (
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="font-medium">{title}</span>
                    {isOptimal ? (
                        <FaCheckCircle className="text-green-500" size={14} />
                    ) : (
                        <FaExclamationTriangle className="text-yellow-500" size={14} />
                    )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{message}</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Üst Bar */}
            <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/dashboard/blog/posts')}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <FaArrowLeft size={20} />
                            </button>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Yazı başlığı..."
                                className="text-xl font-medium bg-transparent border-0 outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
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
                        {/* Editor Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                            <div className="sticky top-[71px] z-50 bg-white dark:bg-gray-800  border-b border-gray-200 dark:border-gray-700">
                                {/* Editor Toolbar */}
                                {editor && (
                                    <div className="border-b border-gray-200 dark:border-gray-700 shadow-sm">
                                        <div className="overflow-x-auto">
                                            <EditorToolbar editor={editor} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <EditorContent
                                    editor={editor}
                                    className="prose prose-lg max-w-none dark:prose-invert focus:outline-none min-h-[500px]"
                                    autoFocus={false}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sağ Panel - Ayarlar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            {/* Yazı Ayarları Accordion */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                                <Accordion defaultOpen="url">
                                    {/* URL Ayarları */}
                                    <AccordionItem id="url" icon={<FaLink />} title="URL Ayarları">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Kalıcı Bağlantı
                                                </label>
                                                <div className="flex gap-2">
                                                    <div className="flex-1 relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                                            /blog/
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={formData.slug}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                                            className="pl-14 w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const newSlug = formData.title
                                                                .toLowerCase()
                                                                .replace(/[^a-z0-9]+/g, '-')
                                                                .replace(/^-+|-+$/g, '')
                                                            setFormData(prev => ({ ...prev, slug: newSlug }))
                                                        }}
                                                        className="shrink-0 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium"
                                                    >
                                                        URL Oluştur
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionItem>

                                    {/* Kategoriler */}
                                    <AccordionItem id="categories" icon={<FaTags />} title="Kategoriler">
                                        <div className="max-h-48 overflow-y-auto custom-scrollbar">
                                            {renderCategoryTree(categories)}
                                        </div>
                                    </AccordionItem>

                                    {/* Öne Çıkan Görsel */}
                                    <AccordionItem id="featured" icon={<FaImage />} title="Öne Çıkan Görsel">
                                        <div className="space-y-4">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={formData.featured_image}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                                                    className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                                                    placeholder="Görsel URL'si"
                                                />
                                                <button className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                                                    <FaImage size={16} />
                                                </button>
                                            </div>
                                            {formData.featured_image && (
                                                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                    <img
                                                        src={formData.featured_image}
                                                        alt="Öne çıkan görsel"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                                                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/75"
                                                    >
                                                        <FaTimes size={12} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </AccordionItem>

                                    {/* SEO Ayarları */}
                                    <AccordionItem id="seo" icon={<FaCog />} title="SEO Ayarları">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Meta Başlık
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.meta_title}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                                                    placeholder="SEO başlığı..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Meta Açıklama
                                                </label>
                                                <textarea
                                                    value={formData.meta_description}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                                                    rows={3}
                                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                                                    placeholder="SEO açıklaması..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Anahtar Kelimeler
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.meta_keywords}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                                                    placeholder="Virgülle ayırarak yazın..."
                                                />
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.is_indexable}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, is_indexable: e.target.checked }))}
                                                    className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
                                                />
                                                <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                                    Arama motorlarında indekslenebilir
                                                </label>
                                            </div>
                                        </div>
                                    </AccordionItem>

                                    {/* SEO Analiz - Yeni Eklenen */}
                                    <AccordionItem id="seo-analysis" icon={<FaChartBar />} title="SEO Analizi">
                                        <SEOAnalysis content={formData.content} formData={formData} />
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Editor Toolbar Komponenti
function EditorToolbar({ editor }: { editor: any }) {
    if (!editor) return null;

    // State'leri buraya taşıyalım
    const [colorPickerOpen, setColorPickerOpen] = useState(false);
    const [colorPickerPosition, setColorPickerPosition] = useState({ top: 0, left: 0, buttonWidth: 0, buttonHeight: 0 });
    const colorButtonRef = useRef<HTMLButtonElement>(null);

    const addImage = () => {
        const url = window.prompt('Görsel URL\'si girin:')
        if (url) {
            editor.chain().setImage({ src: url }).run()
        }
    }

    const addLink = () => {
        const url = window.prompt('Link URL\'si girin:')
        if (url) {
            editor.chain().setLink({ href: url }).run()
        }
    }

    const addTable = () => {
        editor.chain().insertTable({ rows: 3, cols: 3 }).run()
    }

    return (
        <div className="flex items-center gap-2 p-2 min-w-max">
            {/* Geri/İleri */}
            <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().undo().run()}
                    disabled={!editor.can().undo()}
                    icon={<FaUndo size={14} />}
                    tooltip="Geri Al"
                />
                <ToolbarButton
                    onClick={() => editor.chain().redo().run()}
                    disabled={!editor.can().redo()}
                    icon={<FaRedo size={14} />}
                    tooltip="İleri Al"
                />
            </div>

            {/* Başlık Seçici */}
            <select
                onChange={(e) => {
                    const level = parseInt(e.target.value)
                    level === 0
                        ? editor.chain().setParagraph().run()
                        : editor.chain().toggleHeading({ level }).run()
                }}
                className="h-8 px-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm mr-2"
                value={
                    editor.isActive('heading', { level: 1 }) ? '1' :
                        editor.isActive('heading', { level: 2 }) ? '2' :
                            editor.isActive('heading', { level: 3 }) ? '3' : '0'
                }
            >
                <option value="0">Normal</option>
                <option value="1">Başlık 1</option>
                <option value="2">Başlık 2</option>
                <option value="3">Başlık 3</option>
            </select>

            {/* Metin Biçimlendirme */}
            <div className="flex gap-1 mr-2 border-r border-gray-200 dark:border-gray-700 pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().toggleBold().run()}
                    active={editor.isActive('bold')}
                    icon={<FaBold size={14} />}
                    tooltip="Kalın"
                />
                <ToolbarButton
                    onClick={() => editor.chain().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    icon={<FaItalic size={14} />}
                    tooltip="İtalik"
                />
                <ToolbarButton
                    onClick={() => editor.chain().toggleUnderline().run()}
                    active={editor.isActive('underline')}
                    icon={<FaUnderline size={14} />}
                    tooltip="Altı Çizili"
                />
                <ToolbarButton
                    onClick={() => editor.chain().toggleStrike().run()}
                    active={editor.isActive('strike')}
                    icon={<FaStrikethrough size={14} />}
                    tooltip="Üstü Çizili"
                />
            </div>

            {/* Hizalama */}
            <div className="flex gap-1 mr-2 border-r border-gray-200 dark:border-gray-700 pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().setTextAlign('left').run()}
                    active={editor.isActive({ textAlign: 'left' })}
                    icon={<FaAlignLeft size={14} />}
                    tooltip="Sola Hizala"
                />
                <ToolbarButton
                    onClick={() => editor.chain().setTextAlign('center').run()}
                    active={editor.isActive({ textAlign: 'center' })}
                    icon={<FaAlignCenter size={14} />}
                    tooltip="Ortala"
                />
                <ToolbarButton
                    onClick={() => editor.chain().setTextAlign('right').run()}
                    active={editor.isActive({ textAlign: 'right' })}
                    icon={<FaAlignRight size={14} />}
                    tooltip="Sağa Hizala"
                />
                <ToolbarButton
                    onClick={() => editor.chain().setTextAlign('justify').run()}
                    active={editor.isActive({ textAlign: 'justify' })}
                    icon={<FaAlignJustify size={14} />}
                    tooltip="İki Yana Yasla"
                />
            </div>

            {/* Listeler */}
            <div className="flex gap-1 mr-2 border-r border-gray-200 dark:border-gray-700 pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    icon={<FaListUl size={14} />}
                    tooltip="Madde İşaretli Liste"
                />
                <ToolbarButton
                    onClick={() => editor.chain().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                    icon={<FaListOl size={14} />}
                    tooltip="Numaralı Liste"
                />
            </div>

            {/* Font Ayarları */}
            <div className="flex gap-1 mr-2 border-r border-gray-200 dark:border-gray-700 pr-2">
                {/* Font Ailesi */}
                <select
                    onChange={(e) => editor.chain().setFontFamily(e.target.value).run()}
                    value={editor.getAttributes('textStyle').fontFamily || 'Inter'}
                    className="h-8 px-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                >
                    {FONT_FAMILIES.map(font => (
                        <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                            {font.label}
                        </option>
                    ))}
                </select>

                {/* Font Boyutu */}
                <div className="flex items-center gap-1">
                    <select
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === 'custom') {
                                const size = prompt('Font boyutu girin (örn: 22):');
                                if (size) {
                                    if (/^\d$/.test(size)) {
                                        editor.chain().setFontSize(size + 'px').run();
                                    } else {
                                        toast.error('Geçerli bir piksel değeri girin (örn: 22px)');
                                    }
                                }
                            } else {
                                editor.chain().setFontSize(value).run();
                            }
                        }}
                        value={editor.getAttributes('textStyle').fontSize || ''}
                        className="h-8 px-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                    >
                        {FONT_SIZES.map(size => (
                            <option key={size.value} value={size.value}>
                                {size.label}
                            </option>
                        ))}
                    </select>

                    {/* Font Boyutu Temizle */}
                    <button
                        onClick={() => editor.chain().unsetFontSize().run()}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Font Boyutunu Sıfırla"
                    >
                        <FaTimes size={14} />
                    </button>
                </div>
            </div>

            {/* Renk Seçici */}
            <div className="relative group">
                <button
                    ref={colorButtonRef}
                    onClick={(e) => {
                        e.preventDefault();
                        const rect = colorButtonRef.current?.getBoundingClientRect();
                        if (rect) {
                            setColorPickerPosition({
                                top: rect.bottom + window.scrollY,
                                left: rect.left + window.scrollX,
                                buttonWidth: rect.width,
                                buttonHeight: rect.height
                            });
                            setColorPickerOpen(!colorPickerOpen);
                        }
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    title="Yazı Rengi"
                >
                    <FaPalette size={14} />
                    <div
                        className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-600"
                        style={{
                            backgroundColor: editor.getAttributes('textStyle').color || '#000000',
                            borderColor: editor.getAttributes('textStyle').color === '#FFFFFF' ? '#718096' : 'transparent'
                        }}
                    />
                </button>
                <ColorPicker
                    isOpen={colorPickerOpen}
                    onClose={() => setColorPickerOpen(false)}
                    position={colorPickerPosition}
                    editor={editor}
                    onColorSelect={(color) => {
                        editor.chain().focus().setColor(color).run();
                        setColorPickerOpen(false);
                    }}
                />
            </div>

            {/* Ekstra Özellikler */}
            <div className="flex gap-1">
                <ToolbarButton
                    onClick={() => editor.chain().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                    icon={<FaQuoteRight size={14} />}
                    tooltip="Alıntı"
                />
                <ToolbarButton
                    onClick={addLink}
                    active={editor.isActive('link')}
                    icon={<FaLink size={14} />}
                    tooltip="Link Ekle"
                />
                {editor.isActive('link') && (
                    <ToolbarButton
                        onClick={(e) => {
                            e.preventDefault();
                            editor.chain().unsetLink().run()
                        }}
                        icon={<FaUnlink size={14} />}
                        tooltip="Linki Kaldır"
                    />
                )}
                <ToolbarButton
                    onClick={addImage}
                    icon={<FaImage size={14} />}
                    tooltip="Görsel Ekle"
                />
                <ToolbarButton
                    onClick={addTable}
                    icon={<FaTable size={14} />}
                    tooltip="Tablo Ekle"
                />
                <ToolbarButton
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().toggleCode().run()
                    }}
                    active={editor.isActive('code')}
                    icon={<FaCode size={14} />}
                    tooltip="Kod"
                />
            </div>
        </div>
    )
}

// Toolbar Buton Komponenti
function ToolbarButton({
    onClick,
    icon,
    active = false,
    disabled = false,
    tooltip
}: {
    onClick: () => void
    icon: React.ReactNode
    active?: boolean
    disabled?: boolean
    tooltip: string
}) {
    return (
        <button
            onClick={(e) => {
                e.preventDefault(); // Scroll'u engelle
                onClick();
            }}
            disabled={disabled}
            className={`
                p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                transition-colors relative group
                ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            title={tooltip}
        >
            <span className="text-gray-600 dark:text-gray-300">
                {icon}
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs 
                           text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 
                           transition-opacity whitespace-nowrap pointer-events-none">
                {tooltip}
            </div>
        </button>
    )
}

// Accordion Komponentleri
function Accordion({ children, defaultOpen = '' }: { children: React.ReactNode, defaultOpen?: string }) {
    const [openItem, setOpenItem] = useState(defaultOpen);

    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {React.Children.map(children, (child: React.ReactNode) => {
                if (React.isValidElement(child)) {
                    if ((child as any).props.id) {
                        return React.cloneElement(child, {
                            isOpen: openItem === (child as any).props.id,
                            onToggle: () => setOpenItem(openItem === (child as any).props.id ? '' : (child as any).props.id)
                        });
                    }
                }
                return child;
            })}
        </div>
    );
}

function AccordionItem({ id, icon, title, children, isOpen, onToggle }: { id: string, icon: React.ReactNode, title: string, children?: React.ReactNode, isOpen?: boolean, onToggle?: () => void }) {
    return (
        <div>
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full p-4 text-left"
            >
                <div className="flex items-center gap-2">
                    <span className="text-gray-400">{icon}</span>
                    <span className="font-medium">{title}</span>
                </div>
                <FaChevronDown
                    className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && (
                <div className="p-4 pt-0">
                    {children}
                </div>
            )}
        </div>
    );
} 