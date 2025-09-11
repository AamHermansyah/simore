-- CreateEnum
CREATE TYPE "public"."StatusLaporan" AS ENUM ('DITOLAK', 'TERKIRIM', 'DIVERIFIKASI', 'TERLEWAT');

-- CreateTable
CREATE TABLE "public"."Siswi" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "poin" INTEGER NOT NULL DEFAULT 0,
    "nisn" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nomorTelepon" TEXT,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "jurusan" TEXT,
    "alamat" TEXT,
    "golonganDarah" TEXT,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "bestStreak" INTEGER NOT NULL DEFAULT 0,
    "namaOrtu" TEXT,
    "nomorTeleponOrtu" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "angkatanId" TEXT,
    "sekolahId" TEXT,

    CONSTRAINT "Siswi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Guru" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "nip" TEXT NOT NULL,
    "posisi" TEXT,
    "email" TEXT NOT NULL,
    "nomorTelepon" TEXT,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "alamat" TEXT,
    "pendidikanTerakhir" TEXT,
    "universitas" TEXT,
    "tahunLulus" INTEGER,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sekolahId" TEXT,

    CONSTRAINT "Guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Angkatan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "guruId" TEXT,
    "sekolahId" TEXT,

    CONSTRAINT "Angkatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sekolah" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nspn" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "wilayah" TEXT,
    "email" TEXT,
    "nomorTeleponSekolah" TEXT,
    "website" TEXT,
    "alamatLengkap" TEXT,
    "akreditasi" TEXT,
    "namaKepalaSekolah" TEXT,
    "nomorTeleponKepalaSekolah" TEXT,
    "namaKoordinator" TEXT,
    "nomorTeleponKoordinator" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sekolah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Puskesmas" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT NOT NULL,
    "nomorTelepon" TEXT,
    "website" TEXT,
    "alamat" TEXT,
    "wilayahKerja" TEXT,
    "namaKepalaPuskesmas" TEXT,
    "nip" TEXT,
    "nomorTeleponKepalaPuskesmas" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sekolahId" TEXT,

    CONSTRAINT "Puskesmas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PuskesmasSekolah" (
    "puskesmasId" TEXT NOT NULL,
    "sekolahId" TEXT NOT NULL,

    CONSTRAINT "PuskesmasSekolah_pkey" PRIMARY KEY ("puskesmasId","sekolahId")
);

-- CreateTable
CREATE TABLE "public"."SuperAdmin" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nomorTelepon" TEXT,
    "alamat" TEXT,
    "jabatan" TEXT,
    "instansi" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuperAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Laporan" (
    "id" TEXT NOT NULL,
    "urlGambar" TEXT,
    "status" "public"."StatusLaporan" NOT NULL,
    "catatanGuru" TEXT,
    "keluhan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "siswiId" TEXT NOT NULL,

    CONSTRAINT "Laporan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Siswi_nisn_key" ON "public"."Siswi"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "Siswi_email_key" ON "public"."Siswi"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_nip_key" ON "public"."Guru"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_email_key" ON "public"."Guru"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Sekolah_nspn_key" ON "public"."Sekolah"("nspn");

-- CreateIndex
CREATE UNIQUE INDEX "Sekolah_email_key" ON "public"."Sekolah"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Puskesmas_email_key" ON "public"."Puskesmas"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Puskesmas_nip_key" ON "public"."Puskesmas"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "SuperAdmin_nip_key" ON "public"."SuperAdmin"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "SuperAdmin_email_key" ON "public"."SuperAdmin"("email");

-- AddForeignKey
ALTER TABLE "public"."Siswi" ADD CONSTRAINT "Siswi_angkatanId_fkey" FOREIGN KEY ("angkatanId") REFERENCES "public"."Angkatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Siswi" ADD CONSTRAINT "Siswi_sekolahId_fkey" FOREIGN KEY ("sekolahId") REFERENCES "public"."Sekolah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Guru" ADD CONSTRAINT "Guru_sekolahId_fkey" FOREIGN KEY ("sekolahId") REFERENCES "public"."Sekolah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Angkatan" ADD CONSTRAINT "Angkatan_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "public"."Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Angkatan" ADD CONSTRAINT "Angkatan_sekolahId_fkey" FOREIGN KEY ("sekolahId") REFERENCES "public"."Sekolah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Puskesmas" ADD CONSTRAINT "Puskesmas_sekolahId_fkey" FOREIGN KEY ("sekolahId") REFERENCES "public"."Sekolah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PuskesmasSekolah" ADD CONSTRAINT "PuskesmasSekolah_puskesmasId_fkey" FOREIGN KEY ("puskesmasId") REFERENCES "public"."Puskesmas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PuskesmasSekolah" ADD CONSTRAINT "PuskesmasSekolah_sekolahId_fkey" FOREIGN KEY ("sekolahId") REFERENCES "public"."Sekolah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Laporan" ADD CONSTRAINT "Laporan_siswiId_fkey" FOREIGN KEY ("siswiId") REFERENCES "public"."Siswi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
