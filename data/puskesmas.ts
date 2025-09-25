import { JWT_SECRET, JwtPayload } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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

export async function getPuskesmas() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload
    if (!decoded?.id) {
      throw new Error("Token tidak valid")
    }

    const puskesmas = await prisma.puskesmas.findUnique({
      where: { id: decoded.id },
      include: {
        sekolahs: {
          select: {
            sekolah: {
              select: { id: true, nama: true },
            },
          },
        },
      },
    })

    if (!puskesmas) {
      throw new Error("Puskesmas tidak ditemukan")
    }

    const { sekolahs, ...profile } = puskesmas;

    // Ambil id sekolah yang dimonitor
    const sekolahIds = sekolahs.map((s) => s.sekolah.id)

    // Jalankan query paralel
    const [totalSekolah, totalSiswi] = await Promise.all([
      Promise.resolve(sekolahIds.length), // langsung dari relasi
      prisma.siswi.count({
        where: { sekolahId: { in: sekolahIds } },
      }),
    ]);

    return {
      success: true,
      data: {
        puskesmas: profile,
        totalSekolah,
        totalSiswi,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Terjadi kesalahan",
    }
  }
}