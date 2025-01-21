import { createClient } from '@/app/utils/supabase/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const origin = new URL(request.url).origin

    if (code) {
        const cookieStore = cookies()
        const supabase = await createClient();
        // const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
        await supabase.auth.exchangeCodeForSession(code)
        return NextResponse.redirect(`${origin}/dashboard`)
    }

    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}