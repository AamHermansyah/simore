import { JWT_SECRET, JwtPayload, verifyJwt } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface GetAllSekolahProps {
  q?: string;
  page: number;
  limit: number;
}

export async function getAllSekolah({ q, page, limit }: GetAllSekolahProps) {
  try {
    const skip = (page - 1) * limit

    const where: Prisma.SekolahWhereInput = q
      ? {
        OR: [
          { nama: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { nspn: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { email: { contains: q, mode: Prisma.QueryMode.insensitive } },
        ],
      }
      : {}

    const [data, total] = await Promise.all([
      prisma.sekolah.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.sekolah.count({ where }),
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

export async function getSekolah() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // 1. Verifikasi token
    const decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload;
    if (!decoded?.id) {
      throw new Error("Token tidak valid");
    }

    // 2. Cari super admin
    const sekolah = await prisma.sekolah.findUnique({
      where: { id: decoded.id },
    });

    if (!sekolah) {
      throw new Error("Sekolah tidak ditemukan");
    }

    // 3. Hitung total data
    const [totalSiswi, totalGuru, totalAngkatan] = await Promise.all([
      prisma.siswi.count({ where: { status: true, sekolahId: sekolah.id } }),
      prisma.guru.count({ where: { status: true, sekolahId: sekolah.id } }),
      prisma.angkatan.count({ where: { status: true, sekolahId: sekolah.id } }),
    ]);

    // 4. Return data
    return {
      success: true,
      data: {
        sekolah,
        totalSiswi,
        totalGuru,
        totalAngkatan,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Terjadi kesalahan",
    };
  }
}

export async function getSekolahSummary(id?: string) {
  try {
    let sekolahId = id;

    if (!sekolahId) {
      const c = await cookies();
      const token = c.get("token")?.value || null;

      const decoded = verifyJwt(token || "") as JwtPayload | null;
      if (!decoded) {
        return {
          success: false,
          message: "Token invalid",
        };
      }

      sekolahId = decoded.id;
    }

    // Ambil sekolah + data guru + siswi
    const sekolah = await prisma.sekolah.findUnique({
      where: { id: sekolahId },
      select: {
        nama: true,
        email: true,
        nspn: true,
        jenjang: true,
        guru: {
          select: { id: true, nama: true },
        },
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
    });

    if (!sekolah) {
      throw new Error("Sekolah tidak ditemukan");
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Jalankan query paralel
    const [laporanAll, totalAngkatan] = await Promise.all([
      prisma.laporan.findMany({
        where: {
          siswi: { sekolahId: sekolahId },
          createdAt: {
            gte: sixMonthsAgo,
          },
        },
        select: {
          id: true,
          status: true,
          siswiId: true,
          rewardPoint: true,
          createdAt: true,
        },
      }),
      prisma.angkatan.count({
        where: { sekolahId: sekolahId },
      }),
    ]);

    // Statistik dasar
    const totalGuru = sekolah.guru.length;
    const totalSiswi = sekolah.siswi.length;

    let totalPoinSiswi = 0;
    let totalCurrentStreak = 0;
    let totalBestStreak = 0;
    let totalVerified = 0;
    let totalTidakMelapor = 0;

    sekolah.siswi.forEach((s) => {
      totalPoinSiswi += s.poin;
      totalCurrentStreak += s.currentStreak;
      totalBestStreak += s.bestStreak;
    });

    laporanAll.forEach((l) => {
      if (l.status === "DIVERIFIKASI") totalVerified++;
      if (l.status === "TERLEWAT") totalTidakMelapor++;
    });

    const totalLaporan = laporanAll.length;
    const kepatuhan =
      totalLaporan > 0 ? Math.round((totalVerified / totalLaporan) * 100) : 0;
    const avgPoinSiswi =
      totalSiswi > 0 ? Math.round(totalPoinSiswi / totalSiswi) : 0;
    const avgCurrentStreak =
      totalSiswi > 0 ? Number(totalCurrentStreak / totalSiswi).toFixed(2) : 0;
    const avgBestStreak =
      totalSiswi > 0 ? Number(totalBestStreak / totalSiswi).toFixed(2) : 0;

    return {
      success: true,
      data: {
        nama: sekolah.nama,
        email: sekolah.email,
        nspn: sekolah.nspn,
        jenjang: sekolah.jenjang,
        totalAngkatan,
        totalGuru,
        totalSiswi,
        totalLaporan,
        totalVerified,
        totalTidakMelapor,

        kepatuhan,
        totalPoinSiswi,
        avgPoinSiswi,
        avgCurrentStreak,
        avgBestStreak,

        laporan: laporanAll, // id, status, siswiId, rewardPoint, createdAt
      },
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}

export async function getSekolahList() {
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

    let sekolahList: { id: string; nama: string }[] = []

    switch (decoded.role) {
      case "SISWI": {
        const siswi = await prisma.siswi.findUnique({
          where: { id: decoded.id },
          select: {
            sekolah: {
              select: { id: true, nama: true },
            },
          },
        })
        if (siswi?.sekolah) {
          sekolahList = [siswi.sekolah]
        }
        break
      }

      case "GURU": {
        const guru = await prisma.guru.findUnique({
          where: { id: decoded.id },
          select: {
            sekolah: {
              select: { id: true, nama: true },
            },
          },
        })
        if (guru?.sekolah) {
          sekolahList = [guru.sekolah]
        }
        break
      }

      case "SEKOLAH": {
        const sekolah = await prisma.sekolah.findUnique({
          where: { id: decoded.id },
          select: { id: true, nama: true },
        })
        if (sekolah) {
          sekolahList = [sekolah]
        }
        break
      }

      case "PUSKESMAS": {
        const sekolahs = await prisma.puskesmasSekolah.findMany({
          where: { puskesmasId: decoded.id },
          select: {
            sekolah: { select: { id: true, nama: true } },
          },
          orderBy: {
            sekolah: {
              nama: "asc",
            },
          },
        })
        sekolahList = sekolahs.map((s) => s.sekolah)
        break
      }

      case "SUPERADMIN": {
        sekolahList = await prisma.sekolah.findMany({
          select: { id: true, nama: true },
          orderBy: { nama: "asc" },
        })
        break
      }
    }

    return {
      success: true,
      data: sekolahList,
    }
  } catch (error) {
    console.error("Error getSekolahList:", error)
    return {
      success: false,
      message: "Gagal mengambil data sekolah",
    }
  }
}