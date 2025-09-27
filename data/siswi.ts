import { JWT_SECRET, JwtPayload, verifyJwt } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface GetAllSiswiProps {
  q?: string;
  page: number;
  limit: number;
  sekolahId?: string;
  status?: '0' | '1';
  angkatanId?: string;
}

export async function getAllSiswi({ q, page, limit, sekolahId, angkatanId, status }: GetAllSiswiProps) {
  try {
    const skip = (page - 1) * limit

    const where: Prisma.SiswiWhereInput = {
      sekolahId,
      angkatanId,
      ...(q && {
        OR: [
          { nama: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { nisn: { contains: q, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
      ...(status !== undefined && {
        status: Boolean(+status),
      }),
    }

    const [data, total] = await Promise.all([
      prisma.siswi.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          angkatan: true,
          _count: {
            select: { laporan: true }
          }
        }
      }),
      prisma.siswi.count({ where }),
    ])

    return {
      success: true,
      data: {
        items: data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message
    }
  }
}

export async function getSiswi() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload
    if (!decoded?.id) {
      throw new Error("Token tidak valid")
    }

    const siswi = await prisma.siswi.findUnique({
      where: { id: decoded.id },
      include: { angkatan: true }
    })

    if (!siswi) {
      throw new Error("Siswi tidak ditemukan")
    }

    return {
      success: true,
      data: siswi
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Terjadi kesalahan",
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

export async function getSiswiRanking(
  angkatanId?: string,
  sekolahId?: string
) {
  try {
    if (!sekolahId) {
      throw new Error("sekolahId wajib diisi")
    }

    let siswiList

    if (angkatanId) {
      // Ranking per angkatan
      siswiList = await prisma.siswi.findMany({
        where: { angkatanId },
        select: {
          id: true,
          nama: true,
          angkatan: { select: { nama: true } },
          poin: true,
          bestStreak: true,
        },
        orderBy: { poin: "desc" },
        take: 99,
      })
    } else {
      // Ranking per sekolah
      siswiList = await prisma.siswi.findMany({
        where: { angkatan: { sekolahId } },
        select: {
          id: true,
          nama: true,
          angkatan: { select: { nama: true } },
          poin: true,
          bestStreak: true,
        },
        orderBy: { poin: "desc" },
        take: 99,
      })
    }

    return {
      success: true,
      data: siswiList.map((s, i) => ({
        id: s.id,
        rank: i + 1,
        nama: s.nama,
        angkatan: s.angkatan!.nama,
        totalPoint: s.poin,
        bestStrike: s.bestStreak,
      })),
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Terjadi kesalahan",
    }
  }
}