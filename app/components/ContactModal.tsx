'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import { FaPaperPlane } from 'react-icons/fa'
import { useForm, Controller } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import { FC, useState } from 'react'
import ResultModal from './ResultModal'

interface ContactModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
}

interface FormInputs {
    name: string
    email: string
    phone: string
    message: string
}

const ContactModal: FC<ContactModalProps> = ({ isOpen, onClose, title }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, control, reset } = useForm<FormInputs>({
        defaultValues: {
            phone: '+90'
        },
        mode: 'onSubmit'
    })

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

    console.log('Form errors:', errors);

    const onSubmit = async (data: FormInputs) => {
        console.log('Form data:', data);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            console.log('Response:', response);

            if (!response.ok) {
                const result = await response.json();
                console.log('Error result:', result);
                throw new Error(result.error || 'Bir hata oluştu');
            }

            reset();
            onClose();
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
    }

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
                        >
                            {/* Modal */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full max-w-lg mx-4"
                            >
                                <div
                                    className="relative bg-dark-darker rounded-2xl p-8 shadow-[0_0_30px_rgba(0,122,255,0.25)]"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    {/* Close Button */}
                                    <button
                                        onClick={onClose}
                                        className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <IoClose size={24} />
                                    </button>

                                    {/* Title */}
                                    <h2 className="text-2xl font-bold mb-6">{title}</h2>

                                    {/* Form */}
                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="space-y-4"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
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
                                                className="w-full px-4 py-2 rounded-lg bg-dark border border-dark-light focus:border-primary outline-none transition-all focus:shadow-[0_0_15px_rgba(0,122,255,0.25)]"
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
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Sonuç Modalı */}
            <ResultModal
                isOpen={resultModal.isOpen}
                onClose={() => setResultModal(prev => ({ ...prev, isOpen: false }))}
                type={resultModal.type}
                title={resultModal.title}
                message={resultModal.message}
            />
        </>
    )
}

export default ContactModal 