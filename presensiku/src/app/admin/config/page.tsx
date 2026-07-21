import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import ConfigForm from './ConfigForm'

export default async function AdminConfigPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  let schoolId = null;
  if (user) {
    const { data: adminProfile } = await supabase.from('users').select('school_id').eq('auth_id', user.id).single()
    schoolId = adminProfile?.school_id || null
  }

  // Fetch configs
  let query = supabase.from('school_configs').select('*')
  if (schoolId) {
    query = query.eq('school_id', schoolId)
  } else {
    query = query.is('school_id', null)
  }
  const { data: config } = await query.single()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pengaturan Sekolah</h1>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Konfigurasi Presensi</CardTitle>
          <CardDescription>Atur lokasi GPS, waktu, dan fitur lainnya.</CardDescription>
        </CardHeader>
        <CardContent>
          <ConfigForm initialConfig={config} />
        </CardContent>
      </Card>
    </div>
  )
}
