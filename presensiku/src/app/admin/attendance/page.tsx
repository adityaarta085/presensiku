import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminAttendancePage({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const supabase = await createClient()

  // Get admin school_id
  const { data: { user } } = await supabase.auth.getUser()
  const { data: adminProfile } = await supabase.from('users').select('school_id').eq('auth_id', user?.id).single()
  const schoolId = adminProfile?.school_id

  // Default to today if no date in searchParams
  const dateParam = searchParams.date || new Date().toISOString().split('T')[0]

  // Fetch attendance for the specific date
  const { data: attendances } = await supabase
    .from('attendance')
    .select(`
      *,
      users!student_id (
        full_name,
        nis,
        classes (name)
      )
    `)
    .match(schoolId ? { school_id: schoolId } : {})
    .eq('date', dateParam)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Presensi Harian</h1>
        <form>
            <input
                type="date"
                name="date"
                defaultValue={dateParam}
                className="border rounded p-2 text-sm"
            />
            {/* Note: In a real app, you'd use a client component for better onChange handling without a submit button, or a submit button here. Next.js handles form GET requests by updating URL searchParams */}
            <button type="submit" className="ml-2 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">Filter</button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Kehadiran - {new Date(dateParam).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
        </CardHeader>
        <CardContent>
          {attendances && attendances.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3">Nama Siswa</th>
                    <th className="px-6 py-3">NIS</th>
                    <th className="px-6 py-3">Kelas</th>
                    <th className="px-6 py-3">Waktu Masuk</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.map((att: any) => (
                    <tr key={att.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{att.users?.full_name}</td>
                      <td className="px-6 py-4">{att.users?.nis || '-'}</td>
                      <td className="px-6 py-4">{att.users?.classes?.name || '-'}</td>
                      <td className="px-6 py-4">{att.check_in_time ? new Date(att.check_in_time).toLocaleTimeString('id-ID') : '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${att.status === 'hadir' ? 'bg-green-100 text-green-800' :
                            att.status === 'terlambat' ? 'bg-orange-100 text-orange-800' :
                            att.status === 'alpha' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'}`}>
                          {att.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">{att.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <p className="text-gray-500 text-center py-8">Belum ada data presensi pada tanggal ini.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
