'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export default function LoginForm({ settings }: { settings: Record<string, any> }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error('Email atau password salah')
      setLoading(false)
      return
    }

    // Cek apakah akun sudah approved
    const { data: profile } = await supabase
      .from('users')
      .select('status, role')
      .eq('auth_id', data.user.id)
      .single()

    if (profile && profile.status !== 'approved') {
      await supabase.auth.signOut()
      toast.warning('Akun Anda belum disetujui oleh Admin')
      setLoading(false)
      return
    }

    toast.success('Login berhasil!')
    router.push('/dashboard')
    router.refresh()
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Kiri: Background Image (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-blue-900">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 z-0"
        >
          {settings?.login_bg_url ? (
            <Image
              src={settings.login_bg_url}
              alt="School Background"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          )}
        </motion.div>

        <div className="absolute inset-0 bg-blue-950/60 z-10" />

        <div className="relative z-20 flex flex-col justify-center items-start p-16 text-white h-full max-w-xl">
          <div className="bg-white p-2 rounded-full mb-8 shadow-2xl">
            <Image
              src={settings?.logo_url || '/placeholder.svg'}
              alt="Logo Sekolah"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">{settings?.school_name}</h1>
          <p className="text-blue-100 mb-8">{settings?.school_address}</p>
          <div className="mt-auto">
            <p className="text-blue-200/60 italic text-lg border-l-4 border-blue-400 pl-4">
              "Membangun generasi disiplin melalui teknologi"quot;Membangun generasi disiplin melalui teknologi"Membangun generasi disiplin melalui teknologi"quot;
            </p>
          </div>
        </div>
      </div>

      {/* Kanan: Form Login */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Header Mobile */}
          <div className="lg:hidden flex flex-col items-center mb-10 text-center">
            <div className="bg-white p-2 rounded-full mb-4 shadow-md border border-slate-100">
              <Image
                src={settings?.logo_url || '/placeholder.svg'}
                alt="Logo Sekolah"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-slate-900">{settings?.school_name}</h1>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Selamat Datang 👋</h2>
            <p className="text-slate-500">Masuk ke akun PresensiKu</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="email">
                Email atau Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="pl-10 h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700" htmlFor="password">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium">
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1 pb-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
              >
                Ingat saya
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-md font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Masuk →'
              )}
            </Button>
          </form>

          <div className="my-8 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-slate-200 after:mt-0.5 after:flex-1 after:border-t after:border-slate-200">
            <p className="mx-4 mb-0 text-center text-sm font-medium text-slate-500">atau</p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 bg-white text-slate-700 border-slate-300 hover:bg-slate-50 font-medium rounded-lg flex items-center justify-center gap-2 mb-6"
            onClick={handleGoogleLogin}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
              <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
              <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
              <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
            </svg>
            Masuk dengan Google
          </Button>

          <p className="text-center text-sm text-slate-600 mb-12">
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">
              Daftar
            </Link>
          </p>

          {/* Developer Credit */}
          <div className="text-center mt-auto border-t border-slate-100 pt-6">
            <div className="text-xs text-slate-400 flex flex-col items-center space-y-1">
              <span>Developed with ❤️ by Aditya Arta Putra</span>
              <span>XI TJKT A 2026 • SMK Muhammadiyah Bandongan</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
