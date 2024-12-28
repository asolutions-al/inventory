"use client"

import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { SelectCategoriesType } from "@/db/(inv)/schema"

export type RevenueByCategoryChartDataType = {
  category: string
  profit: number
  fill: string
}

export function RevenueByCategoryChart({
  data,
  categoriesList,
}: {
  data: RevenueByCategoryChartDataType[]
  categoriesList: SelectCategoriesType[]
}) {
  const t = (key: string) => key

  const chartConfig = categoriesList.reduce((acc, curr, index) => {
    acc[curr.name] = {
      label: curr.name,
      color: `hsl(var(--chart-${index + 1}))`,
    }
    return acc
  }, {} as ChartConfig)

  const total = data.reduce((acc, curr) => acc + curr.profit, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{t("Revenue by Category")}</CardTitle>
        <CardDescription>{t("Top 5 categories")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="profit"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className='flex items-center gap-2 font-medium leading-none'>
          Trending up by 50% this week <TrendingUp className='h-4 w-4' />
        </div> */}
        <div className="leading-none text-muted-foreground">
          {t("Revenue by Category")}
        </div>
      </CardFooter>
    </Card>
  )
}
