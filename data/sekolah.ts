import { JWT_SECRET, JwtPayload } from "@/lib/auth";
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
      throw new Error("Super admin tidak ditemukan");
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