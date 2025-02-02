import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import BlogContent from './components/BlogContent'
import Whatsapp from '@/app/modules/Whatsapp'
import { PageParams } from '@supabase/supabase-js'
import { getSettings } from '@/app/utils/settings'
import { getPostById, getRecentPosts, getRelatedPosts } from '@/app/utils/posts'
import ScrollToTop from '@/app/modules/ScrollToTop'
import { Metadata } from 'next'

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

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug?: string }> }): Promise<Metadata> {
    const p = await params;
    const post = await getPostById(p.slug as string);


    return {
        title: post?.meta_title || post?.title,
        description: post?.meta_description || post?.excerpt,
        keywords: post?.meta_keywords,
        openGraph: {
            title: post?.title,
            description: post?.excerpt,
            type: 'article',
            authors: [post?.author?.full_name],
            publishedTime: post?.created_at
        }
    }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug?: string }> }) {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug as string;
    const post = await getPostById(slug);

    // İlgili yazıları al
    const categoryIds = post?.categoriesWith?.map((cat: any) => cat.categories.id) || [];
    const relatedPosts = await getRelatedPosts(post?.id, categoryIds);

    const settings = await getSettings();


    const recentPosts = await getRecentPosts(3);
    return (
        <>
            <Navbar settings={settings} />
            <main className="pt-32 pb-20">
                <div className="container">
                    <BlogContent
                        post={post}
                        relatedPosts={relatedPosts}
                        recentPosts={recentPosts}
                    />
                </div>
            </main>
            <Footer settings={settings} />
            <Whatsapp settings={settings.whatsapp} />
            <ScrollToTop settings={settings.scrollToTop} />
        </>

    )
} 