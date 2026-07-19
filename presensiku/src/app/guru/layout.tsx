import { ReactNode } from 'react'
import Link from 'next/link'
import { LogOut, LayoutDashboard, UserCheck, FileText } from 'lucide-react'

export default function GuruLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="text-lg font-bold text-blue-600">Portal Guru</span>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/guru" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/guru/attendance" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
            <UserCheck className="w-5 h-5" /> Presensi Kelas
          </Link>
          <Link href="/guru/reports" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
            <FileText className="w-5 h-5" /> Laporan
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-2 p-2 w-full text-red-600 hover:bg-red-50 rounded-md">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
