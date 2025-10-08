"use client"

import React, { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import CameraCapture from "@/components/core/camera-capture"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import axios, { isAxiosError } from "axios"
import { FormError } from "@/components/shared/form-error"
import { LoaderCircle } from "lucide-react"
import { AddLaporanSchema, addLaporanSchema } from "@/lib/schemas/laporan"
import { addLaporan } from "@/actions/laporan"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

function LaporanForm() {
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

        const res = await addLaporan({
          keluhan: values.keluhan,
          buktiGambar: imageBase64
        });

        if (res.success) {
          toast.success(res.message);
          navigate.refresh();
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

  return (
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
  )
}

export default LaporanForm
