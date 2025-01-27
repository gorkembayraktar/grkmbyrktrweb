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
            <div className="container max-w-2xl">
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

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-dark-darker p-8 rounded-2xl border border-dark"
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Ad Soyad</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg bg-dark border border-dark-light focus:border-primary outline-none transition-all focus:shadow-[0_0_15px_rgba(0,122,255,0.25)]"
                                    placeholder="Adınız Soyadınız"
                                    {...register("name", {
                                        required: "Ad Soyad alanı zorunludur",
                                        minLength: {
                                            value: 3,
                                            message: "Ad Soyad en az 3 karakter olmalıdır"
                                        }
                                    })}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">E-posta</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg bg-dark border border-dark-light focus:border-primary outline-none transition-all focus:shadow-[0_0_15px_rgba(0,122,255,0.25)]"
                                    placeholder="ornek@email.com"
                                    {...register("email", {
                                        required: "E-posta alanı zorunludur",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Geçerli bir e-posta adresi giriniz"
                                        }
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Telefon</label>
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
                                            className="w-full px-4 py-2 rounded-lg bg-dark border border-dark-light focus:border-primary outline-none transition-all focus:shadow-[0_0_15px_rgba(0,122,255,0.25)]"
                                            placeholder="+90 (___) ___ __ __"
                                        />
                                    )}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Mesajınız</label>
                                <textarea
                                    className="w-full px-4 py-2 rounded-lg bg-dark border border-dark-light focus:border-primary outline-none transition-all focus:shadow-[0_0_15px_rgba(0,122,255,0.25)] min-h-[120px]"
                                    placeholder="Projeniz hakkında bilgi verin..."
                                    {...register("message", {
                                        required: "Mesaj alanı zorunludur",
                                        minLength: {
                                            value: 10,
                                            message: "Mesajınız en az 10 karakter olmalıdır"
                                        }
                                    })}
                                />
                                {errors.message && (
                                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 rounded-lg bg-primary text-white font-medium transition-colors hover:shadow-[0_0_15px_rgba(0,122,255,0.25)] flex items-center justify-center gap-2
                                    ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Gönderiliyor...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane className="text-lg" />
                                        Gönder
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
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