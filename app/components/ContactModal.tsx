'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import { FaPaperPlane } from 'react-icons/fa'
import { useForm, Controller } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import { FC } from 'react'

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
    const { register, handleSubmit, formState: { errors }, control } = useForm<FormInputs>({
        defaultValues: {
            phone: '+90'
        }
    })

    const onSubmit = (data: FormInputs) => {
        console.log(data)
        // Form gönderme işlemleri burada yapılacak
    }

    return (
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
                                    e.stopPropagation()
                                    e.preventDefault()
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
                                        className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors hover:shadow-[0_0_15px_rgba(0,122,255,0.25)] flex items-center justify-center gap-2"
                                    >
                                        <FaPaperPlane className="text-lg" />
                                        Gönder
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default ContactModal 