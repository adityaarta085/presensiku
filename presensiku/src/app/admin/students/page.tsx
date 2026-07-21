import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CreateUserForm from './CreateUserForm'
import { ToggleActiveButton } from './ToggleActiveButton'

export default async function StudentsTeachersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: adminProfile } = await supabase.from('users').select('school_id').eq('auth_id', user?.id).single()
  const schoolId = adminProfile?.school_id || null

  // Fetch Classes
  const { data: classList } = await supabase
    .from('classes')
    .select('id, name')
    .filter('school_id', schoolId ? 'eq' : 'is', schoolId)

  // Fetch Siswa
  const { data: siswaList } = await supabase
    .from('users')
    .select('*, classes(name)')
    .filter('school_id', schoolId ? 'eq' : 'is', schoolId)
    .eq('role', 'siswa')
    .order('full_name', { ascending: true })

  // Fetch Guru
  const { data: guruList } = await supabase
    .from('users')
    .select('*')
    .filter('school_id', schoolId ? 'eq' : 'is', schoolId)
    .eq('role', 'guru')
    .order('full_name', { ascending: true })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
      </div>

      <Tabs defaultValue="siswa" className="w-full">
        <div className="flex justify-between items-center mb-4">
            <TabsList>
            <TabsTrigger value="siswa">Data Siswa</TabsTrigger>
            <TabsTrigger value="guru">Data Guru</TabsTrigger>
            </TabsList>

            <TabsContent value="siswa" className="mt-0">
                <CreateUserForm role="siswa" classes={classList || []} />
            </TabsContent>
            <TabsContent value="guru" className="mt-0">
                <CreateUserForm role="guru" />
            </TabsContent>
        </div>

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
                                            <ToggleActiveButton userId={siswa.id} isActive={siswa.is_active} />
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
                                            <ToggleActiveButton userId={guru.id} isActive={guru.is_active} />
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
