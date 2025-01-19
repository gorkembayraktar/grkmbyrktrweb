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

            {/* WhatsApp Button */}
            <motion.a
                href="https://wa.me/905340000000"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed left-6 bottom-6 z-50 bg-[#25D366] p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <FaWhatsapp className="text-white text-2xl" />
            </motion.a>
        </footer>
    )
}

export default Footer 