import { Prisma } from "@/lib/generated/prisma"
import prisma from "@/lib/prisma"
import { getWeekStartEnd } from "@/lib/utils";

interface GetAllAngkatanProps {
  q?: string;
  page: number;
  limit: number;
  sekolahId?: string;
  guruId?: string;
}

export async function getAllAngkatan({
  q,
  page,
  limit,
  sekolahId,
  guruId
}: GetAllAngkatanProps) {
  try {
    const skip = (page - 1) * limit

    const where: Prisma.AngkatanWhereInput = {
      sekolahId,
      guruId,
      ...(q && {
        nama: { contains: q, mode: Prisma.QueryMode.insensitive },
      }),
    }

    const { weekStart, weekEnd } = getWeekStartEnd(new Date());

    const [data, total] = await Promise.all([
      prisma.angkatan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          guru: {
            select: {
              id: true,
              nama: true,
            },
          },
          _count: {
            select: { siswi: true },
          },
          siswi: {
            select: {
              id: true,
              status: true,
              laporan: {
                where: {
                  createdAt: {
                    gte: weekStart,
                    lte: weekEnd,
                  },
                },
                take: 1,
                orderBy: { createdAt: "desc" },
                select: { status: true },
              },
            },
          },
        },
      }),
      prisma.angkatan.count({ where }),
    ]);

    const items = data.map((angkatan) => {
      const totalSiswi = angkatan._count.siswi
      const siswiAktif = angkatan.siswi.filter((s) => s.status)
      const totalSiswiAktif = siswiAktif.length

      const patuh = siswiAktif.filter(
        (s) => s.laporan[0]?.status === "DIVERIFIKASI"
      ).length

      const kepatuhan =
        totalSiswiAktif > 0
          ? Math.round((patuh / totalSiswiAktif) * 100)
          : 0

      return {
        id: angkatan.id,
        nama: angkatan.nama,
        guru: angkatan.guru,
        status: angkatan.status,
        totalSiswi,
        totalSiswiAktif,
        kepatuhan,
        createdAt: angkatan.createdAt,
      }
    })

    return {
      success: true,
      data: {
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error("getAllAngkatan error:", error)
    return {
      success: false,
      message: (error as Error).message,
    }
  }
}