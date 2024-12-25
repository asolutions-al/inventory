"use client"

import { Bar, BarChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export type TransactionsChartDataType = {
  date: string
  in: number
  out: number
}

const config = {
  in: {
    label: "In",
    color: "hsl(var(--chart-1))",
  },
  out: {
    label: "Out",
    color: "hsl(var(--chart-2))",
  },
}

export function TransactionsChart({
  data,
}: {
  data: TransactionsChartDataType[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>In and outs</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart accessibilityLayer data={data}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                })
              }}
            />
            <Bar
              dataKey="in"
              stackId="a"
              fill="var(--color-in)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="out"
              stackId="a"
              fill="var(--color-out)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
