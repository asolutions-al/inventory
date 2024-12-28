"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { useTranslations } from "next-intl"
import { Separator } from "../../ui/separator"

const config = {
  commission: {
    label: "Commission",
    color: "hsl(var(--chart-1))",
  },
  cost: {
    label: "Cost",
    color: "hsl(var(--chart-2))",
  },
  profit: {
    label: "Net Profit",
    color: "hsl(var(--chart-3))",
  },
}

export type IncomeChartDataType = {
  activity: "commission" | "cost" | "profit"
  value: number
  fill: string
}

export function IncomeChart({ data }: { data: IncomeChartDataType[] }) {
  const t = useTranslations()

  return (
    <Card x-chunk="charts-01-chunk-4">
      <CardHeader className="items-center pb-0">
        <CardTitle>{t("Income")}</CardTitle>
        <CardDescription>{t("Based on sales")}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4 p-4 pb-2">
        <ChartContainer config={config} className="h-[140px] w-full">
          <BarChart
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 10,
            }}
            data={data}
            layout="vertical"
            barSize={32}
            barGap={2}
          >
            <XAxis type="number" dataKey="value" hide />
            <YAxis
              dataKey="activity"
              type="category"
              tickLine={false}
              tickMargin={4}
              axisLine={false}
              className="capitalize"
            />
            <Bar dataKey="value" radius={5}>
              <LabelList
                position="insideLeft"
                dataKey="label"
                fill="white"
                offset={8}
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-row border-t p-4">
        <div className="flex w-full items-center gap-2">
          {data.map((item, i) => (
            <>
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">
                  {config[item.activity].label}
                </div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                  {item.value}
                </div>
              </div>
              {i < data.length - 1 && (
                <Separator orientation="vertical" className="mx-2 h-10 w-px" />
              )}
            </>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
