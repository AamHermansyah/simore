import { JWT_SECRET, JwtPayload } from "@/lib/auth";
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
