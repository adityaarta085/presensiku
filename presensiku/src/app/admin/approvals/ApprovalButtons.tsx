'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { approveUser, rejectUser } from './actions'

export function ApprovalButtons({ userId }: { userId: string }) {
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  async function handleApprove(formData: FormData) {
    setIsApproving(true)
    try {
      await approveUser(formData)
      toast.success('Pengguna berhasil disetujui.')
    } catch (e) {
      toast.error('Gagal menyetujui pengguna.')
    } finally {
      setIsApproving(false)
    }
  }

  async function handleReject(formData: FormData) {
    setIsRejecting(true)
    try {
      await rejectUser(formData)
      toast.success('Pengguna berhasil ditolak.')
    } catch (e) {
      toast.error('Gagal menolak pengguna.')
    } finally {
      setIsRejecting(false)
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <form action={handleApprove}>
        <input type="hidden" name="id" value={userId} />
        <Button type="submit" size="sm" disabled={isApproving || isRejecting} className="bg-green-600 hover:bg-green-700">
          {isApproving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Setujui
        </Button>
      </form>
      <form action={handleReject}>
        <input type="hidden" name="id" value={userId} />
        <Button type="submit" size="sm" variant="destructive" disabled={isApproving || isRejecting}>
          {isRejecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Tolak
        </Button>
      </form>
    </div>
  )
}
