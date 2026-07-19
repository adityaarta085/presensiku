-- Create necessary tables for PresensiKu

-- Enable PostGIS for geofencing
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. schools
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. school_configs
CREATE TABLE public.school_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE UNIQUE,

  -- GPS / Geofencing
  gps_latitude DOUBLE PRECISION NOT NULL,
  gps_longitude DOUBLE PRECISION NOT NULL,
  gps_radius_meters INTEGER DEFAULT 100,

  -- Selfie
  selfie_mode TEXT DEFAULT 'required' CHECK (selfie_mode IN ('required', 'optional', 'disabled')),
  max_selfie_size_mb INTEGER DEFAULT 2,

  -- Waktu Presensi
  attendance_start_time TIME DEFAULT '06:30',
  attendance_end_time TIME DEFAULT '07:30',
  late_threshold_minutes INTEGER DEFAULT 15,
  auto_mark_absent_time TIME DEFAULT '08:00',

  -- Hari Sekolah
  school_days TEXT[] DEFAULT ARRAY['monday','tuesday','wednesday','thursday','friday'],

  -- WhatsApp Notifikasi
  wa_api_key TEXT,
  wa_realtime_enabled BOOLEAN DEFAULT TRUE,
  wa_weekly_enabled BOOLEAN DEFAULT TRUE,
  weekly_summary_day TEXT DEFAULT 'saturday',

  wa_template_attendance TEXT DEFAULT 'Halo {nama_ortu}, {nama_siswa} ({kelas}) telah melakukan presensi dengan status: {status} pada {waktu}.',
  wa_template_late TEXT DEFAULT 'Halo {nama_ortu}, {nama_siswa} ({kelas}) terlambat masuk sekolah pada {waktu}.',
  wa_template_absent TEXT DEFAULT 'Halo {nama_ortu}, {nama_siswa} ({kelas}) tidak hadir di sekolah hari ini ({tanggal}). Mohon konfirmasi.',
  wa_template_weekly TEXT DEFAULT 'Ringkasan kehadiran {nama_siswa} ({kelas}) minggu ini:\n✅ Hadir: {hadir}\n⏰ Terlambat: {terlambat}\n📝 Izin: {izin}\n🏥 Sakit: {sakit}\n❌ Alpha: {alpha}',
  wa_template_leave_confirm TEXT DEFAULT 'Halo {nama_ortu}, {nama_siswa} mengajukan {tipe_izin} dengan alasan: {alasan}. Mohon konfirmasi: {link_konfirmasi}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. academic_years
CREATE TABLE public.academic_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. "2026/2027"
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, name)
);

-- 4. users
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'guru', 'siswa')),

  full_name TEXT NOT NULL,
  email TEXT,
  nis TEXT,
  nip TEXT,
  phone TEXT,
  avatar_url TEXT,

  parent_name TEXT,
  parent_phone TEXT,

  is_approved BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. classes
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. "X RPL 1"
  grade TEXT, -- e.g. "X", "XI", "XII"
  academic_year_id UUID REFERENCES public.academic_years(id),
  homeroom_teacher_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, name, academic_year_id)
);

-- Add class_id to users after classes table is created
ALTER TABLE public.users ADD COLUMN class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL;

-- 6. attendance
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('hadir', 'terlambat', 'izin', 'sakit', 'alpha')),
  check_in_time TIMESTAMPTZ,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  selfie_url TEXT,
  is_manual_override BOOLEAN DEFAULT FALSE,
  recorded_by UUID REFERENCES public.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- 7. leave_requests
CREATE TABLE public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('izin', 'sakit')),
  reason TEXT NOT NULL,
  document_url TEXT,

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'waiting_parent', 'parent_confirmed', 'parent_rejected', 'approved', 'rejected')),

  parent_token UUID DEFAULT gen_random_uuid() UNIQUE,
  parent_confirmation BOOLEAN,
  parent_confirmed_at TIMESTAMPTZ,
  parent_note TEXT,

  approved_by UUID REFERENCES public.users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,

  wa_sent_to_parent BOOLEAN DEFAULT FALSE,
  wa_sent_to_parent_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. notification_logs
CREATE TABLE public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  channel TEXT DEFAULT 'whatsapp',
  recipient_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  fonnte_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_school_role ON public.users(school_id, role);
CREATE INDEX IF NOT EXISTS idx_users_class ON public.users(class_id);
CREATE INDEX IF NOT EXISTS idx_users_auth ON public.users(auth_id);

CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(school_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON public.attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON public.attendance(school_id, date, status);

CREATE INDEX IF NOT EXISTS idx_leave_student ON public.leave_requests(student_id, date);
CREATE INDEX IF NOT EXISTS idx_leave_status ON public.leave_requests(school_id, status);

CREATE INDEX IF NOT EXISTS idx_notif_school ON public.notification_logs(school_id, created_at DESC);
