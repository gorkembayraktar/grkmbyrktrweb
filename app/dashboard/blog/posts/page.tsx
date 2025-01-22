'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaCheck, FaEllipsisH } from 'react-icons/fa'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import DeleteConfirmModal from '@/app/components/modals/DeleteConfirmModal'

interface Post {
    id: string
    title: string
    slug: string
    status: 'draft' | 'published' | 'trashed'
    author: {
        email: string
    }
    created_at: string
    categories: {
        id: string
        name: string
    }[]
}

export default function PostsPage() {
    const router = useRouter()
    const [posts, setPosts] = useState<Post[]>([])
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [trashedCount, setTrashedCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({
        author: '',
        category: '',
        status: ''
    })
    const [uniqueAuthors, setUniqueAuthors] = useState<string[]>([])
    const [uniqueCategories, setUniqueCategories] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const postsPerPage = 10
    const [selectedPosts, setSelectedPosts] = useState<string[]>([])
    const [isBulkProcessing, setIsBulkProcessing] = useState(false)
    const [statusCounts, setStatusCounts] = useState({
        draft: 0,
        published: 0,
        trashed: 0
    })
    const [isClient, setIsClient] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        if (isClient) {
            loadStatusCounts()
            loadPosts()
        }
    }, [isClient, currentPage])

    // Format date fonksiyonunu güvenli hale getirelim
    const formatDate = (date: string) => {
        if (!isClient) return '' // Server-side'da boş string döndür
        try {
            return format(new Date(date), 'dd MMMM yyyy', { locale: tr })
        } catch (error) {
            return date
        }
    }

    const loadStatusCounts = async () => {
        try {
            const promises = ['draft', 'published', 'trashed'].map(status =>
                supabase
                    .from('posts')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', status)
            )

            const results = await Promise.all(promises)
            setStatusCounts({
                draft: results[0].count || 0,
                published: results[1].count || 0,
                trashed: results[2].count || 0
            })
        } catch (error) {
            console.error('Error loading status counts:', error)
        }
    }

    const loadPosts = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Kullanıcı bulunamadı')

            // Get total count first
            const { count, error: countError } = await supabase
                .from('posts')
                .select('*', { count: 'exact', head: true })
                .neq('status', 'trashed')

            if (countError) throw countError
            setTotalCount(count || 0)

            // Then get paginated data
            const { data: postsData, error: postsError } = await supabase
                .from('posts')
                .select(`
                    *,
                    profiles (
                        email
                    ),
                    categories:post_categories(
                        category:categories(id, name)
                    )
                `)
                .neq('status', 'trashed')
                .order('created_at', { ascending: false })
                .range((currentPage - 1) * postsPerPage, currentPage * postsPerPage - 1)

            if (postsError) throw postsError

            // Format the posts data
            const formattedPosts = postsData.map(post => ({
                id: post.id,
                title: post.title,
                slug: post.slug,
                status: post.status as 'draft' | 'published' | 'trashed',
                created_at: post.created_at,
                author: { email: post.profiles?.email || 'Bilinmeyen Yazar' },
                categories: post.categories.map((c: any) => c.category)
            })) as Post[]

            // After setting posts, update unique filters
            if (formattedPosts.length > 0) {
                const authors = Array.from(new Set(formattedPosts.map(post => post.author.email)))
                const categories = Array.from(new Set(formattedPosts.flatMap(post => post.categories.map(c => c.name))))
                setUniqueAuthors(authors)
                setUniqueCategories(categories)
            }

            setPosts(formattedPosts)
            setFilteredPosts(formattedPosts)
            await loadStatusCounts()
        } catch (error: any) {
            console.error('Error loading posts:', error)
            toast.error(error?.message || 'Yazılar yüklenirken bir hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    // Apply filters and search
    useEffect(() => {
        let result = [...posts]

        // Apply search
        if (searchTerm) {
            result = result.filter(post =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Apply filters
        if (filters.author) {
            result = result.filter(post => post.author.email === filters.author)
        }
        if (filters.category) {
            result = result.filter(post =>
                post.categories.some(cat => cat.name === filters.category)
            )
        }
        if (filters.status) {
            result = result.filter(post => post.status === filters.status)
        }

        setFilteredPosts(result)
    }, [searchTerm, filters, posts])

    // Calculate pagination values
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
    const startIndex = (currentPage - 1) * postsPerPage
    const endIndex = startIndex + postsPerPage
    const currentPosts = filteredPosts.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = (post: Post) => {
        setSelectedPost(post)
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedPost) return

        setIsDeleting(true)
        try {
            const { error } = await supabase
                .from('posts')
                .update({
                    status: 'trashed',
                    trashed_at: new Date().toISOString()
                })
                .eq('id', selectedPost.id)

            if (error) throw error

            toast.success('Yazı çöp kutusuna taşındı')
            loadPosts()
        } catch (error: any) {
            console.error('Error moving post to trash:', error)
            toast.error(error?.message || 'Yazı çöp kutusuna taşınırken bir hata oluştu')
        } finally {
            setIsDeleting(false)
            setShowDeleteModal(false)
            setSelectedPost(null)
        }
    }

    const handleBulkAction = async (action: string) => {
        if (!action || selectedPosts.length === 0) return

        setIsBulkProcessing(true)
        try {
            let updateData = {}

            switch (action) {
                case 'publish':
                    updateData = { status: 'published', published_at: new Date().toISOString() }
                    break
                case 'draft':
                    updateData = { status: 'draft', published_at: null }
                    break
                case 'trash':
                    updateData = { status: 'trashed', trashed_at: new Date().toISOString() }
                    break
                default:
                    return
            }

            const { error } = await supabase
                .from('posts')
                .update(updateData)
                .in('id', selectedPosts)

            if (error) throw error

            toast.success(`${selectedPosts.length} yazı başarıyla güncellendi`)
            setSelectedPosts([])
            loadPosts()
        } catch (error: any) {
            console.error('Error processing bulk action:', error)
            toast.error(error?.message || 'İşlem sırasında bir hata oluştu')
        } finally {
            setIsBulkProcessing(false)
        }
    }

    if (isLoading) {
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
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Yazılar
                        </h1>
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setFilters(prev => ({ ...prev, status: 'draft' }))}
                                className={`px-4 py-2 text-sm font-medium ${filters.status === 'draft'
                                    ? 'bg-primary text-white'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                Taslak ({statusCounts.draft})
                            </button>
                            <button
                                onClick={() => setFilters(prev => ({ ...prev, status: 'published' }))}
                                className={`px-4 py-2 text-sm font-medium border-l border-r border-gray-300 dark:border-gray-600 ${filters.status === 'published'
                                    ? 'bg-primary text-white'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                Yayında ({statusCounts.published})
                            </button>
                            <button
                                onClick={() => router.push('/dashboard/blog/trash')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            >
                                Çöp Kutusu ({statusCounts.trashed})
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/blog/posts/new')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                        Yeni Yazı
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Yazı başlığında ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={filters.author}
                                onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                                className="block w-48 pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            >
                                <option value="">Tüm Yazarlar</option>
                                {uniqueAuthors.map(author => (
                                    <option key={author} value={author}>{author}</option>
                                ))}
                            </select>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                className="block w-48 pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            >
                                <option value="">Tüm Kategoriler</option>
                                {uniqueCategories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                className="block w-48 pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            >
                                <option value="">Tüm Durumlar</option>
                                <option value="published">Yayında</option>
                                <option value="draft">Taslak</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-8">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
                                            checked={currentPosts.length > 0 && selectedPosts.length === currentPosts.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedPosts(currentPosts.map(post => post.id))
                                                } else {
                                                    setSelectedPosts([])
                                                }
                                            }}
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Başlık
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Yazar
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Kategoriler
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Durum
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Tarih
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {currentPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap w-8">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
                                                checked={selectedPosts.includes(post.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedPosts([...selectedPosts, post.id])
                                                    } else {
                                                        setSelectedPosts(selectedPosts.filter(id => id !== post.id))
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {post.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {post.author?.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-wrap gap-1">
                                                {post.categories?.map(category => (
                                                    <span
                                                        key={category.id}
                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                                    >
                                                        {category.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'published'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                }`}>
                                                {post.status === 'published' ? 'Yayında' : 'Taslak'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(post.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                                                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                                >
                                                    <FaEye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/dashboard/blog/posts/${post.id}/edit`)}
                                                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                                >
                                                    <FaEdit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post)}
                                                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                                                >
                                                    <FaTrash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Önceki
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Sonraki
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                Toplam <span className="font-medium">{filteredPosts.length}</span> yazıdan{' '}
                                                <span className="font-medium">{startIndex + 1}</span>-
                                                <span className="font-medium">{Math.min(endIndex, filteredPosts.length)}</span> arası gösteriliyor
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <span className="sr-only">Önceki</span>
                                                    <FaChevronLeft className="h-4 w-4" />
                                                </button>
                                                {[...Array(totalPages)].map((_, index) => (
                                                    <button
                                                        key={index + 1}
                                                        onClick={() => handlePageChange(index + 1)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1
                                                            ? 'z-10 bg-primary border-primary text-white'
                                                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                                            }`}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <span className="sr-only">Sonraki</span>
                                                    <FaChevronRight className="h-4 w-4" />
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                title="Yazıyı Sil"
                message={`"${selectedPost?.title}" başlıklı yazıyı silmek istediğinize emin misiniz?`}
                isLoading={isDeleting}
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                    setShowDeleteModal(false)
                    setSelectedPost(null)
                }}
            />
        </div>
    )
} 