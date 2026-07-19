'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, School } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FloatingShapes from './FloatingShapes'

export default function HeroSection({ settings, studentCount }: { settings: Record<string, any>, studentCount: number }) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-br from-blue-600 to-blue-900 text-white">
      <FloatingShapes />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex justify-center items-center"
          >
            <img
              src={settings.logo_url || '/placeholder.svg'}
              alt="Logo Sekolah"
              className="w-full h-full object-contain p-2"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight"
          >
            ✨ {settings.hero_title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl"
          >
            {settings.hero_subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center space-y-2 mb-10 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20"
          >
            <div className="flex items-center space-x-2 text-white font-medium">
              <School size={18} className="text-amber-400" />
              <span>{settings.school_name}</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-100 text-sm">
              <MapPin size={16} />
              <span>{settings.school_address}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full sm:w-auto"
          >
            <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-white text-blue-700 hover:bg-slate-100 font-semibold h-14 px-8 text-lg">
              <Link href="/login">Masuk Sekarang &rarr;</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full border-white text-white hover:bg-white/10 hover:text-white font-medium h-14 px-8">
              <Link href="#fitur">Pelajari Lebih Lanjut &darr;</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex items-center space-x-4 text-sm text-blue-200"
          >
            <div className="h-[1px] w-12 bg-blue-300/30"></div>
            <span>Dipercaya oleh {studentCount}+ siswa aktif</span>
            <div className="h-[1px] w-12 bg-blue-300/30"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
