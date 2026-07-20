import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: { month?: string }
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: adminProfile } = await supabase.from('users').select('school_id').eq('auth_id', user?.id).single()
  const schoolId = adminProfile?.school_id

  // Default to current month
  const currentMonthStr = new Date().toISOString().slice(0, 7) // YYYY-MM
  const monthParam = searchParams.month || currentMonthStr

  const [year, month] = monthParam.split('-')
  const startDate = new Date(parseInt(year), parseInt(month) - 1, 1).toISOString().split('T')[0]
  const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0]

  // Fetch aggregated attendance data for the month
  const { data: attendances } = await supabase
    .from('attendance')
    .select(`
      status,
      student_id,
      users!student_id (full_name, nis, classes(name))
    `)
    .match(schoolId ? { school_id: schoolId } : {})
    .gte('date', startDate)
    .lte('date', endDate)

  // Aggregate data by student
  const reportData = new Map();
  if (attendances) {
      attendances.forEach((record: any) => {
          const studentId = record.student_id;
          if (!reportData.has(studentId)) {
              reportData.set(studentId, {
                  student: record.users,
                  hadir: 0,
                  terlambat: 0,
                  izin: 0,
                  sakit: 0,
                  alpha: 0
              });
          }
          const data = reportData.get(studentId);
          if (data[record.status] !== undefined) {
              data[record.status]++;
          }
      });
  }

  const reportArray = Array.from(reportData.values());

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Laporan Presensi</h1>
        <form className="flex items-center gap-2">
            <input
                type="month"
                name="month"
                defaultValue={monthParam}
                className="border rounded p-2 text-sm"
            />
            <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">Tampilkan</button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rekap Kehadiran - Bulan {monthParam}</CardTitle>
        </CardHeader>
        <CardContent>
          {reportArray.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3">Nama Siswa</th>
                    <th className="px-6 py-3">NIS</th>
                    <th className="px-6 py-3">Kelas</th>
                    <th className="px-6 py-3 text-center">Hadir</th>
                    <th className="px-6 py-3 text-center text-orange-600">Terlambat</th>
                    <th className="px-6 py-3 text-center text-blue-600">Izin</th>
                    <th className="px-6 py-3 text-center text-purple-600">Sakit</th>
                    <th className="px-6 py-3 text-center text-red-600">Alpha</th>
                  </tr>
                </thead>
                <tbody>
                  {reportArray.map((row: any, index: number) => (
                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{row.student?.full_name}</td>
                      <td className="px-6 py-4">{row.student?.nis || '-'}</td>
                      <td className="px-6 py-4">{row.student?.classes?.name || '-'}</td>
                      <td className="px-6 py-4 text-center font-bold">{row.hadir}</td>
                      <td className="px-6 py-4 text-center">{row.terlambat}</td>
                      <td className="px-6 py-4 text-center">{row.izin}</td>
                      <td className="px-6 py-4 text-center">{row.sakit}</td>
                      <td className="px-6 py-4 text-center">{row.alpha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <p className="text-gray-500 text-center py-8">Tidak ada data presensi untuk bulan ini.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
