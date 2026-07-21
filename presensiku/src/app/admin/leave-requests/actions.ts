'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateStatus(formData: FormData) {
  const id = formData.get('id') as string
  const status = formData.get('status') as string
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('users').select('id').eq('auth_id', user.id).single()

  await supabase
    .from('leave_requests')
    .update({
      status,
      approved_by: profile?.id,
      approved_at: new Date().toISOString()
    })
    .eq('id', id)

  revalidatePath('/admin/leave-requests')
  return { success: true }
}
