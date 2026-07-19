'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar({ settings }: { settings: Record<string, any> }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm flex items-center justify-center">
              <img
                src={settings.logo_url || '/placeholder.svg'}
                alt="Logo Sekolah"
                className="w-full h-full object-cover"
              />
            </div>
            <span className={`font-bold text-xl tracking-tight ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
              PresensiKu
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#fitur"
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                isScrolled ? 'text-slate-600' : 'text-white/90'
              }`}
            >
              Fitur
            </Link>
            <Link
              href="#cara-kerja"
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                isScrolled ? 'text-slate-600' : 'text-white/90'
              }`}
            >
              Cara Kerja
            </Link>
            <Button asChild className="rounded-full bg-blue-600 hover:bg-blue-700 text-white border-none">
              <Link href="/login">Masuk &rarr;</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden p-2 rounded-md ${isScrolled ? 'text-slate-900' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col space-y-4">
          <Link
            href="#fitur"
            className="text-slate-700 font-medium py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Fitur
          </Link>
          <Link
            href="#cara-kerja"
            className="text-slate-700 font-medium py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Cara Kerja
          </Link>
          <Button asChild className="rounded-full bg-blue-600 hover:bg-blue-700 w-full">
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Masuk &rarr;</Link>
          </Button>
        </div>
      )}
    </nav>
  )
}
