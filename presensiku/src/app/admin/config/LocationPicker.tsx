'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import { toast } from 'sonner'

interface LocationPickerProps {
  initialLat?: number
  initialLng?: number
}

export default function LocationPicker({ initialLat, initialLng }: LocationPickerProps) {
  const [lat, setLat] = useState<number | string>(initialLat || '')
  const [lng, setLng] = useState<number | string>(initialLng || '')

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation tidak didukung oleh browser ini.')
      return
    }

    toast.info('Mengambil lokasi saat ini...', { id: 'geo' })

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude)
        setLng(position.coords.longitude)
        toast.success('Lokasi berhasil didapatkan!', { id: 'geo' })
      },
      (error) => {
        let msg = 'Gagal mendapatkan lokasi.'
        if (error.code === error.PERMISSION_DENIED) {
            msg = 'Izin akses lokasi ditolak.'
        }
        toast.error(msg, { id: 'geo' })
      }
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <Button
            type="button"
            variant="outline"
            onClick={handleGetCurrentLocation}
            className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 flex gap-2"
        >
            <MapPin className="w-4 h-4" />
            Ambil Lokasi Saat Ini
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Latitude Pusat Sekolah</label>
          <input
            name="gps_latitude"
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="w-full border rounded p-2 text-sm"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Longitude Pusat Sekolah</label>
          <input
            name="gps_longitude"
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="w-full border rounded p-2 text-sm"
            required
          />
        </div>
      </div>
    </div>
  )
}
