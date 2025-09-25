import React from "react"
import {
  RiSchoolLine,
  RiUserLine,
  RiTeamLine,
  RiFileListLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiSendPlaneLine,
  RiTimerLine,
} from "@remixicon/react"
import { getSuperAdminSummary } from "@/data/superadmin"
import { StatsGrid } from "../../_components/stats-grid"
import { CompliancePieChart } from "../_components/compliance-pie-chart"
import { ComplianceAreaChart } from "../../_components/compliance-area-chart"

async function SuperAdminDashboardPage() {
  const res = await getSuperAdminSummary()
  if (!res.success) throw new Error(res.message)

  const data = res.data!

  return (
    <div className="space-y-6">
      {/* Salam dan welcome */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Halo, Super Admin!</h1>
        <p className="text-sm text-muted-foreground">
          Selamat datang di dashboard super admin. Di sini kamu bisa memantau
          seluruh sekolah, guru, siswi, angkatan, dan laporan yang terdaftar
          dalam sistem.
        </p>
      </div>

      {/* Statistik utama */}
      <StatsGrid
        className="lg:grid-cols-4"
        stats={[
          {
            title: "Total Sekolah",
            value: `${data.totalSekolah}`,
            icon: <RiSchoolLine size={20} aria-hidden="true" />,
          },
          {
            title: "Total Guru",
            value: `${data.totalGuru}`,
            icon: <RiTeamLine size={20} aria-hidden="true" />,
          },
          {
            title: "Total Siswi",
            value: `${data.totalSiswi}`,
            icon: <RiUserLine size={20} aria-hidden="true" />,
          },
          {
            title: "Total Angkatan",
            value: `${data.totalAngkatan}`,
            icon: <RiUserLine size={20} aria-hidden="true" />,
          },
          {
            title: "Total Laporan",
            value: `${data.totalLaporan}`,
            icon: <RiFileListLine size={20} aria-hidden="true" />,
          },
          {
            title: "Laporan Terkirim",
            value: `${data.laporan.terkirim}`,
            icon: <RiSendPlaneLine size={20} aria-hidden="true" />,
          },
          {
            title: "Laporan Diverifikasi",
            value: `${data.laporan.diverifikasi}`,
            icon: <RiCheckboxCircleLine size={20} aria-hidden="true" />,
          },
          {
            title: "Laporan Ditolak",
            value: `${data.laporan.ditolak}`,
            icon: <RiCloseCircleLine size={20} aria-hidden="true" />,
          },
          {
            title: "Laporan Terlewat",
            value: `${data.laporan.terlewat}`,
            icon: <RiTimerLine size={20} aria-hidden="true" />,
          },
        ]}
      />

      {/* Grafik distribusi laporan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 xl:col-span-7">
          <ComplianceAreaChart data={data.laporan.data} />
        </div>
        <div className="lg:col-span-6 xl:col-span-5">
          <CompliancePieChart data={data.laporan} />
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboardPage
