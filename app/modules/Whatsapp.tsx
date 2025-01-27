'use client'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'

export default function Whatsapp() {
    {/* WhatsApp Button */ }
    return <motion.a
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
}