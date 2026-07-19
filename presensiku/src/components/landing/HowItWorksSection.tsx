'use client'

import { motion } from 'framer-motion'
import { Smartphone, MapPin, Camera, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: Smartphone,
    title: "Buka Aplikasi",
    description: "Login ke PresensiKu dari HP atau laptop"
  },
  {
    icon: MapPin,
    title: "Cek Lokasi",
    description: "Sistem otomatis mengecek kamu di area sekolah"
  },
  {
    icon: Camera,
    title: "Ambil Selfie",
    description: "Foto selfie sebagai bukti kehadiran"
  },
  {
    icon: CheckCircle,
    title: "Selesai!",
    description: "Presensi tercatat, orang tua dapat notifikasi WA"
  }
]

export default function HowItWorksSection() {
  return (
    <section id="cara-kerja" className="py-20 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4"
          >
            Cara Kerja PresensiKu
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-slate-600"
          >
            Hanya 4 langkah, selesai dalam 30 detik!
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 bg-slate-200 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex flex-col items-center text-center relative"
              >
                <div className="w-24 h-24 rounded-full bg-white shadow-xl shadow-blue-900/10 border-4 border-white flex items-center justify-center mb-6 relative z-10 text-blue-600">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold border-2 border-white">
                    {index + 1}
                  </div>
                  <step.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm max-w-[200px]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
