import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { revalidatePath } from 'next/cache'

export default async function StudentsTeachersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: adminProfile } = await supabase.from('users').select('school_id').eq('auth_id', user?.id).single()
  const schoolId = adminProfile?.school_id

  // Fetch Siswa
  const { data: siswaList } = await supabase
    .from('users')
    .select('*, classes(name)')
    .eq('school_id', schoolId)
    .eq('role', 'siswa')
    .order('full_name', { ascending: true })

  // Fetch Guru
  const { data: guruList } = await supabase
    .from('users')
    .select('*')
    .eq('school_id', schoolId)
    .eq('role', 'guru')
    .order('full_name', { ascending: true })


  async function toggleActiveStatus(formData: FormData) {
    'use server'
    const id = formData.get('id')
    const currentStatus = formData.get('currentStatus') === 'true'
    const supabase = await createClient()

    await supabase.from('users').update({ is_active: !currentStatus }).eq('id', id)

    revalidatePath('/admin/students')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
      </div>

      <Tabs defaultValue="siswa" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="siswa">Data Siswa</TabsTrigger>
          <TabsTrigger value="guru">Data Guru</TabsTrigger>
        </TabsList>

        <TabsContent value="siswa">
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Siswa</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3">Nama</th>
                                    <th className="px-6 py-3">NIS</th>
                                    <th className="px-6 py-3">Kelas</th>
                                    <th className="px-6 py-3">Status Akun</th>
                                    <th className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {siswaList && siswaList.map((siswa: any) => (
                                    <tr key={siswa.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{siswa.full_name}</td>
                                        <td className="px-6 py-4">{siswa.nis || '-'}</td>
                                        <td className="px-6 py-4">{siswa.classes?.name || '-'}</td>
                                        <td className="px-6 py-4">
                                            {siswa.is_active ?
                                                <span className="text-green-600 font-semibold">Aktif</span> :
                                                <span className="text-red-600 font-semibold">Nonaktif</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <form action={toggleActiveStatus}>
                                                <input type="hidden" name="id" value={siswa.id} />
                                                <input type="hidden" name="currentStatus" value={siswa.is_active.toString()} />
                                                <Button type="submit" size="sm" variant={siswa.is_active ? "destructive" : "default"}>
                                                    {siswa.is_active ? "Nonaktifkan" : "Aktifkan"}
                                                </Button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="guru">
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Guru</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3">Nama</th>
                                    <th className="px-6 py-3">NIP/Kontak</th>
                                    <th className="px-6 py-3">Status Akun</th>
                                    <th className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guruList && guruList.map((guru: any) => (
                                    <tr key={guru.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{guru.full_name}</td>
                                        <td className="px-6 py-4">{guru.nip || guru.phone || guru.email || '-'}</td>
                                        <td className="px-6 py-4">
                                            {guru.is_active ?
                                                <span className="text-green-600 font-semibold">Aktif</span> :
                                                <span className="text-red-600 font-semibold">Nonaktif</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <form action={toggleActiveStatus}>
                                                <input type="hidden" name="id" value={guru.id} />
                                                <input type="hidden" name="currentStatus" value={guru.is_active.toString()} />
                                                <Button type="submit" size="sm" variant={guru.is_active ? "destructive" : "default"}>
                                                    {guru.is_active ? "Nonaktifkan" : "Aktifkan"}
                                                </Button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
