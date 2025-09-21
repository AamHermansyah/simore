"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { FormError } from "@/components/shared/form-error"
import { Angkatan, Siswi } from "@/lib/generated/prisma"
import { ProfileFormValues, profileSchema } from "@/lib/schemas/siswi"
import { editSiswi } from "@/actions/siswi"
import DatePicker from "@/components/core/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface IProps {
  data: Siswi
  onCancel: () => void
  onSuccess: (data: Siswi & { angkatan: Angkatan | null }) => void
}

export function ProfileEditForm({ data, onCancel, onSuccess }: IProps) {
  const [loading, startServer] = useTransition()
  const [error, setError] = useState("")

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nama: data.nama,
      nisn: data.nisn,
      email: data.email || "",
      nomorTelepon: data.nomorTelepon || "",
      alamat: data.alamat || "",
      tanggalLahir: data.tanggalLahir
        ? format(data.tanggalLahir, "yyyy-MM-dd")
        : "",
      jurusan: data.jurusan || "",
      golonganDarah: data.golonganDarah || "",
      namaOrtu: data.namaOrtu || "",
      nomorTeleponOrtu: data.nomorTeleponOrtu || "",
    },
  })

  function onSubmit(values: ProfileFormValues) {
    setError("")

    startServer(async () => {
      const res = await editSiswi(values)
      if (res.success) {
        toast.success("Profil siswi berhasil diperbarui")
        onSuccess(res.data!)
      } else setError(res.message!)
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6"
      >
        {/* Informasi Pribadi */}
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
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama siswi" {...field} />
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
                      <Input placeholder="Masukkan NISN" {...field} />
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
                      <Input type="email" placeholder="Masukkan email" {...field} />
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
                    <FormLabel>No. Telepon</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Masukkan nomor telepon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tanggalLahir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <FormControl>
                      <DatePicker
                        id="tanggalLahir"
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) => field.onChange(date?.toISOString() || '')}
                        disabled={field.disabled}
                        disabledDate={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        endMonth={new Date()}
                      />
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
                      <Textarea rows={3} placeholder="Masukkan alamat" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="golonganDarah"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Golongan Darah</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih golongan darah" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="AB">AB</SelectItem>
                        <SelectItem value="O">O</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Informasi Akademik */}
        <div className="space-y-6">
          <Card>
            <CardContent>
              <h2 className="font-semibold">Informasi Akademik</h2>
              <Separator className="my-3" />
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="jurusan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jurusan</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan jurusan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="namaOrtu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Orang Tua</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama orang tua" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nomorTeleponOrtu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon Orang Tua</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Masukkan nomor telepon orang tua"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
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
  )
}
