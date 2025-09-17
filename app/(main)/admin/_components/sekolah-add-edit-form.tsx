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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
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
import { addSekolah, updateSekolahAccount } from "@/actions/sekolah"
import { JenisJenjang, Sekolah } from "@/lib/generated/prisma"
import { LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { FormError } from "@/components/shared/form-error"
import { AddSekolahFormValues, addSekolahSchema } from "@/lib/schemas/sekolah"

interface IProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  type: 'add' | 'edit';
  selectedSekolah: Sekolah | null;
  onAddSuccess: (data: Sekolah) => void;
  onEditSuccess: (data: Sekolah) => void;
}

export function SekolahAddEditForm({
  onOpenChange,
  open,
  onAddSuccess,
  selectedSekolah,
  type,
  onEditSuccess
}: IProps) {
  const [loading, startServer] = useTransition();
  const [error, setError] = useState('');

  const form = useForm<AddSekolahFormValues>({
    resolver: zodResolver(addSekolahSchema),
    defaultValues: {
      type,
      nama: "",
      nspn: "",
      email: "",
      password: "",
    },
  })

  function onSubmit(values: AddSekolahFormValues) {
    setError('');
    const { type, ...payload } = values;

    startServer(async () => {
      if (type === 'add') {
        const res = await addSekolah(payload);
        if (res.success) {
          onAddSuccess(res.data!);
          toast.success(res.message);
          onOpenChange(false);
          form.reset();
        } else setError(res.message);
      } else if (selectedSekolah) {
        const res = await updateSekolahAccount(payload, selectedSekolah.id);
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
    if ((type === 'edit') && selectedSekolah) {
      form.setValue('type', type);
      form.setValue('nama', selectedSekolah.nama);
      form.setValue('nspn', selectedSekolah.nspn);
      form.setValue('email', selectedSekolah.email);
      form.setValue('jenjang', selectedSekolah.jenjang);
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
          <AlertDialogTitle>Tambah Akun Sekolah</AlertDialogTitle>
          <AlertDialogDescription>Isi data institusi dan autentikasi.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Nama Sekolah</FormLabel>
                  <FormControl>
                    <Input placeholder="cth. SMA Negeri 3 Tasikmalaya" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nspn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NPSN</FormLabel>
                  <FormControl>
                    <Input placeholder="cth. 2023xxxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jenjang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenjang</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih jenjang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(JenisJenjang).map((value) => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Email Admin</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="admin@sekolah.sch.id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="col-span-2">
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

            <div className="col-span-2">
              <FormError message={error} />
            </div>

            <AlertDialogFooter className="col-span-2">
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
