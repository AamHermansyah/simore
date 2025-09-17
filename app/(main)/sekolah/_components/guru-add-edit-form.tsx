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
import { Angkatan, Guru } from "@/lib/generated/prisma"
import { LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { FormError } from "@/components/shared/form-error"
import { AddGuruFormValues, addGuruSchema } from "@/lib/schemas/guru"
import { addGuru, updateGuruAccount } from "@/actions/guru"

type GuruData = Guru & {
  angkatan: Angkatan[]
}

interface IProps {
  sekolahId: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  type: 'add' | 'edit';
  selectedGuru: GuruData | null;
  onAddSuccess: (data: GuruData) => void;
  onEditSuccess: (data: GuruData) => void;
}

export function GuruAddEditForm({
  onOpenChange,
  open,
  onAddSuccess,
  selectedGuru,
  type,
  onEditSuccess,
  sekolahId
}: IProps) {
  const [loading, startServer] = useTransition();
  const [error, setError] = useState('');

  const form = useForm<AddGuruFormValues>({
    resolver: zodResolver(addGuruSchema),
    defaultValues: {
      type,
      nama: "",
      email: "",
      nip: "",
      password: "",
    },
  })

  function onSubmit(values: AddGuruFormValues) {
    setError('');
    const { type, ...payload } = values;

    startServer(async () => {
      if (type === 'add') {
        const res = await addGuru(payload, sekolahId);
        if (res.success) {
          onAddSuccess(res.data!);
          toast.success(res.message);
          onOpenChange(false);
          form.reset();
        } else setError(res.message);
      } else if (selectedGuru) {
        const res = await updateGuruAccount(payload, selectedGuru.id);
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
    if ((type === 'edit') && selectedGuru) {
      form.setValue('type', type);
      form.setValue('nama', selectedGuru.nama);
      form.setValue('email', selectedGuru.email);
      form.setValue('nip', selectedGuru.nip);
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
          <AlertDialogTitle>Tambah Akun Guru</AlertDialogTitle>
          <AlertDialogDescription>Isi data dasar guru untuk mengelola dan monitoring siswi per kelas.</AlertDialogDescription>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Masukan email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIP</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukan NIP guru" {...field} />
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
