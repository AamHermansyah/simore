import React from "react";
import LaporanLayout from "../_layouts/laporan-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Timer } from "lucide-react";
import { submitTimes } from "@/lib/constants";
import { getDayName } from "@/lib/utils";
import { cookies } from "next/headers";
import { JWT_SECRET, JwtPayload } from "@/lib/auth";
import jwt from 'jsonwebtoken';
import prisma from "@/lib/prisma";
import { addDays, setHours, setMinutes, setSeconds, startOfWeek } from "date-fns";
import { Laporan } from "@/lib/generated/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function SiswiLaporanPage() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const targetDay = day === submitTimes.day;
  const isWithinTime = hour >= submitTimes.start && hour < submitTimes.end;
  let canAccess = targetDay && isWithinTime;
  let hasSubmited = false;
  let laporan: Laporan | null;

  if (canAccess) {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;

      const decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload;
      if (!decoded?.id) {
        throw new Error("Token tidak valid");
      }

      // Cari hari sabtu minggu ini
      const weekStart = startOfWeek(now, { weekStartsOn: 0 });
      const thisIsTargetDay = addDays(weekStart, submitTimes.day);

      // Batas waktu mulai & selesai laporan
      const startTime = setSeconds(
        setMinutes(setHours(thisIsTargetDay, submitTimes.start), 0),
        0
      );

      const endTime = setSeconds(
        setMinutes(setHours(thisIsTargetDay, submitTimes.end), 0),
        0
      );

      laporan = await prisma.laporan.findFirst({
        where: {
          siswiId: decoded.id,
          createdAt: {
            gte: startTime,
            lte: endTime,
          },
        },
      });

      if (laporan && (laporan.status !== 'TERLEWAT')) {
        hasSubmited = true;
        canAccess = false;
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  return (
    <>
      {canAccess ? (
        <LaporanLayout />
      ) : hasSubmited ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {laporan!.status === 'DITOLAK' ? (
            <Card>
              <CardContent className="max-w-lg text-center">
                <div className="flex items-center justify-center mb-4">
                  <Timer className="size-16 mx-auto text-destructive" />
                </div>
                <h1 className="text-xl font-extrabold text-destructive mb-3">
                  Laporan Ditolak ❌
                </h1>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Keterangan yang kamu kirim <span className="font-semibold">ditolak</span>.
                  Jangan khawatir, kamu masih bisa memperbarui laporanmu.
                </p>
                <div className="bg-destructive text-white text-center border rounded-xl p-4 mb-6 space-y-2">
                  <p className="font-semibold">Segera perbaiki buktinya!</p>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  Pastikan keterangan yang kamu masukkan sesuai agar laporan dapat diterima. Poin yang didapatkan akan berkurang 50%!
                </p>
                <div className="mt-4">
                  <Link href="/siswi/laporan/update">
                    <Button variant="secondary" className="w-full">
                      Update Laporan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="max-w-lg text-center">
                <div className="flex items-center justify-center mb-4">
                  <Timer className="size-16 mx-auto text-sky-500" />
                </div>
                <h1 className="text-xl font-extrabold text-sky-600 mb-3">
                  Laporan Terkirim 🎉
                </h1>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Kamu sudah mengirim laporan untuk hari ini.
                </p>
                <div className="bg-sky-500 text-white text-center border rounded-xl p-4 mb-6 space-y-2">
                  <p className="font-semibold">Terima kasih atas kedisiplinanmu!</p>
                  <span className="block text-2xl font-bold">+{laporan!.rewardPoint} Poin</span>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  Silakan kembali minggu depan untuk mengirim laporan berikutnya.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <Card>
            <CardContent className="max-w-lg text-center">
              <div className="flex items-center justify-center mb-4">
                <Timer className="size-16 mx-auto" />
              </div>
              <h1 className="text-xl font-extrabold text-destructive mb-3">
                Pelaporan Belum Dimulai
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Waktu pelaporan hanya dibuka pada:
              </p>
              <div className="bg-primary text-primary-foreground text-center border rounded-xl p-4 mb-6">
                <p className="font-semibold">
                  Setiap {getDayName(submitTimes.day)}
                </p>
                <p className="font-semibold">
                  Pukul {submitTimes.start}.00 - {submitTimes.end}.00 WIB
                </p>
              </div>
              <p className="text-sm text-muted-foreground italic">
                Silakan kembali sesuai jadwal. Jangan sampai terlewat! 😉
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default SiswiLaporanPage;
