import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LandingPage from '@/components/landing/LandingPage'
import { getSchoolSettings } from '@/lib/getSchoolSettings'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  // Ambil school_settings dari database
  const settings = await getSchoolSettings()

  // Ambil statistik (jumlah siswa terdaftar)
  const { count: studentCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'student')
    .eq('status', 'approved')

  return <LandingPage settings={settings} studentCount={studentCount || 500} />
}
