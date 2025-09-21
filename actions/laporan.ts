"use server"

import prisma from "@/lib/prisma"
import z from "zod";
import { AddLaporanSchema } from "@/lib/schemas/laporan";
import { cookies } from "next/headers";
import { JwtPayload, verifyJwt } from "@/lib/auth";

import { startOfWeek, addDays, setHours, setMinutes, setSeconds } from "date-fns"
import { submitTimes } from "@/lib/constants";
import { calculateRewardPoint } from "@/lib/utils";

export async function addLaporan(
  values: Omit<AddLaporanSchema, "foto"> & { buktiGambar: string }
) {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const targetDay = day === submitTimes.day;
  const isWithinTime = hour >= submitTimes.start && hour < submitTimes.end;
  let canAccess = targetDay && isWithinTime;

  if (!canAccess) return {
    success: false,
    message: 'Batas waktu unggah laporan telah habis'
  }

  try {
    const c = await cookies()
    const token = c.get("token")?.value || null

    const decoded = verifyJwt(token || "") as JwtPayload | null
    if (!decoded) {
      return {
        success: false,
        message: "Token invalid",
      }
    }

    const parsed = z
      .object({
        keluhan: z.string().optional(),
        buktiGambar: z.string().min(1),
      })
      .safeParse(values)
    if (!parsed.success) {
      return {
        success: false,
        message: z.treeifyError(parsed.error).errors.join(", "),
      }
    }

    const data = parsed.data

    const now = new Date()

    // Cari sabtu minggu ini
    const weekStart = startOfWeek(now, { weekStartsOn: 0 })
    const thisIsTargetDay = addDays(weekStart, submitTimes.day)
    const startTime = setSeconds(setMinutes(setHours(thisIsTargetDay, submitTimes.start), 0), 0)
    const endTime = setSeconds(setMinutes(setHours(thisIsTargetDay, submitTimes.end), 0), 0)

    // Cari laporan yang sudah ada untuk siswi ini di minggu ini
    const existing = await prisma.laporan.findFirst({
      where: {
        siswiId: decoded.id,
        createdAt: {
          gte: startTime,
          lte: endTime,
        },
      },
    })

    if (existing) {
      return {
        success: false,
        message: "Kamu sudah mengirim laporan minggu ini!",
      }
    }

    const rewardPoint = calculateRewardPoint(now);

    const laporan = await prisma.laporan.create({
      data: {
        buktiGambar: data.buktiGambar,
        status: "TERKIRIM",
        keluhan: data.keluhan,
        siswiId: decoded.id,
        rewardPoint
      },
    })

    return {
      success: true,
      data: laporan,
      message: "Berhasil mengunggah laporan",
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    }
  }
}

export async function updateLaporan(
  values: Omit<AddLaporanSchema, "foto"> & { buktiGambar: string },
  id: string
) {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const targetDay = day === submitTimes.day;
  const isWithinTime = hour >= submitTimes.start && hour < submitTimes.end;
  let canAccess = targetDay && isWithinTime;

  if (!canAccess) return {
    success: false,
    message: 'Batas waktu unggah laporan telah habis'
  }

  try {
    const c = await cookies()
    const token = c.get("token")?.value || null

    const decoded = verifyJwt(token || "") as JwtPayload | null
    if (!decoded) {
      return {
        success: false,
        message: "Token invalid",
      }
    }

    const parsed = z
      .object({
        keluhan: z.string().optional(),
        buktiGambar: z.string().min(1),
      })
      .safeParse(values)
    if (!parsed.success) {
      return {
        success: false,
        message: z.treeifyError(parsed.error).errors.join(", "),
      }
    }

    const data = parsed.data

    const now = new Date()

    // Cari sabtu minggu ini
    const weekStart = startOfWeek(now, { weekStartsOn: 0 })
    const thisIsTargetDay = addDays(weekStart, submitTimes.day)
    const startTime = setSeconds(setMinutes(setHours(thisIsTargetDay, submitTimes.start), 0), 0)
    const endTime = setSeconds(setMinutes(setHours(thisIsTargetDay, submitTimes.end), 0), 0)

    // Cari laporan yang sudah ada untuk siswi ini di minggu ini
    const existing = await prisma.laporan.findFirst({
      where: {
        siswiId: decoded.id,
        createdAt: {
          gte: startTime,
          lte: endTime,
        },
        status: 'DITOLAK'
      },
    })

    if (!existing) {
      return {
        success: false,
        message: "Perbaruan ditolak karena laporan tidak valid",
      }
    }

    const rewardPoint = Math.floor(calculateRewardPoint(now) / 2);

    const laporan = await prisma.laporan.update({
      where: { id: existing.id },
      data: {
        buktiGambar: data.buktiGambar,
        status: "TERKIRIM",
        keluhan: data.keluhan,
        rewardPoint
      },
    })

    return {
      success: true,
      data: laporan,
      message: "Berhasil memperbarui laporan",
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    }
  }
}

type UpdateStatusParams = {
  type: "approve" | "decline" | "edit-note";
  id: string;
  note?: string;
}

export async function updateStatusLaporan(params: UpdateStatusParams) {
  try {
    const { type, id, note } = params

    const laporan = await prisma.laporan.findUnique({
      where: { id },
      include: { siswi: true },
    })

    if (!laporan) {
      return { success: false, message: "Laporan tidak ditemukan" }
    }

    if (type === "edit-note") {
      await prisma.laporan.update({
        where: { id },
        data: { catatanGuru: note },
      })
    }

    if (type === "decline") {
      await prisma.laporan.update({
        where: { id },
        data: {
          status: "DITOLAK",
          catatanGuru: note,
        },
      })
    }

    if (type === "approve") {
      // Hitung streak
      const newCurrentStreak = (laporan.siswi.currentStreak ?? 0) + 1
      const newBestStreak = Math.max(
        laporan.siswi.bestStreak ?? 0,
        newCurrentStreak
      )

      // Update laporan & siswi
      await prisma.$transaction([
        prisma.laporan.update({
          where: { id },
          data: {
            status: "DIVERIFIKASI",
            catatanGuru: note,
          },
        }),
        prisma.siswi.update({
          where: { id: laporan.siswiId },
          data: {
            poin: laporan.siswi.poin + laporan.rewardPoint,
            currentStreak: newCurrentStreak,
            bestStreak: newBestStreak,
          },
        }),
      ])
    }

    return {
      success: true,
      message: `Laporan berhasil ${type === 'approve' ? 'diverifikasi' : 'diperbarui'}`
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message
    }
  }
}

export async function getSiswiSummary() {
  try {
    const c = await cookies()
    const token = c.get("token")?.value || null

    const decoded = verifyJwt(token || "") as JwtPayload | null
    if (!decoded) {
      return {
        success: false,
        message: "Token invalid",
      }
    }

    // 1. Ambil data siswi
    const siswi = await prisma.siswi.findUnique({
      where: { id: decoded.id },
      select: {
        nama: true,
        poin: true,
        bestStreak: true,
        currentStreak: true,
      },
    })

    if (!siswi) {
      throw new Error("Siswi tidak ditemukan")
    }

    // 2. Ambil semua laporan siswi ini
    const laporan = await prisma.laporan.findMany({
      where: { siswiId: decoded.id },
      select: { id: true, status: true, createdAt: true, rewardPoint: true },
      orderBy: { createdAt: "asc" },
    })

    // 4. Hitung kepatuhan & total tidak melapor
    const totalLaporan = laporan.length
    const totalTidakMelapor = laporan.filter(
      (l) => l.status === "TERLEWAT"
    ).length

    // Misalnya kepatuhan = laporan diverifikasi / total laporan * 100
    const totalVerified = laporan.filter(
      (l) => l.status === "DIVERIFIKASI"
    ).length
    const kepatuhan =
      totalLaporan > 0
        ? Math.round((totalVerified / totalLaporan) * 100)
        : 0

    return {
      success: true,
      data: {
        nama: siswi.nama,
        poin: siswi.poin,
        bestStreak: siswi.bestStreak,
        currentStreak: siswi.currentStreak,
        kepatuhan,
        totalTidakMelapor,
        laporan,
        totalLaporan: laporan.length
      },
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    }
  }
}