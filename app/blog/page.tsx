import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BlogContent from './components/BlogContent'
import { getSettings } from '../utils/settings'
import Whatsapp from '../modules/Whatsapp'
import ScrollToTop from '../modules/ScrollToTop'
import { getCategories } from '../utils/categories'
import { Category } from '@/app/dashboard/blog/posts/types'
import { getPostsFiltered } from '../utils/posts'





export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const search = params.search || '';
    let page = params.page || 1;
    page = parseInt(page as string);

    if (page < 1) {
        page = 1;
    }

    const settings = await getSettings();
    const perPage = 12;
    const { posts, total } = await getPostsFiltered({
        category: params.category as string,
        perPage,
        search: search as string,
        page: page,
        orderBy: "created_at",
        order: "desc"
    });

    const categories = [
        { id: 0, name: "Tümü" },
        ... await getCategories()
    ]


    return (
        <>
            <Navbar settings={settings} />
            <main className="pt-32 pb-20">
                <div className="container">
                    <BlogContent
                        blogPosts={posts}
                        categories={categories as Category[]}
                        total={total}
                        perPage={perPage}
                        page={page}
                    />
                </div>
            </main>
            <Footer settings={settings} />
            <Whatsapp settings={settings.whatsapp} />
            <ScrollToTop settings={settings.scrollSettings} />
        </>

    )
} 