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
import { GeneralSettings, Project, Settings, WhatsAppSettings } from './types'
import type { Metadata } from 'next'
import { getSettings } from './utils/settings'

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

    return (
        <main>
            <Navbar settings={settings} />
            <Hero />
            <PhpSolutions />
            <Services />
            <About />
            <Projects projects={projects as Project[]} />
            <Blog />
            <Contact />
            <Footer settings={settings} />
            <Whatsapp settings={whatsapp} />
        </main>
    );
};





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