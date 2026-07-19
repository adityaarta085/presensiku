import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

export default async function GuruDashboard() {
  const supabase = await createClient()

  // Ambil profil guru
  const { data: { user } } = await supabase.auth.getUser()
  const { data: guruProfile } = await supabase.from('users').select('id, school_id').eq('auth_id', user?.id).single()

  // Cek apakah guru adalah wali kelas
  const { data: classData } = await supabase
    .from('classes')
    .select('id')
    .eq('homeroom_teacher_id', guruProfile?.id)
    .single()

  const classId = classData?.id

  let totalSiswaWaliKelas = 0
  let hadirHariIni = 0
  let tidakHadirHariIni = 0

  if (classId) {
    // 1. Total Siswa Wali Kelas
    const { count: countTotal } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('class_id', classId)
      .eq('role', 'siswa')
      .eq('is_active', true)
      .eq('is_approved', true)

    totalSiswaWaliKelas = countTotal || 0

    // 2. Kehadiran Hari Ini
    const today = new Date().toISOString().split('T')[0]

    // Ambil ID semua siswa di kelas ini
    const { data: siswaKelas } = await supabase
      .from('users')
      .select('id')
      .eq('class_id', classId)
      .eq('role', 'siswa')

    const siswaIds = siswaKelas?.map(s => s.id) || []

    if (siswaIds.length > 0) {
      const { count: countHadir } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .in('student_id', siswaIds)
        .eq('date', today)
        .in('status', ['hadir', 'terlambat'])

      hadirHariIni = countHadir || 0

      const { count: countTidakHadir } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .in('student_id', siswaIds)
        .eq('date', today)
        .in('status', ['alpha', 'sakit', 'izin'])

      tidakHadirHariIni = countTidakHadir || 0
    }
  }

  // 3. Pengajuan izin (siswa wali kelas)
  let pendingLeaves: any[] = []
  if (classId) {
     const { data: siswaKelas } = await supabase
      .from('users')
      .select('id')
      .eq('class_id', classId)
      .eq('role', 'siswa')

     const siswaIds = siswaKelas?.map(s => s.id) || []

     if (siswaIds.length > 0) {
       const { data } = await supabase
        .from('leave_requests')
        .select(`
          id,
          type,
          reason,
          created_at,
          users (full_name)
        `)
        .in('student_id', siswaIds)
        .in('status', ['pending', 'parent_confirmed'])
        .order('created_at', { ascending: false })
        .limit(5)

       pendingLeaves = data || []
     }
  }


  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Guru</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Siswa Wali Kelas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSiswaWaliKelas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Hadir Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{hadirHariIni}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tidak Hadir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{tidakHadirHariIni}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pengajuan Izin/Sakit Siswa Wali Kelas</CardTitle>
        </CardHeader>
        <CardContent>
          {classId ? (
             pendingLeaves.length > 0 ? (
                <ul className="space-y-4">
                  {pendingLeaves.map((leave: any) => (
                    <li key={leave.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium text-sm">{leave.users?.full_name}</p>
                        <p className="text-xs text-gray-500 capitalize">{leave.type} - {leave.reason}</p>
                      </div>
                    </li>
                  ))}
                </ul>
             ) : (
                <p className="text-gray-500">Tidak ada pengajuan izin dari siswa wali kelas Anda saat ini.</p>
             )
          ) : (
            <p className="text-gray-500">Anda bukan wali kelas dari kelas mana pun.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
