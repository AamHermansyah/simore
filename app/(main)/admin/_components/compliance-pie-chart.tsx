"use client"

import { LabelList, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Laporan } from "@/lib/generated/prisma"

const chartConfig = {
  reported: { label: "Melapor", color: "#5EE9B5" },
  pending: { label: "Terkirim", color: "#74D4FF" },
  rejected: { label: "Ditolak", color: "#F4B0B3" },
  missed: { label: "Terlewat", color: "#EEEEEE" },
} satisfies ChartConfig

interface IProps {
  data: {
    terkirim: number;
    ditolak: number;
    diverifikasi: number;
    terlewat: number;
  }
}

export function CompliancePieChart({ data }: IProps) {
  // Hitung jumlah tiap status
  const chartData = [
    {
      type: "reported",
      total: data.diverifikasi,
      fill: chartConfig.reported.color,
    },
    {
      type: "pending",
      total: data.terkirim,
      fill: chartConfig.pending.color,
    },
    {
      type: "rejected",
      total: data.ditolak,
      fill: chartConfig.rejected.color,
    },
    {
      type: "missed",
      total: data.terlewat,
      fill: chartConfig.missed.color,
    },
  ].filter((item) => item.total > 0)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Grafik Kepatuhan</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-text]:fill-foreground mx-auto w-full h-[220px] sm:h-auto"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="total" hideLabel />}
              />
              <Pie data={chartData} dataKey="total" outerRadius={80} fill="#8884d8">
                <LabelList
                  dataKey="type"
                  className="fill-foreground"
                  stroke="none"
                  fontSize={12}
                  formatter={(value: keyof typeof chartConfig) =>
                    `${chartConfig[value]?.label} (${chartData.find((i) => i.type === value)?.total})`
                  }
                />
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="type" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <p className="text-center text-sm h-10">
            Grafik masih kosong
          </p>
        )}
      </CardContent>
    </Card>
  )
}
