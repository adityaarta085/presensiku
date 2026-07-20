import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { revalidatePath } from 'next/cache'

export default async function LeaveRequestsPage() {
  const supabase = await createClient()

  // Get admin school_id
  const { data: { user } } = await supabase.auth.getUser()
  const { data: adminProfile } = await supabase.from('users').select('school_id, id').eq('auth_id', user?.id).single()
  const schoolId = adminProfile?.school_id
  const adminId = adminProfile?.id

  // Fetch pending leave requests
  const { data: requests } = await supabase
    .from('leave_requests')
    .select(`
      *,
      users!student_id (full_name, nis)
    `)
    .match(schoolId ? { school_id: schoolId } : {})
    .order('created_at', { ascending: false })

  async function updateStatus(formData: FormData) {
    'use server'
    const id = formData.get('id')
    const status = formData.get('status')
    const supabase = await createClient()

    // get user ID for `approved_by`
    const { data: { user } } = await supabase.auth.getUser()
    const { data: adminProfile } = await supabase.from('users').select('id').eq('auth_id', user?.id).single()

    await supabase.from('leave_requests').update({
        status: status,
        approved_by: adminProfile?.id,
        approved_at: new Date().toISOString()
    }).eq('id', id)

    // If approved, you might want to automatically create an attendance record
    if (status === 'approved') {
        const { data: req } = await supabase.from('leave_requests').select('*').eq('id', id).single()
        if (req) {
            // upsert attendance
            await supabase.from('attendance').upsert({
                school_id: req.school_id,
                student_id: req.student_id,
                date: req.date,
                status: req.type,
                notes: 'Approved leave request'
            }, { onConflict: 'student_id, date' })
        }
    }

    revalidatePath('/admin/leave-requests')
    revalidatePath('/admin')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pengajuan Izin & Sakit</h1>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengajuan</CardTitle>
        </CardHeader>
        <CardContent>
          {requests && requests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3">Tanggal</th>
                    <th className="px-6 py-3">Nama Siswa</th>
                    <th className="px-6 py-3">Tipe</th>
                    <th className="px-6 py-3">Alasan</th>
                    <th className="px-6 py-3">Status Ortu</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req: any) => (
                    <tr key={req.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{new Date(req.date).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4 font-medium">{req.users?.full_name} ({req.users?.nis})</td>
                      <td className="px-6 py-4 capitalize">{req.type}</td>
                      <td className="px-6 py-4 max-w-xs truncate" title={req.reason}>{req.reason}</td>
                      <td className="px-6 py-4">
                          {req.parent_confirmation === true ? <span className="text-green-600 font-semibold">Disetujui</span> :
                           req.parent_confirmation === false ? <span className="text-red-600 font-semibold">Ditolak</span> :
                           <span className="text-gray-500">Menunggu</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${req.status === 'approved' ? 'bg-green-100 text-green-800' :
                            req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {(req.status === 'pending' || req.status === 'parent_confirmed') && (
                            <div className="flex justify-end gap-2">
                                <form action={updateStatus}>
                                    <input type="hidden" name="id" value={req.id} />
                                    <input type="hidden" name="status" value="approved" />
                                    <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">Setujui</Button>
                                </form>
                                <form action={updateStatus}>
                                    <input type="hidden" name="id" value={req.id} />
                                    <input type="hidden" name="status" value="rejected" />
                                    <Button type="submit" size="sm" variant="destructive">Tolak</Button>
                                </form>
                            </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <p className="text-gray-500 text-center py-8">Tidak ada pengajuan izin/sakit.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
