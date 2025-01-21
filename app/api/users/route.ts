import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
    try {
        const { data: { users }, error } = await supabase.auth.admin.listUsers()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const formattedUsers = users?.map(user => ({
            ...user,
            provider: user.app_metadata?.provider || 'email'
        })) || []

        return NextResponse.json(formattedUsers)
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
} 