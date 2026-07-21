'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateStatus } from './actions'

export function StatusButtons({ requestId }: { requestId: string }) {
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  async function handleApprove(formData: FormData) {
    setIsApproving(true)
    try {
      await updateStatus(formData)
      toast.success('Pengajuan disetujui.')
    } catch (e) {
      toast.error('Gagal menyetujui pengajuan.')
    } finally {
      setIsApproving(false)
    }
  }

  async function handleReject(formData: FormData) {
    setIsRejecting(true)
    try {
      await updateStatus(formData)
      toast.success('Pengajuan ditolak.')
    } catch (e) {
      toast.error('Gagal menolak pengajuan.')
    } finally {
      setIsRejecting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <form action={handleApprove}>
        <input type="hidden" name="id" value={requestId} />
        <input type="hidden" name="status" value="approved" />
        <Button type="submit" size="sm" disabled={isApproving || isRejecting} className="bg-green-600 hover:bg-green-700">
          {isApproving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Terima
        </Button>
      </form>
      <form action={handleReject}>
        <input type="hidden" name="id" value={requestId} />
        <input type="hidden" name="status" value="rejected" />
        <Button type="submit" size="sm" variant="destructive" disabled={isApproving || isRejecting}>
          {isRejecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Tolak
        </Button>
      </form>
    </div>
  )
}
