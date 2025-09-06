"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { week: "Minggu 1", minum: 180, tidakMinum: 20 },
  { week: "Minggu 2", minum: 175, tidakMinum: 25 },
  { week: "Minggu 3", minum: 185, tidakMinum: 15 },
  { week: "Minggu 4", minum: 190, tidakMinum: 10 },

  { week: "Minggu 5", minum: 178, tidakMinum: 22 },
  { week: "Minggu 6", minum: 182, tidakMinum: 18 },
  { week: "Minggu 7", minum: 170, tidakMinum: 30 },
  { week: "Minggu 8", minum: 188, tidakMinum: 12 },

  { week: "Minggu 9", minum: 192, tidakMinum: 8 },
  { week: "Minggu 10", minum: 180, tidakMinum: 20 },
  { week: "Minggu 11", minum: 185, tidakMinum: 15 },
  { week: "Minggu 12", minum: 190, tidakMinum: 10 },
];

const chartConfig = {
  minum: {
    label: "Melapor",
    color: "var(--chart-1)",
  },
  tidakMinum: {
    label: "Tidak Melapor",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ComplianceMonthlyChart() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <CardTitle>Monitoring Laporan</CardTitle>
            <CardDescription>
              Pantau laporan siswi selama 3 bulan terakhir
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                aria-hidden="true"
                className="size-3 shrink-0 rounded-xs bg-chart-3"
              ></div>
              <div className="text-[13px]/3 text-muted-foreground/50">
                Melapor
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                aria-hidden="true"
                className="size-3 shrink-0 rounded-xs bg-chart-1"
              ></div>
              <div className="text-[13px]/3 text-muted-foreground/50">
                Tidak Melapor
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-60 sm:h-78 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: -26, right: 0, top: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillMinum" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-minum)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-minum)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillTidakMinum" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-tidakMinum)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-tidakMinum)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="minum"
              type="natural"
              fill="url(#fillMinum)"
              fillOpacity={0.4}
              stroke="var(--color-minum)"
              stackId="a"
            />
            <Area
              dataKey="tidakMinum"
              type="natural"
              fill="url(#fillTidakMinum)"
              fillOpacity={0.4}
              stroke="var(--color-tidakMinum)"
              stackId="a"
            />
          </AreaChart>
          {/* <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: -12, right: 12, top: 12 }}
          >
            <defs>
              <linearGradient id={`${id}-gradient`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--chart-2)" />
                <stop offset="100%" stopColor="var(--chart-1)" />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="2 2"
              stroke="var(--border)"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={12}
              tickFormatter={(value) => value.slice(0, 3)}
              stroke="var(--border)"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <Line
              type="linear"
              dataKey="tidakMinum"
              stroke="var(--color-tidakMinum)"
              strokeWidth={2}
              dot={false}
              activeDot={false}
            />
            <ChartTooltip
              content={
                <CustomTooltipContent
                  colorMap={{
                    minum: "var(--chart-1)",
                    tidakMinum: "var(--chart-3)",
                  }}
                  labelMap={{
                    minum: "Melapor",
                    tidakMinum: "Tidak Melapor",
                  }}
                  dataKeys={["minum", "tidakMinum"]}
                  valueFormatter={(value) => `$${value.toLocaleString()}`}
                />
              }
              cursor={<CustomCursor fill="var(--chart-1)" />}
            />
            <Line
              type="linear"
              dataKey="minum"
              stroke={`url(#${id}-gradient)`}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 5,
                fill: "var(--chart-1)",
                stroke: "var(--background)",
                strokeWidth: 2,
              }}
            />
          </LineChart> */}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}