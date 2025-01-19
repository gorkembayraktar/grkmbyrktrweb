'use client'
import { motion } from 'framer-motion'
import { FaPhp, FaLaravel, FaCode, FaDatabase, FaServer, FaShieldAlt } from 'react-icons/fa'
import { SiCodeigniter } from 'react-icons/si'
import type { FC } from 'react'

const frameworks = [
    {
        icon: FaLaravel,
        title: "Laravel Çözümleri",
        description: "Modern Laravel framework ile güçlü ve ölçeklenebilir web uygulamaları geliştiriyoruz.",
        features: [
            { icon: FaCode, text: "RESTful API Geliştirme" },
            { icon: FaDatabase, text: "Veritabanı Optimizasyonu" },
            { icon: FaServer, text: "Sunucu Yönetimi" },
            { icon: FaShieldAlt, text: "Güvenlik Çözümleri" }
        ]
    },
    {
        icon: SiCodeigniter,
        title: "CodeIgniter Çözümleri",
        description: "Hafif ve hızlı CodeIgniter framework ile özel web uygulamaları geliştiriyoruz.",
        features: [
            { icon: FaCode, text: "Özel MVC Geliştirme" },
            { icon: FaDatabase, text: "Veritabanı Entegrasyonu" },
            { icon: FaServer, text: "Performans Optimizasyonu" },
            { icon: FaShieldAlt, text: "Güvenlik Önlemleri" }
        ]
    }
]

const PhpSolutions: FC = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="absolute -right-20 top-20 text-[400px] text-primary/10"
                >
                    <FaPhp />
                </motion.div>
            </div>

            <div className="container relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="space-y-16"
                >
                    {/* Section Header */}
                    <div className="text-center">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-primary mb-2"
                        >
                            PHP Framework Çözümleri
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            Laravel & CodeIgniter
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-gray-400 max-w-2xl mx-auto"
                        >
                            Modern PHP frameworkleri ile güvenli, ölçeklenebilir ve yüksek performanslı web uygulamaları geliştiriyoruz.
                        </motion.p>
                    </div>

                    {/* Frameworks Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {frameworks.map((framework, index) => (
                            <motion.div
                                key={framework.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-2xl bg-dark-darker border border-dark hover:border-primary transition-all group"
                            >
                                {/* Framework Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <framework.icon className="text-4xl text-primary" />
                                    <h3 className="text-2xl font-bold">{framework.title}</h3>
                                </div>

                                {/* Description */}
                                <p className="text-gray-400 mb-8">{framework.description}</p>

                                {/* Features Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    {framework.features.map((feature, featureIndex) => (
                                        <motion.div
                                            key={feature.text}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: 0.2 + (featureIndex * 0.1) }}
                                            viewport={{ once: true }}
                                            className="flex items-center gap-3"
                                        >
                                            <feature.icon className="text-primary" />
                                            <span className="text-sm text-gray-300">{feature.text}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default PhpSolutions 