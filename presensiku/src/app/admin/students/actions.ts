'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Note: Requires SUPABASE_SERVICE_ROLE_KEY to create users via Admin API
// But for now, we can use the regular sign up or assume the service key is available if we do this server side,
// wait, we can't create an auth user easily without the service role key if we don't want to sign in as them.
// Let's implement it assuming NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (if missing, we fallback to auth.signUp which might auto-login, which we don't want).
// Wait, `supabase.auth.signUp` from the server might not log the admin out, but it's not the admin API.
// Actually, `supabase.auth.admin.createUser` requires the service role key.
// Let's check if SUPABASE_SERVICE_ROLE_KEY is present in env.
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) return null

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    {
      cookies: {
        getAll() { return [] },
        setAll() {}
      }
    }
  )
}

export async function createUser(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: adminProfile } = await supabase.from('users').select('school_id').eq('auth_id', user.id).single()
  const schoolId = adminProfile?.school_id || null

  const role = formData.get('role') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const nis = formData.get('nis') as string
  const classId = formData.get('class_id') as string
  const nipPhone = formData.get('nip_phone') as string

  const adminClient = getAdminClient()

  if (!adminClient) {
      return { error: "SUPABASE_SERVICE_ROLE_KEY tidak ditemukan. Tidak bisa membuat user baru dari panel admin." }
  }

  // 1. Create Auth User
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (authError) {
      return { error: authError.message }
  }

  // 2. Create User Profile
  const profileData: any = {
      auth_id: authData.user.id,
      school_id: schoolId,
      role: role,
      full_name: fullName,
      email: email,
      is_approved: true,
      is_active: true
  }

  if (role === 'siswa') {
      profileData.nis = nis
      if (classId) profileData.class_id = classId
  } else {
      // Guru
      profileData.nip = nipPhone // Or phone, simplification for this UI
      profileData.phone = nipPhone
  }

  const { error: profileError } = await adminClient.from('users').insert(profileData)

  if (profileError) {
      // Rollback Auth user if profile fails
      await adminClient.auth.admin.deleteUser(authData.user.id)
      return { error: profileError.message }
  }

  revalidatePath('/admin/students')
  return { success: true }
}

export async function toggleActiveStatus(formData: FormData) {
  const id = formData.get('id') as string
  const currentStatus = formData.get('currentStatus') === 'true'
  const supabase = await createClient()

  await supabase.from('users').update({ is_active: !currentStatus }).eq('id', id)

  revalidatePath('/admin/students')
  return { success: true }
}
