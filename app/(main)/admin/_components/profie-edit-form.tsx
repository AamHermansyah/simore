"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SuperAdmin } from "@/lib/generated/prisma";
import { ProfileFormValues, profileSchema } from "@/lib/schemas/superadmin";
import { useState, useTransition } from "react";
import { editSuperAdmin } from "@/actions/superadmin";
import { toast } from "sonner";
import { FormError } from "@/components/shared/form-error";
import { LoaderCircle } from "lucide-react";

interface IProps {
  data: SuperAdmin;
  onCancel: () => void;
  onSuccess: (data: SuperAdmin) => void;
}

export function ProfileEditForm({ data, onCancel, onSuccess }: IProps) {
  const [loading, startServer] = useTransition();
  const [error, setError] = useState('');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nama: data.nama,
      nip: data.nip,
      email: data.email,
      nomorTelepon: data.nomorTelepon || '',
      alamat: data.alamat || '',
      jabatan: data.jabatan || '',
      instansi: data.instansi || '',
    },
  });

  function onSubmit(values: ProfileFormValues) {
    setError('');

    startServer(async () => {
      const res = await editSuperAdmin(values);
      if (res.success) {
        toast.success('Profil berhasil diperbarui');
        onSuccess(res.data!);
      } else setError(res.message!);
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6"
      >
        <Card>
          <CardContent>
            <h2 className="font-semibold">Informasi Pribadi</h2>
            <Separator className="my-3" />
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama lengkap" {...field} />
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
                      <Input placeholder="Masukkan NIP" {...field} />
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
                      <Input placeholder="Masukkan email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nomorTelepon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Telepon Pribadi</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan no. telepon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="Masukkan alamat lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-semibold">Informasi Jabatan</h2>
            <Separator className="my-3" />
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="jabatan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jabatan</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan jabatan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instansi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instansi</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan instansi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormError message={error} />
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <LoaderCircle className="w-4 h-4 animate-spin" />}
              Simpan
            </Button>
          </CardFooter>
        </Card>

      </form>
    </Form>
  );
}
