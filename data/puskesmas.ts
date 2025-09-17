import { Prisma } from "@/lib/generated/prisma"
import prisma from "@/lib/prisma"

interface GetAllPuskemasProps {
  q: string;
  page: number;
  limit: number;
}

export async function getAllPuskemas({ q, page, limit }: GetAllPuskemasProps) {
  try {
    const skip = (page - 1) * limit

    const where: Prisma.PuskesmasWhereInput = q
      ? { nama: { contains: q, mode: Prisma.QueryMode.insensitive } }
      : {}

    const [data, total] = await Promise.all([
      prisma.puskesmas.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          sekolahs: {
            include: {
              sekolah: {
                select: { id: true, nama: true }
              }
            },
          },
        },
      }),
      prisma.puskesmas.count({ where }),
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