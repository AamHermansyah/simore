import cron from "node-cron";
import * as wppconnect from "@wppconnect-team/wppconnect";
import prisma from "../prisma";
import { addDays, setHours, setMinutes, setSeconds, startOfWeek } from "date-fns";
import { submitTimes } from "../constants";

// Jalankan client wppconnect sekali di awal
let wppClient: wppconnect.Whatsapp | null = null;

wppconnect
  .create({
    session: "siswi-reminder",
    headless: true,
    useChrome: true,
    catchQR: (base64Qr, asciiQR) => {
      console.log("QR RECEIVED");
      console.log(asciiQR); // scan QR code saat pertama kali run
    },
  })
  .then((client) => {
    wppClient = client;
    console.log("WPPConnect client ready ✅");
  })
  .catch((err) => {
    console.error("Error init WPPConnect:", err);
  });

// ✅ Cron: Reminder WA setiap Kamis pukul 06:00 pagi
cron.schedule("0 6 * * 4", async () => {
  try {
    if (!wppClient) {
      console.log("WPPConnect client belum siap ❌");
      return;
    }

    console.log("Cron Reminder WA dimulai...");

    // Ambil semua siswi yang aktif
    const allSiswi = await prisma.siswi.findMany({
      where: { status: true },
      select: {
        id: true,
        nama: true,
        nomorTelepon: true,
        sekolah: { select: { nama: true } },
      },
    });

    const batchSize = 100;
    for (let i = 0; i < allSiswi.length; i += batchSize) {
      const batch = allSiswi.slice(i, i + batchSize);

      for (const siswi of batch) {
        if (!siswi.nomorTelepon) continue;

        const nomor = siswi.nomorTelepon.replace(/^0/, "62");
        const pesan = generateReminderMessage(
          siswi.nama,
          siswi.sekolah?.nama || "Admin SIMORE"
        );

        try {
          await wppClient.sendText(`${nomor}@c.us`, pesan);
          console.log(`✅ Reminder terkirim ke ${siswi.nama}`);
        } catch (err) {
          console.error(`❌ Gagal kirim WA ke ${siswi.nama}:`, err);
        }

        // Delay antar pesan
        await new Promise((r) => setTimeout(r, 10000));
      }

      // Delay antar batch (biar stabil)
      await new Promise((r) => setTimeout(r, 1000));
    }

    console.log("Cron Reminder WA selesai ✅");
  } catch (err) {
    console.error("Error cron Reminder WA:", err);
  }
}, { timezone: "Asia/Jakarta" });

/**
 * CRON 2: Reminder WA ulang setiap Kamis jam 15:00
 */
cron.schedule("0 15 * * 4", async () => {
  try {
    if (!wppClient) {
      console.log("WPPConnect client belum siap ❌");
      return;
    }

    console.log("Cron Reminder Ulang (15:00) dimulai...");

    const now = new Date();

    // 🔹 Tentukan rentang waktu pengumpulan laporan minggu ini
    const weekStart = startOfWeek(now, { weekStartsOn: 0 }); // Minggu = 0
    const targetDay = addDays(weekStart, submitTimes.day);   // Hari pengumpulan (biasanya Kamis)

    const startTime = setSeconds(setMinutes(setHours(targetDay, submitTimes.start), 0), 0);
    const endTime = setSeconds(setMinutes(setHours(targetDay, submitTimes.end), 0), 0);

    // 🔹 Ambil semua siswi aktif
    const allSiswi = await prisma.siswi.findMany({
      where: { status: true },
      select: {
        id: true,
        nama: true,
        nomorTelepon: true,
        sekolah: { select: { nama: true } },
      },
    });

    const batchSize = 100;
    for (let i = 0; i < allSiswi.length; i += batchSize) {
      const batch = allSiswi.slice(i, i + batchSize);

      for (const siswi of batch) {
        if (!siswi.nomorTelepon) continue;

        // 🔍 Cek apakah siswi sudah kirim laporan hari ini (seperti di cron TERLEWAT)
        const laporan = await prisma.laporan.findFirst({
          where: {
            siswiId: siswi.id,
            createdAt: {
              gte: startTime,
              lte: endTime,
            },
          },
        });

        // ❌ Belum lapor → kirim reminder ulang
        if (!laporan) {
          const nomor = siswi.nomorTelepon.replace(/^0/, "62");
          const pesan = `Halo ${siswi.nama}! 🌸\n\n` +
            `Ini pengingat kedua dari *SIMORE*. Kamu belum mengunggah laporan mingguanmu hari ini.\n` +
            `Silakan segera kirim sebelum batas waktu berakhir malam ini (pukul ${submitTimes.end}:00 WIB).\n\n` +
            `Salam,\n${siswi.sekolah?.nama || "Admin SIMORE"}`;

          try {
            await wppClient.sendText(`${nomor}@c.us`, pesan);
            console.log(`✅ Reminder ulang terkirim ke ${siswi.nama}`);
          } catch (err) {
            console.error(`❌ Gagal kirim WA ke ${siswi.nama}:`, err);
          }

          // Delay antar pesan supaya aman dari rate limit
          await new Promise((r) => setTimeout(r, 10000));
        }
      }

      await new Promise((r) => setTimeout(r, 1000));
    }

    console.log("Cron Reminder Ulang (15:00) selesai ✅");
  } catch (err) {
    console.error("❌ Error cron Reminder Ulang (15:00):", err);
  }
}, { timezone: "Asia/Jakarta" });


function generateReminderMessage(nama: string, admin: string): string {
  return `Assalamu'alaikum Wr. Wb.  

Halo ananda ${nama}, semoga selalu dalam keadaan sehat dan bersemangat dalam menunaikan kewajiban harian.  

Kami ingin mengingatkan bahwa hari ini adalah jadwal pelaporan kegiatan. Mohon untuk segera melakukan *upload laporan* melalui sistem SIMORE sebelum batas waktu yang telah ditentukan.  

Adapun ketentuan penting:
1. Jika laporan tidak dikirim sesuai jadwal, maka sistem akan otomatis mencatat status sebagai *TERLEWAT* dan akan mengurangi poin kepatuhan.
2. Laporan yang dikirim tepat waktu akan menambah poin kepatuhan dan menjaga streak ananda tetap berlanjut.
3. Kedisiplinan dalam mengirim laporan merupakan salah satu indikator kepatuhan dan tanggung jawab yang akan tercatat dalam evaluasi.  

Mari bersama-sama menjaga konsistensi agar capaian kepatuhan tetap tinggi.  

Terima kasih atas perhatian dan kerjasama ananda.  
Wassalamu'alaikum Wr. Wb.  
- ${admin}`;
}