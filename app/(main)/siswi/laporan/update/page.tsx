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

async function SiswiUpdateLaporan() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const targetDay = day === submitTimes.day;
  const isWithinTime = hour >= submitTimes.start && hour < submitTimes.end;

  const canAccess = targetDay && isWithinTime;
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

      if (!laporan || (laporan.status !== 'DITOLAK')) {
        return redirect('/404', 'repalce' as RedirectType);
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  } else {
    return redirect('/404', 'repalce' as RedirectType);
  }

  return (
    <LaporanUpdateLayout
      laporanId={laporan!.id}
      keluhan={laporan!.keluhan}
    />
  )
}

export default SiswiUpdateLaporan