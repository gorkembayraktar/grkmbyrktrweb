'use client'
import { motion } from 'framer-motion'
import { FaClock, FaTag } from 'react-icons/fa'
import type { FC } from 'react'
import { Category, PostFormData } from '../dashboard/blog/posts/types'
import Link from 'next/link'

const blogPosts = [
    {
        title: "Modern Web Teknolojileri",
        excerpt: "Next.js, React ve modern web teknolojileri ile ilgili detaylı bir inceleme ve en iyi pratikler.",
        image: "/images/blog/modern-web.jpg",
        category: "Teknoloji",
        date: "15 Mart 2024",
        readTime: "5 dk"
    },
    {
        title: "SEO Optimizasyonu İpuçları",
        excerpt: "Web sitenizin arama motorlarında üst sıralarda yer alması için uygulamanız gereken SEO teknikleri.",
        image: "/images/blog/seo-tips.jpg",
        category: "SEO",
        date: "10 Mart 2024",
        readTime: "4 dk"
    },
    {
        title: "Veritabanı Performans Optimizasyonu",
        excerpt: "MySQL ve PostgreSQL veritabanlarında performans artırıcı yöntemler ve örnek uygulamalar.",
        image: "/images/blog/database.jpg",
        category: "Veritabanı",
        date: "5 Mart 2024",
        readTime: "6 dk"
    }
]

const Blog: FC<{ posts: PostFormData[] }> = ({ posts }) => {
    return (
        <section id="blog" className="py-20">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="space-y-16"
                >
                    {/* Section Header */}
                    <div className="text-center">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-primary mb-2"
                        >
                            Blog
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            Son Yazılar
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-gray-400 max-w-2xl mx-auto"
                        >
                            Web teknolojileri, yazılım geliştirme ve dijital dünya hakkında güncel yazılar.
                        </motion.p>
                    </div>

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post: PostFormData, index: number) => (
                            <motion.article
                                key={post.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                {/* Image Container */}
                                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-video">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10" />
                                    <motion.div
                                        className="absolute inset-0 bg-dark-darker"
                                        initial={{ opacity: 0.7 }}
                                        whileInView={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        viewport={{ once: true }}
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
                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        {
                                            post.categoriesWith?.map((category: Category) => (
                                                <div className="flex items-center gap-2" key={category.id}>
                                                    <FaTag className="text-primary" />
                                                    <span>{category.name}</span>
                                                </div>
                                            ))
                                        }
                                    </div>

                                    {/* Title */}
                                    <Link href={`/blog/${post.slug}`}>
                                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                            {post.title.slice(0, 30) + (post.title.length > 30 ? '...' : '')}
                                        </h3>
                                    </Link>


                                    {/* Excerpt */}
                                    <p className="text-gray-400">
                                        {post.excerpt ? post.excerpt :
                                            (post.content.replace(/<[^>]*>?/gm, '').split(' ').slice(0, 15).join(' ') + '...')}
                                    </p>

                                    {/* Date */}
                                    <p className="text-sm text-gray-500">
                                        {post.created_at ? new Date(post.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}
                                    </p>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    {/* View All Button */}
                    <div className="text-center">
                        <motion.a
                            href="/blog"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 rounded-full bg-dark-darker border border-dark hover:border-primary transition-all inline-flex items-center gap-2"
                        >
                            Tüm Yazıları Gör
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Blog 