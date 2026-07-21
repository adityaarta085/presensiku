'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { toggleActiveStatus } from './actions'

interface Props {
  userId: string
  isActive: boolean
}

export function ToggleActiveButton({ userId, isActive }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleToggle(formData: FormData) {
    setIsLoading(true)
    try {
      await toggleActiveStatus(formData)
      toast.success(isActive ? 'Pengguna dinonaktifkan.' : 'Pengguna diaktifkan.')
    } catch (e) {
      toast.error('Gagal mengubah status pengguna.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={handleToggle}>
      <input type="hidden" name="id" value={userId} />
      <input type="hidden" name="currentStatus" value={isActive.toString()} />
      <Button type="submit" size="sm" variant={isActive ? "destructive" : "default"} disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isActive ? "Nonaktifkan" : "Aktifkan"}
      </Button>
    </form>
  )
}
