import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SiswaDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Halo, Siswa! 👋</h1>
      </div>

      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="pt-6">
          <div className="text-center">
            <h2 className="text-lg font-medium mb-1">Status Kehadiran Hari Ini</h2>
            <p className="text-3xl font-bold mb-4">Belum Absen</p>
            <Link href="/siswa/attendance">
              <Button variant="secondary" className="w-full font-bold">
                Presensi Sekarang
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">45</div>
            <p className="text-xs text-gray-500">Total Hadir</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-500">2</div>
            <p className="text-xs text-gray-500">Terlambat</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
