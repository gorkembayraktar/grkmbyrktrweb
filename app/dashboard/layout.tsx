'use client'
import { createClient } from '@/app/utils/supabase/client'
import DashboardLayout from '@/app/components/dashboard/DashboardLayout'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Toaster } from 'react-hot-toast'

import useUserStore from "@/app/store/userStore";

export default function Layout({ children }: { children: React.ReactNode }) {
    //const [user, setUser] = useState<User | null>(null)
    const supabase = createClient()
    const { user: userData, updateUser } = useUserStore()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            console.log("layout", user)
            updateUser(user as User)
        }
        getUser()
    }, [])



    return (
        <>
            <Toaster position="top-right" />
            <DashboardLayout user={userData}>
                {children}
            </DashboardLayout>
        </>
    )
} 