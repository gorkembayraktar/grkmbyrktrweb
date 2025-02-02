'use client'
import { motion } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import { FaPaperPlane } from 'react-icons/fa'
import { FC, useState } from 'react'
import ResultModal from './ResultModal'

interface FormInputs {
    name: string
    email: string
    phone: string
    message: string
}

const Contact: FC = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, control, reset } = useForm<FormInputs>({
        defaultValues: {
            phone: '+90'
        },
        mode: 'onSubmit'
    });

    const [resultModal, setResultModal] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        title: string;
        message: string;
    }>({
        isOpen: false,
        type: 'success',
        title: '',
        message: ''
    });

    const onSubmit = async (data: FormInputs) => {
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Bir hata oluştu');
            }

            reset();
            setResultModal({
                isOpen: true,
                type: 'success',
                title: 'Mesajınız İletildi!',
                message: 'En kısa sürede size dönüş yapacağız.'
            });
        } catch (error: any) {
            console.error('Submit error:', error);
            setResultModal({
                isOpen: true,
                type: 'error',
                title: 'Hata Oluştu!',
                message: error.message || 'Mesajınız gönderilirken bir hata oluştu'
            });
        }
    };

    return (
        <section id="contact" className="py-20">
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
                            İletişim
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold mb-4"
                        >
                            Bize Ulaşın
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-gray-400 max-w-2xl mx-auto"
                        >
                            Projeniz hakkında konuşmak veya bilgi almak için bize ulaşabilirsiniz.
                        </motion.p>
                    </div>

                    {/* Contact Content */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-dark-darker p-8 rounded-2xl border border-dark relative overflow-hidden"
                        >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                                    </pattern>
                                    <rect width="100" height="100" fill="url(#grid)" />
                                </svg>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
                                {/* Form Header */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold mb-2">İletişim Formu</h3>
                                    <p className="text-gray-400 text-sm">Tüm alanları doldurarak formu gönderebilirsiniz.</p>
                                </div>

                                {/* Input Groups */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-300">
                                            Ad Soyad <span className="text-primary">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark border border-dark-light focus:border-primary outline-none transition-all"
                                                placeholder="Adınız Soyadınız"
                                                {...register("name", {
                                                    required: "Ad Soyad alanı zorunludur",
                                                    minLength: {
                                                        value: 3,
                                                        message: "Ad Soyad en az 3 karakter olmalıdır"
                                                    }
                                                })}
                                            />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </span>
                                        </div>
                                        {errors.name && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-red-500 text-sm mt-1 flex items-center gap-1"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.name.message}
                                            </motion.p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-300">
                                            E-posta <span className="text-primary">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark border border-dark-light focus:border-primary outline-none transition-all"
                                                placeholder="ornek@email.com"
                                                {...register("email", {
                                                    required: "E-posta alanı zorunludur",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Geçerli bir e-posta adresi giriniz"
                                                    }
                                                })}
                                            />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </span>
                                        </div>
                                        {errors.email && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-red-500 text-sm mt-1 flex items-center gap-1"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.email.message}
                                            </motion.p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-300">
                                            Telefon <span className="text-primary">*</span>
                                        </label>
                                        <div className="relative">
                                            <Controller
                                                name="phone"
                                                control={control}
                                                rules={{
                                                    required: "Telefon alanı zorunludur",
                                                    pattern: {
                                                        value: /^\+\d{1,4} \(\d{3}\) \d{3} \d{2} \d{2}$/,
                                                        message: "Geçerli bir telefon numarası giriniz"
                                                    }
                                                }}
                                                render={({ field: { onChange, value } }) => (
                                                    <PatternFormat
                                                        format="+## (###) ### ## ##"
                                                        mask="_"
                                                        value={value}
                                                        onValueChange={(values) => {
                                                            onChange(values.formattedValue)
                                                        }}
                                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark border border-dark-light focus:border-primary outline-none transition-all"
                                                        placeholder="+90 (___) ___ __ __"
                                                    />
                                                )}
                                            />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </span>
                                        </div>
                                        {errors.phone && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-red-500 text-sm mt-1 flex items-center gap-1"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.phone.message}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Mesajınız <span className="text-primary">*</span>
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark border border-dark-light focus:border-primary outline-none transition-all min-h-[120px]"
                                            placeholder="Projeniz hakkında bilgi verin..."
                                            {...register("message", {
                                                required: "Mesaj alanı zorunludur",
                                                minLength: {
                                                    value: 10,
                                                    message: "Mesajınız en az 10 karakter olmalıdır"
                                                }
                                            })}
                                        />
                                        <span className="absolute left-3 top-3 text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </span>
                                    </div>
                                    {errors.message && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-500 text-sm mt-1 flex items-center gap-1"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.message.message}
                                        </motion.p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-4 rounded-xl bg-primary text-white font-medium transition-all flex items-center justify-center gap-2 relative overflow-hidden
                                        ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90 hover:scale-[1.02]'}`}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Gönderiliyor...
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane className="text-lg" />
                                                Gönder
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>
                        </motion.div>

                        {/* Animated SVG */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="hidden lg:block"
                        >
                            <svg
                                className="w-full max-w-lg mx-auto"
                                viewBox="0 0 500 500"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* Envelope Base */}
                                <motion.path
                                    d="M100 150h300v200H100z"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    className="text-primary"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                />
                                {/* Envelope Flap */}
                                <motion.path
                                    d="M100 150l150 100 150-100"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    className="text-primary"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                                />
                                {/* Decorative Lines */}
                                <motion.path
                                    d="M150 200h200M150 250h200M150 300h100"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    className="text-primary/30"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
                                />
                                {/* Circular Background */}
                                <motion.circle
                                    cx="250"
                                    cy="250"
                                    r="180"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="text-primary/10"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </svg>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Sonuç Modalı */}
            <ResultModal
                isOpen={resultModal.isOpen}
                onClose={() => setResultModal(prev => ({ ...prev, isOpen: false }))}
                type={resultModal.type}
                title={resultModal.title}
                message={resultModal.message}
            />
        </section>
    );
};

export default Contact; 