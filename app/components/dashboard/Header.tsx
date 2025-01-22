'use client'
import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { FaBell, FaUser, FaSignOutAlt, FaCog, FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/app/utils/supabase/client'

interface HeaderProps {
    user: User | null
    isCollapsed: boolean
    setIsCollapsed: (value: boolean) => void
}

export default function Header({ user, isCollapsed, setIsCollapsed }: HeaderProps) {
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [isDarkTheme, setIsDarkTheme] = useState(true)
    const menuRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()
    // Theme durumunu kontrol et ve uygula
    useEffect(() => {
        // localStorage'dan theme durumunu al, yoksa dark theme kullan
        const savedTheme = localStorage.getItem('theme') ?? 'dark'
        const isDark = savedTheme === 'dark'
        setIsDarkTheme(isDark)

        // HTML elementine dark class'ını ekle/çıkar
        if (isDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    const toggleTheme = () => {
        const newTheme = !isDarkTheme
        setIsDarkTheme(newTheme)

        // Theme durumunu localStorage'a kaydet
        localStorage.setItem('theme', newTheme ? 'dark' : 'light')

        // HTML elementine dark class'ını ekle/çıkar
        if (newTheme) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    return (
        <header className={`h-16 bg-light dark:bg-dark-darker border-b border-light-darker dark:border-dark-light fixed top-0 right-0 transition-all duration-300 z-20
            ${isCollapsed
                ? 'left-0 md:left-16' // Collapsed state
                : 'left-0 md:left-64' // Expanded state
            }`}
        >
            <div className="h-full px-4 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-light-dark/5 dark:hover:bg-dark-light/10 rounded-lg transition-colors"
                    >
                        {isCollapsed ? <FaBars className="text-gray-600 dark:text-gray-400 text-sm md:text-base" /> : <FaTimes className="text-gray-600 dark:text-gray-400 text-sm md:text-base" />}
                    </button>

                </div>

                <div className="flex items-center gap-4">
                    <button className="hidden md:flex p-2 hover:bg-light-dark/5 dark:hover:bg-dark-light/10 rounded-lg relative">
                        <FaBell className="text-gray-600 dark:text-gray-400" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 p-2 hover:bg-light-dark/5 dark:hover:bg-dark-light/10 rounded-lg"
                        >
                            <div className="w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                                <FaUser className="text-primary" />
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.user_metadata.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
                            </div>
                        </button>

                        {showUserMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-0 top-full mt-2 w-64 bg-light dark:bg-dark-darker border border-light-darker dark:border-dark-light/20 rounded-lg shadow-lg divide-y divide-light-darker dark:divide-dark-light/10"
                            >
                                {/* Kullanıcı Bilgisi */}
                                <div className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                                            <FaUser className="text-primary text-lg" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-light-darker dark:border-dark-light/10" />

                                {/* Görünüm Ayarları */}
                                <div className="px-4 py-3">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Görünüm Ayarları</p>
                                    <div className="flex items-center justify-between hover:bg-light-dark/5 dark:hover:bg-dark-light/5 p-2 rounded-lg transition-colors">
                                        <div className="flex items-center gap-3">
                                            {isDarkTheme ? (
                                                <FaMoon className="text-blue-500 dark:text-blue-400" />
                                            ) : (
                                                <FaSun className="text-yellow-500 dark:text-yellow-400" />
                                            )}
                                            <span className="text-sm text-gray-700 dark:text-gray-200">Tema Ayarları</span>
                                        </div>
                                        <button
                                            onClick={toggleTheme}
                                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
                                                ${isDarkTheme ? 'bg-primary' : 'bg-gray-400 dark:bg-gray-600'}`}
                                        >
                                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200
                                                ${isDarkTheme ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                <hr className="border-light-darker dark:border-dark-light/10" />

                                {/* Menü Öğeleri */}
                                <div className="py-1">
                                    <button className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-light-dark/5 dark:hover:bg-dark-light/5 transition-colors">
                                        <FaCog className="text-gray-500 dark:text-gray-400" />
                                        <span className="text-sm text-gray-700 dark:text-gray-200">Ayarlar</span>
                                    </button>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-light-dark/5 dark:hover:bg-dark-light/5 transition-colors group"
                                    >
                                        <FaSignOutAlt className="text-gray-500 dark:text-gray-400 group-hover:text-red-500" />
                                        <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-red-500">Çıkış Yap</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
} 