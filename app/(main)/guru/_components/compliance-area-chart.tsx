"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Laporan } from "@/lib/generated/prisma"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface IProps {
  data: Pick<Laporan, "id" | "status" | "createdAt">[]
}

export function ComplianceAreaChart({ data }: IProps) {
  // Hitung tanggal 6 bulan terakhir
  const today = new Date()
  const startDate = new Date()
  startDate.setMonth(today.getMonth() - 6)
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date()
  endDate.setHours(23, 59, 59, 999)

  // Hitung total minggu dalam 6 bulan
  const totalWeeks = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
  )

  // Map minggu untuk chart
  const weeksMap: Record<number, Record<string, number>> = {}
  for (let i = 1; i <= totalWeeks; i++) {
    weeksMap[i] = { DIVERIFIKASI: 0, TERKIRIM: 0, DITOLAK: 0, TERLEWAT: 0 }
  }

  // Masukkan data laporan ke minggu yang sesuai
  data.forEach((lap) => {
    const lapDate = new Date(lap.createdAt)
    if (lapDate < startDate) return
    const weekIndex =
      Math.floor((lapDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1
    weeksMap[weekIndex][lap.status] += 1
  })

  // Ubah menjadi array untuk chart
  const chartData = Object.entries(weeksMap).map(([week, counts]) => ({
    week: `Minggu ${week}`,
    diverifikasi: counts.DIVERIFIKASI,
    terkirim: counts.TERKIRIM,
    ditolak: counts.DITOLAK,
    terlewat: counts.TERLEWAT,
  }))

  const chartConfig = {
    diverifikasi: { label: "Diverifikasi", color: "var(--chart-1)" },
    terkirim: { label: "Terkirim", color: "var(--chart-2)" },
    ditolak: { label: "Ditolak", color: "var(--chart-3)" },
    terlewat: { label: "Terlewat", color: "var(--chart-4)" },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laporan 6 Bulan Terakhir</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <AreaChart
              data={chartData}
              margin={{ left: -38, right: 0, top: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `Mg. ${value.split(' ')[1]}`}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={3}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillDiverifikasi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillTerkirim" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillDitolak" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillTerlewat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-4)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-chart-4)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                type="natural"
                dataKey="diverifikasi"
                stroke="var(--color-chart-1)"
                fill="url(#fillDiverifikasi)"
              />
              <Area
                type="natural"
                dataKey="terkirim"
                stroke="var(--color-chart-2)"
                fill="url(#fillTerkirim)"
              />
              <Area
                type="natural"
                dataKey="ditolak"
                stroke="var(--color-chart-3)"
                fill="url(#fillDitolak)"
              />
              <Area
                type="natural"
                dataKey="terlewat"
                stroke="var(--color-chart-4)"
                fill="url(#fillTerlewat)"
              />

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        ) : (
          <p className="text-center text-sm h-10">Data grafik masih kosong</p>
        )}
      </CardContent>
    </Card>
  )
}
