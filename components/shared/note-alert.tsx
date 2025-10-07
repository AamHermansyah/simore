"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Info, CheckCircle2, XCircle, Clock, AlertTriangle, ShieldCheck } from "lucide-react"

export default function NoteAlert() {
  const notes = [
    {
      icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      title: "Poin Verifikasi",
      desc: "Setiap pelaporan yang terverifikasi akan mendapatkan poin beragam sesuai kecepatan submit dengan maksimal 200 poin.",
      badge: "+200 XP",
      badgeColor: "bg-green-100 text-green-700"
    },
    {
      icon: <XCircle className="w-5 h-5 text-yellow-600" />,
      title: "Laporan Ditolak (Masih Bisa Submit Ulang)",
      desc: "Jika laporan ditolak dan waktu submit masih dibuka, maka masih bisa melakukan submit ulang dengan ketentuan poin yang didapatkan berkurang 50% dari seharusnya.",
      badge: "Poin berkurang",
      badgeColor: "bg-yellow-100 text-yellow-700"
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      title: "Laporan Ditolak (Tidak Submit Ulang)",
      desc: "Jika laporan ditolak dan tidak dilakukan submit ulang, maka poin akan berkurang 75 XP dengan pengecekan setiap pukul 18:00 hari Rabu.",
      badge: "-75 XP",
      badgeColor: "bg-red-100 text-red-700"
    },
    {
      icon: <Clock className="w-5 h-5 text-orange-600" />,
      title: "Laporan Terlewat",
      desc: "Laporan yang terlewat akan mendapatkan pengurangan poin sebesar 100 XP.",
      badge: "-100 XP",
      badgeColor: "bg-orange-100 text-orange-700"
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
      title: "Laporan Belum Diverifikasi",
      desc: "Jika laporan terkirim dan tidak diverifikasi oleh guru sampai hari Selasa pukul 23:59, maka akan dinyatakan terverifikasi otomatis dan mendapatkan poin semestinya.",
      badge: "Auto Verified",
      badgeColor: "bg-blue-100 text-blue-700"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Info className="w-5 h-5 text-primary" />
          Catatan Penting Laporan
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="space-y-4">
          {notes.map((note, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl border bg-muted/40 hover:bg-muted/70 transition"
            >
              <div>{note.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{note.title}</h3>
                  <Badge className={`${note.badgeColor} font-medium`}>
                    {note.badge}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {note.desc}
                </p>
              </div>
            </div>
          ))}

          <Separator className="my-6" />

          <div className="p-4 rounded-xl border bg-blue-50 text-blue-700 text-sm flex items-start gap-2">
            <Info className="w-5 h-5 mt-0.5" />
            <p>
              Seluruh <b>poin akan direset setiap 3 bulan sekali</b> pada tanggal 1 bulan <b>Januari, April, Juli, dan Oktober</b>.
              Pastikan selalu mengumpulkan laporan tepat waktu untuk menjaga XP anda tetap tinggi!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
