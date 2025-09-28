import React from 'react'
import { submitTimes } from "@/lib/constants";
import { cookies } from "next/headers";
import { JWT_SECRET, JwtPayload } from "@/lib/auth";
import jwt from 'jsonwebtoken';
import prisma from "@/lib/prisma";
import { addDays, setHours, setMinutes, setSeconds, startOfWeek } from "date-fns";
import { Laporan } from "@/lib/generated/prisma";
import { redirect, RedirectType } from 'next/navigation';
import LaporanUpdateLayout from '../../_layouts/laporan-update-layout';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock, Info, XCircle } from 'lucide-react';

async function SiswiUpdateLaporan() {
  function isWithinAccessTime(date: Date): boolean {
    const day = date.getDay();
    const hour = date.getHours();

    // Kamis mulai jam 06:00
    if (day === 4 && hour >= 6) return true;

    // Jumat, Sabtu, Minggu, Senin → akses penuh
    if ([5, 6, 0, 1].includes(day)) return true;

    // Selasa sampai jam 21:00
    if (day === 2 && hour <= 21) return true;

    return false;
  }

  const now = new Date();

  const canAccess = isWithinAccessTime(now);
  let laporan: Laporan | null = null;

  if (canAccess) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload;
    if (!decoded?.id) {
      throw new Error("Token tidak valid");
    }

    // Cari hari sabtu minggu ini
    const weekStart = startOfWeek(now, { weekStartsOn: 0 }); // minggu = 0
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
  }

  if (!canAccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Card className="max-w-lg mx-auto text-center">
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-4">
              <Clock className="size-16 text-orange-500" />
            </div>
            <h1 className="text-xl font-extrabold text-orange-500 mb-3">
              Update Pelaporan Belum Dibuka
            </h1>
            <div className="bg-muted text-center border rounded-xl p-4 mb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Waktu update pelaporan hanya dibuka pada{" "}
                <span className="font-semibold">Kamis 06:00</span> sampai{" "}
                <span className="font-semibold">Selasa 21:00</span>.
                Silakan kembali sesuai jadwal.
              </p>
            </div>
            <p className="text-sm text-muted-foreground italic">
              Tetap konsisten ya! Disiplin adalah kunci keberhasilan 🚀
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!laporan || laporan.status !== 'DITOLAK') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Card>
          <CardContent className="max-w-lg text-center">
            <div className="flex items-center justify-center mb-4">
              <XCircle className="size-16 text-orange-500 mx-auto" />
            </div>
            <h1 className="text-xl font-extrabold text-orange-500 mb-3">
              Tidak Ada Laporan Ditolak
            </h1>
            <div className="bg-muted text-center border rounded-xl p-4 mb-4">
              <p className="text-sm text-muted-foreground">
                Minggu ini tidak ada laporan dengan status{" "}
                <span className="font-semibold text-orange-500">ditolak</span>.
              </p>
            </div>
            <p className="text-sm text-muted-foreground italic">
              Tetap konsisten ya! Disiplin adalah kunci keberhasilan 🚀
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <LaporanUpdateLayout keluhan={laporan!.keluhan} />
  )
}

export default SiswiUpdateLaporan