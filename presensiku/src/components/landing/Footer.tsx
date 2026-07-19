'use client'

import { MapPin, Phone, Mail } from 'lucide-react'

export default function Footer({ settings }: { settings: Record<string, any> }) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">

          <div className="space-y-4 lg:col-span-1">
            <h3 className="text-xl font-bold text-white tracking-tight">PresensiKu</h3>
            <p className="text-slate-400">
              Sistem Presensi Digital Siswa dengan verifikasi GPS dan selfie, mempermudah sekolah dan memberikan ketenangan bagi orang tua.
            </p>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <h4 className="text-lg font-semibold text-white">Hubungi Kami</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>{settings.school_address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400 shrink-0" />
                <span>{settings.school_phone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                <a href={`mailto:${settings.school_email}`} className="hover:text-white transition-colors">
                  {settings.school_email}
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} PresensiKu — {settings.school_name}
          </p>

          {/* Developer Credit */}
          <div className="text-xs text-slate-500 flex flex-col items-center space-y-1">
            <span>Developed with ❤️ by Aditya Arta Putra</span>
            <span>XI TJKT A 2026 • SMK Muhammadiyah Bandongan</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
