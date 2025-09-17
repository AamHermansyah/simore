"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel
} from "@/components/ui/alert-dialog"
import { useEffect, useState, useTransition } from "react"
import { PasswordInput } from "@/components/core/password-input"
import { Angkatan, Guru, Siswi } from "@/lib/generated/prisma"
import { LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { FormError } from "@/components/shared/form-error"
import { AddSiswiFormValues, addSiswiSchema } from "@/lib/schemas/siswi"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addSiswi, updateSiswiAccount } from "@/actions/siswi"

type SiswiData = Siswi & {
  angkatan: Angkatan | null;
  _count: { laporan: number };
}

interface IProps {
  sekolahId: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  type: 'add' | 'edit';
  selectedSiswi: SiswiData | null;
  onAddSuccess: (data: SiswiData) => void;
  onEditSuccess: (data: SiswiData) => void;
  angkatanData: (Angkatan & {
    guru: Pick<Guru, 'id' | 'nama'> | null,
    _count: {
      siswi: number;
    }
  })[]
}

export function SiswiAddEditForm({
  onOpenChange,
  open,
  onAddSuccess,
  selectedSiswi,
  type,
  onEditSuccess,
  sekolahId,
  angkatanData
}: IProps) {
  const [loading, startServer] = useTransition();
  const [error, setError] = useState('');

  const form = useForm<AddSiswiFormValues>({
    resolver: zodResolver(addSiswiSchema),
    defaultValues: {
      type,
      nama: "",
      nisn: "",
      nomorTelepon: "",
      password: "",
    },
  })

  function onSubmit(values: AddSiswiFormValues) {
    setError('');
    const { type, ...payload } = values;

    startServer(async () => {
      if (type === 'add') {
        const res = await addSiswi(payload, sekolahId);
        if (res.success) {
          onAddSuccess(res.data!);
          toast.success(res.message);
          onOpenChange(false);
          form.reset();
        } else setError(res.message);
      } else if (selectedSiswi) {
        const res = await updateSiswiAccount(payload, selectedSiswi.id);
        if (res.success) {
          onEditSuccess(res.data!);
          toast.success(res.message);
          onOpenChange(false);
          form.reset();
        } else setError(res.message);
      }
    })
  }

  useEffect(() => {
    if ((type === 'edit') && selectedSiswi) {
      form.setValue('type', type);
      form.setValue('nama', selectedSiswi.nama);
      form.setValue('nisn', selectedSiswi.nisn);
      if (selectedSiswi.angkatanId) form.setValue('angkatanId', selectedSiswi.angkatanId);
      form.setValue('nomorTelepon', selectedSiswi.nomorTelepon);
    }
  }, [type]);

  return (
    <AlertDialog open={open} onOpenChange={(open) => {
      if (!open) {
        setTimeout(() => {
          setError('');
          form.reset();
        }, 200);
      };
      onOpenChange(open);
    }}>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Tambah Akun Siswa</AlertDialogTitle>
          <AlertDialogDescription>Isi data dasar siswa untuk gabung kedalam program simore.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukan nama lengkap guru" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nisn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NISN</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukan NISN siswi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="angkatanId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Angkatan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih angkatan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {angkatanData.map((angkatan) => (
                        <SelectItem key={angkatan.id} value={angkatan.id}>
                          {angkatan.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nomorTelepon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor WA Aktif</FormLabel>
                  <FormControl>
                    <Input inputMode="numeric" placeholder="Masukan no. WA aktif" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {type === 'edit' && 'Reset'} Password {type === 'edit' && '(Opsional)'}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Minimal 6 karakter" {...field} />
                  </FormControl>
                  {type === 'edit' && (
                    <FormDescription>
                      Kosongkan kolom reset password jika anda tidak ingin mengubah password
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormError message={error} />

            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
              <Button type="submit" disabled={loading}>
                {loading && <LoaderCircle className="w-4 h-4 animate-spin" />}
                {type === 'edit' ? 'Konfirmasi' : 'Tambah'}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
