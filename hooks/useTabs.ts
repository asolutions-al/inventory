import { DATE_TABS } from "@/contants/list"
import { RANGE_TO_DATE_MAP } from "@/contants/maps"
import { status } from "@/orm/(inv)/schema"

export const useDateTabs = ({ tabParam }: { tabParam?: string }) => {
  const validTab: RangeT =
    tabParam && DATE_TABS.includes(tabParam as RangeT)
      ? (tabParam as RangeT)
      : "TODAY"
  const { getStart, getEnd } = RANGE_TO_DATE_MAP[validTab]
  const start = getStart()
  const end = getEnd()

  return { start, end, validTab }
}

export const useStatusTabs = ({ tabParam }: { tabParam?: string }) => {
  const validTab: (typeof status.enumValues)[number] =
    tabParam &&
    status.enumValues.includes(tabParam as (typeof status.enumValues)[number])
      ? (tabParam as (typeof status.enumValues)[number])
      : "ACTIVE"

  return { validTab }
}
