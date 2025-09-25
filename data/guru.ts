import { JWT_SECRET, JwtPayload, verifyJwt } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface GetAllGuruProps {
  q?: string;
  page: number;
  limit: number;
  sekolahId: string;
}

export async function getAllGuru({ q, page, limit, sekolahId }: GetAllGuruProps) {
  try {
    const skip = (page - 1) * limit

    const where: Prisma.GuruWhereInput = {
      sekolahId,
      ...(q && {
        nama: { contains: q, mode: Prisma.QueryMode.insensitive },
      }),
    };

    const [data, total] = await Promise.all([
      prisma.guru.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          angkatan: true
        }
      }),
      prisma.guru.count({ where }),
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

export async function getGuru() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload
    if (!decoded?.id) {
      throw new Error("Token tidak valid")
    }

    const guru = await prisma.guru.findUnique({
      where: { id: decoded.id },
    })

    if (!guru) {
      throw new Error("Guru tidak ditemukan")
    }

    const sekolahId = guru.sekolahId

    // Jalankan query paralel agar efisien
    const [totalSiswi, totalSiswiAktif, totalAngkatan] = await Promise.all([
      // Semua siswi dari angkatan yang diampu guru ini
      prisma.siswi.count({
        where: {
          angkatan: {
            guruId: guru.id,
            sekolahId: sekolahId,
          },
        },
      }),

      // Hanya siswi aktif dari angkatan yang diampu guru ini
      prisma.siswi.count({
        where: {
          status: true,
          angkatan: {
            guruId: guru.id,
            sekolahId: sekolahId,
          },
        },
      }),

      // Angkatan yang diampu guru ini
      prisma.angkatan.count({
        where: {
          sekolahId: sekolahId,
          guruId: guru.id,
        },
      }),
    ]);

    return {
      success: true,
      data: {
        guru,
        totalSiswi,
        totalSiswiAktif,
        totalAngkatan,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Terjadi kesalahan",
    }
  }
}

export async function getGuruSummary() {
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

    // Ambil guru dan angkatan yang diampu
    const guru = await prisma.guru.findUnique({
      where: { id: decoded.id },
      select: {
        nama: true,
        email: true,
        nip: true,
        angkatan: {
          select: {
            id: true,
            nama: true,
            siswi: {
              select: {
                id: true,
                nama: true,
                poin: true,
                currentStreak: true,
                bestStreak: true,
              },
            },
          },
        },
      },
    });

    if (!guru) {
      throw new Error("Guru tidak ditemukan");
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const laporanAll = await prisma.laporan.findMany({
      where: {
        siswi: { angkatan: { guruId: decoded.id } },
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        id: true,
        status: true,
        siswiId: true,
        rewardPoint: true,
        createdAt: true
      },
    });

    // Statistik dasar
    let totalSiswi = 0;
    let totalPoinSiswi = 0;
    let totalCurrentStreak = 0;
    let totalBestStreak = 0;
    let totalVerified = 0;
    let totalTidakMelapor = 0;

    // Hitung total siswi & streak/poin
    guru.angkatan.forEach((angkatan) => {
      totalSiswi += angkatan.siswi.length;
      angkatan.siswi.forEach((s) => {
        totalPoinSiswi += s.poin;
        totalCurrentStreak += s.currentStreak;
        totalBestStreak += s.bestStreak;
      });
    });

    // Hitung kepatuhan & tidak melapor
    laporanAll.forEach((l) => {
      if (l.status === "DIVERIFIKASI") totalVerified++;
      if (l.status === "TERLEWAT") totalTidakMelapor++;
    });

    const totalLaporan = laporanAll.length;
    const kepatuhan =
      totalLaporan > 0 ? Math.round((totalVerified / totalLaporan) * 100) : 0;
    const avgCurrentStreak =
      totalSiswi > 0 ? Number(totalCurrentStreak / totalSiswi).toFixed(2) : 0;
    const avgBestStreak =
      totalSiswi > 0 ? Number(totalBestStreak / totalSiswi).toFixed(2) : 0;
    const avgPoinSiswi =
      totalSiswi > 0 ? Math.round(totalPoinSiswi / totalSiswi) : 0;

    return {
      success: true,
      data: {
        nama: guru.nama,
        email: guru.email,
        nip: guru.nip,
        totalAngkatan: guru.angkatan.length,
        totalSiswi,
        totalLaporan,
        totalVerified,
        totalTidakMelapor,
        kepatuhan,
        totalPoinSiswi,
        avgPoinSiswi,
        avgCurrentStreak,
        avgBestStreak,
        laporan: laporanAll, // id, status, siswiId
      },
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}