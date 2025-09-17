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
import { Puskesmas, PuskesmasSekolah, Sekolah } from "@/lib/generated/prisma"
import { LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { FormError } from "@/components/shared/form-error"
import { AddPuskesmasFormValues, addPuskesmasSchema } from "@/lib/schemas/puskesmas"
import MultipleSelector from "@/components/ui/multiselect"
import { addPuskesmas, updatePuskesmasAccount } from "@/actions/puskesmas"

type PuskesmasData = Puskesmas & {
  sekolahs: (PuskesmasSekolah & {
    sekolah: Pick<Sekolah, 'id' | 'nama'>
  })[];
}

interface IProps {
  sekolahs: Pick<Sekolah, 'id' | 'nama'>[];
  onOpenChange: (open: boolean) => void;
  open: boolean;
  type: 'add' | 'edit';
  selectedPuskesmas: PuskesmasData | null;
  onAddSuccess: (data: PuskesmasData) => void;
  onEditSuccess: (data: PuskesmasData) => void;
}

export function PuskesmasAddEditForm({
  onOpenChange,
  open,
  onAddSuccess,
  selectedPuskesmas,
  type,
  onEditSuccess,
  sekolahs
}: IProps) {
  const [loading, startServer] = useTransition();
  const [error, setError] = useState('');

  const sekolahOptions = sekolahs.map((sekolah) => ({ label: sekolah.nama, value: sekolah.id }));

  const form = useForm<AddPuskesmasFormValues>({
    resolver: zodResolver(addPuskesmasSchema),
    defaultValues: {
      type,
      nama: "",
      email: "",
      sekolahIds: [],
      password: "",
    },
  })

  function onSubmit(values: AddPuskesmasFormValues) {
    setError('');
    const { type, ...payload } = values;

    startServer(async () => {
      if (type === 'add') {
        const res = await addPuskesmas(payload);
        if (res.success) {
          onAddSuccess(res.data!);
          toast.success(res.message);
          onOpenChange(false);
          form.reset();
        } else setError(res.message);
      } else if (selectedPuskesmas) {
        const res = await updatePuskesmasAccount(payload, selectedPuskesmas.id);
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
    if ((type === 'edit') && selectedPuskesmas) {
      form.setValue('type', type);
      form.setValue('nama', selectedPuskesmas.nama);
      form.setValue('email', selectedPuskesmas.email);
      form.setValue('sekolahIds', selectedPuskesmas.sekolahs.map((i) => i.sekolahId));
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
          <AlertDialogTitle>Tambah Akun Puskesmas</AlertDialogTitle>
          <AlertDialogDescription>Isi data institusi dan kontak utama admin puskesmas.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Puskesmas</FormLabel>
                  <FormControl>
                    <Input placeholder="cth. Puskesmas Cempaka Putih" {...field} />
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
                  <FormLabel>Email Admin</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="admin@puskesmas.go.id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sekolahIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Akses Sekolah</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      commandProps={{ label: "Pilih sekolah" }}
                      defaultOptions={sekolahOptions}
                      placeholder="Pilih sekolah..."
                      value={sekolahOptions.filter(opt => field.value.includes(opt.value))}
                      onChange={(vals) => field.onChange(vals.map(v => v.value))}
                      hideClearAllButton
                      emptyIndicator={<p className="text-center text-sm">Tidak ada sekolah ditemukan</p>}
                    />
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
