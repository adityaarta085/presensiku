import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PendingApprovalPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm w-full text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Akun Sedang Diproses</CardTitle>
          <CardDescription>
            Pendaftaran Anda berhasil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            Akun Anda sedang menunggu persetujuan dari admin sekolah. Silakan hubungi pihak sekolah jika akun belum aktif setelah 1x24 jam.
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full">Kembali ke Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
