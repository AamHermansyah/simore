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