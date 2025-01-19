'use client'
import { motion } from 'framer-motion'
import { FaClock, FaTag, FaArrowLeft, FaSearch, FaTwitter, FaLinkedin, FaList } from 'react-icons/fa'
import type { FC } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Örnek son yazılar verisi
const recentPosts = [
    {
        title: "SEO Optimizasyonu İpuçları",
        date: "10 Mart 2024",
        slug: "seo-optimizasyonu-ipuclari"
    },
    {
        title: "Veritabanı Performans Optimizasyonu",
        date: "5 Mart 2024",
        slug: "veritabani-performans-optimizasyonu"
    },
    {
        title: "Modern Web Teknolojileri",
        date: "15 Mart 2024",
        slug: "modern-web-teknolojileri"
    }
]

// İlgili yazılar verisi
const relatedPosts = [
    {
        title: "React Hooks Kullanım Rehberi",
        excerpt: "React hooks ile fonksiyonel component'lerde state yönetimi ve yaşam döngüsü.",
        slug: "react-hooks-kullanim-rehberi",
        category: "React"
    },
    {
        title: "Next.js 13 Yenilikleri",
        excerpt: "Next.js 13 ile gelen yeni özellikler ve app directory yapısı.",
        slug: "nextjs-13-yenilikleri",
        category: "Next.js"
    }
]

// Örnek blog yazısı verisi
const blogPost = {
    title: "Modern Web Teknolojileri",
    excerpt: "Next.js, React ve modern web teknolojileri ile ilgili detaylı bir inceleme ve en iyi pratikler.",
    content: `
        <h2>Modern Web Geliştirme</h2>
        <p>Modern web geliştirme dünyası sürekli olarak evrim geçiriyor. Yeni teknolojiler ve yaklaşımlar, geliştiricilere daha iyi performans, daha iyi kullanıcı deneyimi ve daha verimli geliştirme süreçleri sunuyor.</p>
        
        <h3>Next.js ve React</h3>
        <p>Next.js, React tabanlı web uygulamaları geliştirmek için mükemmel bir framework. Sunucu tarafı rendering, statik site oluşturma ve API route'ları gibi özellikleriyle modern web uygulamaları geliştirmeyi kolaylaştırıyor.</p>
        
        <h3>Modern Web Teknolojileri</h3>
        <p>Günümüzde web geliştirme süreçlerinde kullanılan bazı önemli teknolojiler:</p>
        <ul>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
            <li>Framer Motion</li>
            <li>React Query</li>
        </ul>
        
        <h2>En İyi Pratikler</h2>
        <p>Modern web uygulamaları geliştirirken dikkat edilmesi gereken bazı önemli noktalar:</p>
        <ul>
            <li>Performans optimizasyonu</li>
            <li>SEO dostu yapı</li>
            <li>Responsive tasarım</li>
            <li>Erişilebilirlik</li>
        </ul>
    `,
    image: "/images/blog/modern-web.jpg",
    category: "Teknoloji",
    date: "15 Mart 2024",
    readTime: "5 dk",
    author: "Görkem Bayraktar",
    authorImage: "/images/author.jpg"
}

const BlogDetailPage: FC = () => {
    const [tableOfContents, setTableOfContents] = useState<Array<{ id: string, title: string, level: number }>>([])
    const [activeSection, setActiveSection] = useState<string>("")

    useEffect(() => {
        // İçerik yüklendiğinde başlıkları bul
        const content = document.querySelector('.prose')
        if (content) {
            const headings = content.querySelectorAll('h2, h3')
            const toc = Array.from(headings).map(heading => ({
                id: heading.textContent?.toLowerCase().replace(/ /g, '-') || '',
                title: heading.textContent || '',
                level: heading.tagName === 'H2' ? 2 : 3
            }))
            setTableOfContents(toc)

            // Başlıklara ID ekle
            headings.forEach(heading => {
                heading.id = heading.textContent?.toLowerCase().replace(/ /g, '-') || ''
            })
        }
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const headings = document.querySelectorAll('h2, h3')
            let current = ''

            headings.forEach(heading => {
                const top = heading.getBoundingClientRect().top
                if (top < 100) {
                    current = heading.id
                }
            })

            setActiveSection(current)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <Navbar />
            <main className="pt-32 pb-20">
                <div className="container">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Content */}
                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="space-y-8"
                            >
                                {/* Back Button */}
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors"
                                >
                                    <FaArrowLeft />
                                    <span>Geri Dön</span>
                                </Link>

                                {/* Article Header */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <FaTag className="text-primary" />
                                            <span>{blogPost.category}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaClock className="text-primary" />
                                            <span>{blogPost.readTime}</span>
                                        </div>
                                    </div>

                                    <h1 className="text-4xl md:text-5xl font-bold">
                                        {blogPost.title}
                                    </h1>

                                    {/* Author Info */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-dark-darker">
                                            <motion.div
                                                className="w-full h-full bg-dark-darker animate-pulse"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">{blogPost.author}</p>
                                            <p className="text-sm text-gray-400">{blogPost.date}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Table of Contents - Mobile */}
                                <div className="lg:hidden bg-dark-darker rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <FaList className="text-primary" />
                                        <h3 className="text-xl font-bold">İçindekiler</h3>
                                    </div>
                                    <nav className="space-y-2">
                                        {tableOfContents.map((item) => (
                                            <a
                                                key={item.id}
                                                href={`#${item.id}`}
                                                className={`block text-sm ${item.level === 3 ? 'pl-4' : ''
                                                    } ${activeSection === item.id
                                                        ? 'text-primary'
                                                        : 'text-gray-400 hover:text-primary'
                                                    } transition-colors`}
                                            >
                                                {item.title}
                                            </a>
                                        ))}
                                    </nav>
                                </div>

                                {/* Featured Image */}
                                <div className="relative aspect-video rounded-2xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10" />
                                    <motion.div
                                        className="absolute inset-0 bg-dark-darker"
                                        initial={{ opacity: 0.7 }}
                                        animate={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                    <motion.div className="w-full h-full">
                                        <div className="absolute inset-0 bg-dark-darker animate-pulse" />
                                    </motion.div>
                                </div>

                                {/* Article Content */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="prose prose-invert prose-primary max-w-none"
                                    dangerouslySetInnerHTML={{ __html: blogPost.content }}
                                />

                                {/* Related Posts */}
                                <div className="border-t border-dark-light pt-8 space-y-6">
                                    <h3 className="text-xl font-bold">İlgili Yazılar</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {relatedPosts.map((post) => (
                                            <motion.article
                                                key={post.slug}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="bg-dark-darker rounded-2xl p-6 group"
                                            >
                                                <Link href={`/blog/${post.slug}`} className="space-y-4 block">
                                                    <span className="text-sm text-primary">{post.category}</span>
                                                    <h4 className="text-lg font-bold group-hover:text-primary transition-colors">
                                                        {post.title}
                                                    </h4>
                                                    <p className="text-gray-400 text-sm line-clamp-2">
                                                        {post.excerpt}
                                                    </p>
                                                </Link>
                                            </motion.article>
                                        ))}
                                    </div>
                                </div>

                                {/* Share Buttons */}
                                <div className="border-t border-dark-light pt-8">
                                    <h3 className="text-xl font-bold mb-4">Paylaş</h3>
                                    <div className="flex gap-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-6 py-2 rounded-full bg-dark-darker border border-dark hover:border-primary transition-all inline-flex items-center gap-2"
                                        >
                                            <FaTwitter />
                                            <span>Twitter</span>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-6 py-2 rounded-full bg-dark-darker border border-dark hover:border-primary transition-all inline-flex items-center gap-2"
                                        >
                                            <FaLinkedin />
                                            <span>LinkedIn</span>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:w-80 space-y-8"
                        >
                            {/* Table of Contents - Desktop */}
                            <div className="hidden lg:block bg-dark-darker rounded-2xl p-6 space-y-4 sticky top-24">
                                <div className="flex items-center gap-2">
                                    <FaList className="text-primary" />
                                    <h3 className="text-xl font-bold">İçindekiler</h3>
                                </div>
                                <nav className="space-y-2">
                                    {tableOfContents.map((item) => (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className={`block text-sm ${item.level === 3 ? 'pl-4' : ''
                                                } ${activeSection === item.id
                                                    ? 'text-primary'
                                                    : 'text-gray-400 hover:text-primary'
                                                } transition-colors`}
                                        >
                                            {item.title}
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            {/* Search */}
                            <div className="bg-dark-darker rounded-2xl p-6 space-y-4">
                                <h3 className="text-xl font-bold">Ara</h3>
                                <div className="relative">
                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Yazılarda ara..."
                                        className="w-full pl-12 pr-4 py-3 rounded-full bg-black/20 border border-dark-light focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Recent Posts */}
                            <div className="bg-dark-darker rounded-2xl p-6 space-y-4">
                                <h3 className="text-xl font-bold">Son Yazılar</h3>
                                <div className="space-y-4">
                                    {recentPosts.map((post) => (
                                        <motion.div
                                            key={post.slug}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="group"
                                        >
                                            <Link href={`/blog/${post.slug}`} className="block space-y-1">
                                                <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                                                    {post.title}
                                                </h4>
                                                <p className="text-sm text-gray-400">{post.date}</p>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="bg-dark-darker rounded-2xl p-6 space-y-4">
                                <h3 className="text-xl font-bold">Kategoriler</h3>
                                <div className="flex flex-wrap gap-2">
                                    {["Teknoloji", "SEO", "Veritabanı", "Web Geliştirme"].map((category) => (
                                        <Link
                                            key={category}
                                            href={`/blog?category=${category.toLowerCase()}`}
                                            className="px-3 py-1 rounded-full bg-black/20 text-sm text-gray-400 hover:bg-primary/20 hover:text-primary transition-all"
                                        >
                                            {category}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default BlogDetailPage 