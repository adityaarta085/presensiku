import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { revalidatePath } from 'next/cache'
import LocationPicker from './LocationPicker'

export default async function AdminConfigPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: adminProfile } = await supabase.from('users').select('school_id').eq('auth_id', user?.id).single()
  const schoolId = adminProfile?.school_id

  // Fetch configs
  const { data: config } = await supabase
    .from('school_configs')
    .select('*')
    .eq('school_id', schoolId)
    .single()

  async function updateConfig(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: adminProfile } = await supabase.from('users').select('school_id').eq('auth_id', user?.id).single()

    const gpsLat = parseFloat(formData.get('gps_latitude') as string)
    const gpsLng = parseFloat(formData.get('gps_longitude') as string)
    const radius = parseInt(formData.get('gps_radius_meters') as string)
    const start = formData.get('attendance_start_time') as string
    const end = formData.get('attendance_end_time') as string
    const selfieMode = formData.get('selfie_mode') as string

    const updates = {
        gps_latitude: isNaN(gpsLat) ? 0 : gpsLat,
        gps_longitude: isNaN(gpsLng) ? 0 : gpsLng,
        gps_radius_meters: isNaN(radius) ? 100 : radius,
        attendance_start_time: start,
        attendance_end_time: end,
        selfie_mode: selfieMode
    }

    if (adminProfile?.school_id) {
        // Cek apakah config sudah ada
        const { data: existing } = await supabase.from('school_configs').select('id').eq('school_id', adminProfile.school_id).single()
        if (existing) {
            await supabase.from('school_configs').update(updates).eq('school_id', adminProfile.school_id)
        } else {
            await supabase.from('school_configs').insert({ school_id: adminProfile.school_id, ...updates })
        }
    }

    revalidatePath('/admin/config')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pengaturan Sekolah</h1>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Konfigurasi Presensi</CardTitle>
          <CardDescription>Atur lokasi GPS, waktu, dan fitur lainnya.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateConfig} className="space-y-6">
            <LocationPicker initialLat={config?.gps_latitude} initialLng={config?.gps_longitude} />

            <div className="space-y-2">
                <label className="text-sm font-medium">Radius Area Presensi (meter)</label>
                <input
                    name="gps_radius_meters"
                    type="number"
                    defaultValue={config?.gps_radius_meters || 100}
                    className="w-full border rounded p-2 text-sm"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Jam Mulai Presensi (HH:MM)</label>
                    <input
                        name="attendance_start_time"
                        type="time"
                        defaultValue={config?.attendance_start_time || '06:00'}
                        className="w-full border rounded p-2 text-sm"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Jam Batas Presensi (HH:MM)</label>
                    <input
                        name="attendance_end_time"
                        type="time"
                        defaultValue={config?.attendance_end_time || '07:30'}
                        className="w-full border rounded p-2 text-sm"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Mode Selfie</label>
                <select
                    name="selfie_mode"
                    defaultValue={config?.selfie_mode || 'required'}
                    className="w-full border rounded p-2 text-sm"
                >
                    <option value="required">Wajib</option>
                    <option value="optional">Opsional</option>
                    <option value="disabled">Nonaktif</option>
                </select>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Simpan Pengaturan</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
