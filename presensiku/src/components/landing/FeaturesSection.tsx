'use client'

import { motion } from 'framer-motion'
import { MapPin, Camera, MessageCircle, ShieldCheck } from 'lucide-react'

const features = [
  {
    icon: MapPin,
    title: "Presensi Tepat Lokasi",
    description: "Pastikan siswa benar-benar berada di area sekolah. Radius lokasi bisa dikonfigurasi sesuai kebutuhan.",
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    icon: Camera,
    title: "Bukti Kehadiran Visual",
    description: "Foto selfie saat presensi sebagai bukti otentik. Tidak bisa dititipkan!",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100"
  },
  {
    icon: MessageCircle,
    title: "Orang Tua Langsung Tahu",
    description: "Notifikasi otomatis ke WhatsApp orang tua setiap siswa melakukan presensi. Hadir, terlambat, izin, atau sakit.",
    color: "text-amber-500",
    bgColor: "bg-amber-100"
  },
  {
    icon: ShieldCheck,
    title: "Sistem Keamanan Berlapis",
    description: "Kombinasi GPS + selfie + validasi waktu membuat presensi tidak bisa dipalsukan.",
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  }
]

export default function FeaturesSection() {
  return (
    <section id="fitur" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4"
          >
            Fitur Unggulan PresensiKu
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-slate-600"
          >
            Teknologi modern untuk presensi yang akurat dan aman
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-8 shadow-lg shadow-blue-900/5 border border-slate-100 flex flex-col items-center text-center transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${feature.bgColor}`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
