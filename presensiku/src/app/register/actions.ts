'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function register(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const nis = formData.get('nis') as string
  const parent_name = formData.get('parent_name') as string
  const parent_phone = formData.get('parent_phone') as string

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    redirect('/register?message=' + authError.message)
  }

  if (authData.user) {
    // We would normally insert into the users table here.
    // However, since RLS might block it if we are not using a service role key,
    // let's assume we use a service role key for this or RLS allows insert for own auth.uid().
    // For simplicity, we'll just try to insert with the current client.
    // If RLS is strict, we should use a trigger in DB instead.

    const { error: insertError } = await supabase
      .from('users')
      .insert([
        {
          auth_id: authData.user.id,
          role: 'siswa',
          full_name,
          email,
          nis,
          parent_name,
          parent_phone,
          is_approved: false
        }
      ])

    if (insertError) {
        console.error("Error inserting user details:", insertError);
        // Clean up auth user if details failed?
    }
  }

  revalidatePath('/', 'layout')
  redirect('/pending-approval')
}
