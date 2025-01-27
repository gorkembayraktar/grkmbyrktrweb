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
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-sm bg-dark-darker rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,122,255,0.25)]"
                    >
                        {/* İkon ve Başlık */}
                        <div className={`p-6 flex flex-col items-center ${type === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 
                                ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                                {type === 'success' ? (
                                    <FaCheck className="w-8 h-8 text-white" />
                                ) : (
                                    <FaTimes className="w-8 h-8 text-white" />
                                )}
                            </div>
                            <h3 className="text-xl font-semibold text-white">{title}</h3>
                        </div>

                        {/* Mesaj ve Buton */}
                        <div className="p-6">
                            <p className="text-center text-gray-400 mb-6">{message}</p>
                            <button
                                onClick={onClose}
                                className={`w-full py-3 rounded-lg font-medium transition-colors
                                    ${type === 'success'
                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                        : 'bg-red-500 hover:bg-red-600 text-white'}`}
                            >
                                Tamam
                            </button>
                        </div>

                        {/* Kapatma Butonu */}
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <IoClose size={24} />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ResultModal; 