import { JWT_SECRET, JwtPayload } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface GetAllSiswiProps {
  q?: string;
  page: number;
  limit: number;
  sekolahId: string;
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
