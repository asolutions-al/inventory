"use client"

import { Bar, BarChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

type Props = {
  data: {
    user: string
    in: number
    out: number
    commission: number
  }[]
}

function Chart({ data }: Props) {
  const t = (key: string) => key

  const config: ChartConfig = {
    in: {
      label: t("In"),
      color: "hsl(var(--chart-1))",
    },
    out: {
      label: t("Out"),
      color: "hsl(var(--chart-2))",
    },
    commission: {
      label: t("Commission"),
      color: "hsl(var(--chart-3))",
    },
  }

  const neededUsers = 2 - data?.length // 2 is the minimum number of users needed
  const users = Array.from({ length: neededUsers }, (_, i) => ({
    user: "",
    in: 0,
    out: 0,
    commission: 0,
  }))

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>{t("Members performance")}</CardTitle>
        <CardDescription>{t("In, out and commission")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart accessibilityLayer data={[...data, ...users]}>
            <XAxis
              dataKey="user"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <Bar dataKey="in" stackId="a" fill="var(--color-in)" />
            <Bar dataKey="out" stackId="a" fill="var(--color-out)" />
            <Bar
              dataKey="commission"
              stackId="a"
              fill="var(--color-commission)"
            />
            {/* <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              cursor={false}
              defaultIndex={1}
            /> */}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export {
  Chart as MembersPerformanceChart,
  type Props as MembersPerformanceChartProps,
}
