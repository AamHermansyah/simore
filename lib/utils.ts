import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { submitTimes } from "./constants";
import { addDays, startOfWeek } from "date-fns";
import { StatusLaporan } from "./generated/prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDayName(day: number): string {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  return days[day] || "Hari tidak valid";
}

export function calculateRewardPoint(now: Date) {
  const hour = now.getHours();

  if (hour < submitTimes.start || hour > submitTimes.end) {
    return 0; // di luar waktu submit → tidak ada poin
  }

  // Hitung selisih jam dari jam mulai
  const diff = (hour - submitTimes.start) - submitTimes.start;

  // Poin = maxPoint - (diff * step)
  const point = submitTimes.maxPoint - diff * submitTimes.step;

  // Jangan sampai negatif
  return Math.max(point, 0);
}

export const getWeekRange = (now: Date) => {
  // Cari awal minggu sesuai submitTimes.day
  const weekStart = startOfWeek(now, { weekStartsOn: submitTimes.day });
  const weekEnd = addDays(weekStart, 6);

  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const month = weekStart.toLocaleDateString("id-ID", { month: "short" });

  return `${startDay} - ${endDay} ${month}`;
};

export const getStatusLaporanVariant = (status: StatusLaporan) => {
  switch (status) {
    case 'DITOLAK':
      return 'destructive';
    case 'DIVERIFIKASI':
      return 'success';
    case 'TERKIRIM':
      return 'secondary';
    case 'TERLEWAT':
      return 'default';
    default:
      return 'outline';
  }
}

export const getWeekStartEnd = (now: Date) => {
  const weekStart = startOfWeek(now, { weekStartsOn: submitTimes.day });
  const weekEnd = addDays(weekStart, 6);
  return { weekStart, weekEnd };
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}