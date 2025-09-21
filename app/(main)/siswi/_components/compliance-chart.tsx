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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Laporan } from "@/lib/generated/prisma"

const chartConfig = {
  total: {
    label: "Total",
  },
  reported: {
    label: "Melapor",
    color: "#5EE9B5",
  },
  pending: {
    label: "Pending",
    color: "#74D4FF",
  },
  rejected: {
    label: "Ditolak",
    color: "#F4B0B3",
  },
  missed: {
    label: "Terlewat",
    color: "#EEEEEE",
  },
} satisfies ChartConfig

interface IProps {
  data: Pick<Laporan, 'id' | 'status' | 'createdAt' | 'rewardPoint'>[];
}

export function ComplianceChart({ data }: IProps) {
  const chartData = [
    {
      type: "reported",
      total: data.filter((item) => item.status === "DIVERIFIKASI").length,
      fill: "var(--color-reported)",
    },
    {
      type: "pending",
      total: data.filter((item) => item.status === "TERKIRIM").length,
      fill: "var(--color-pending)",
    },
    {
      type: "rejected",
      total: data.filter((item) => item.status === "DITOLAK").length,
      fill: "var(--color-rejected)",
    },
    {
      type: "missed",
      total: data.filter((item) => item.status === "TERLEWAT").length,
      fill: "var(--color-missed)",
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
            className="[&_.recharts-text]:fill-foreground mx-auto w-full h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="total" hideLabel />}
              />
              <Pie data={chartData} dataKey="total">
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
