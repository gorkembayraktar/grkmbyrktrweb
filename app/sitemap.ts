import { MetadataRoute } from 'next'
import { getPosts } from './utils/posts'
import { getCategories } from './utils/categories'
import { PostFormData } from './dashboard/blog/posts/types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.SITE_URL || 'http://localhost:3000'

    // Tüm blog yazılarını al
    const posts = await getPosts()
    const postUrls = posts.map((post: PostFormData) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.created_at || ''),
        changeFrequency: 'weekly' as const,
        priority: 0.8
    }))

    // Kategori sayfaları - query parameter olarak
    const categories = await getCategories()
    const categoryUrls = categories.map(category => ({
        url: `${baseUrl}/blog?category=${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5
    }))

    // Statik sayfalar
    const staticUrls = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9
        }
    ]

    return [...staticUrls, ...postUrls, ...categoryUrls]
} 