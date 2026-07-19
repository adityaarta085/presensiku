import { createClient } from '@/lib/supabase/server'

export async function getSchoolSettings() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('school_settings')
    .select('*')
    .limit(1)
    .single()

  return data || {
    school_name: 'SMK MUHAMMADIYAH BANDONGAN',
    school_address: 'Jl. Kyai A\'rof Timur Lapangan Bandongan Kab. Magelang',
    school_phone: '0293 310217',
    school_email: 'smkm_bdg@yahoo.co.id',
    logo_url: 'https://www.smkmbandongan.sch.id/media_library/images/55ea75a09ef20ff3de1e0d2ae0ec4ed7.png',
    login_bg_url: null,
    hero_title: 'Presensi Digital untuk Masa Depan Pendidikan',
    hero_subtitle: 'Sistem presensi modern dengan validasi GPS, selfie, dan notifikasi WhatsApp real-time untuk orang tua.',
    primary_color: '#2563EB',
    spmb_link: 'https://spmb.smkmbandongan.sch.id',
    spmb_enabled: true,
  }
}
