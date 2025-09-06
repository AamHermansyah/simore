import React from 'react'
import { RiScanLine } from "@remixicon/react";
import { StatsGrid } from "../../_components/stats-grid";
import { ComplianceMonthlyChart } from '../_components/compliance-monthly-chart';

function SchoolDashboardPage() {
  return (
    <>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Dashboard Sekolah</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan kepatuhan, analisis, dan operasional program TTD.
        </p>
      </div>

      <StatsGrid
        className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        stats={[
          {
            title: "Kepatuhan (3 Bulan)",
            value: "95%",
            icon: <RiScanLine size={20} aria-hidden="true" />,
          },
          {
            title: "Siswi Aktif",
            value: "655",
            icon: <RiScanLine size={20} aria-hidden="true" />,
          },
          {
            title: "Laporan Minggu Ini",
            value: "600",
            icon: <RiScanLine size={20} aria-hidden="true" />,
          },
          {
            title: "Tidak Melapor Minggu Ini",
            value: "55",
            icon: <RiScanLine size={20} aria-hidden="true" />,
          },
          {
            title: "Guru Aktif",
            value: "22",
            icon: <RiScanLine size={20} aria-hidden="true" />,
          },
          {
            title: "Jumlah Kelas",
            value: "22",
            icon: <RiScanLine size={20} aria-hidden="true" />,
          },
        ]}
      />

      <ComplianceMonthlyChart />
    </>
  );
}

export default SchoolDashboardPage;