'use client'
import { motion } from 'framer-motion'
import { FaClock, FaTag, FaSearch } from 'react-icons/fa'
import Link from 'next/link'
import { Category, PostFormData } from '@/app/dashboard/blog/posts/types'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Pagination from './Pagination'

interface BlogContentProps {
    blogPosts: PostFormData[]
    categories: Category[]
    total: number
    page: number
    perPage: number
}

export default function BlogContent({ blogPosts, categories, total, page, perPage }: BlogContentProps) {
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const categoryProp = searchParams.get('category') || '';
    const router = useRouter();

    const search = () => {
        router.push(`/blog?search=${encodeURIComponent(searchTerm.trim())}&page=1`);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-16"
        >
            {/* Page Header */}
            <div className="text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold mb-6"
                >
                    Blog
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-gray-400 max-w-2xl mx-auto"
                >
                    Web teknolojileri, yazılım geliştirme ve dijital dünya hakkında güncel yazılar.
                </motion.p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((category: Category, index: number) => (
                        <motion.button
                            key={category.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-full ${category.name === "Tümü" && categoryProp === ""
                                ? "bg-primary text-black"
                                : category.slug === categoryProp
                                    ? "bg-primary text-black"
                                    : "bg-dark-darker hover:bg-dark-light"
                                } transition-all`}
                            onClick={() => {
                                if (category.name === "Tümü") {
                                    router.push(`/blog`);
                                } else {
                                    router.push(`/blog?category=${category.slug}&page=1`);
                                }
                            }}
                        >
                            {category.name}
                        </motion.button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-64">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" onClick={search} />
                    <input
                        type="search"
                        placeholder="Yazılarda ara..."
                        name="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && search()}
                        className="w-full pl-12 pr-4 py-3 rounded-full bg-dark-darker border border-dark-light focus:border-primary outline-none transition-all"
                    />
                </div>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.length > 0 ? (
                    blogPosts.map((post, index) => (
                        <motion.article
                            key={post.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            {/* Image Container */}
                            <div className="relative overflow-hidden rounded-2xl mb-6 aspect-video">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10" />
                                <motion.div
                                    className="absolute inset-0 bg-dark-darker"
                                    initial={{ opacity: 0.7 }}
                                    animate={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                />
                                <motion.div
                                    className="w-full h-full"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="absolute inset-0 bg-dark-darker animate-pulse" />
                                </motion.div>
                            </div>

                            {/* Content */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <FaTag className="text-primary" />
                                        <span>{post.categoriesWith?.map((category: Category) => category.name).join(', ')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaClock className="text-primary" />
                                        <span>{post.created_at ? new Date(post.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}</span>
                                    </div>
                                </div>

                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="block"
                                >
                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                        {post.title.slice(0, 30) + (post.title.length > 30 ? '...' : '')}
                                    </h3>
                                </Link>

                                <p className="text-gray-400">
                                    {post.excerpt}
                                </p>


                            </div>
                        </motion.article>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-gray-400 text-lg"
                        >
                            Aradığınız kriterlere uygun yazı bulunamadı.
                        </motion.p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <Pagination
                total={total}
                perPage={perPage}
                currentPage={page}
            />
        </motion.div>
    )
} 