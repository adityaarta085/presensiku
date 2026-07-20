import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
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
  } else {
      redirect('/login')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Landing page content goes here if user is not authenticated. Since we redirect to login, this will rarely show but it's good practice. */}
    </main>
  )
}
