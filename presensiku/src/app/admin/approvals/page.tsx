import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { revalidatePath } from 'next/cache'

export default async function ApprovalsPage() {
  const supabase = await createClient()

  // Get admin school_id
  const { data: { user } } = await supabase.auth.getUser()
  const { data: adminProfile } = await supabase.from('users').select('school_id').eq('auth_id', user?.id).single()
  const schoolId = adminProfile?.school_id

  // Fetch pending users
  const { data: pendingUsers } = await supabase
    .from('users')
    .select('*')
    .eq('school_id', schoolId)
    .eq('is_approved', false)
    .order('created_at', { ascending: false })

  async function approveUser(formData: FormData) {
    'use server'
    const id = formData.get('id')
    const supabase = await createClient()
    await supabase.from('users').update({ is_approved: true }).eq('id', id)
    revalidatePath('/admin/approvals')
    revalidatePath('/admin')
  }

  async function rejectUser(formData: FormData) {
    'use server'
    const id = formData.get('id')
    const supabase = await createClient()
    await supabase.from('users').delete().eq('id', id) // Or mark as rejected if you want to keep them
    revalidatePath('/admin/approvals')
    revalidatePath('/admin')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Persetujuan Akun</h1>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Akun Menunggu Persetujuan</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingUsers && pendingUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3">Nama Lengkap</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Email/Kontak</th>
                    <th className="px-6 py-3">Tanggal Daftar</th>
                    <th className="px-6 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((u) => (
                    <tr key={u.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{u.full_name}</td>
                      <td className="px-6 py-4 capitalize">{u.role}</td>
                      <td className="px-6 py-4">{u.email || u.phone || '-'}</td>
                      <td className="px-6 py-4">{new Date(u.created_at).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <form action={approveUser}>
                          <input type="hidden" name="id" value={u.id} />
                          <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">Setujui</Button>
                        </form>
                        <form action={rejectUser}>
                          <input type="hidden" name="id" value={u.id} />
                          <Button type="submit" size="sm" variant="destructive">Tolak</Button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <p className="text-gray-500 text-center py-8">Tidak ada akun yang menunggu persetujuan.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
