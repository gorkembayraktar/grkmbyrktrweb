'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MenuItem } from '../types'
import ContactModal from './ContactModal'
import type { FC } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { GeneralSettings } from '../types'

const Navbar: FC<{ settings: GeneralSettings }> = ({ settings }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [show, setShow] = useState(false)
    const pathname = usePathname()
    const isBlogPage = pathname.startsWith('/blog')

    useEffect(() => {
        // Hero animasyonlarının toplam süresi (1.7 saniye)
        const timer = setTimeout(() => {
            setShow(true)
        }, 1700)

        return () => clearTimeout(timer)
    }, [])

    const menuItems: MenuItem[] = [
        { title: "Ana Sayfa", href: isBlogPage ? "/" : "#home" },
        { title: "Hakkımda", href: isBlogPage ? "/#about" : "#about" },
        { title: "Hizmetler", href: isBlogPage ? "/#services" : "#services" },
        { title: "Blog", href: "/blog" },
        { title: "Projeler", href: isBlogPage ? "/#projects" : "#projects" },
        { title: "İletişim", href: isBlogPage ? "/#contact" : "#contact" },
    ]

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: show ? 0 : -100 }}
                transition={{ duration: 0.3 }}
                className="fixed w-full backdrop-blur-sm z-50 border-b border-dark-light"
            >
                <div className="container">
                    <div className="flex justify-between items-center h-16">
                        <Link
                            href="/"
                            className="text-2xl font-bold"
                        >
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: show ? 1 : 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {settings.name}
                            </motion.span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            {menuItems.map((item, index) => (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className="hover:text-primary transition-colors relative"
                                >
                                    <motion.span
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: show ? 1 : 0, y: show ? 0 : -20 }}
                                        transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {item.title}
                                    </motion.span>
                                </Link>
                            ))}
                            <motion.button
                                onClick={() => setIsModalOpen(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: show ? 1 : 0, y: show ? 0 : -20 }}
                                transition={{ duration: 0.3, delay: 0.8 }}
                                className="px-6 py-2 rounded-full flex items-center justify-center gap-2 bg-black border-1 hover:bg-primary/10 transition-all"
                            >
                                Ücretsiz Teklif Al
                            </motion.button>
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            className="md:hidden"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: show ? 1 : 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </motion.button>
                    </div>

                    {/* Mobile Menu */}
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="md:hidden"
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                {menuItems.map((item, index) => (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className="block px-3 py-2 hover:text-primary transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <motion.span
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.1 * index }}
                                            whileHover={{ x: 10 }}
                                        >
                                            {item.title}
                                        </motion.span>
                                    </Link>
                                ))}
                                <motion.button
                                    onClick={() => {
                                        setIsOpen(false)
                                        setIsModalOpen(true)
                                    }}
                                    className="block w-full px-3 py-2 mt-2 text-center rounded-full bg-black border-2 border-primary hover:bg-primary/10 transition-all"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Ücretsiz Teklif Al
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.nav>

            <ContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Ücretsiz Teklif Al"
            />
        </>
    )
}

export default Navbar 