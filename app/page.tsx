import Hero from './components/Hero'
import Services from './components/Services'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PhpSolutions from './components/PhpSolutions'
import Blog from './components/Blog'
import type { FC } from 'react'
import Whatsapp from './modules/Whatsapp'
import { adminClient } from './utils/supabase/server'
import { GeneralSettings, Project, ScrollToTopSettings, Settings, WhatsAppSettings } from './types'
import type { Metadata } from 'next'
import { getSettings } from './utils/settings'
import ScrollToTop from './modules/ScrollToTop'
import { Category, PostFormData } from './dashboard/blog/posts/types'



const Home: FC = async () => {
    const supabase = await adminClient();

    const settings = await getSettings();

    // Projects'leri çek
    const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

    if (projectsError) {
        console.error('Error fetching projects:', projectsError);
    }

    // WhatsApp ayarlarını parse et
    let whatsapp = settings?.module_whatsapp;
    if (whatsapp) {
        try {
            whatsapp = JSON.parse(whatsapp) as WhatsAppSettings;
        } catch (error) {
            console.error('Error parsing WhatsApp settings:', error);
        }
    }

    let scrollSettings = settings?.module_scroll_to_top;
    if (scrollSettings) {
        try {
            scrollSettings = JSON.parse(scrollSettings) as ScrollToTopSettings;
        } catch (error) {
            console.error('Error parsing ScrollToTop settings:', error);
        }
    }

    const posts = await getPosts(3);

    return (
        <main>
            <Navbar settings={settings} />
            <Hero />
            <PhpSolutions />
            <Services />
            <About />
            <Projects projects={projects as Project[]} />
            <Blog posts={posts as PostFormData[]} />
            <Contact />
            <Footer settings={settings} />
            <Whatsapp settings={whatsapp} />
            <ScrollToTop settings={scrollSettings} />
        </main>
    );
};


async function getPosts(limit: number = 3) {
    const supabase = await adminClient();

    // Önce postları al
    const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select(`*`)
        .eq('status', 'published')
        .limit(limit)
        .order('created_at', { ascending: false });

    if (postsError) {
        console.error('Error fetching posts:', postsError);
        return [];
    }

    // Her post için kategorileri al
    return await Promise.all(posts?.map(async (post: PostFormData) => {
        const { data: postCategories, error: categoriesError } = await supabase
            .from('post_categories')
            .select(`
                post_id,
                categories!inner(
                    id,
                    name,
                    slug,
                    parent_id
                ) 
            `)
            .eq('post_id', post.id);

        if (categoriesError) {
            console.error('Error fetching categories:', categoriesError);
        }

        if (postCategories) {
            const list = postCategories as any;

            post.categoriesWith = list.map((pc: PostCategoriesType) => ({
                id: pc.categories.id,
                name: pc.categories.name,
                parent_id: pc.categories.parent_id
            } as Category)) || [];
        }

        return post;
    })) as PostFormData[] || [];
}

interface PostCategoriesType {
    post_id: string;
    categories: CategoriesType;
}
interface CategoriesType {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
}


export async function generateMetadata(): Promise<Metadata> {
    const settingsObject = await getSettings();

    return {
        title: settingsObject.title || 'Görkem Bayraktar - Web Yazılım Çözümleri',
        description: settingsObject.description || 'Next.js, React Native ve modern teknolojilerle web ve mobil çözümler',
        keywords: settingsObject.keywords || 'web,yazılım,nextjs,react native,mobil uygulama',
        authors: [{ name: 'Görkem Bayraktar' }],
        openGraph: {
            title: settingsObject.title,
            description: settingsObject.description,
            url: 'https://gorkembayraktar.com',
            siteName: settingsObject.title,
            locale: 'tr_TR',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: settingsObject.title,
            description: settingsObject.description
        },
        robots: {
            index: true,
            follow: true,
        },
        manifest: '/manifest.json',
        icons: {
            icon: '/favicon.ico',
            apple: [
                { url: '/favicon.ico' },
            ],
        },
    };
}

export default Home; 