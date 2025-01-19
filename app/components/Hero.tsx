'use client'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { FaRocket, FaProjectDiagram, FaPhoneAlt } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import ContactModal from './ContactModal'
import type { FC } from 'react'

const CountingNumber: FC<{ value: number; suffix?: string }> = ({ value, suffix = "" }) => {
    const count = useMotionValue(0)
    const rounded = useTransform(count, (latest) => Math.round(latest))
    const [displayNumber, setDisplayNumber] = useState(0)

    useEffect(() => {
        const animation = animate(count, value, { duration: 2, delay: 0.7 })

        const unsubscribe = rounded.on("change", (latest) => {
            setDisplayNumber(latest)
        })

        return () => {
            animation.stop()
            unsubscribe()
        }
    }, [count, value, rounded])

    return (
        <motion.h3 className="text-2xl sm:text-4xl font-bold bg-accent-gradient text-transparent bg-clip-text mb-1 sm:mb-2">
            {displayNumber}{suffix}
        </motion.h3>
    )
}

const Hero: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState('')

    const openModal = (title: string) => {
        setModalTitle(title)
        setIsModalOpen(true)
    }

    const stats = [
        { number: 50, suffix: "+", text: "Tamamlanan Proje" },
        { number: 100, suffix: "%", text: "Müşteri Memnuniyeti" },
        { number: 30, suffix: "+", text: "Kurulan Database" }
    ]

    return (
        <>
            <div className="gradient-bg" />
            <div className="animated-background" />
            <div className="gradient-overlay" />

            <section id="home" className="min-h-screen flex items-center justify-center pt-16 relative">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.h1
                            className="text-4xl md:text-6xl font-bold mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Modern{" "}
                            <span className="bg-accent-gradient text-transparent bg-clip-text">
                                Web Çözümleri
                            </span>
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-xl text-gray-400 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Hazır şablonlar yerine, her müşterimize özel sıfırdan geliştirilen web çözümleri sunuyoruz.
                            Next.js ve modern teknolojilerle geliştirdiğimiz projelerimiz,
                            Google PageSpeed testlerinde maksimum performans skorları elde ediyor.
                        </motion.p>
                        <div className="flex flex-col items-center gap-8">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-[300px] sm:max-w-none">
                                <motion.button
                                    onClick={() => openModal('Projenizi Başlatalım')}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={{
                                        y: [0, -10, 0],
                                        boxShadow: [
                                            "0 0 0 rgba(0, 122, 255, 0)",
                                            "0 0 20px rgba(0, 122, 255, 0.5)",
                                            "0 0 0 rgba(0, 122, 255, 0)"
                                        ]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="w-full sm:w-auto h-[50px] px-6 rounded-full flex items-center justify-start sm:justify-center gap-2 bg-dark-darker border border-dark hover:border-primary transition-all"
                                >
                                    <FaRocket className="text-lg text-primary" />
                                    <span className="flex-1 sm:flex-initial text-left sm:text-center">Projenizi Başlatalım</span>
                                </motion.button>

                                <motion.a
                                    href="#projects"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto h-[50px] px-6 rounded-full flex items-center justify-start sm:justify-center gap-2 bg-dark-darker border border-dark hover:border-primary transition-all"
                                >
                                    <FaProjectDiagram className="text-lg text-primary" />
                                    <span className="flex-1 sm:flex-initial text-left sm:text-center">Projelerimiz</span>
                                </motion.a>

                                <motion.a
                                    href="tel:+905340000000"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto h-[50px] px-6 rounded-full flex items-center justify-start sm:justify-center gap-2 bg-dark-darker border border-dark hover:border-primary transition-all"
                                >
                                    <FaPhoneAlt className="text-lg text-primary" />
                                    <span className="flex-1 sm:flex-initial text-left sm:text-center">+90 534 000 00 00</span>
                                </motion.a>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="grid grid-cols-3 gap-3 sm:gap-8 mt-8 w-full"
                            >
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={stat.text}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 + index * 0.1 }}
                                        className="text-center p-2 sm:p-6 rounded-xl backdrop-blur-sm bg-dark-darker/40 border border-dark hover:border-primary transition-all"
                                        whileHover={{ y: -5 }}
                                    >
                                        <CountingNumber value={stat.number} suffix={stat.suffix} />
                                        <p className="text-gray-400 text-xs sm:text-base">{stat.text}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <ContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
            />
        </>
    )
}

export default Hero 