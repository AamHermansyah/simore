import { getSekolahSummary } from '@/data/sekolah';
import { JwtPayload, verifyJwt } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import React from 'react'
import { StatsGrid } from '../../_components/stats-grid';
import { RiAwardLine, RiCheckboxCircleLine, RiCloseCircleLine, RiFileListLine, RiUserLine } from "@remixicon/react";
import { ComplianceAreaChart } from '../../_components/compliance-area-chart';
import { CompliancePieChart } from '../../_components/compliance-pie-chart';

interface IProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

async function PuskesmasDashboardPage({ searchParams }: IProps) {
  let sekolahId = (await searchParams).sekolahId;
  const c = await cookies()
  const token = c.get("token")?.value || null

  const decoded = verifyJwt(token || "") as JwtPayload | null
  if (!decoded) throw new Error('Token invalid');

  const puskesmas = await prisma.puskesmas.findUnique({
    where: { id: decoded.id },
    select: { nama: true }
  });

  if (!puskesmas) throw new Error('Puskesmas tidak ditemukan');

  if (!sekolahId) {
    const sekolah = await prisma.puskesmasSekolah.findFirst({
      where: { puskesmasId: decoded.id },
      select: {
        sekolah: { select: { id: true, nama: true } },
      },
      orderBy: {
        sekolah: {
          nama: "asc",
        },
      },
    })

    if (!sekolah?.sekolah) throw Error('Sekolah yang dipilih tidak ditemukan');
    sekolahId = sekolah.sekolah.id;
  }

  const resSummary = await getSekolahSummary(sekolahId);
  if (!resSummary.success) throw new Error(resSummary.message);

  const data = resSummary.data!;

  return (
    <div className="space-y-6">
      {/* Salam dan welcome */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Halo, {puskesmas.nama}!</h1>
        <p className="text-sm text-muted-foreground">
          Selamat datang di dashboard sekolah <b>{data.nama}</b>. Disini kamu bisa memonitor laporan siswi, kepatuhan, dan performa mingguan mereka.
        </p>
      </div>

      {/* Statistik utama */}
      <StatsGrid
        className="lg:grid-cols-4"
        stats={[
          {
            title: "Total Angkatan",
            value: `${data.totalAngkatan}`,
            icon: <RiUserLine size={20} aria-hidden="true" />,
          },
          {
            title: "Total Siswi",
            value: `${data.totalSiswi}`,
            icon: <RiUserLine size={20} aria-hidden="true" />,
          },
          {
            title: "Total Laporan",
            value: `${data.totalLaporan}`,
            icon: <RiFileListLine size={20} aria-hidden="true" />,
          },
          {
            title: "Kepatuhan",
            value: `${data.kepatuhan}%`,
            icon: <RiCheckboxCircleLine size={20} aria-hidden="true" />,
          },
          {
            title: "Tidak Melapor",
            value: `${data.totalTidakMelapor}x`,
            icon: <RiCloseCircleLine size={20} aria-hidden="true" />,
          },
          {
            title: "Rata-rata Poin Siswi",
            value: `${data.avgPoinSiswi} Poin`,
            icon: <RiAwardLine size={20} aria-hidden="true" />,
          },
          {
            title: "Rata-rata Current Streak",
            value: `${data.avgCurrentStreak}`,
            icon: <RiAwardLine size={20} aria-hidden="true" />,
          },
          {
            title: "Rata-rata Best Streak",
            value: `${data.avgBestStreak}`,
            icon: <RiAwardLine size={20} aria-hidden="true" />,
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 xl:col-span-7">
          <ComplianceAreaChart data={data.laporan} />
        </div>
        <div className="lg:col-span-6 xl:col-span-5">
          <CompliancePieChart data={data.laporan} />
        </div>
      </div>
    </div>
  )
}

export default PuskesmasDashboardPage