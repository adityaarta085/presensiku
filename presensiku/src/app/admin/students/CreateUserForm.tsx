'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createUser } from './actions'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface CreateUserFormProps {
  role: 'siswa' | 'guru'
  classes?: any[]
}

export default function CreateUserForm({ role, classes }: CreateUserFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    formData.append('role', role)
    try {
      const result = await createUser(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(`${role === 'siswa' ? 'Siswa' : 'Guru'} berhasil ditambahkan!`)
        setOpen(false)
      }
    } catch (error) {
      toast.error('Gagal menambahkan pengguna.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Tambah {role === 'siswa' ? 'Siswa' : 'Guru'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah {role === 'siswa' ? 'Siswa' : 'Guru'} Baru</DialogTitle>
        </DialogHeader>
        <form action={onSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Lengkap</label>
            <input name="full_name" required className="w-full border rounded p-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input type="email" name="email" required className="w-full border rounded p-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password Sementara</label>
            <input type="password" name="password" required className="w-full border rounded p-2 text-sm" />
          </div>

          {role === 'siswa' ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">NIS</label>
                <input name="nis" required className="w-full border rounded p-2 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Kelas</label>
                <select name="class_id" required className="w-full border rounded p-2 text-sm">
                  <option value="">Pilih Kelas</option>
                  {classes?.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">NIP / Nomor HP</label>
              <input name="nip_phone" required className="w-full border rounded p-2 text-sm" />
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
