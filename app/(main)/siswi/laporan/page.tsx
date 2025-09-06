import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import CameraCapture from '@/components/core/camera-capture';

function SiswiNewReportPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Laporan Konsumsi TTD</h1>
        <p className="text-sm text-muted-foreground">
          Unggah foto bukti dan isi konfirmasi, hanya butuh ±1 menit.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Kolom kiri: Form */}
        <div className="col-span-12 lg:col-span-7">
          <Card>
            <CardContent>
              <form className="space-y-6">
                <div className="grid gap-2">
                  <Label>Foto Bukti</Label>
                  <CameraCapture />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="keluhan">Keluhan (opsional)</Label>
                  <Textarea
                    id="keluhan"
                    placeholder="Tulis keterangan atau keluhan..."
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <Button className="w-full">
                  Kirim Laporan
                </Button>
              </form>
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

          <Alert className="mt-4 bg-secondary rounded-xl py-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Tips cepat</AlertTitle>
            <AlertDescription>
              Minum TTD setelah makan untuk mengurangi rasa mual.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}

export default SiswiNewReportPage