'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { FaTrashRestore, FaTrash, FaArrowLeft } from 'react-icons/fa'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import DeleteConfirmModal from '@/app/components/modals/DeleteConfirmModal'

interface Post {
    id: string
    title: string
    slug: string
    status: 'trashed'
    author: {
        email: string
    }
    created_at: string
    trashed_at: string
    categories: {
        id: string
        name: string
    }[]
}

export default function TrashPage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const supabase = createClient()

    const loadPosts = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Kullanıcı bulunamadı')

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
                .eq('status', 'trashed')
                .order('trashed_at', { ascending: false })

            if (postsError) throw postsError

            const formattedPosts = postsData.map(post => ({
                id: post.id,
                title: post.title,
                slug: post.slug,
                status: post.status as 'trashed',
                created_at: post.created_at,
                trashed_at: post.trashed_at,
                author: { email: post.profiles?.email || 'Bilinmeyen Yazar' },
                categories: post.categories.map((c: any) => c.category)
            })) as Post[]

            setPosts(formattedPosts)
        } catch (error: any) {
            console.error('Error loading trashed posts:', error)
            toast.error(error?.message || 'Silinen yazılar yüklenirken bir hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadPosts()
    }, [])

    const handleRestore = async (post: Post) => {
        try {
            const { error } = await supabase
                .from('posts')
                .update({
                    status: 'draft',
                    trashed_at: null
                })
                .eq('id', post.id)

            if (error) throw error

            toast.success('Yazı geri yüklendi')
            loadPosts()
        } catch (error: any) {
            console.error('Error restoring post:', error)
            toast.error(error?.message || 'Yazı geri yüklenirken bir hata oluştu')
        }
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
                .delete()
                .eq('id', selectedPost.id)

            if (error) throw error

            toast.success('Yazı kalıcı olarak silindi')
            loadPosts()
        } catch (error: any) {
            console.error('Error permanently deleting post:', error)
            toast.error(error?.message || 'Yazı kalıcı olarak silinirken bir hata oluştu')
        } finally {
            setIsDeleting(false)
            setShowDeleteModal(false)
            setSelectedPost(null)
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
                            Çöp Kutusu
                        </h1>
                        <a
                            href="/dashboard/blog/posts"
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                            <FaArrowLeft className="-ml-0.5 mr-2 h-4 w-4" />
                            Yazılara Dön
                        </a>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                    {posts.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                            Çöp kutusu boş
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900/50">
                                    <tr>
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
                                            Silinme Tarihi
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            İşlemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {posts.map((post) => (
                                        <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {format(new Date(post.trashed_at), 'dd MMM yyyy HH:mm', { locale: tr })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleRestore(post)}
                                                        className="text-gray-400 hover:text-green-500 dark:hover:text-green-400"
                                                        title="Geri Yükle"
                                                    >
                                                        <FaTrashRestore className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(post)}
                                                        className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                                                        title="Kalıcı Olarak Sil"
                                                    >
                                                        <FaTrash className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                title="Yazıyı Kalıcı Olarak Sil"
                message={`"${selectedPost?.title}" başlıklı yazıyı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz!`}
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