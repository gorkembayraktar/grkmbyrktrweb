import { type NextRequest, NextResponse } from 'next/server'
import { updateSession, incrementViewCount } from '@/app/utils/supabase/middleware'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
    // Auth session update
    const response = await updateSession(request)

    // If response is a redirect, return it immediately
    if (response instanceof NextResponse && response.headers.get('Location')) {
        return response
    }

    await incrementViewCount({ request, response });

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}