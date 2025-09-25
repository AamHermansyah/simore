import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { LoaderCircle } from "lucide-react"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { FormError } from "@/components/shared/form-error"
import { toast } from "sonner"
import { Puskesmas } from "@/lib/generated/prisma"
import { ProfileFormValues, profileSchema } from "@/lib/schemas/puskesmas"
import { editPuskesmas } from "@/actions/puskesmas"

interface IProps {
  data: Puskesmas;
  onCancel: () => void;
  onSuccess: (data: Puskesmas) => void;
}

export function ProfileEditForm({ data, onCancel, onSuccess }: IProps) {
  const [loading, startServer] = useTransition()
  const [error, setError] = useState("")

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nama: data.nama,
      nip: data.nip || "",
      email: data.email,
      nomorTelepon: data.nomorTelepon || "",
      alamat: data.alamat || "",
      website: data.website || "",
      wilayahKerja: data.wilayahKerja || "",
      namaKepalaPuskesmas: data.namaKepalaPuskesmas || "",
      nomorTeleponKepalaPuskesmas: data.nomorTeleponKepalaPuskesmas || "",
    },
  })

  function onSubmit(values: ProfileFormValues) {
    setError("")

    startServer(async () => {
      const res = await editPuskesmas(values);
      if (res.success) {
        toast.success("Profil puskesmas berhasil diperbarui")
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
        {/* Informasi Puskesmas */}
        <Card>
          <CardContent>
            <h2 className="font-semibold">Informasi Puskesmas</h2>
            <Separator className="my-3" />
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Puskesmas</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama puskesmas" {...field} />
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
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan website puskesmas" {...field} />
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
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="Masukkan alamat puskesmas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wilayahKerja"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wilayah Kerja</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan wilayah kerja puskesmas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Kepala Puskesmas */}
        <Card>
          <CardContent>
            <h2 className="font-semibold">Kepala Puskesmas</h2>
            <Separator className="my-3" />
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="namaKepalaPuskesmas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama" {...field} />
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
                name="nomorTeleponKepalaPuskesmas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Telepon</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Masukkan nomor telepon"
                        {...field}
                      />
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
  )
}