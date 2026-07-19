'use client'

import { motion } from 'framer-motion'
import { Users, GraduationCap, Building } from 'lucide-react'

export default function StatsSection({ studentCount }: { studentCount: number }) {
  const stats = [
    {
      title: "Siswa Terdaftar",
      value: `${studentCount}+`,
      icon: Users
    },
    {
      title: "Guru Terdaftar",
      value: "20+",
      icon: GraduationCap
    },
    {
      title: "Kelas Aktif",
      value: "12+",
      icon: Building
    }
  ]

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-8 text-center"
            >
              <stat.icon className="w-10 h-10 text-blue-200 mb-4" />
              <div className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                {stat.value}
              </div>
              <div className="text-blue-100 font-medium">
                {stat.title}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
