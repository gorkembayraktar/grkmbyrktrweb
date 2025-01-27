'use client';
import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface ResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'success' | 'error';
    title: string;
    message: string;
}

const ResultModal: FC<ResultModalProps> = ({ isOpen, onClose, type, title, message }) => {
    // Animasyon varyantları
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const modalVariants = {
        hidden: { scale: 0.95, opacity: 0, y: 20 },
        visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                duration: 0.5,
                bounce: 0.3
            }
        },
        exit: {
            scale: 0.95,
            opacity: 0,
            y: 20,
            transition: {
                duration: 0.2
            }
        }
    };

    const iconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                duration: 0.6,
                bounce: 0.4,
                delay: 0.2
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative w-full max-w-sm bg-dark-darker rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,122,255,0.25)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* İkon ve Başlık */}
                        <div className={`p-6 flex flex-col items-center 
                            ${type === 'success'
                                ? 'bg-gradient-to-b from-green-500/20 to-green-500/5'
                                : 'bg-gradient-to-b from-red-500/20 to-red-500/5'}`}
                        >
                            <motion.div
                                variants={iconVariants}
                                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg
                                    ${type === 'success'
                                        ? 'bg-gradient-to-br from-green-400 to-green-600'
                                        : 'bg-gradient-to-br from-red-400 to-red-600'}`}
                            >
                                {type === 'success' ? (
                                    <FaCheck className="w-8 h-8 text-white" />
                                ) : (
                                    <FaTimes className="w-8 h-8 text-white" />
                                )}
                            </motion.div>
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl font-semibold text-white"
                            >
                                {title}
                            </motion.h3>
                        </div>

                        {/* Mesaj ve Buton */}
                        <div className="p-6">
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-center text-gray-400 mb-6"
                            >
                                {message}
                            </motion.p>
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                onClick={onClose}
                                className={`w-full py-3 rounded-lg font-medium transition-all duration-200
                                    ${type === 'success'
                                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'}
                                    text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Tamam
                            </motion.button>
                        </div>

                        {/* Kapatma Butonu */}
                        <motion.button
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            transition={{ delay: 0.3 }}
                            onClick={onClose}
                            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <IoClose size={24} />
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ResultModal; 