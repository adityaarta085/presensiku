import { register } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Daftar Akun Siswa</CardTitle>
          <CardDescription>
            Isi data di bawah ini untuk membuat akun PresensiKu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={register}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full_name">Nama Lengkap</Label>
                <Input id="full_name" name="full_name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nis">NIS / NISN</Label>
                <Input id="nis" name="nis" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parent_name">Nama Orang Tua/Wali</Label>
                <Input id="parent_name" name="parent_name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parent_phone">No. WhatsApp Orang Tua</Label>
                <Input id="parent_phone" name="parent_phone" placeholder="081234567890" required />
              </div>
              <Button type="submit" className="w-full mt-2">
                Daftar
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Sudah punya akun?{' '}
            <Link href="/login" className="underline">
              Login di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
