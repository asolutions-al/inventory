import { eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns"
import dayjs from "dayjs"

export const getWeeklyBarChartUtils = (date: Date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  const end = endOfWeek(date, { weekStartsOn: 1 })
  const datesOfWeek = eachDayOfInterval({ start, end })
  const dataExample = datesOfWeek.map((date) => ({
    date: dayjs(date).format("YYYY-MM-DD"),
    in: 0,
    out: 0,
  })) // Initialize with 0 values then map below
  return {
    start,
    end,
    dataExample,
  }
}
