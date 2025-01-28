'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowUp } from 'react-icons/fa'
import type { ScrollToTopSettings } from '../types'

export default function ScrollToTop({ settings }: { settings: ScrollToTopSettings | null }) {
    const [isVisible, setIsVisible] = useState(false);

    // Eğer ayarlar yoksa veya modül aktif değilse gösterme
    if (!settings || !settings.is_active) return null;

    // Mobil kontrolü
    if (!settings.show_mobile && window.innerWidth <= 768) return null;

    useEffect(() => {
        const toggleVisibility = () => {
            // Otomatik modda sayfanın %20'si kaydırıldığında göster
            if (settings.scroll_behavior === 'auto') {
                const scrolled = document.documentElement.scrollHeight * 0.2;
                setIsVisible(window.scrollY > scrolled);
            } else {
                // Manuel modda belirlenen piksel değerinde göster
                setIsVisible(window.scrollY > settings.show_after_scroll);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, [settings.scroll_behavior, settings.show_after_scroll]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Boyut değerlerini hesapla
    const sizeMap = {
        small: { button: 'w-10 h-10', icon: 16 },
        medium: { button: 'w-12 h-12', icon: 20 },
        large: { button: 'w-14 h-14', icon: 24 }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    onClick={scrollToTop}
                    className={`fixed z-50 rounded-full shadow-lg hover:scale-110 transition-transform ${sizeMap[settings.size].button}`}
                    style={{
                        backgroundColor: settings.bg_color,
                        color: settings.text_color,
                        [settings.position.split('-')[0]]: `${settings.margin_y}px`,
                        [settings.position.split('-')[1]]: `${settings.margin_x}px`
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <div className="flex items-center justify-center w-full h-full">
                        <FaArrowUp size={sizeMap[settings.size].icon} />
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
}