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
  time?:
  | "all"
  | "minggu-ini"
  | "bulan-ini"
  | "tahun-ini"
  | "7-hari-terakhir"
  | "30-hari-terakhir"
  | "365-hari-terakhir";
}

export async function getAllLaporan({
  q,
  page,
  limit,
  sekolahId,
  angkatanId,
  status,
  siswiId,
  time,
}: GetAllLaporanProps) {
  try {
    const skip = (page - 1) * limit;
    let dateFilter: Prisma.DateTimeFilter | undefined;

    if (time && time !== "all") {
      const now = new Date();

      const setToStartOfDay = (date: Date) => {
        date.setHours(0, 0, 0, 0);
        return date;
      };
      const setToEndOfDay = (date: Date) => {
        date.setHours(23, 59, 59, 999);
        return date;
      };

      switch (time) {
        // =====================
        // PERIODE BERJALAN
        // =====================
        case "minggu-ini": {
          // Kamis sebagai awal minggu
          const currentDay = now.getDay(); // Minggu=0, Senin=1, ..., Sabtu=6
          const offsetToThursday = ((currentDay - 4 + 7) % 7);
          const start = new Date(now);
          start.setDate(now.getDate() - offsetToThursday);
          setToStartOfDay(start);

          const end = new Date(start);
          end.setDate(start.getDate() + 6);
          setToEndOfDay(end);

          dateFilter = { gte: start, lte: end };
          break;
        }

        case "bulan-ini": {
          const start = setToStartOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
          const end = setToEndOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));
          dateFilter = { gte: start, lte: end };
          break;
        }

        case "tahun-ini": {
          const start = setToStartOfDay(new Date(now.getFullYear(), 0, 1));
          const end = setToEndOfDay(new Date(now.getFullYear(), 11, 31));
          dateFilter = { gte: start, lte: end };
          break;
        }

        // =====================
        // PERIODE TERAKHIR
        // =====================
        case "7-hari-terakhir": {
          const end = setToEndOfDay(now);
          const start = setToStartOfDay(new Date());
          start.setDate(now.getDate() - 6); // 7 hari terakhir (termasuk hari ini)
          dateFilter = { gte: start, lte: end };
          break;
        }

        case "30-hari-terakhir": {
          const end = setToEndOfDay(now);
          const start = setToStartOfDay(new Date());
          start.setDate(now.getDate() - 29); // 30 hari terakhir
          dateFilter = { gte: start, lte: end };
          break;
        }

        case "365-hari-terakhir": {
          const end = setToEndOfDay(now);
          const start = setToStartOfDay(new Date());
          start.setFullYear(now.getFullYear() - 1);
          start.setDate(start.getDate() + 1); // supaya tepat 365 hari
          dateFilter = { gte: start, lte: end };
          break;
        }
      }
    }

    // ======== Build kondisi WHERE utama ========
    const where: Prisma.LaporanWhereInput = {
      ...(status && { status }),
      ...(siswiId && { siswiId }),
      ...(dateFilter && { createdAt: dateFilter }),
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
    };

    // ======== Query ke database ========
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
              angkatan: { select: { id: true, nama: true } },
            },
          },
        },
      }),
      prisma.laporan.count({ where }),
    ]);

    return {
      success: true,
      data: {
        items: data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}