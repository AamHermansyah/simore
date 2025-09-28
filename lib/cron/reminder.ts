import cron from "node-cron";
import * as wppconnect from "@wppconnect-team/wppconnect";
import prisma from "../prisma";

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
        sekolah: {
          select: { nama: true }
        }
      },
    });

    for (const siswi of allSiswi) {
      if (!siswi.nomorTelepon) continue;

      const nomor = siswi.nomorTelepon.replace(/^0/, "62");
      const pesan = generateReminderMessage(siswi.nama, siswi.sekolah?.nama || "Admin SIMORE");

      try {
        await wppClient.sendText(`${nomor}@c.us`, pesan);
      } catch (err) {
        console.error(`Gagal kirim WA ke ${siswi.nama}:`, err);
      }

      // Delay biar ga ke-spam
      await new Promise((r) => setTimeout(r, 1000));
    }

    console.log("Cron Reminder WA selesai ✅");
  } catch (err) {
    console.error("Error cron Reminder WA:", err);
  }
}, { timezone: 'Asia/Jakarta' });

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