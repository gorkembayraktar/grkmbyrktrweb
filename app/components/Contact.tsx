'use client'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import { FaPaperPlane } from 'react-icons/fa'
import type { FC } from 'react'

interface FormInputs {
    name: string
    email: string
    phone: string
    message: string
}

const Contact: FC = () => {
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
                                <PatternFormat
                                    format="+90 (###) ### ## ##"
                                    mask="_"
                                    className="w-full px-4 py-2 rounded-lg bg-dark border border-dark-light focus:border-primary outline-none transition-all focus:shadow-[0_0_15px_rgba(0,122,255,0.25)]"
                                    placeholder="+90 (___) ___ __ __"
                                />
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
                                className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors hover:shadow-[0_0_15px_rgba(0,122,255,0.25)] flex items-center justify-center gap-2"
                            >
                                <FaPaperPlane className="text-lg" />
                                Gönder
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default Contact 