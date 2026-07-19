import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function SiswaDashboard() {
  const supabase = await createClient()

  // Ambil profil siswa
  const { data: { user } } = await supabase.auth.getUser()
  const { data: siswaProfile } = await supabase.from('users').select('id, full_name, school_id').eq('auth_id', user?.id).single()

  const studentId = siswaProfile?.id
  const today = new Date().toISOString().split('T')[0]

  // 1. Status Kehadiran Hari Ini
  const { data: attendanceToday } = await supabase
    .from('attendance')
    .select('status, check_in_time')
    .eq('student_id', studentId)
    .eq('date', today)
    .single()

  // 2. Statistik Kehadiran
  const { count: countHadir } = await supabase
    .from('attendance')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', studentId)
    .eq('status', 'hadir')

  const { count: countTerlambat } = await supabase
    .from('attendance')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', studentId)
    .eq('status', 'terlambat')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Halo, {siswaProfile?.full_name?.split(' ')[0] || 'Siswa'}! 👋</h1>
      </div>

      <Card className={`text-white ${attendanceToday ? (attendanceToday.status === 'hadir' || attendanceToday.status === 'terlambat' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600') : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}>
        <CardContent className="pt-6">
          <div className="text-center">
            <h2 className="text-lg font-medium mb-1">Status Kehadiran Hari Ini</h2>

            {attendanceToday ? (
              <>
                <p className="text-3xl font-bold mb-2 capitalize">{attendanceToday.status}</p>
                {attendanceToday.check_in_time && (
                  <p className="text-sm mb-4">
                    Jam: {new Date(attendanceToday.check_in_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                  </p>
                )}
                <Link href="/siswa/attendance">
                  <Button variant="secondary" className="w-full font-bold">
                    Lihat Riwayat
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <p className="text-3xl font-bold mb-4">Belum Absen</p>
                <Link href="/siswa/attendance">
                  <Button variant="secondary" className="w-full font-bold">
                    Presensi Sekarang
                  </Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">{countHadir || 0}</div>
            <p className="text-xs text-gray-500">Total Hadir</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-500">{countTerlambat || 0}</div>
            <p className="text-xs text-gray-500">Terlambat</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
