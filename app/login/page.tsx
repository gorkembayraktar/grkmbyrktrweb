'use client'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FC } from 'react'
import UnauthorizedModal from '../components/UnauthorizedModal'
import { createClient } from '../utils/supabase/client'

interface FormInputs {
    email: string
    password: string
}

const LoginPage: FC = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>()
    const redirectTo = searchParams.get('redirectedFrom') || '/dashboard'


    const handleGoogleLogin = async () => {

        const supabase = await createClient()
        try {
            setLoading(true)
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    //skipBrowserRedirect: true,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            })

            if (error) throw error

            if (data?.url) {
                window.location.href = data.url
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Giriş yapılırken bir hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        return;
        /*
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: register.email,
                password: register.password
            })

            if (error) throw error

            router.push(redirectTo)
            router.refresh()
        } catch (error) {
            console.error('Login error:', error)
            alert('Login failed')
        }
            */
    }

    return (
        <main className="min-h-screen flex items-center justify-center relative">
            {/* Background Elements */}
            <div className="gradient-bg" />
            <div className="animated-background" />
            <div className="gradient-overlay" />

            {/* Unauthorized Modal */}
            <UnauthorizedModal />

            <div className="container max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-dark-darker p-8 rounded-2xl border border-dark relative z-10"
                >
                    {/* Error Message */}
                    {/* Error message is handled by the useEffect */}

                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block mb-6">
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-2xl font-bold bg-accent-gradient text-transparent bg-clip-text"
                            >
                                Görkem Bayraktar
                            </motion.h1>
                        </Link>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-2xl font-bold mb-2"
                        >
                            Hoş Geldiniz
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-gray-400"
                        >
                            Hesabınıza giriş yapın
                        </motion.p>
                    </div>

                    {/* Login Form */}
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        onSubmit={handleLogin}
                        className="space-y-4"
                    >
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium mb-2">E-posta</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-dark border border-dark-light focus:border-primary outline-none transition-all"
                                    placeholder="ornek@email.com"
                                    disabled
                                    {...register("email", {
                                        required: "E-posta alanı zorunludur",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Geçerli bir e-posta adresi giriniz"
                                        }
                                    })}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Şifre</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full pl-12 pr-12 py-3 rounded-lg bg-dark border border-dark-light focus:border-primary outline-none transition-all"
                                    placeholder="••••••••"
                                    disabled
                                    {...register("password", {
                                        required: "Şifre alanı zorunludur",
                                        minLength: {
                                            value: 6,
                                            message: "Şifre en az 6 karakter olmalıdır"
                                        }
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <Link
                                href="#"
                                onClick={(e) => e.preventDefault()}
                                className="text-sm text-primary/50 cursor-not-allowed pointer-events-none"
                            >
                                Şifremi Unuttum
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 rounded-lg bg-primary/50 text-white/70 font-medium cursor-not-allowed"
                        >
                            Giriş Yap
                        </motion.button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-dark-light"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-dark-darker text-gray-400">veya</span>
                            </div>
                        </div>

                        {/* Google Sign In Button */}
                        <motion.button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 px-4 rounded-lg bg-dark border border-dark-light hover:border-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            {loading ? 'Giriş yapılıyor...' : 'Google ile Giriş Yap'}
                        </motion.button>
                    </motion.form>
                </motion.div>
            </div>
        </main>
    )
}

export default LoginPage 