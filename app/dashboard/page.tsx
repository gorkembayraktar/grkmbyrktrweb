'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '../utils/supabase/client'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import { motion } from 'framer-motion'

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push('/login')
                    return
                }
                setUser(user)
            } catch (error) {
                console.error('Error checking auth:', error)
                router.push('/login')
            } finally {
                setLoading(false)
            }
        }

        checkUser()
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <DashboardLayout user={user}>

            sdada
        </DashboardLayout>
    )
} 