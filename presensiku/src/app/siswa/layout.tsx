import { ReactNode } from 'react'
import Link from 'next/link'
import { Home, UserCheck, FileText, User } from 'lucide-react'

export default function SiswaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md z-10 flex justify-between items-center">
        <span className="font-bold text-lg">PresensiKu</span>
        <form action="/auth/signout" method="post">
          <button className="text-sm font-medium hover:text-blue-200">Logout</button>
        </form>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-20">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="bg-white border-t fixed bottom-0 w-full flex justify-around p-2 z-10 safe-area-pb">
        <Link href="/siswa" className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600">
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Beranda</span>
        </Link>
        <Link href="/siswa/attendance" className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600">
          <UserCheck className="w-6 h-6" />
          <span className="text-xs mt-1">Absen</span>
        </Link>
        <Link href="/siswa/leave" className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600">
          <FileText className="w-6 h-6" />
          <span className="text-xs mt-1">Izin</span>
        </Link>
        <Link href="/siswa/profile" className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600">
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Profil</span>
        </Link>
      </nav>
    </div>
  )
}
