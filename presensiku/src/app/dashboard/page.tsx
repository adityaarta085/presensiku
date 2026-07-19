import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile to determine role
  const { data: profile } = await supabase
    .from('users')
    .select('role, is_approved')
    .eq('auth_id', user.id)
    .single()

  if (!profile) {
    // Profil tidak ditemukan, mungkin sedang setup, redirect ke login atau error
    redirect('/login')
  }

  // Jika belum di-approve
  if (!profile.is_approved) {
    redirect('/pending-approval')
  }

  // Redirect berdasarkan role
  if (profile.role === 'admin') {
    redirect('/admin')
  } else if (profile.role === 'guru') {
    redirect('/guru')
  } else if (profile.role === 'siswa') {
    redirect('/siswa')
  }

  // Fallback
  redirect('/login')
}
