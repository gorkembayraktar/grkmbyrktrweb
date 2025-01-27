'use client'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import type { WhatsAppSettings } from '../types'

export default function Whatsapp({ settings }: { settings: WhatsAppSettings }) {
    if (!settings || !settings.is_active) return null;

    // Mobil kontrolü
    if (!settings.show_mobile && window.innerWidth <= 768) return null;

    // WhatsApp URL'ini oluştur
    const whatsappUrl = `https://wa.me/${settings.phone.replace(/\D/g, '')}${settings.default_message ? `?text=${encodeURIComponent(settings.default_message)}` : ''
        }`;

    // Boyut değerlerini hesapla
    const sizeMap = {
        small: { button: 'w-12 h-12', icon: 24 },
        medium: { button: 'w-14 h-14', icon: 28 },
        large: { button: 'w-16 h-16', icon: 32 }
    };

    // Pozisyon sınıflarını hesapla
    const positionClasses = {
        'top-left': 'top-0 left-0',
        'top-right': 'top-0 right-0',
        'bottom-left': 'bottom-0 left-0',
        'bottom-right': 'bottom-0 right-0'
    };

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`fixed z-50 rounded-full shadow-lg hover:scale-110 transition-transform`}
            style={{
                backgroundColor: settings.bg_color,
                margin: `${settings.margin_y}px ${settings.margin_x}px`,
                [settings.position.split('-')[0]]: `${settings.margin_y}px`,
                [settings.position.split('-')[1]]: `${settings.margin_x}px`
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <div className={`flex items-center justify-center ${sizeMap[settings.size].button}`}>
                <FaWhatsapp
                    style={{ color: settings.text_color }}
                    size={sizeMap[settings.size].icon}
                />
            </div>
        </motion.a>
    );
}