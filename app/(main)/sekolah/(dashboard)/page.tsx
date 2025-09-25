import React from 'react'
import { RiAwardLine, RiCheckboxCircleLine, RiCloseCircleLine, RiFileListLine, RiUserLine } from "@remixicon/react";
import { StatsGrid } from "../../_components/stats-grid";
import { getSekolahSummary } from '@/data/sekolah';
import { ComplianceAreaChart } from '../../_components/compliance-area-chart';
import { CompliancePieChart } from '../../_components/compliance-pie-chart';

async function SekolahDashboardPage() {
  const res = await getSekolahSummary();
  if (!res.success) throw new Error(res.message);

  const data = res.data!;

  return (
    <div className="space-y-6">
      {/* Salam dan welcome */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Halo, {data.nama}!</h1>
        <p className="text-sm text-muted-foreground">
          Selamat datang di dashboard sekolah. Disini kamu bisa memonitor laporan siswi, kepatuhan, dan performa mingguan mereka.
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
  );
}

export default SekolahDashboardPage;