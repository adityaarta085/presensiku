'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveUser(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('users').update({ is_approved: true }).eq('id', id)
  revalidatePath('/admin/approvals')
  revalidatePath('/admin')
  return { success: true }
}

export async function rejectUser(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('users').delete().eq('id', id)
  revalidatePath('/admin/approvals')
  revalidatePath('/admin')
  return { success: true }
}
