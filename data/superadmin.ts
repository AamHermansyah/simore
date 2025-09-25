import { JWT_SECRET, JwtPayload } from "@/lib/auth";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getSuperAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // 1. Verifikasi token
    const decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload;
    if (!decoded?.id) {
      throw new Error("Token tidak valid");
    }

    // 2. Cari super admin
    const superAdmin = await prisma.superAdmin.findUnique({
      where: { id: decoded.id },
    });

    if (!superAdmin) {
      throw new Error("Super admin tidak ditemukan");
    }

    // 3. Hitung total data
    const [totalSekolah, totalPuskesmas, totalSiswi] = await Promise.all([
      prisma.sekolah.count({ where: { status: true } }),
      prisma.puskesmas.count({ where: { status: true } }),
      prisma.siswi.count({ where: { status: true } }),
    ]);

    // 4. Return data
    return {
      success: true,
      data: {
        superAdmin,
        totalSekolah,
        totalPuskesmas,
        totalSiswi,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Terjadi kesalahan",
    };
  }
}

export async function getSuperAdminSummary() {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      totalSekolah,
      totalGuru,
      totalSiswi,
      totalAngkatan,
      laporan,
      laporanTerkirim,
      laporanDitolak,
      laporanDiverifikasi,
      laporanTerlewat,
      laporanPerBulan,
    ] = await Promise.all([
      // Hitung semua sekolah
      prisma.sekolah.count(),

      // Hitung semua guru
      prisma.guru.count(),

      // Hitung semua siswi
      prisma.siswi.count(),

      // Hitung semua angkatan
      prisma.angkatan.count(),

      // Ambil laporan 6 bulan terakhir
      prisma.laporan.findMany({
        where: {
          createdAt: {
            gte: sixMonthsAgo
          }
        }
      }),

      // Hitung laporan berdasarkan status
      prisma.laporan.count({ where: { status: "TERKIRIM" } }),
      prisma.laporan.count({ where: { status: "DITOLAK" } }),
      prisma.laporan.count({ where: { status: "DIVERIFIKASI" } }),
      prisma.laporan.count({ where: { status: "TERLEWAT" } }),

      // Statistik laporan per bulan
      prisma.laporan.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
    ])

    return {
      success: true,
      data: {
        totalSekolah,
        totalGuru,
        totalSiswi,
        totalAngkatan,
        totalLaporan: laporan.length,
        laporan: {
          terkirim: laporanTerkirim,
          ditolak: laporanDitolak,
          diverifikasi: laporanDiverifikasi,
          terlewat: laporanTerlewat,
          data: laporan
        },
        laporanPerBulan,
      },
    }
  } catch (error) {
    console.error("Error getSuperAdminSummary:", error)
    return {
      success: false,
      message: "Gagal mengambil data summary super admin",
    }
  }
}
