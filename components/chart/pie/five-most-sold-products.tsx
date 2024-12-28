"use client"

import { LabelList, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type Data = {
  id: string
  label: string
  quantity: number
}

type Props = {
  data: Data[]
}

function Chart({ data }: Props) {
  const t = (key: string) => key

  const mappedData: (Data & { fill: string })[] = data.map((item, idx) => ({
    ...item,
    fill: `var(--color-${item.id})`,
  }))

  const config = mappedData.reduce<ChartConfig>((acc, curr, idx) => {
    acc[curr.id] = {
      label: curr.label,
      color: `hsl(var(--chart-${idx + 1}))`, // assign random color
    }
    return acc
  }, {})

  return (
    <Card className="flex flex-col">
      <CardHeader className="text-center pb-0">
        <CardTitle>{t("Top Selling Products")}</CardTitle>
        <CardDescription>{t("Top 5")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{
            ...config,
            quantity: {
              label: t("Quantity"),
            },
          }}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="quantity"
                  indicator="line"
                  labelFormatter={(_, payload) => payload[0]?.payload?.label}
                />
              }
            />
            <Pie data={mappedData} dataKey="quantity">
              <LabelList
                dataKey="id"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(id: string) => config[id]?.label}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export {
  Chart as FiveMostSoldProductsChart,
  type Props as FiveMostSoldProductsChartProps,
}
