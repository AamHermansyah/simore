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
import { Sekolah } from "@/lib/generated/prisma";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { FormError } from "@/components/shared/form-error";
import { LoaderCircle } from "lucide-react";
import { ProfileFormValues, profileSchema } from "@/lib/schemas/sekolah";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { editSekolah } from "@/actions/sekolah";

interface IProps {
  data: Sekolah;
  onCancel: () => void;
  onSuccess: (data: Sekolah) => void;
}

export function ProfileEditForm({ data, onCancel, onSuccess }: IProps) {
  const [loading, startServer] = useTransition();
  const [error, setError] = useState('');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nama: data.nama,
      akreditasi: (data.akreditasi as 'A' | 'B' | 'C') || '',
      email: data.email,
      nomorTeleponSekolah: data.nomorTeleponSekolah || '',
      website: data.website || '',
      alamatLengkap: data.alamatLengkap || '',
      namaKepalaSekolah: data.namaKepalaSekolah || '',
      nomorTeleponKepalaSekolah: data.nomorTeleponKepalaSekolah || '',
      namaKoordinator: data.namaKoordinator || '',
      nomorTeleponKoordinator: data.nomorTeleponKoordinator || '',
      nspn: data.nspn,
      wilayah: data.wilayah || ''
    },
  });

  function onSubmit(values: ProfileFormValues) {
    setError('');

    startServer(async () => {
      const res = await editSekolah(values);
      if (res.success) {
        toast.success('Profil sekolah berhasil diperbarui');
        onSuccess(res.data!);
      } else setError(res.message!);
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6"
      >
        {/* Informasi Sekolah */}
        <Card>
          <CardContent>
            <h2 className="font-semibold">Informasi Sekolah</h2>
            <Separator className="my-3" />
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Sekolah</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama sekolah" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="akreditasi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Akreditasi</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih akreditasi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
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
                  <FormItem>
                    <FormLabel>Email Sekolah</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan email sekolah" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nomorTeleponSekolah"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Telepon</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan no. telepon sekolah" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan alamat website" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wilayah"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wilayah</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan wilayah" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alamatLengkap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Lengkap</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="Masukkan alamat lengkap sekolah" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Kepala Sekolah */}
          <Card>
            <CardContent>
              <h2 className="font-semibold">Kepala Sekolah</h2>
              <Separator className="my-3" />
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="namaKepalaSekolah"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Kepala Sekolah</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama kepala sekolah" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nomorTeleponKepalaSekolah"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan no. telepon kepala sekolah" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormError message={error} />
              </div>
            </CardContent>
          </Card>

          {/* Koordinator Program */}
          <Card>
            <CardContent>
              <h2 className="font-semibold">Koordinator Program</h2>
              <Separator className="my-3" />
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="namaKoordinator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Koordinator</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama koordinator" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nomorTeleponKoordinator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan no. telepon koordinator" {...field} />
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
        </div>
      </form>
    </Form>
  );
}
