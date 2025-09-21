'use client'

import React, { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import CameraCapture from "@/components/core/camera-capture"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import axios, { isAxiosError } from "axios"
import { FormError } from "@/components/shared/form-error"
import { Info, LoaderCircle } from "lucide-react"
import { AddLaporanSchema, addLaporanSchema } from "@/lib/schemas/laporan"
import { updateLaporan } from "@/actions/laporan"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface IProps {
  laporanId: string;
  keluhan: string | null;
}

function LaporanUpdateLayout({ laporanId, keluhan }: IProps) {
  const [loading, startServer] = useTransition();
  const [error, setError] = useState('');
  const navigate = useRouter();

  const form = useForm<AddLaporanSchema>({
    resolver: zodResolver(addLaporanSchema),
    defaultValues: {
      foto: undefined,
      keluhan: "",
    },
  })

  function onSubmit(values: AddLaporanSchema) {
    setError('');

    startServer(async () => {
      try {
        const formData = new FormData()
        formData.append("file", values.foto!)
        formData.append("width", "600")
        formData.append("height", "900")

        const resImage = await axios.post("/api/compress-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })

        const imageBase64 = `data:image/png;base64,${resImage.data}`;

        const res = await updateLaporan({
          keluhan: values.keluhan,
          buktiGambar: imageBase64
        }, laporanId);

        if (res.success) {
          toast.success(res.message);
          navigate.push('/siswi/riwayat');
        } else setError(res.message);

      } catch (error) {
        if (isAxiosError(error)) {
          setError(JSON.stringify(error.response?.data) || error.message);
        } else {
          setError((error as Error).message || 'Internal Error');
        }
      }
    });
  }

  useEffect(() => {
    form.setValue('keluhan', keluhan || '');
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Laporan Konsumsi TTD</h1>
        <p className="text-sm text-muted-foreground">
          Unggah foto bukti dan isi konfirmasi, hanya butuh ±1 menit.
        </p>
      </div>

      <Alert className="mt-4 bg-primary/50 rounded-xl py-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Perhatian!</AlertTitle>
        <AlertDescription>
          Setiap perbaikan laporan yang ditolak akan menyebabkan pengurangan poin sebesar 50% dari yang seharusnya.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-12 gap-4">
        {/* Kolom kiri: Form */}
        <div className="col-span-12 lg:col-span-7">
          <Card>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                  {/* Foto Bukti */}
                  <FormField
                    control={form.control}
                    name="foto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Foto Bukti</FormLabel>
                        <FormControl>
                          <CameraCapture
                            onChange={(file) => field.onChange(file)}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Keluhan */}
                  <FormField
                    control={form.control}
                    name="keluhan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keluhan (opsional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Tulis keterangan atau keluhan..."
                            className="min-h-[100px] resize-none"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormError message={error} />

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <LoaderCircle className="w-4 h-4 animate-spin" />}
                    Kirim Laporan
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Kolom kanan: Panduan & Info */}
        <div className="col-span-12 lg:col-span-5">
          <Card className="py-4 gap-4">
            <CardHeader className="px-4">
              <CardTitle>Panduan Foto Benar</CardTitle>
              <CardDescription>Kualitas foto membantu verifikasi lebih cepat.</CardDescription>
            </CardHeader>
            <CardContent className="px-4">
              <ul className="list-disc space-y-1 pl-4 text-sm">
                <li>Ambil foto tablet + kemasan pada meja datar.</li>
                <li>Pencahayaan cukup, hindari blur.</li>
              </ul>
            </CardContent>
          </Card>

          <Alert className="mt-4 bg-secondary/50 rounded-xl py-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Tips cepat</AlertTitle>
            <AlertDescription>
              Minum tablet setelah makan untuk mengurangi rasa mual.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}

export default LaporanUpdateLayout