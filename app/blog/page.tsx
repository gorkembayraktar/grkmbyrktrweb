'use client'
import { motion } from 'framer-motion'
import { FaClock, FaTag, FaSearch } from 'react-icons/fa'
import type { FC } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
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

const categories = ["Tümü", "Teknoloji", "SEO", "Veritabanı", "Web Geliştirme"]

const BlogPage: FC = () => {
    return (
        <>
            <Navbar />
            <main className="pt-32 pb-20">
                <div className="container">
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
                                {categories.map((category, index) => (
                                    <motion.button
                                        key={category}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-4 py-2 rounded-full ${category === "Tümü"
                                            ? "bg-primary text-black"
                                            : "bg-dark-darker hover:bg-dark-light"
                                            } transition-all`}
                                    >
                                        {category}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Search */}
                            <div className="relative w-full md:w-64">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Yazılarda ara..."
                                    className="w-full pl-12 pr-4 py-3 rounded-full bg-dark-darker border border-dark-light focus:border-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Blog Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogPosts.map((post, index) => (
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
                                        {/* Meta */}
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <FaTag className="text-primary" />
                                                <span>{post.category}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaClock className="text-primary" />
                                                <span>{post.readTime}</span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <Link
                                            href={`/blog/${post.title.toLowerCase().replace(/ /g, '-')}`}
                                            className="block"
                                        >
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h3>
                                        </Link>

                                        {/* Excerpt */}
                                        <p className="text-gray-400">
                                            {post.excerpt}
                                        </p>

                                        {/* Date */}
                                        <p className="text-sm text-gray-500">
                                            {post.date}
                                        </p>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default BlogPage 