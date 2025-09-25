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
import { Angkatan, Guru } from "@/lib/generated/prisma"
import { LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { FormError } from "@/components/shared/form-error"
import { AddAngkatanFormValues, addAngkatanSchema } from "@/lib/schemas/angkatan"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addAngkatan, updateAngkatan } from "@/actions/angkatan"

type AngkatanData = Pick<Angkatan, 'id' | 'nama' | 'createdAt' | 'status'> & {
  guru: Pick<Guru, 'id' | 'nama'> | null;
  totalSiswi: number;
  totalSiswiAktif: number;
  kepatuhan: number;
}

interface IProps {
  sekolahId: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  type: 'add' | 'edit';
  selectedAngkatan: AngkatanData | null;
  onAddSuccess: (data: AngkatanData) => void;
  onEditSuccess: (data: AngkatanData) => void;
  guruData: (Guru & {
    angkatan: Angkatan[]
  })[];
}

export function AngkatanAddEditForm({
  onOpenChange,
  open,
  onAddSuccess,
  selectedAngkatan,
  type,
  onEditSuccess,
  sekolahId,
  guruData
}: IProps) {
  const [loading, startServer] = useTransition();
  const [error, setError] = useState('');

  const form = useForm<AddAngkatanFormValues>({
    resolver: zodResolver(addAngkatanSchema),
    defaultValues: {
      type,
      nama: "",
      guruId: ""
    },
  })

  function onSubmit(values: AddAngkatanFormValues) {
    setError('');
    const { type, ...payload } = values;

    startServer(async () => {
      if (type === 'add') {
        const res = await addAngkatan(payload, sekolahId);
        if (res.success) {
          onAddSuccess(res.data!);
          toast.success(res.message);
          onOpenChange(false);
          form.reset();
        } else setError(res.message);
      } else if (selectedAngkatan) {
        const res = await updateAngkatan(payload, selectedAngkatan.id);
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
    if ((type === 'edit') && selectedAngkatan) {
      form.setValue('type', type);
      form.setValue('nama', selectedAngkatan.nama);
      if (selectedAngkatan.guru) form.setValue('guruId', selectedAngkatan.guru.id);
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
          <AlertDialogTitle>{type === 'add' ? 'Tambah' : 'Edit'} Angkatan</AlertDialogTitle>
          <AlertDialogDescription>Isi data angkatan untuk keperluan administrasi dan monitoring.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Angkatan</FormLabel>
                  <FormControl>
                    <Input placeholder="cth: 2025/2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guruId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guru Pengurus</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih guru pengurus" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {guruData.map((guru) => (
                        <SelectItem key={guru.id} value={guru.id}>
                          {guru.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
