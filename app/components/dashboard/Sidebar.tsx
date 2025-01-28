'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaNewspaper, FaProjectDiagram, FaUsers, FaCog, FaChartBar, FaList, FaPlus, FaTags, FaWrench, FaEnvelope, FaSlidersH, FaWhatsapp, FaArrowUp } from 'react-icons/fa'
import { useEffect, useState } from 'react'

interface SidebarProps {
    isCollapsed: boolean
    setIsCollapsed: (value: boolean) => void
}

interface MenuItem {
    icon: any
    label: string
    path: string
    subItems?: MenuItem[]
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname()
    const [expandedMenus, setExpandedMenus] = useState<string[]>([])

    // Ekran boyutu değiştiğinde sidebar durumunu kontrol et
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [setIsCollapsed])

    const menuItems: MenuItem[] = [
        { icon: FaHome, label: 'Ana Sayfa', path: '/dashboard' },
        {
            icon: FaNewspaper,
            label: 'Blog',
            path: '/dashboard/blog',
            subItems: [
                { icon: FaList, label: 'Yazılar', path: '/dashboard/blog/posts' },
                { icon: FaPlus, label: 'Yazı Ekle', path: '/dashboard/blog/posts/new' },
                { icon: FaTags, label: 'Kategoriler', path: '/dashboard/blog/categories' },
            ]
        },
        { icon: FaProjectDiagram, label: 'Projeler', path: '/dashboard/projects' },
        { icon: FaUsers, label: 'Kullanıcılar', path: '/dashboard/users' },
        { icon: FaEnvelope, label: 'Mail', path: '/dashboard/contacts' },
        {
            icon: FaCog,
            label: 'Modül',
            path: '/dashboard/modules',
            subItems: [
                { icon: FaWhatsapp, label: 'Whatsapp', path: '/dashboard/modules/whatsapp' },
                { icon: FaArrowUp, label: 'Yukarı Çık', path: '/dashboard/modules/scroll-to-top' },
            ]
        },
        {
            icon: FaCog,
            label: 'Ayarlar',
            path: '/dashboard/settings',
            subItems: [
                { icon: FaSlidersH, label: 'Genel', path: '/dashboard/settings/general' },
                { icon: FaEnvelope, label: 'Mail', path: '/dashboard/settings/mail' },
            ]
        }
    ]

    const toggleSubMenu = (path: string) => {
        setExpandedMenus(prev =>
            prev.includes(path)
                ? prev.filter(p => p !== path)
                : [...prev, path]
        )
    }

    const renderMenuItem = (item: MenuItem, isSubItem: boolean = false) => {
        const isActive = pathname === item.path ||
            (item.subItems && item.subItems.some(subItem => pathname === subItem.path))
        const hasSubItems = item.subItems && item.subItems.length > 0
        const isExpanded = expandedMenus.includes(item.path)

        return (
            <div key={item.path} className={`${isSubItem ? 'mt-1' : 'mt-2'} relative`}>
                <div
                    onClick={() => hasSubItems ? toggleSubMenu(item.path) : null}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer relative
                        ${isActive
                            ? 'text-primary font-medium bg-primary/5'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-light-dark/5 dark:hover:bg-dark-light/5 hover:text-gray-900 dark:hover:text-white'}
                        ${isCollapsed ? 'justify-center' : ''}
                        ${isSubItem ? 'text-sm' : ''}`}
                >
                    {isActive && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-lg" />
                    )}
                    <Link
                        href={hasSubItems ? '#' : item.path}
                        className="flex items-center gap-3 flex-1"
                        onClick={(e) => hasSubItems && e.preventDefault()}
                    >
                        <div className={`flex-shrink-0 transition-transform duration-200 
                            ${isCollapsed ? 'transform scale-110' : ''}
                            ${isActive ? 'text-primary' : 'group-hover:scale-110'}`}
                        >
                            <item.icon className={isSubItem ? 'text-base' : 'text-lg'} />
                        </div>
                        {!isCollapsed && (
                            <span className="flex-1 whitespace-nowrap">{item.label}</span>
                        )}
                    </Link>
                    {hasSubItems && !isCollapsed && (
                        <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            className="w-4 h-4 flex items-center justify-center opacity-60"
                        >
                            <svg
                                width="6"
                                height="10"
                                viewBox="0 0 6 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M1 9L5 5L1 1"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </motion.div>
                    )}
                </div>

                {hasSubItems && !isCollapsed && (
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pl-3 ml-3 border-l border-light-darker/5 dark:border-dark-light/5"
                            >
                                {item.subItems?.map(subItem => renderMenuItem(subItem, true))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        )
    }

    return (
        <>
            {/* Mobil için karartma overlay */}
            {!isCollapsed && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsCollapsed(true)}
                />
            )}

            <motion.div
                className={`fixed top-0 left-0 h-screen bg-light dark:bg-dark-darker border-r border-light-darker dark:border-dark-light/20 transition-all duration-300 z-40
                    ${isCollapsed ? '-translate-x-full md:translate-x-0 md:w-16' : 'w-[280px] md:w-64'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="h-16 border-b border-light-darker dark:border-dark-light/20 flex items-center px-4 relative">
                        {/* Logo */}
                        <motion.div
                            animate={{ opacity: isCollapsed ? 0 : 1 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden whitespace-nowrap"
                        >
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <span className="text-lg font-bold text-white">A</span>
                                </div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Admin Panel
                                </h1>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-4 px-2 overflow-y-auto">
                        <div className="space-y-0.5">
                            {menuItems.map(item => renderMenuItem(item))}
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className={`p-4 border-t border-light-darker dark:border-dark-light/20 transition-all duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center whitespace-nowrap">
                            © 2024 Admin Panel
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    )
} 