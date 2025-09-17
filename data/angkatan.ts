import { Prisma } from "@/lib/generated/prisma"
import prisma from "@/lib/prisma"

interface GetAllAngkatanProps {
  q?: string;
  page: number;
  limit: number;
  sekolahId: string;
}

export async function getAllAngkatan({ q, page, limit, sekolahId }: GetAllAngkatanProps) {
  try {
    const skip = (page - 1) * limit

    const where: Prisma.AngkatanWhereInput = {
      sekolahId,
      ...(q && {
        nama: { contains: q, mode: Prisma.QueryMode.insensitive },
      }),
    };

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
              nama: true
            }
          },
          _count: {
            select: { siswi: true }
          }
        }
      }),
      prisma.angkatan.count({ where }),
    ]);

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
