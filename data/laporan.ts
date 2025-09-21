import { Prisma, StatusLaporan } from "@/lib/generated/prisma"
import prisma from "@/lib/prisma"

interface GetAllLaporanProps {
  q?: string
  page: number
  limit: number
  sekolahId?: string
  angkatanId?: string
  siswiId?: string
  status?: StatusLaporan
}

export async function getAllLaporan({ q, page, limit, sekolahId, angkatanId, status, siswiId }: GetAllLaporanProps) {
  try {
    const skip = (page - 1) * limit

    const where: Prisma.LaporanWhereInput = {
      ...(status && { status: status }),
      ...(siswiId && { siswiId }),
      siswi: {
        ...(angkatanId && { angkatanId }),
        ...(sekolahId && { sekolahId }),
        ...(q && {
          OR: [
            { nama: { contains: q, mode: Prisma.QueryMode.insensitive } },
            { nisn: { contains: q, mode: Prisma.QueryMode.insensitive } },
          ],
        }),
      },
    }

    const [data, total] = await Promise.all([
      prisma.laporan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          siswi: {
            select: {
              id: true,
              nama: true,
              nisn: true,
              angkatan: {
                select: { id: true, nama: true }
              },
            },
          },
        },
      }),
      prisma.laporan.count({ where }),
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
      message: (error as Error).message,
    }
  }
}

