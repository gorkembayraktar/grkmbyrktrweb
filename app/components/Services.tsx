'use client'
import { motion } from 'framer-motion'
import { FaCode, FaPaintBrush, FaChartLine } from 'react-icons/fa'
import type { FC } from 'react'

const services = [
    {
        icon: FaCode,
        title: "Web Geliştirme",
        description: "Next.js ve React ile modern web uygulamaları geliştiriyorum."
    },
    {
        icon: FaPaintBrush,
        title: "UI/UX Tasarım",
        description: "Kullanıcı deneyimi odaklı modern arayüz tasarımları."
    },
    {
        icon: FaChartLine,
        title: "SEO Optimizasyonu",
        description: "Google PageSpeed testlerinde maksimum performans skorları."
    }
]

const Services: FC = () => {
    return (
        <section id="services" className="py-20">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-16"
                >
                    {/* Section Header */}
                    <div className="text-center">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-primary mb-2"
                        >
                            Hizmetler
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            Kapsamlı Dijital Çözümler
                        </motion.h2>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                                className="group p-8 rounded-2xl bg-dark-darker border border-dark hover:border-primary transition-all"
                            >
                                <div className="relative w-16 h-16 mb-6">
                                    <div className="absolute inset-0 bg-primary/20 rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform" />
                                    <div className="absolute inset-0 bg-dark-darker rounded-2xl border border-primary/30 flex items-center justify-center">
                                        <service.icon className="text-3xl text-primary" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-medium mb-4 group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-gray-400">
                                    {service.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Services 