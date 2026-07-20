import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/auth/LoginForm'
import { getSchoolSettings } from '@/lib/getSchoolSettings'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase.from('users').select('role, is_approved').eq('auth_id', user.id).single()
    if (profile) {
      if (!profile.is_approved) redirect('/pending-approval')
      if (profile.role === 'admin') redirect('/admin')
      if (profile.role === 'guru') redirect('/guru')
      if (profile.role === 'siswa') redirect('/siswa')
    }
  }

  // Ambil school_settings (untuk logo, nama, background)
  const settings = await getSchoolSettings()

  return <LoginForm settings={settings} />
}
