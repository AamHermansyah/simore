import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const password = await bcrypt.hash("superadmin123", 10);

  const superAdmin = await prisma.superAdmin.upsert({
    where: { email: "superadmin@simore.com" },
    update: {},
    create: {
      nama: "Super Admin",
      nip: "0000000000",
      email: "superadmin@simore.com",
      nomorTelepon: "081234567890",
      alamat: "Pusat",
      jabatan: "Administrator",
      instansi: "SiMoRe",
      password,
    },
  });

  console.log("Super Admin created:", superAdmin);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
