'use client'
import { motion } from 'framer-motion'
import { FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import type { FC } from 'react'
import type { GeneralSettings } from '../types'
import { formatPhoneNumber } from '@/app/utils/formatters'

const Footer: FC<{ settings: GeneralSettings }> = ({ settings }) => {
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
                            {settings.contact_email}
                        </motion.a>
                        {settings.contact_phone && (
                            <motion.a
                                href={`tel:${settings.contact_phone}`}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="hover:text-primary transition-colors flex items-center gap-2 group"
                            >
                                <FaPhone className="text-primary group-hover:text-primary" />
                                {formatPhoneNumber(settings.contact_phone)}
                            </motion.a>
                        )}
                        <motion.a
                            href={`https://maps.google.com/?q=${encodeURIComponent(settings.contact_address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="hover:text-primary transition-colors flex items-center gap-2 group"
                        >
                            <FaMapMarkerAlt className="text-primary group-hover:text-primary" />
                            {settings.contact_address}
                        </motion.a>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        {settings.footer_copyright}
                    </motion.p>
                </div>
            </div>


        </footer>
    )
}

export default Footer 