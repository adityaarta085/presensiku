'use client'

import { motion } from 'framer-motion'
import { GraduationCap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function SPMBBanner({ settings }: { settings: Record<string, any> }) {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-full shrink-0">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Pendaftaran Siswa Baru Telah Dibuka!</h3>
              <p className="text-orange-50">Daftarkan diri Anda melalui SPMB Online resmi sekolah kami.</p>
            </div>
          </div>
          <Link
            href={settings.spmb_link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-full md:w-auto inline-flex items-center justify-center bg-white text-orange-600 font-bold px-6 py-3 rounded-full hover:bg-orange-50 transition-colors shadow-sm"
          >
            Kunjungi SPMB <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
