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
