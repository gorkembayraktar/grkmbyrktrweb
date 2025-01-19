'use client'
import { motion } from 'framer-motion'
import { FaCode, FaLaptopCode, FaServer, FaDatabase } from 'react-icons/fa'
import { PiGraduationCapBold } from 'react-icons/pi'
import type { FC } from 'react'

const skills = [
    {
        icon: FaCode,
        title: "Frontend Geliştirme",
        description: "React, Next.js, TypeScript ve modern web teknolojileri ile kullanıcı deneyimi odaklı arayüzler geliştiriyorum."
    },
    {
        icon: FaServer,
        title: "Backend Geliştirme",
        description: "Node.js, PHP ve veritabanı sistemleri ile güvenli ve ölçeklenebilir backend çözümleri sunuyorum."
    },
    {
        icon: FaDatabase,
        title: "Veritabanı Yönetimi",
        description: "MySQL, PostgreSQL, MongoDB gibi veritabanı sistemlerinde tasarım, optimizasyon ve yönetim konularında uzmanım."
    },
    {
        icon: FaLaptopCode,
        title: "Modern Teknolojiler",
        description: "Docker, Git, AWS gibi modern geliştirme araçları ile profesyonel çözümler üretiyorum."
    }
]

const About: FC = () => {
    return (
        <section id="about" className="py-20">
            <div className="container">
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
                            Hakkımda
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            Deneyim & Uzmanlık
                        </motion.h2>
                    </div>

                    {/* About Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <p className="text-lg text-gray-400">
                                Merhaba! Ben Görkem Bayraktar, 5+ yıllık deneyime sahip bir Full Stack Web Geliştiricisiyim.
                                Modern web teknolojileri ve en iyi geliştirme pratikleri konusunda uzmanım.
                            </p>
                            <p className="text-gray-400">
                                Her projeye özgün bir yaklaşım getirerek, müşterilerimin ihtiyaçlarını en iyi şekilde karşılayan
                                çözümler üretiyorum. Sürekli öğrenme ve gelişim odaklı çalışma prensibim ile her projede
                                en güncel teknolojileri kullanmaya özen gösteriyorum.
                            </p>
                            <div className="pt-4">
                                <motion.a
                                    href="#contact"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-block px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                                >
                                    İletişime Geç
                                </motion.a>
                            </div>
                        </motion.div>

                        {/* Skills Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {skills.map((skill, index) => (
                                <motion.div
                                    key={skill.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="p-6 rounded-2xl bg-dark-darker border border-dark hover:border-primary transition-colors group relative overflow-hidden"
                                >
                                    <skill.icon className="text-3xl text-primary mb-4" />
                                    <h3 className="text-lg font-medium mb-2">{skill.title}</h3>
                                    <p className="text-gray-400 text-sm">{skill.description}</p>

                                    {/* Özümseniyor Overlay - Only for Modern Technologies */}
                                    {skill.title === "Modern Teknolojiler" && (
                                        <motion.div
                                            className="absolute inset-0 backdrop-blur-[1px] flex flex-col items-center justify-center"
                                            initial={{ opacity: 0 }}
                                            animate={{
                                                opacity: 1,
                                                backgroundColor: ['rgba(17, 17, 17, 0.1)', 'rgba(17, 17, 17, 0.4)', 'rgba(17, 17, 17, 0.1)']
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    rotate: [0, 10, -10, 0]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                                className="text-white text-3xl mb-2 drop-shadow-glow"
                                            >
                                                <PiGraduationCapBold />
                                            </motion.div>
                                            <motion.p
                                                animate={{ opacity: [0.7, 1, 0.7] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                className="text-white font-semibold text-base drop-shadow-glow"
                                            >
                                                Özümseniyor...
                                            </motion.p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default About 