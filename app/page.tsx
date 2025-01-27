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

const Home: FC = async () => {
    const supabase = await adminClient();

    // Settings'leri çek
    const { data: settings, error: settingsError } = await supabase
        .from('settings')
        .select('*');

    if (settingsError) {
        console.error('Error fetching settings:', settingsError);
    }

    // Projects'leri çek
    const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

    if (projectsError) {
        console.error('Error fetching projects:', projectsError);
    }

    // WhatsApp ayarlarını parse et
    let whatsapp = settings?.find(s => s.key === 'module_whatsapp')?.value;
    if (whatsapp) {
        try {
            whatsapp = JSON.parse(whatsapp) as WhatsAppSettings;
        } catch (error) {
            console.error('Error parsing WhatsApp settings:', error);
        }
    }

    const settingsObject = ArrayToObjectSettings(settings);

    return (
        <main>
            <Navbar />
            <Hero />
            <PhpSolutions />
            <Services />
            <About />
            <Projects projects={projects as Project[]} />
            <Blog />
            <Contact />
            <Footer settings={settingsObject} />
            <Whatsapp settings={whatsapp} />
        </main>
    );
};


const ArrayToObjectSettings = (array: any) => {
    return array.reduce((acc: any, item: any) => {
        acc[item.key] = item.value;
        return acc;
    }, {}) as GeneralSettings;
}

export default Home; 