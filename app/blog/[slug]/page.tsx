import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import BlogContent from './components/BlogContent'
import Whatsapp from '@/app/modules/Whatsapp'
import { getSettings } from '@/app/utils/settings'
import { getPostById, getRecentPosts, getRelatedPosts } from '@/app/utils/posts'
import ScrollToTop from '@/app/modules/ScrollToTop'
import { Metadata } from 'next'



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