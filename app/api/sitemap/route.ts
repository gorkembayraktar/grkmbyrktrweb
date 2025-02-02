import { NextResponse } from 'next/server'
import { getPosts } from '@/app/utils/posts'

export async function GET() {
    const baseUrl = 'https://your-domain.com'
    const posts = await getPosts()

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>${baseUrl}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
        </url>
        ${posts.map(post => `
            <url>
                <loc>${baseUrl}/blog/${post.slug}</loc>
                <lastmod>${new Date(post.updated_at || post.created_at || '').toISOString()}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
            </url>

        `).join('')}
    </urlset>`

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml'
        }
    })
} 