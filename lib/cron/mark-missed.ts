import cron from "node-cron";
import { addDays, setHours, setMinutes, setSeconds, startOfWeek } from "date-fns";
import { submitTimes } from "@/lib/constants";
import prisma from "../prisma";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * CRON 1: Mark TERLEWAT setiap Kamis jam 21:00
 */
cron.schedule("0 21 * * 4", async () => {
  try {
    const now = new Date();

    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const thisIsTargetDay = addDays(weekStart, submitTimes.day);

    const startTime = setSeconds(setMinutes(setHours(thisIsTargetDay, submitTimes.start), 0), 0);
    const endTime = setSeconds(setMinutes(setHours(thisIsTargetDay, submitTimes.end), 0), 0);

    const allSiswi = await prisma.siswi.findMany({
      select: { id: true, currentStreak: true, poin: true },
    });

    const batchSize = 100;
    for (let i = 0; i < allSiswi.length; i += batchSize) {
      const batch = allSiswi.slice(i, i + batchSize);
      const transactions: unknown[] = [];

      for (const siswi of batch) {
        const laporan = await prisma.laporan.findFirst({
          where: {
            siswiId: siswi.id,
            createdAt: {
              gte: startTime,
              lte: endTime,
            },
          },
        });

        if (!laporan) {
          // Tidak ada laporan → buat TERLEWAT
          transactions.push(
            prisma.laporan.create({
              data: {
                siswiId: siswi.id,
                status: "TERLEWAT",
                buktiGambar: "",
                rewardPoint: 0,
              },
            })
          );

          const currentPoin = siswi.poin ?? 0;
          const newPoin = Math.max(currentPoin - 100, 0);

          transactions.push(
            prisma.siswi.update({
              where: { id: siswi.id },
              data: {
                poin: newPoin,
                currentStreak: 0,
              },
            })
          );
        }
      }

      if (transactions.length > 0) {
        // @ts-expect-error sangat sulit untuk menulis tipe data transactions jadi dipaksa unknown
        await prisma.$transaction(transactions);
      }

      await sleep(200);
    }

    console.log("✅ Cron TERLEWAT selesai");
  } catch (err) {
    console.error("❌ Error mark TERLEWAT:", err);
  }
}, { timezone: 'Asia/Jakarta' });

/**
 * CRON 2: Reset streak untuk laporan DITOLAK setiap Rabu jam 18:00
 */
cron.schedule("0 18 * * 3", async () => {
  try {
    const now = new Date();

    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const thisIsTargetDay = addDays(weekStart, submitTimes.day);

    const startTime = setSeconds(setMinutes(setHours(thisIsTargetDay, submitTimes.start), 0), 0);
    const endTime = setSeconds(setMinutes(setHours(thisIsTargetDay, submitTimes.end), 0), 0);

    const allSiswi = await prisma.siswi.findMany({
      select: { id: true, poin: true },
    });

    const batchSize = 100;
    for (let i = 0; i < allSiswi.length; i += batchSize) {
      const batch = allSiswi.slice(i, i + batchSize);
      const transactions: unknown[] = [];

      for (const siswi of batch) {
        const laporan = await prisma.laporan.findFirst({
          where: {
            siswiId: siswi.id,
            createdAt: {
              gte: startTime,
              lte: endTime,
            },
            status: "DITOLAK",
          },
        });

        if (laporan) {
          transactions.push(
            prisma.siswi.update({
              where: { id: siswi.id },
              data: { currentStreak: 0 },
            })
          );

          const currentPoin = siswi.poin ?? 0;
          const newPoin = Math.max(currentPoin - 75, 0);

          transactions.push(
            prisma.siswi.update({
              where: { id: siswi.id },
              data: {
                poin: newPoin,
                currentStreak: 0,
              },
            })
          );
        }
      }

      if (transactions.length > 0) {
        // @ts-expect-error sangat sulit untuk menulis tipe data transactions jadi dipaksa unknown
        await prisma.$transaction(transactions);
      }

      await sleep(200);
    }

    console.log("✅ Cron reset DITOLAK selesai");
  } catch (err) {
    console.error("❌ Error reset DITOLAK:", err);
  }
}, { timezone: 'Asia/Jakarta' });

/**
 * CRON 3: Approve otomatis laporan TERKIRIM → DIVERIFIKASI setiap Rabu 00:00
 */
cron.schedule("0 0 * * 3", async () => {
  try {
    const allLaporan = await prisma.laporan.findMany({
      where: { status: "TERKIRIM" },
      include: { siswi: true },
    });

    const batchSize = 100;
    for (let i = 0; i < allLaporan.length; i += batchSize) {
      const batch = allLaporan.slice(i, i + batchSize);

      const transactions: unknown[] = [];

      for (const laporan of batch) {
        const newCurrentStreak = (laporan.siswi.currentStreak ?? 0) + 1;
        const newBestStreak = Math.max(
          laporan.siswi.bestStreak ?? 0,
          newCurrentStreak
        );

        let totalReward = laporan.rewardPoint ?? 0;

        // Bonus streak
        if (newCurrentStreak === 5) {
          totalReward += 500;
        } else if (newCurrentStreak === 10) {
          totalReward += 1100;
        } else if (newCurrentStreak > 10 && newCurrentStreak % 10 === 0) {
          totalReward += 1200;
        }

        transactions.push(
          prisma.laporan.update({
            where: { id: laporan.id },
            data: { status: "DIVERIFIKASI" },
          })
        );

        transactions.push(
          prisma.siswi.update({
            where: { id: laporan.siswiId },
            data: {
              poin: (laporan.siswi.poin ?? 0) + totalReward,
              currentStreak: newCurrentStreak,
              bestStreak: newBestStreak,
            },
          })
        );
      }

      if (transactions.length > 0) {
        // @ts-expect-error sangat sulit untuk menulis tipe data transactions jadi dipaksa unknown
        await prisma.$transaction(transactions);
      }

      await sleep(200);
    }

    console.log("Cron Approve Otomatis selesai ✅");
  } catch (err) {
    console.error("Error cron Approve Otomatis:", err);
  }
}, { timezone: 'Asia/Jakarta' });