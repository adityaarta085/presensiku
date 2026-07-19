import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Ambil school_id admin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: adminProfile } = await supabase.from('users').select('school_id').eq('auth_id', user?.id).single()
  const schoolId = adminProfile?.school_id

  // 1. Total Siswa
  const { count: totalSiswa } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .eq('role', 'siswa')
    .eq('is_active', true)
    .eq('is_approved', true)

  // 2. Presensi Hari Ini
  const today = new Date().toISOString().split('T')[0]

  const { count: hadirHariIni } = await supabase
    .from('attendance')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .eq('date', today)
    .eq('status', 'hadir')

  const { count: terlambatHariIni } = await supabase
    .from('attendance')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .eq('date', today)
    .eq('status', 'terlambat')

  const { count: alphaHariIni } = await supabase
    .from('attendance')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .eq('date', today)
    .eq('status', 'alpha')

  // 3. Menunggu Persetujuan Akun
  const { data: pendingAccounts } = await supabase
    .from('users')
    .select('id, full_name, created_at')
    .eq('school_id', schoolId)
    .eq('role', 'siswa')
    .eq('is_approved', false)
    .order('created_at', { ascending: false })
    .limit(5)

  // 4. Pengajuan Izin/Sakit Pending
  const { data: pendingLeaves } = await supabase
    .from('leave_requests')
    .select(`
      id,
      type,
      reason,
      created_at,
      users (full_name)
    `)
    .eq('school_id', schoolId)
    .in('status', ['pending', 'parent_confirmed'])
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSiswa || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Hadir Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{hadirHariIni || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Terlambat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{terlambatHariIni || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Alpha</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{alphaHariIni || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Menunggu Persetujuan Akun</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/approvals">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingAccounts && pendingAccounts.length > 0 ? (
              <ul className="space-y-4">
                {pendingAccounts.map((account) => (
                  <li key={account.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{account.full_name}</p>
                      <p className="text-xs text-gray-500">{new Date(account.created_at).toLocaleDateString('id-ID')}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Belum ada akun baru yang perlu disetujui.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pengajuan Izin/Sakit Terbaru</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/leave-requests">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingLeaves && pendingLeaves.length > 0 ? (
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
              <p className="text-gray-500">Tidak ada pengajuan baru.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
