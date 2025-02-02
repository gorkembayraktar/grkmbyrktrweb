'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FaClock, FaTag, FaArrowLeft, FaList, FaTwitter, FaLinkedin, FaSearch } from 'react-icons/fa'
import Link from 'next/link'
import { Category, PostFormData } from '@/app/dashboard/blog/posts/types'

interface BlogContentProps {
    post: PostFormData
    relatedPosts: any[]
    recentPosts: PostFormData[]
}


export default function BlogContent({ post, relatedPosts, recentPosts }: BlogContentProps) {
    const [tableOfContents, setTableOfContents] = useState<Array<{ id: string, title: string, level: number }>>([])
    const [activeSection, setActiveSection] = useState<string>("")


    function readTime(content: string) {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).filter(Boolean).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return minutes;
    }

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

    const shareOnTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
    }

    const shareOnLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content - Sol Kolon */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-8 space-y-8"
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
                            <span>{post.categoriesWith?.map((category: any) => category.categories.name).join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaClock className="text-primary" />
                            <span>{readTime(post.content)} dk okuma süresi</span>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold">
                        {post.title}
                    </h1>

                    {/* Author Info */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-dark-darker">
                            {post.author?.avatar_url ? (
                                <img
                                    src={post.author.avatar_url}
                                    alt={post.author.full_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <motion.div
                                    className="w-full h-full bg-dark-darker animate-pulse"
                                />
                            )}
                        </div>
                        <div>
                            <p className="font-medium">{post.author?.full_name}</p>
                            <p className="text-sm text-gray-400">
                                {post.created_at ? new Date(post.created_at).toLocaleDateString('tr-TR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                }) : ''}
                            </p>
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
                                className={`block text-sm ${item.level === 3 ? 'pl-4' : ''} 
                                    ${activeSection === item.id ? 'text-primary' : 'text-gray-400 hover:text-primary'} 
                                    transition-colors`}
                            >
                                {item.title}
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Article Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="prose prose-invert prose-primary max-w-none
                        prose-headings:text-white prose-headings:font-bold prose-headings:scroll-mt-24
                        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                        prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                        prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                        prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary/80
                        prose-strong:text-white prose-strong:font-bold
                        prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                        prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                        prose-li:text-gray-300 prose-li:mb-2
                        prose-blockquote:border-l-4 prose-blockquote:border-primary 
                        prose-blockquote:pl-6 prose-blockquote:py-1 prose-blockquote:my-6
                        prose-blockquote:text-gray-300 prose-blockquote:font-medium prose-blockquote:italic
                        prose-img:rounded-2xl prose-img:shadow-xl
                        prose-code:text-primary prose-code:bg-dark-darker prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                        prose-pre:bg-dark-darker prose-pre:border prose-pre:border-dark-light
                        [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                    dangerouslySetInnerHTML={{ __html: post.content }}
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
                                <Link href={`/blog/${post.slug}`} className="block hover:scale-[1.02] transition-transform">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-dark-darker flex-shrink-0">
                                            {post.author?.avatar_url ? (
                                                <img
                                                    src={post.author.avatar_url}
                                                    alt={post.author.full_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-dark-darker flex items-center justify-center text-gray-600">
                                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                                                {post.title}
                                            </h4>
                                            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed mt-2">
                                                {post.excerpt ? post.excerpt :
                                                    (post.content.replace(/<[^>]*>?/gm, '').split(' ').slice(0, 15).join(' ') + '...')}
                                            </p>
                                            <div className="flex items-center gap-2 mt-3">
                                                <span className="text-sm text-gray-400 border border-gray-700 px-3 py-1 rounded-full">
                                                    {post.created_at ? new Date(post.created_at).toLocaleDateString('tr-TR', {
                                                        day: '2-digit',
                                                        month: 'long'
                                                    }) : ''}
                                                </span>
                                                {post.author?.full_name && (
                                                    <span className="text-sm text-gray-500">
                                                        {post.author.full_name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
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
                            onClick={shareOnTwitter}
                        >
                            <FaTwitter />
                            <span>Twitter</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2 rounded-full bg-dark-darker border border-dark hover:border-primary transition-all inline-flex items-center gap-2"
                            onClick={shareOnLinkedIn}
                        >
                            <FaLinkedin />
                            <span>LinkedIn</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Sidebar - Sağ Kolon */}
            <div className="lg:col-span-4 space-y-8">
                {/* Table of Contents - Desktop */}
                <div className="hidden lg:block sticky top-24 space-y-8">
                    {/* Search */}
                    <div className="bg-dark-darker rounded-2xl p-6 space-y-4">
                        <h3 className="text-xl font-bold">Ara</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const searchInput = e.currentTarget.search as HTMLInputElement;
                                window.location.href = `/blog?search=${encodeURIComponent(searchInput.value.trim())}&page=1`;
                            }}
                            className="relative"
                        >
                            <input
                                type="search"
                                name="search"
                                placeholder="Yazılarda ara..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/20 border border-dark-light focus:border-primary outline-none transition-all"
                            />
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </form>
                    </div>

                    {/* İçindekiler */}
                    <div className="bg-dark-darker rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <FaList className="text-primary" />
                            <h3 className="text-xl font-bold">İçindekiler</h3>
                        </div>
                        <nav className="space-y-2">
                            {tableOfContents.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className={`block text-sm ${item.level === 3 ? 'pl-4' : ''} 
                                        ${activeSection === item.id ? 'text-primary' : 'text-gray-400 hover:text-primary'} 
                                        transition-colors`}
                                >
                                    {item.title}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Son Yazılar */}
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
                                    <Link href={`/blog/${post.slug}`} className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-dark-darker flex-shrink-0">
                                            {post.author?.avatar_url ? (
                                                <img
                                                    src={post.author.avatar_url}
                                                    alt={post.author.full_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-dark-darker flex items-center justify-center text-gray-600">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                                                {post.title}
                                            </h4>
                                            <p className="text-sm text-gray-400">
                                                {post.created_at ? new Date(post.created_at).toLocaleDateString('tr-TR', {
                                                    day: '2-digit',
                                                    month: 'long'
                                                }) : ''}
                                            </p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 