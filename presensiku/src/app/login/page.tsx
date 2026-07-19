import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/auth/LoginForm'
import { getSchoolSettings } from '@/lib/getSchoolSettings'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  // Ambil school_settings (untuk logo, nama, background)
  const settings = await getSchoolSettings()

  return <LoginForm settings={settings} />
}
