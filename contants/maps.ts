import {
  endOfMonth,
  endOfQuarter,
  endOfToday,
  endOfWeek,
  endOfYesterday,
  startOfMonth,
  startOfQuarter,
  startOfToday,
  startOfWeek,
  startOfYesterday,
  subDays,
} from "date-fns"

export const RANGE_TO_DATE_MAP: Record<
  RangeT,
  {
    getStart: () => Date
    getEnd: () => Date
  }
> = {
  TODAY: {
    getStart: startOfToday,
    getEnd: endOfToday,
  },
  YESTERDAY: {
    getStart: startOfYesterday,
    getEnd: endOfYesterday,
  },
  WEEK: {
    getStart: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getEnd: () => endOfWeek(new Date(), { weekStartsOn: 1 }),
  },
  MONTH: {
    getStart: () => startOfMonth(new Date()),
    getEnd: () => endOfMonth(new Date()),
  },
  QUARTER: {
    getStart: () => startOfQuarter(new Date()),
    getEnd: () => endOfQuarter(new Date()),
  },
  LAST30DAYS: {
    getStart: () => subDays(new Date(), 30),
    getEnd: () => new Date(),
  },
}
