import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from './server'

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