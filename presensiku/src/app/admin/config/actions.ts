'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateConfig(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: adminProfile } = await supabase.from('users').select('school_id').eq('auth_id', user.id).single()
  const adminSchoolId = adminProfile?.school_id || null

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

  let existingQuery = supabase.from('school_configs').select('id')
  if (adminSchoolId) {
      existingQuery = existingQuery.eq('school_id', adminSchoolId)
  } else {
      existingQuery = existingQuery.is('school_id', null)
  }
  const { data: existing } = await existingQuery.single()

  if (existing) {
      let updateQuery = supabase.from('school_configs').update(updates)
      if (adminSchoolId) {
          updateQuery = updateQuery.eq('school_id', adminSchoolId)
      } else {
          updateQuery = updateQuery.is('school_id', null)
      }
      await updateQuery
  } else {
      await supabase.from('school_configs').insert({ school_id: adminSchoolId, ...updates })
  }

  revalidatePath('/admin/config')
}
