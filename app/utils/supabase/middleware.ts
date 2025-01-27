import { NextResponse, type NextRequest } from 'next/server'
import { adminClient, createClient } from './server'
import { UAParser } from 'ua-parser-js'


export async function updateSession(request: NextRequest) {
    try {
        const requestUrl = new URL(request.url)
        const response = NextResponse.next()

        if (requestUrl.pathname === '/') return response;

        if (requestUrl.pathname.startsWith('/auth/auth-unauthorized')) {
            const supabase = await createClient()
            const { data: { user }, error } = await supabase.auth.getUser()
            if (!user) {
                return NextResponse.redirect(new URL('/login', request.url))
            }
            if (user?.email === process.env.AUTHORIZED_EMAIL) {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }
        }

        if (['/login', '/register'].includes(requestUrl.pathname)) {

            const supabase = await createClient()
            const { data: { user }, error } = await supabase.auth.getUser()

            return user ? NextResponse.redirect(new URL('/dashboard', request.url)) : response
        }

        // Public routes - her zaman erişilebilir
        const publicUrls = ['/auth', '/api', '/blog']
        const isPublicRoute = publicUrls.some(url => requestUrl.pathname.startsWith(url))

        if (isPublicRoute) {
            return response
        }

        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        // Oturum yoksa login sayfasına yönlendir
        if (error || !user && !isPublicRoute) {
            const redirectUrl = new URL('/login', request.url)
            redirectUrl.searchParams.set('redirectedFrom', requestUrl.pathname)
            return NextResponse.redirect(redirectUrl)
        }

        if (requestUrl.pathname.startsWith('/dashboard') && user?.email !== process.env.AUTHORIZED_EMAIL) {
            return NextResponse.redirect(new URL('/auth/auth-unauthorized', request.url))
        }

        return response
    } catch (e) {
        console.error('Middleware error:', e)
        return NextResponse.next()
    }
}


export async function incrementViewCount({ request, response }: { request: NextRequest, response: NextResponse }) {
    const supabase = await adminClient();
    const path = request.nextUrl.pathname

    if (path.startsWith('/projects/') || path.startsWith('/blog/')) {
        try {
            // Get user agent info
            const userAgent = request.headers.get('user-agent') || '';
            const parser = new UAParser(userAgent);

            // Get IP and location info
            const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '';
            const language = request.headers.get('accept-language')?.split(',')[0] || '';
            const referrer = request.headers.get('referer') || '';

            // Parse user agent
            const browser = parser.getBrowser().name || '';
            const os = parser.getOS().name || '';
            const device = parser.getDevice().type || 'desktop';
            const isMobile = device === 'mobile' || device === 'tablet';

            // Get location info from IP
            let country = '', city = '';

            await supabase
                .from('views')
                .insert([{
                    page_path: path,
                    view_count: 1,
                    ip_address: ip,
                    user_agent: userAgent,
                    device_type: device,
                    browser: browser,
                    os: os,
                    language: language,
                    referrer: referrer,
                    is_mobile: isMobile,
                    country: country,
                    city: city
                }])

        } catch (error) {
            console.error('Error tracking page view:', error)
        }
    }
}
