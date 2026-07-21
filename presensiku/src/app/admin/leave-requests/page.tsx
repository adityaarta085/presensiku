import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusButtons } from './StatusButtons'

export default async function LeaveRequestsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: adminProfile } = await supabase.from('users').select('school_id').eq('auth_id', user?.id).single()
  const schoolId = adminProfile?.school_id || null

  const { data: requests } = await supabase
    .from('leave_requests')
    .select(`
      *,
      users!student_id (full_name, nis)
    `)
    .filter('school_id', schoolId ? 'eq' : 'is', schoolId)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pengajuan Izin & Sakit</h1>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengajuan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Siswa</th>
                  <th className="px-6 py-3">Tipe</th>
                  <th className="px-6 py-3">Alasan</th>
                  <th className="px-6 py-3">Bukti</th>
                  <th className="px-6 py-3">Konfirmasi Ortu</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {requests && requests.map((req: any) => (
                  <tr key={req.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{new Date(req.date).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{req.users?.full_name}</div>
                      <div className="text-xs text-gray-500">{req.users?.nis}</div>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${req.type === 'sakit' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {req.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate" title={req.reason}>{req.reason}</td>
                    <td className="px-6 py-4">
                      {req.document_url ? (
                        <a href={req.document_url} target="_blank" className="text-blue-600 hover:underline">Lihat</a>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {req.parent_confirmation === true ? '✅ Disetujui' :
                       req.parent_confirmation === false ? '❌ Ditolak' : '⏳ Menunggu'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        req.status === 'approved' ? 'bg-green-100 text-green-700' :
                        req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {req.status === 'approved' ? 'Disetujui' : req.status === 'rejected' ? 'Ditolak' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {(req.status === 'pending' || req.status === 'waiting_parent' || req.status === 'parent_confirmed') ? (
                        <StatusButtons requestId={req.id} />
                      ) : (
                        <span className="text-gray-400 text-xs">Selesai</span>
                      )}
                    </td>
                  </tr>
                ))}
                {(!requests || requests.length === 0) && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      Belum ada pengajuan izin/sakit.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
