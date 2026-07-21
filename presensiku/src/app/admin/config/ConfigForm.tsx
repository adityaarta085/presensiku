'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import LocationPicker from './LocationPicker'
import { updateConfig } from './actions'

interface ConfigFormProps {
  initialConfig: any
}

export default function ConfigForm({ initialConfig }: ConfigFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      await updateConfig(formData)
      toast.success('Pengaturan berhasil disimpan!')
    } catch (error) {
      toast.error('Gagal menyimpan pengaturan.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={onSubmit} className="space-y-6">
      <LocationPicker initialLat={initialConfig?.gps_latitude} initialLng={initialConfig?.gps_longitude} />

      <div className="space-y-2">
          <label className="text-sm font-medium">Radius Area Presensi (meter)</label>
          <input
              name="gps_radius_meters"
              type="number"
              defaultValue={initialConfig?.gps_radius_meters || 100}
              className="w-full border rounded p-2 text-sm"
              required
          />
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
              <label className="text-sm font-medium">Jam Mulai Presensi (HH:MM)</label>
              <input
                  name="attendance_start_time"
                  type="time"
                  defaultValue={initialConfig?.attendance_start_time || '06:00'}
                  className="w-full border rounded p-2 text-sm"
                  required
              />
          </div>
          <div className="space-y-2">
              <label className="text-sm font-medium">Jam Batas Presensi (HH:MM)</label>
              <input
                  name="attendance_end_time"
                  type="time"
                  defaultValue={initialConfig?.attendance_end_time || '07:30'}
                  className="w-full border rounded p-2 text-sm"
                  required
              />
          </div>
      </div>

      <div className="space-y-2">
          <label className="text-sm font-medium">Mode Selfie</label>
          <select
              name="selfie_mode"
              defaultValue={initialConfig?.selfie_mode || 'required'}
              className="w-full border rounded p-2 text-sm"
          >
              <option value="required">Wajib</option>
              <option value="optional">Opsional</option>
              <option value="disabled">Nonaktif</option>
          </select>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Simpan Pengaturan
      </Button>
    </form>
  )
}
