import React from 'react'
import { RiCalendarCheckLine, RiCheckboxCircleLine, RiCloseCircleLine } from "@remixicon/react";
import { StatsGrid } from "../../_components/stats-grid";
import { Card, CardContent } from '@/components/ui/card';
import Graph from '../_components/graph';
import { ComplianceChart } from '../_components/compliance-chart';
import { getSiswiSummary } from '@/data/siswi';
import { Separator } from '@/components/ui/separator';
import { Crown, Flame } from 'lucide-react';

async function SiswiDashboardPage() {
  const res = await getSiswiSummary()
  if (!res.success) throw new Error(res.message);

  const data = res.data!;

  return (
    <>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Halo, {data.nama}!</h1>
        <p className="text-sm text-muted-foreground">
          Selamat datang di simore table tambah darah. Disini kamu akan di monitor dan di ingatkan selalu untuk mengkonsumsi tablet setiap minggunya.
        </p>
      </div>

      <Card className="gap-1 bg-gradient-to-br from-primary to-orange-500 rounded-2xl">
        <CardContent className="space-y-4 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Poin */}
          <div className="px-3">
            <h1 className="text-primary-foreground text-lg font-semibold">
              Poin
            </h1>
            <span className="text-4xl font-extrabold text-primary-foreground drop-shadow">
              {data.poin.toLocaleString("id-ID")} XP
            </span>
          </div>

          <Separator orientation="vertical" className="hidden sm:block bg-secondary-foreground" />
          <Separator orientation="horizontal" className="sm:hidden bg-secondary-foreground" />

          {/* Strike */}
          <div className="w-full sm:w-auto grid grid-cols-2 gap-4 px-3">
            {/* Strike Berjalan */}
            <div className="text-center flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-white to-secondary">
              <Flame className="w-8 h-8 text-sky-500 animate-pulse" />
              <span className="mt-1 text-sm text-sky-600 font-medium">Strike Berjalan</span>
              <span className="text-2xl font-bold text-sky-700">
                {data.currentStreak}x
              </span>
            </div>

            {/* Strike Terbaik */}
            <div className="text-center flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-white to-secondary">
              <Crown className="w-8 h-8 text-sky-500 animate-pulse" />
              <span className="mt-1 text-sm text-sky-600 font-medium">Strike Terbaik</span>
              <span className="text-2xl font-bold text-sky-700">
                {data.bestStreak}x
              </span>
            </div>
          </div>
        </CardContent>
      </Card>


      <StatsGrid
        className="lg:grid-cols-3"
        stats={[
          {
            title: "Minggu Ke",
            value: `${data.totalLaporan}`,
            icon: <RiCalendarCheckLine size={20} aria-hidden="true" />,
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
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 xl:col-span-7">
          <Graph data={data.laporan} />
        </div>
        <div className="lg:col-span-6 xl:col-span-5">
          <ComplianceChart data={data.laporan} />
        </div>
      </div>
    </>
  );
}

export default SiswiDashboardPage;