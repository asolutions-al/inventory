import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "../ui/progress"

export function IncomeProgressCard({
  title,
  amount,
  percentage,
  from = "last week",
}: {
  title: string
  amount: number
  percentage: number
  from?: string
}) {
  return (
    <Card x-chunk="dashboard-05-chunk-1">
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-4xl">{amount}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {percentage}% from {from}
        </div>
      </CardContent>
      <CardFooter>
        <Progress value={percentage} aria-label={`${percentage} increase`} />
      </CardFooter>
    </Card>
  )
}
