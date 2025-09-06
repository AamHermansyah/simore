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

export const description = "A pie chart with a label list"

const chartData = [
  { type: "report", weeks: 20, fill: "var(--color-report)" },
  { type: "notReport", weeks: 2, fill: "var(--color-notReport)" },
]

const chartConfig = {
  weeks: {
    label: "Total",
  },
  report: {
    label: "Melapor",
    color: "var(--chart-4)",
  },
  notReport: {
    label: "Tidak Melapor",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function ComplianceChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Grafik Kepatuhan</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-foreground mx-auto w-full h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="weeks" hideLabel />}
            />
            <Pie data={chartData} dataKey="weeks">
              <LabelList
                dataKey="type"
                className="fill-foreground"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="type" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
