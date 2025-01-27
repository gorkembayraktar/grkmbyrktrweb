'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '../utils/supabase/client'
import { FaEnvelope, FaProjectDiagram, FaUsers, FaUser, FaNewspaper, FaEye, FaStar, FaFolder } from 'react-icons/fa'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { getTotalPageViews } from '../utils/views'

interface DashboardStats {
    totalContacts: number
    unreadMessages: number
    totalProjects: number
    totalPosts: number
    totalViews: number
}

interface Post {
    id: string
    title: string
    slug: string
    status: string
    published_at: string
}

interface Category {
    id: string
    name: string
    slug: string
    description: string | null
    is_default: boolean
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<DashboardStats>({
        totalContacts: 0,
        unreadMessages: 0,
        totalProjects: 0,
        totalPosts: 0,
        totalViews: 0
    })
    const [recentPosts, setRecentPosts] = useState<Post[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push('/login')
                    return
                }
                setUser(user)
                await loadDashboardData()
            } catch (error) {
                console.error('Error checking auth:', error)
                router.push('/login')
            } finally {
                setLoading(false)
            }
        }

        checkUser()
    }, [router])

    const loadDashboardData = async () => {
        try {
            // Get contacts stats
            const { data: contacts, error: contactsError } = await supabase
                .from('contacts')
                .select('id, is_read')

            if (contactsError) throw contactsError

            // Get projects count
            const { count: projectsCount, error: projectsError } = await supabase
                .from('projects')
                .select('id', { count: 'exact' })

            if (projectsError) throw projectsError

            // Get posts count and recent posts
            const { count: postsCount, error: postsCountError } = await supabase
                .from('posts')
                .select('id', { count: 'exact' })
                .eq('status', 'published')

            if (postsCountError) throw postsCountError

            const { data: recent, error: recentError } = await supabase
                .from('posts')
                .select('id, title, slug, status, published_at')
                .eq('status', 'published')
                .order('published_at', { ascending: false })
                .limit(5)

            if (recentError) throw recentError

            // Get total page views
            const totalViews = await getTotalPageViews()

            // Get categories
            const { data: categoriesData, error: categoriesError } = await supabase
                .from('categories')
                .select('id, name, slug, description, is_default')
                .order('name')

            if (categoriesError) throw categoriesError

            setStats({
                totalContacts: contacts?.length || 0,
                unreadMessages: contacts?.filter(c => !c.is_read).length || 0,
                totalProjects: projectsCount || 0,
                totalPosts: postsCount || 0,
                totalViews
            })

            setRecentPosts(recent || [])
            setCategories(categoriesData || [])

        } catch (error) {
            console.error('Error loading dashboard data:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="py-6">
            <div className="px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>

                {/* Stats Grid */}
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Total Messages */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FaUsers className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Toplam Mesaj
                                        </dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                {stats.totalContacts}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Unread Messages */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FaEnvelope className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Okunmamış Mesaj
                                        </dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                {stats.unreadMessages}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Projects */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FaProjectDiagram className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Toplam Proje
                                        </dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                {stats.totalProjects}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Posts */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FaNewspaper className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Toplam Blog
                                        </dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                {stats.totalPosts}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Views */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FaEye className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Toplam Görüntülenme
                                        </dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                {stats.totalViews}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col md:flex-row gap-8">
                    {/* Recent Posts */}
                    <div className="w-full md:w-1/2">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Son Yazılar</h2>
                        <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
                            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                                {recentPosts.map((post) => (
                                    <li key={post.id} className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <FaNewspaper className="h-5 w-5 text-primary" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {post.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {format(new Date(post.published_at), 'dd MMM yyyy', { locale: tr })}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => router.push(`/blog/${post.slug}`)}
                                                className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20"
                                            >
                                                Görüntüle
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {recentPosts.length === 0 && (
                                <div className="text-center py-6">
                                    <p className="text-gray-500 dark:text-gray-400">Henüz blog yazısı yok</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="w-full md:w-1/2">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Kategoriler</h2>
                        <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
                            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                                {categories.map((category) => (
                                    <li key={category.id} className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                        {category.is_default ? (
                                                            <FaStar className="h-5 w-5 text-primary" />
                                                        ) : (
                                                            <FaFolder className="h-5 w-5 text-primary" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {category.name}
                                                    </div>
                                                    {category.description && (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {category.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => router.push(`/blog/category/${category.slug}`)}
                                                className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20"
                                            >
                                                Görüntüle
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {categories.length === 0 && (
                                <div className="text-center py-6">
                                    <p className="text-gray-500 dark:text-gray-400">Henüz kategori yok</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Hızlı İşlemler</h2>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <button
                            onClick={() => router.push('/dashboard/contacts')}
                            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 text-center hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            <FaEnvelope className="mx-auto h-8 w-8 text-gray-400" />
                            <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Mesajları Görüntüle
                            </span>
                        </button>
                        <button
                            onClick={() => router.push('/dashboard/projects')}
                            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 text-center hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            <FaProjectDiagram className="mx-auto h-8 w-8 text-gray-400" />
                            <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Projeleri Yönet
                            </span>
                        </button>
                        <button
                            onClick={() => router.push('/dashboard/profile')}
                            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 text-center hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            <FaUser className="mx-auto h-8 w-8 text-gray-400" />
                            <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Profili Düzenle
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} 