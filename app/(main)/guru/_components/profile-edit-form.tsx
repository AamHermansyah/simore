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
import { Guru } from "@/lib/generated/prisma"
import { ProfileFormValues, profileSchema } from "@/lib/schemas/guru"
import { editGuru } from "@/actions/guru"

interface IProps {
  data: Guru;
  onCancel: () => void;
  onSuccess: (data: Guru) => void;
}

export function ProfileEditForm({ data, onCancel, onSuccess }: IProps) {
  const [loading, startServer] = useTransition()
  const [error, setError] = useState("")

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nama: data.nama,
      nip: data.nip,
      email: data.email,
      nomorTelepon: data.nomorTelepon || "",
      alamat: data.alamat || "",
      posisi: data.posisi || "",
      pendidikanTerakhir: data.pendidikanTerakhir || "",
      universitas: data.universitas || "",
      tahunLulus: data.tahunLulus || "",
    },
  })

  function onSubmit(values: ProfileFormValues) {
    setError("")

    startServer(async () => {
      const res = await editGuru(values);
      if (res.success) {
        toast.success('Profil guru berhasil diperbarui');
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
                      <Input placeholder="Masukkan nama guru" {...field} />
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
            </div>
          </CardContent>
        </Card>

        {/* Informasi Profesional */}
        <div className="space-y-6">
          <Card>
            <CardContent>
              <h2 className="font-semibold">Informasi Profesional</h2>
              <Separator className="my-3" />
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="posisi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Posisi</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan posisi jabatan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pendidikanTerakhir"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pendidikan Terakhir</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan pendidikan terakhir" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="universitas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Universitas</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan universitas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tahunLulus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tahun Lulus</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Masukkan tahun lulus" {...field} />
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
