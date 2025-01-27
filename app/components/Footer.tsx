'use client'
import { motion } from 'framer-motion'
import { FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import type { FC } from 'react'

const Footer: FC = () => {
    return (
        <footer className="py-8 border-t border-dark mt-20">
            <div className="container">
                <div className="flex flex-col items-center justify-center gap-6 text-gray-400 text-sm">
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                        <motion.a
                            href="mailto:bilgi@gorkembayraktar.com"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="hover:text-primary transition-colors flex items-center gap-2 group"
                        >
                            <FaEnvelope className="text-primary group-hover:text-primary" />
                            bilgi@gorkembayraktar.com
                        </motion.a>
                        <motion.a
                            href="tel:+905340000000"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="hover:text-primary transition-colors flex items-center gap-2 group"
                        >
                            <FaPhone className="text-primary group-hover:text-primary" />
                            +90 534 000 00 00
                        </motion.a>
                        <motion.a
                            href="https://maps.google.com/?q=Bursa,Türkiye"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="hover:text-primary transition-colors flex items-center gap-2 group"
                        >
                            <FaMapMarkerAlt className="text-primary group-hover:text-primary" />
                            Bursa, Türkiye
                        </motion.a>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        © {new Date().getFullYear()} Tüm hakları saklıdır.
                    </motion.p>
                </div>
            </div>


        </footer>
    )
}

export default Footer 