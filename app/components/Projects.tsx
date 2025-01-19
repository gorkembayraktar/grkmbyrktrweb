'use client'
import { motion } from 'framer-motion'
import type { FC } from 'react'

const projects = [
    {
        title: "Speed Test App",
        description: "İnternet bağlantı hızınızı test edebileceğiniz modern bir web uygulaması. Next.js ile geliştirilmiş, hızlı ve kullanıcı dostu arayüz.",
        image: "/images/speedtest.png",
        link: "https://speedtestapp.vercel.app/"
    }
]

const ProjectSkeleton = () => (
    <div className="relative group">
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-dark-darker">
            {/* Skeleton image */}
            <div className="w-full h-full bg-gradient-to-r from-dark-darker via-dark-light to-dark-darker animate-shimmer"
                style={{ backgroundSize: '200% 100%' }}
            />
        </div>

        {/* Skeleton content */}
        <div className="mt-4 space-y-3">
            {/* Title skeleton */}
            <div className="h-6 w-3/4 bg-gradient-to-r from-dark-darker via-dark-light to-dark-darker animate-shimmer rounded"
                style={{ backgroundSize: '200% 100%' }}
            />

            {/* Description skeleton */}
            <div className="space-y-2">
                <div className="h-4 w-full bg-gradient-to-r from-dark-darker via-dark-light to-dark-darker animate-shimmer rounded"
                    style={{ backgroundSize: '200% 100%' }}
                />
                <div className="h-4 w-5/6 bg-gradient-to-r from-dark-darker via-dark-light to-dark-darker animate-shimmer rounded"
                    style={{ backgroundSize: '200% 100%' }}
                />
            </div>

            {/* Tags skeleton */}
            <div className="flex gap-2 pt-2">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-6 w-16 bg-gradient-to-r from-dark-darker via-dark-light to-dark-darker animate-shimmer rounded-full"
                        style={{ backgroundSize: '200% 100%' }}
                    />
                ))}
            </div>
        </div>
    </div>
)

const Projects: FC = () => {
    return (
        <section id="projects" className="py-20">
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
                            Son Çalışmalarımız
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            Projelerimiz
                        </motion.h2>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {projects.map((project, index) => (
                            <motion.a
                                key={project.title}
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative overflow-hidden rounded-2xl bg-dark-darker border border-dark hover:border-primary transition-colors"
                            >
                                <div className="aspect-video relative">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="object-cover w-full h-full rounded-t-2xl"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium mb-2">{project.title}</h3>
                                    <p className="text-gray-400 text-sm">{project.description}</p>
                                </div>
                            </motion.a>
                        ))}

                        {/* Project Skeletons with Overlay */}
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <ProjectSkeleton />
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center bg-dark-darker/30 backdrop-blur-[1px] rounded-xl"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.p
                                        animate={{ opacity: [0.7, 1, 0.7] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="text-white font-semibold text-base drop-shadow-glow"
                                    >
                                        Yakında...
                                    </motion.p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Projects 