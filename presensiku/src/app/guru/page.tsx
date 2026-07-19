import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function GuruDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Guru</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Siswa Wali Kelas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Hadir Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">30</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tidak Hadir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">2</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pengajuan Izin/Sakit Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Tidak ada pengajuan izin dari siswa wali kelas Anda saat ini.</p>
        </CardContent>
      </Card>
    </div>
  )
}
