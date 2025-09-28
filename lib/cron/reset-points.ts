import cron from "node-cron";
import prisma from "../prisma";
import { sleep } from "../utils";

cron.schedule("0 0 1 */3 *", async () => {
  try {
    const siswiList = await prisma.siswi.findMany({
      select: { id: true },
    });

    for (let i = 0; i < siswiList.length; i++) {
      const siswi = siswiList[i];

      await prisma.siswi.update({
        where: { id: siswi.id },
        data: {
          poin: 0,
          currentStreak: 0,
        },
      });

      await sleep(200);
    }

    console.log("🎉 Semua poin siswi berhasil direset!");
  } catch (error) {
    console.error("❌ Gagal reset poin siswi:", error);
  }
}, { timezone: 'Asia/Jakarta' });
